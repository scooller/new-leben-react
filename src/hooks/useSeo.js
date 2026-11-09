import { useEffect } from 'react'

const DEFAULT_TITLE = 'Inmobiliaria Leben | Departamentos y Proyectos en Venta en Chile'
const DEFAULT_DESC = 'Descubre departamentos en venta en el sur de Chile y Santiago con Inmobiliaria Leben. Proyectos exclusivos, alta calidad y diseño sustentable.'
const SITE_NAME = 'Inmobiliaria Leben'
const LOCALE = 'es_CL'
const TWITTER_SITE = '@leben_inmuebles'

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return import.meta.env.VITE_SITE_URL || 'https://ileben.cl'
}

function toAbsoluteUrl(url, baseUrl) {
  const origin = baseUrl || getBaseUrl()
  if (!url) return `${origin}/images/home/hero-institucional.jpg`
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${origin}${cleanPath}`
}

function updateMeta(attr, val, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${val}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, val)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function updateLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Lightweight, zero-dependency SEO hook (Ponytail principle)
 * Dynamically updates document.title, meta tags, canonical link, OpenGraph, Twitter Cards, and JSON-LD schema.
 * All URLs are resolved dynamically according to the active domain (dev, test, prod).
 */
export function useSeo({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  schema = null,
} = {}) {
  useEffect(() => {
    const baseUrl = getBaseUrl()
    const defaultImage = `${baseUrl}/images/home/hero-institucional.jpg`

    // 1. Title (prevent duplicate brand suffix)
    const pageTitle = title
      ? (title.includes('Inmobiliaria Leben') ? title : `${title} | Inmobiliaria Leben`)
      : DEFAULT_TITLE
    document.title = pageTitle

    // 2. Canonical
    const fullCanonical = canonical
      ? toAbsoluteUrl(canonical, baseUrl)
      : `${baseUrl}${window.location.pathname}`
    updateLink('canonical', fullCanonical)

    // 3. Meta description & robots
    updateMeta('name', 'description', description)
    updateMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // 4. Open Graph (Facebook, WhatsApp, LinkedIn)
    const absoluteImage = toAbsoluteUrl(ogImage || defaultImage, baseUrl)
    updateMeta('property', 'og:site_name', SITE_NAME)
    updateMeta('property', 'og:locale', LOCALE)
    updateMeta('property', 'og:title', pageTitle)
    updateMeta('property', 'og:description', description)
    updateMeta('property', 'og:url', fullCanonical)
    updateMeta('property', 'og:type', ogType)
    updateMeta('property', 'og:image', absoluteImage)
    updateMeta('property', 'og:image:secure_url', absoluteImage)
    updateMeta('property', 'og:image:alt', pageTitle)
    updateMeta('property', 'og:logo', toAbsoluteUrl('/images/brand/logo-isotipo.webp', baseUrl))

    // 5. Twitter Card
    updateMeta('name', 'twitter:card', 'summary_large_image')
    updateMeta('name', 'twitter:site', TWITTER_SITE)
    updateMeta('name', 'twitter:title', pageTitle)
    updateMeta('name', 'twitter:description', description)
    updateMeta('name', 'twitter:image', absoluteImage)
    updateMeta('name', 'twitter:image:alt', pageTitle)

    // 6. JSON-LD Schema
    const SCHEMA_ID = 'lb-json-ld-schema'
    let script = document.getElementById(SCHEMA_ID)

    if (schema) {
      if (!script) {
        script = document.createElement('script')
        script.id = SCHEMA_ID
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(schema)
    } else if (script) {
      script.remove()
    }
  }, [title, description, canonical, ogImage, ogType, noindex, schema])
}
