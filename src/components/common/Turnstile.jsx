import { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const DEFAULT_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACMfgB0ehGErCdBk'

let turnstileScriptPromise = null

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (turnstileScriptPromise) return turnstileScriptPromise

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src*="challenges.cloudflare.com/turnstile"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.turnstile))
      existingScript.addEventListener('error', (err) => reject(err))
      return
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

export default function Turnstile({
  onVerify,
  onExpire,
  onError,
  theme = 'light',
  siteKey = DEFAULT_SITE_KEY,
  className = '',
}) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const [isLocalFallback, setIsLocalFallback] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadTurnstileScript()
      .then((turnstile) => {
        if (!isMounted || !containerRef.current || !turnstile) return

        try {
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: (token) => {
              if (isMounted && onVerify) onVerify(token)
            },
            'expired-callback': () => {
              if (isMounted && onExpire) onExpire()
            },
            'error-callback': (code) => {
              // Localhost domain fallback if rejected by Cloudflare
              const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
              if (isLocalhost) {
                setIsLocalFallback(true)
                if (onVerify) onVerify('dev-turnstile-token')
              } else {
                if (onError) onError(code)
              }
            },
          })
        } catch {
          // Graceful fallback for local development
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          if (isLocalhost) {
            setIsLocalFallback(true)
            if (onVerify) onVerify('dev-turnstile-token')
          }
        }
      })
      .catch(() => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        if (isLocalhost) {
          setIsLocalFallback(true)
          if (onVerify) onVerify('dev-turnstile-token')
        }
      })

    return () => {
      isMounted = false
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Ignore removal errors on unmount
        }
      }
    }
  }, [siteKey, theme, onVerify, onExpire, onError])

  if (isLocalFallback) {
    return (
      <div className={`p-2 px-3 rounded-2 bg-light border d-inline-flex align-items-center gap-2 small text-secondary ${className}`}>
        <ShieldCheck size={16} className="text-success" />
        <span>Verificación Turnstile (Entorno Local)</span>
      </div>
    )
  }

  return (
    <div className={`lb-turnstile-wrapper ${className}`}>
      <div ref={containerRef} />
    </div>
  )
}
