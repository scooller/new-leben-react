import { apiFetch } from './apiFetch.js'

const UTM_SESSION_STORAGE_KEY = 'ileben-utms-session'

let utmDefaultOverrides = {}
let hasSyncedBackendConfig = false

export const UTM_PARAM_CONFIG = [
  { key: 'utm_source', defaultValue: 'direct' },
  { key: 'utm_medium', defaultValue: 'organic' },
  { key: 'utm_campaign', defaultValue: 'campaign' },
  { key: 'utm_term', defaultValue: 'none' },
  { key: 'utm_content', defaultValue: 'none' },
  { key: 'utm_site', defaultValue: '' },
]

let saleEventOptions = {
  isSaleEvent: false,
  saleCampaignOverride: '',
  saleUtmCampaign: '',
}

const normalizeUtmValue = (value) => {
  if (value === null || value === undefined) return ''
  try {
    return decodeURIComponent(`${value}`.trim())
  } catch {
    return `${value}`.trim()
  }
}

const readCookieUtm = (key) => {
  if (typeof document === 'undefined' || !document.cookie) return ''
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
  return match ? normalizeUtmValue(match.split('=').slice(1).join('=')) : ''
}

const resolveDefaultValue = (config) => {
  if (config.key === 'utm_campaign' && saleEventOptions.isSaleEvent && saleEventOptions.saleUtmCampaign) {
    const overriddenDefaultValue = normalizeUtmValue(utmDefaultOverrides?.[config.key])
    if (!overriddenDefaultValue || ['auto-tagging', 'campaign'].includes(overriddenDefaultValue.toLowerCase())) {
      return normalizeUtmValue(saleEventOptions.saleUtmCampaign)
    }
  }

  const overriddenDefaultValue = normalizeUtmValue(utmDefaultOverrides?.[config.key])
  const effectiveDefaultValue = overriddenDefaultValue !== '' ? overriddenDefaultValue : config.defaultValue

  if (config.key === 'utm_site') {
    if (typeof window === 'undefined') {
      return normalizeUtmValue(effectiveDefaultValue)
    }
    return normalizeUtmValue(effectiveDefaultValue || window.location.hostname || '')
  }

  return normalizeUtmValue(effectiveDefaultValue)
}

const readStoredUtms = () => {
  if (typeof window === 'undefined') return {}
  try {
    const rawValue = window.sessionStorage.getItem(UTM_SESSION_STORAGE_KEY)
    if (!rawValue) return {}
    const parsedValue = JSON.parse(rawValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : {}
  } catch {
    return {}
  }
}

const persistStoredUtms = (values) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(UTM_SESSION_STORAGE_KEY, JSON.stringify(values))
  } catch {
    // ignore storage errors
  }
}

export const setUtmDefaultOverrides = (overrides = {}, options = {}) => {
  if (!overrides || typeof overrides !== 'object') return

  saleEventOptions = {
    isSaleEvent: Boolean(options?.isSaleEvent),
    saleCampaignOverride: normalizeUtmValue(options?.saleCampaignOverride),
    saleUtmCampaign: normalizeUtmValue(options?.saleUtmCampaign || options?.saleCampaignOverride),
  }

  utmDefaultOverrides = {
    ...utmDefaultOverrides,
    ...Object.entries(overrides).reduce((acc, [key, value]) => {
      acc[key] = normalizeUtmValue(value)
      return acc
    }, {}),
  }

  const storedValues = readStoredUtms()
  const nextValues = { ...storedValues }
  const isSaleActive = saleEventOptions.isSaleEvent
  const forcedCampaignOverride = isSaleActive && saleEventOptions.saleCampaignOverride !== ''
    ? saleEventOptions.saleCampaignOverride
    : ''

  const isBrevoSource = (normalizeUtmValue(nextValues.utm_source) || '').toLowerCase() === 'brevo'
  const effectiveBrevoCampaign = isSaleActive && isBrevoSource && saleEventOptions.saleUtmCampaign !== ''
    ? saleEventOptions.saleUtmCampaign
    : ''

  const legacyDefaultValuesByKey = {
    utm_campaign: ['auto-tagging', 'campaign'],
    utm_content: ['none'],
    utm_term: ['none'],
  }

  UTM_PARAM_CONFIG.forEach((config) => {
    if (config.key === 'utm_campaign') {
      if (effectiveBrevoCampaign !== '') {
        nextValues[config.key] = effectiveBrevoCampaign
        return
      }
      if (forcedCampaignOverride !== '') {
        nextValues[config.key] = forcedCampaignOverride
        return
      }
    }

    const fallbackValue = resolveDefaultValue(config)
    const currentValue = normalizeUtmValue(nextValues[config.key])
    const isLegacyValue = (legacyDefaultValuesByKey[config.key] || []).includes(currentValue.toLowerCase())

    if (currentValue !== '' && !isLegacyValue) {
      return
    }

    if (fallbackValue !== '') {
      nextValues[config.key] = fallbackValue
    }
  })

  persistStoredUtms(nextValues)
}

export const captureUtmParamsFromUrl = (search = '') => {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(search || window.location.search || '')
  const storedValues = readStoredUtms()
  const nextValues = { ...storedValues }

  UTM_PARAM_CONFIG.forEach((config) => {
    const incomingValue = normalizeUtmValue(params.get(config.key))

    if (incomingValue !== '') {
      nextValues[config.key] = incomingValue
      return
    }

    if (normalizeUtmValue(nextValues[config.key]) === '') {
      const cookieVal = readCookieUtm(config.key)
      if (cookieVal !== '') {
        nextValues[config.key] = cookieVal
        return
      }

      const fallbackValue = resolveDefaultValue(config)
      if (fallbackValue !== '') {
        nextValues[config.key] = fallbackValue
      }
    }
  })

  const isCapturedBrevo = (normalizeUtmValue(nextValues.utm_source) || '').toLowerCase() === 'brevo'
  if (saleEventOptions.isSaleEvent && isCapturedBrevo && saleEventOptions.saleUtmCampaign !== '') {
    nextValues.utm_campaign = saleEventOptions.saleUtmCampaign
  } else if (saleEventOptions.isSaleEvent && saleEventOptions.saleUtmCampaign !== '') {
    const currentCampaign = normalizeUtmValue(nextValues.utm_campaign)
    if (currentCampaign === '' || ['auto-tagging', 'campaign'].includes(currentCampaign.toLowerCase())) {
      nextValues.utm_campaign = saleEventOptions.saleUtmCampaign
    }
  }

  persistStoredUtms(nextValues)
  return nextValues
}

export const getStoredUtmParams = () => {
  if (typeof window === 'undefined') return {}

  // Always check current URL first in case user landed with fresh UTMs
  const currentSearch = window.location.search || ''
  const hasUrlUtm = UTM_PARAM_CONFIG.some((c) => new URLSearchParams(currentSearch).has(c.key))
  if (hasUrlUtm) {
    return captureUtmParamsFromUrl(currentSearch)
  }

  const storedValues = readStoredUtms()
  if (Object.keys(storedValues).length === 0) {
    return captureUtmParamsFromUrl(currentSearch)
  }

  const nextValues = { ...storedValues }

  UTM_PARAM_CONFIG.forEach((config) => {
    if (normalizeUtmValue(nextValues[config.key]) === '') {
      const fallbackValue = resolveDefaultValue(config)
      if (fallbackValue !== '') {
        nextValues[config.key] = fallbackValue
      }
    }
  })

  const isStoredBrevo = (normalizeUtmValue(nextValues.utm_source) || '').toLowerCase() === 'brevo'
  if (saleEventOptions.isSaleEvent && isStoredBrevo && saleEventOptions.saleUtmCampaign !== '') {
    nextValues.utm_campaign = saleEventOptions.saleUtmCampaign
  }

  persistStoredUtms(nextValues)
  return nextValues
}

/**
 * Syncs UTM defaults and Sale Event campaign overrides from backend (/api/v1/site-config).
 */
export const syncUtmConfigFromBackend = async () => {
  if (hasSyncedBackendConfig || typeof window === 'undefined') return
  hasSyncedBackendConfig = true

  const { data } = await apiFetch('/api/v1/site-config')
  if (!data) return

  const isSale = Boolean(data?.evento_sale)
  const currentChannelSlug = new URLSearchParams(window.location.search).get('channel') || 'sale'
  const allowedChannelSlugs = Array.isArray(data?.seo?.sale_utm_campaign_channel_slugs)
    ? data.seo.sale_utm_campaign_channel_slugs
    : null
  const isChannelEligible = !allowedChannelSlugs || allowedChannelSlugs.includes(currentChannelSlug)

  const saleCampaignOverride = isSale && isChannelEligible
    ? (data?.seo?.sale_campaign_override || data?.seo?.sale_event?.utm_campaign || data?.seo?.sale_utm_campaign || null)
    : null

  const saleUtmCampaign = isSale
    ? (data?.seo?.sale_utm_campaign || data?.seo?.sale_campaign_override || data?.seo?.sale_event?.utm_campaign || null)
    : null

  setUtmDefaultOverrides(
    {
      utm_source: data?.seo?.utm_source_default,
      utm_medium: data?.seo?.utm_medium_default,
      utm_campaign: data?.seo?.utm_campaign_default,
      utm_term: data?.seo?.utm_term_default,
      utm_content: data?.seo?.utm_content_default,
      utm_site: data?.seo?.utm_site_default,
    },
    {
      isSaleEvent: isSale,
      saleCampaignOverride,
      saleUtmCampaign,
    }
  )
}

/**
 * Builds the Cotizar iframe URL injecting UTM parameters from URL/session or backend defaults.
 */
export const buildCotizaUrlWithUtms = (rawUrl) => {
  const normalizedUrl = `${rawUrl ?? ''}`.trim()
  if (!normalizedUrl || typeof window === 'undefined') return normalizedUrl

  try {
    const parsedUrl = new URL(normalizedUrl, window.location.origin)
    const utmParams = getStoredUtmParams()

    Object.entries(utmParams).forEach(([key, rawValue]) => {
      const val = normalizeUtmValue(rawValue)
      if (val !== '') {
        parsedUrl.searchParams.set(key, val)
      }
    })

    return parsedUrl.toString()
  } catch {
    return normalizedUrl
  }
}

