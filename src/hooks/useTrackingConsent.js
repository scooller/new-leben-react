import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const GA_ID = import.meta.env.VITE_GA_ID || ''
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || ''

/**
 * Initializes and dynamically updates Google Consent Mode v2 and Meta Pixel Consent
 * in strict compliance with Chilean Data Protection Law (Ley 21.719).
 *
 * Privacy & Anonymity Strategy:
 * 1. Default State: All tracking storage is DENIED.
 * 2. Google Consent Mode v2 (Cookieless Pings):
 *    - GA4 script is initialized with 'analytics_storage: denied' and 'anonymize_ip: true'.
 *    - In this state, Google Analytics DOES NOT write or read cookies on the user's device.
 *    - It sends anonymous, cookieless pings that enable Google's behavioral modeling
 *      (preserving aggregate site traffic metrics without identifying individual users).
 * 3. Opt-in: When user accepts, consent is updated to 'granted' enabling persistent cookies.
 * 4. Meta Pixel: Strictly opt-in only. Zero network requests or tracking until marketing consent is granted.
 */
export function useTrackingConsent() {
  const { preferences, hasInteracted } = useSelector((state) => state.cookie)
  const isGaInjected = useRef(false)
  const isPixelInjected = useRef(false)

  // 1. Initial Setup: Establish stub objects, set default consent to DENIED, and mount GA4 in anonymous mode
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Ensure dataLayer and gtag exist
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments)
      }
    }

    // Ensure fbq stub exists
    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, arguments)
        } else {
          fbq.queue.push(arguments)
        }
      }
      fbq.push = fbq
      fbq.loaded = true
      fbq.version = '2.0'
      fbq.queue = []
      window.fbq = fbq
    }

    // Ley 21.719 requirement: Default to DENIED for all non-essential storage
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    })
    window.fbq('consent', 'revoke')

    // Mount GA4 script in Cookieless Mode if GA_ID is configured
    // This transmits anonymous pings (no cookies written) so aggregate traffic data is not lost
    if (GA_ID && !isGaInjected.current) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(script)

      window.gtag('js', new Date())
      window.gtag('config', GA_ID, {
        anonymize_ip: true,
        send_page_view: true,
      })
      isGaInjected.current = true
    }
  }, [])

  // 2. React to consent changes (Granular update)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag || !window.fbq) return

    const { analytics = false, marketing = false } = preferences || {}

    // --- Google Consent Mode v2 Update ---
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    })

    // --- Meta Pixel Consent Update ---
    if (marketing) {
      window.fbq('consent', 'grant')

      // Dynamically inject Meta script only once marketing consent is explicitly granted
      if (PIXEL_ID && !isPixelInjected.current) {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'
        document.head.appendChild(script)

        window.fbq('init', PIXEL_ID)
        window.fbq('track', 'PageView')
        isPixelInjected.current = true
      }
    } else {
      window.fbq('consent', 'revoke')
    }

    // Broadcast standard event for custom tags or mailing trackers
    window.dispatchEvent(
      new CustomEvent('leben:consent-updated', {
        detail: { preferences, hasInteracted },
      })
    )
  }, [preferences, hasInteracted])
}
