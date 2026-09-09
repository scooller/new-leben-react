import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShieldCheck, Settings2, Cookie, ArrowLeft, Check } from 'lucide-react'
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
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-cookie-title"
      style={{ zIndex: 1060 }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '620px' }}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom p-4 d-flex align-items-start justify-content-between">
            <div>
              <span
                className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 mb-2 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                <ShieldCheck size={14} />
                Ley 21.719 • Privacidad Chile
              </span>
              <h2 id="lb-cookie-title" className="h5 fw-bold text-dark mb-0">
                {view === 'summary' ? 'Control de cookies y privacidad' : 'Preferencias de cookies'}
              </h2>
            </div>
            {hasInteracted && isSettingsOpen && (
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Cerrar preferencias"
              />
            )}
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
            {view === 'summary' ? (
              <>
                <p className="text-secondary small lh-base mb-3">
                  En <strong>Leben Grupo Inmobiliario</strong> (Inmobiliaria Cenit Ltda.) valoramos tu privacidad. Conforme a la <strong>Ley 21.719</strong> sobre Protección de Datos Personales, requerimos tu consentimiento para el uso de cookies y tecnologías de seguimiento.
                </p>
                <div className="alert alert-light border-start border-danger border-3 p-3 rounded-3 small text-secondary mb-3">
                  <strong className="text-dark">Importante:</strong> Las cookies esenciales son necesarias para operar el sitio y están activas por defecto. Las cookies de analítica, publicidad digital (Google Ads, Meta Pixel) y envío de ofertas o mailings solo se activarán si decides autorizarlas.
                </div>
                <p className="text-secondary small lh-base mb-0">
                  Puedes aceptar todas las cookies, navegar únicamente con las esenciales o ajustar cada finalidad en cualquier momento. Para más información consulta nuestra{' '}
                  <Link to="/cookies" className="text-danger fw-semibold text-decoration-underline" onClick={handleClose}>
                    Política de Cookies y Privacidad
                  </Link>.
                </p>
              </>
            ) : (
              <div className="d-flex flex-column gap-3">
                {/* Category 1: Essential */}
                <div className="card border-0 bg-light rounded-3 p-3">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={18} className="text-success" />
                      <h3 className="h6 fw-bold text-dark mb-0">Técnicas y Esenciales</h3>
                    </div>
                    <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '0.65rem' }}>
                      Obligatorias
                    </span>
                  </div>
                  <p className="text-muted small mb-0 lh-base">
                    Imprescindibles para navegar, autenticación, seguridad de navegación y funcionamiento del cotizador. No pueden ser desactivadas.
                  </p>
                </div>

                {/* Category 2: Analytics */}
                <div className="card border-0 bg-light rounded-3 p-3">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Settings2 size={18} className="text-primary" />
                      <h3 className="h6 fw-bold text-dark mb-0">Analíticas y Medición</h3>
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
                  <p className="text-muted small mb-0 lh-base">
                    Nos permiten conocer de forma anónima cuántas personas visitan los proyectos y mejorar la experiencia de navegación (Google Analytics 4).
                  </p>
                </div>

                {/* Category 3: Marketing & Ads */}
                <div className="card border-0 bg-light rounded-3 p-3">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Cookie size={18} className="text-danger" />
                      <h3 className="h6 fw-bold text-dark mb-0">Publicidad y Remarketing</h3>
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
                  <p className="text-muted small mb-0 lh-base">
                    Utilizadas para crear perfiles de audiencia y mostrar anuncios relevantes de proyectos en Google Ads, Meta (Facebook e Instagram) y redes afines.
                  </p>
                </div>

                {/* Category 4: Mailing & Communications */}
                <div className="card border-0 bg-light rounded-3 p-3">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Check size={18} className="text-warning" />
                      <h3 className="h6 fw-bold text-dark mb-0">Mailing y Ofertas Comerciales</h3>
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
                  <p className="text-muted small mb-0 lh-base">
                    Permite rastrear aperturas e intereses en correos de cotización, promociones y lanzamientos, respetando siempre tu derecho de desuscripción inmediata.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top p-4 d-flex flex-column gap-2 bg-white">
            {view === 'summary' ? (
              <>
                <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                  <button
                    type="button"
                    className="btn btn-outline-secondary text-dark flex-fill py-2 rounded-3 fw-semibold"
                    onClick={handleAcceptEssential}
                  >
                    Aceptar solo esenciales
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger flex-fill py-2 rounded-3 fw-semibold shadow-sm"
                    onClick={handleAcceptAll}
                  >
                    Aceptar todas
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-link text-secondary btn-sm text-decoration-underline p-0 mt-1"
                  onClick={() => setView('details')}
                >
                  Personalizar cookies por finalidad
                </button>
              </>
            ) : (
              <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill py-2 rounded-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 text-dark"
                  onClick={() => setView('summary')}
                >
                  <ArrowLeft size={16} />
                  Volver
                </button>
                <button
                  type="button"
                  className="btn btn-danger flex-fill py-2 rounded-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
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
    </div>
  )
}
