import { useEffect, useRef, useState, useCallback } from 'react'
import { ShieldCheck, ShieldAlert, RotateCw } from 'lucide-react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const DEFAULT_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACMfgB0ehGErCdBk'

let turnstileScriptPromise = null

function isNonProductionEnvironment() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('test.') ||
    host.startsWith('dev.') ||
    host.includes('staging') ||
    host.endsWith('.local')
  )
}

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
  const [fallbackMode, setFallbackMode] = useState(null) // 'dev' | 'test-domain' | 'error' | null
  const [retryCount, setRetryCount] = useState(0)

  const activateFallback = useCallback((reason) => {
    setFallbackMode(reason)
    if (onVerify) {
      onVerify(`fallback-${reason}-token-${Date.now()}`)
    }
  }, [onVerify])

  useEffect(() => {
    let isMounted = true

    loadTurnstileScript()
      .then((turnstile) => {
        if (!isMounted || !containerRef.current || !turnstile) return

        try {
          // Clear any previous widget DOM if retrying
          containerRef.current.innerHTML = ''

          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: (token) => {
              if (isMounted) {
                setFallbackMode(null)
                if (onVerify) onVerify(token)
              }
            },
            'expired-callback': () => {
              if (isMounted && onExpire) onExpire()
            },
            'error-callback': (code) => {
              console.warn('[Turnstile] Cloudflare challenge error or domain rejection:', code)
              if (!isMounted) return

              if (isNonProductionEnvironment()) {
                activateFallback('test-domain')
              } else {
                setFallbackMode('error')
                if (onError) onError(code)
              }
            },
          })
        } catch (err) {
          console.warn('[Turnstile] render error:', err)
          if (!isMounted) return
          if (isNonProductionEnvironment()) {
            activateFallback('test-domain')
          } else {
            setFallbackMode('error')
          }
        }
      })
      .catch((err) => {
        console.warn('[Turnstile] script load error:', err)
        if (!isMounted) return
        if (isNonProductionEnvironment()) {
          activateFallback('test-domain')
        } else {
          setFallbackMode('error')
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
  }, [siteKey, theme, onVerify, onExpire, onError, retryCount, activateFallback])

  // Fallback for local development or test/staging domains not registered in Cloudflare
  if (fallbackMode === 'test-domain' || fallbackMode === 'dev') {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'test'
    return (
      <div className={`p-2 px-3 rounded-2 bg-light border d-inline-flex align-items-center gap-2 small text-secondary ${className}`}>
        <ShieldCheck size={16} className="text-success" />
        <span>Verificación Turnstile habilitada (modo pruebas en <strong>{hostname}</strong>)</span>
      </div>
    )
  }

  // Graceful contingency fallback in production if Cloudflare is blocked by adblock/network
  if (fallbackMode === 'error') {
    return (
      <div className={`p-3 rounded-2 bg-light border d-flex flex-column gap-2 small ${className}`}>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 text-muted">
            <ShieldAlert size={16} className="text-warning" />
            <span>El servicio de verificación de seguridad no respondió.</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            onClick={() => {
              setFallbackMode(null)
              setRetryCount((prev) => prev + 1)
            }}
          >
            <RotateCw size={13} />
            <span>Reintentar</span>
          </button>
        </div>
        <div className="form-check mt-1">
          <input
            className="form-check-input"
            type="checkbox"
            id="turnstile-contingency-check"
            onChange={(e) => {
              if (e.target.checked) {
                activateFallback('contingency-confirmed')
              } else if (onExpire) {
                onExpire()
              }
            }}
          />
          <label className="form-check-label text-secondary" htmlFor="turnstile-contingency-check">
            Confirmo que soy una persona real y deseo enviar esta solicitud
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className={`lb-turnstile-wrapper ${className}`}>
      <div ref={containerRef} />
    </div>
  )
}
