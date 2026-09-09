import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShieldCheck, Settings2, Cookie, X, ArrowLeft, Check } from 'lucide-react'
import {
  acceptAll,
  acceptEssentialOnly,
  saveCustomPreferences,
  closeCookieSettings,
} from '../../store/slices/cookieSlice.js'

export default function CookieConsentModal() {
  const dispatch = useDispatch()
  const { hasInteracted, preferences, isSettingsOpen } = useSelector((state) => state.cookie)

  const [view, setView] = useState('summary')
  const [localCustom, setLocalCustom] = useState({
    analytics: false,
    marketing: false,
    mailing: false,
  })

  // Sync local switches when opening
  useEffect(() => {
    if (isSettingsOpen) {
      setView('details')
      setLocalCustom({
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        mailing: Boolean(preferences.mailing),
      })
    } else {
      setView('summary')
    }
  }, [isSettingsOpen, preferences])

  // Freeze background scrolling while active
  const isOpen = !hasInteracted || isSettingsOpen
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lb-cookie-blocking-active')
    } else {
      document.body.classList.remove('lb-cookie-blocking-active')
    }
    return () => {
      document.body.classList.remove('lb-cookie-blocking-active')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAcceptAll = () => {
    dispatch(acceptAll())
  }

  const handleAcceptEssential = () => {
    dispatch(acceptEssentialOnly())
  }

  const handleSaveCustom = () => {
    dispatch(saveCustomPreferences(localCustom))
  }

  const handleClose = () => {
    if (hasInteracted) {
      dispatch(closeCookieSettings())
    }
  }

  return (
    <div
      className="lb-cookie-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-cookie-title"
    >
      <div className="lb-cookie-modal">
        {/* Header */}
        <div className="lb-cookie-modal-header">
          <div>
            <span className="lb-cookie-badge">
              <ShieldCheck size={14} />
              Ley 21.719 • Privacidad Chile
            </span>
            <h2 id="lb-cookie-title" className="lb-cookie-title">
              {view === 'summary' ? 'Control de cookies y privacidad' : 'Preferencias de cookies'}
            </h2>
          </div>
          {hasInteracted && isSettingsOpen && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary border-0 p-1"
              onClick={handleClose}
              aria-label="Cerrar preferencias"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="lb-cookie-modal-body">
          {view === 'summary' ? (
            <>
              <p>
                En <strong>Leben Grupo Inmobiliario</strong> (Inmobiliaria Cenit Ltda.) valoramos tu privacidad. Conforme a la <strong>Ley 21.719</strong> sobre Protección de Datos Personales, requerimos tu consentimiento para el uso de cookies y tecnologías de seguimiento.
              </p>
              <div className="lb-cookie-legal-note">
                <strong>Importante:</strong> Las cookies esenciales son necesarias para operar el sitio y están activas por defecto. Las cookies de analítica, publicidad digital (Google Ads, Meta Pixel) y envío de ofertas o mailings solo se activarán si decides autorizarlas.
              </div>
              <p className="mb-0">
                Puedes aceptar todas las cookies, navegar únicamente con las esenciales o ajustar cada finalidad en cualquier momento. Para más información consulta nuestra{' '}
                <Link to="/cookies" className="lb-cookie-link" onClick={handleClose}>
                  Política de Cookies y Privacidad
                </Link>.
              </p>
            </>
          ) : (
            <div className="lb-cookie-categories">
              {/* Category 1: Essential */}
              <div className="lb-cookie-card">
                <div className="lb-cookie-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <ShieldCheck size={18} className="text-success" />
                    <h3 className="lb-cookie-card-title">Técnicas y Esenciales</h3>
                  </div>
                  <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '0.7rem' }}>
                    Obligatorias
                  </span>
                </div>
                <p className="lb-cookie-card-desc">
                  Imprescindibles para navegar, autenticación, seguridad de navegación y funcionamiento del cotizador. No pueden ser desactivadas.
                </p>
              </div>

              {/* Category 2: Analytics */}
              <div className="lb-cookie-card">
                <div className="lb-cookie-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <Settings2 size={18} className="text-primary" />
                    <h3 className="lb-cookie-card-title">Analíticas y Medición</h3>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="cookie-switch-analytics"
                      checked={localCustom.analytics}
                      onChange={(e) =>
                        setLocalCustom((prev) => ({ ...prev, analytics: e.target.checked }))
                      }
                    />
                  </div>
                </div>
                <p className="lb-cookie-card-desc">
                  Nos permiten conocer de forma anónima cuántas personas visitan los proyectos y mejorar la experiencia de navegación (Google Analytics 4).
                </p>
              </div>

              {/* Category 3: Marketing & Ads */}
              <div className="lb-cookie-card">
                <div className="lb-cookie-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <Cookie size={18} className="text-danger" />
                    <h3 className="lb-cookie-card-title">Publicidad y Remarketing</h3>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="cookie-switch-marketing"
                      checked={localCustom.marketing}
                      onChange={(e) =>
                        setLocalCustom((prev) => ({ ...prev, marketing: e.target.checked }))
                      }
                    />
                  </div>
                </div>
                <p className="lb-cookie-card-desc">
                  Utilizadas para crear perfiles de audiencia y mostrar anuncios relevantes de proyectos en Google Ads, Meta (Facebook e Instagram) y redes afines.
                </p>
              </div>

              {/* Category 4: Mailing & Communications */}
              <div className="lb-cookie-card">
                <div className="lb-cookie-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <Check size={18} className="text-warning" />
                    <h3 className="lb-cookie-card-title">Mailing y Ofertas Comerciales</h3>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="cookie-switch-mailing"
                      checked={localCustom.mailing}
                      onChange={(e) =>
                        setLocalCustom((prev) => ({ ...prev, mailing: e.target.checked }))
                      }
                    />
                  </div>
                </div>
                <p className="lb-cookie-card-desc">
                  Permite rastrear aperturas e intereses en correos de cotización, promociones y lanzamientos, respetando siempre tu derecho de desuscripción inmediata.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="lb-cookie-modal-footer">
          {view === 'summary' ? (
            <>
              <div className="lb-cookie-btn-group">
                <button
                  type="button"
                  className="btn btn-cookie-essential"
                  onClick={handleAcceptEssential}
                >
                  Aceptar solo esenciales
                </button>
                <button
                  type="button"
                  className="btn btn-cookie-accept"
                  onClick={handleAcceptAll}
                >
                  Aceptar todas
                </button>
              </div>
              <button
                type="button"
                className="btn-cookie-config"
                onClick={() => setView('details')}
              >
                Personalizar cookies por finalidad
              </button>
            </>
          ) : (
            <div className="lb-cookie-btn-group">
              <button
                type="button"
                className="btn btn-cookie-essential d-inline-flex align-items-center justify-content-center gap-2"
                onClick={() => setView('summary')}
              >
                <ArrowLeft size={16} />
                Volver
              </button>
              <button
                type="button"
                className="btn btn-cookie-accept d-inline-flex align-items-center justify-content-center gap-2"
                onClick={handleSaveCustom}
              >
                <Check size={16} />
                Guardar preferencias
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
