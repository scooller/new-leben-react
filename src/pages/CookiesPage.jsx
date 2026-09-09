import { useDispatch } from 'react-redux'
import {
  ShieldCheck,
  Building2,
  Lock,
  Cookie,
  Sliders,
  ExternalLink,
  Info,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { cookiesPageContent } from '../data/cookiesPageData.js'
import { openCookieSettings } from '../store/slices/cookieSlice.js'

export default function CookiesPage() {
  const dispatch = useDispatch()
  const { hero, responsible, sections } = cookiesPageContent

  return (
    <>
      <Navbar />
      <main className="lb-static-page lb-cookies-page">
        {/* Hero Section */}
        <section
          className="position-relative text-white py-5 d-flex align-items-center"
          style={{
            minHeight: '300px',
            backgroundColor: '#1f1f1f',
            backgroundImage: hero.heroImage
              ? `linear-gradient(rgba(15, 15, 15, 0.75), rgba(15, 15, 15, 0.85)), url(${hero.heroImage})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container py-4">
            <div className="row">
              <div className="col-lg-9">
                {hero.badge && (
                  <span
                    className="badge bg-danger text-uppercase px-3 py-2 mb-3 rounded-pill"
                    style={{ letterSpacing: '1px' }}
                  >
                    {hero.badge}
                  </span>
                )}
                <h1 className="display-5 fw-bold mb-2 text-white">{hero.title}</h1>
                {hero.subtitle && (
                  <p className="lead text-light opacity-75 mb-0">{hero.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-5 my-3">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Interactive Quick Config Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-white border-start border-4 border-danger">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                  <div className="d-flex align-items-start gap-3">
                    <Sliders size={36} className="text-danger flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="h4 fw-bold mb-1 text-dark">Configurador de Preferencias</h2>
                      <p className="text-secondary small mb-0">
                        Puedes revisar o modificar en tiempo real qué cookies permites en tu navegador.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-lg px-4 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm text-nowrap"
                    onClick={() => dispatch(openCookieSettings())}
                  >
                    <Cookie size={18} />
                    Gestionar Cookies
                  </button>
                </div>
              </div>

              {/* Responsible Info Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-light">
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <Building2 size={32} className="text-danger flex-shrink-0" />
                  <div>
                    <h2 className="h5 mb-0 fw-bold text-dark">{responsible.razonSocial}</h2>
                    <span className="text-muted">RUT: {responsible.rut}</span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <h3 className="h6 text-muted text-uppercase fw-semibold mb-1">Domicilio</h3>
                    <p className="fw-medium text-dark mb-0">{responsible.direccion}</p>
                  </div>
                  <div className="col-md-6">
                    <h3 className="h6 text-muted text-uppercase fw-semibold mb-1">
                      Contacto de Privacidad
                    </h3>
                    <p className="fw-medium text-dark mb-0">
                      <a href={`mailto:${responsible.emailContacto}`} className="text-danger text-decoration-none">
                        {responsible.emailContacto}
                      </a>
                    </p>
                  </div>
                  <div className="col-12 pt-2">
                    <div className="p-3 bg-white rounded-3 border d-flex align-items-center gap-3">
                      <ShieldCheck size={24} className="text-success flex-shrink-0" />
                      <span className="text-secondary small fw-medium">
                        Regulado bajo la fiscalización de la <strong>{responsible.organoRegulador}</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
              {sections.map((sec) => (
                <div key={sec.id} className="mb-5 pb-2">
                  <h2 className="h4 fw-bold mb-3 text-dark border-bottom pb-2">{sec.title}</h2>

                  {/* Paragraphs */}
                  {sec.content &&
                    sec.content.map((p, idx) => (
                      <p key={idx} className="fs-6 lh-lg text-secondary mb-3">
                        {p}
                      </p>
                    ))}

                  {/* Categories Breakdown */}
                  {sec.categories && (
                    <div className="row g-3 my-3">
                      {sec.categories.map((cat, idx) => (
                        <div key={idx} className="col-12">
                          <div className="card border rounded-3 p-4 h-100 shadow-xs bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                              <h3 className="h6 fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                <Lock size={16} className="text-danger" />
                                {cat.name}
                              </h3>
                              <span
                                className={`badge ${
                                  cat.status.includes('Siempre')
                                    ? 'bg-secondary'
                                    : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                                } px-3 py-2 rounded-pill`}
                                style={{ fontSize: '0.75rem' }}
                              >
                                {cat.status}
                              </span>
                            </div>
                            <p className="small text-secondary mb-2">{cat.description}</p>
                            <div className="bg-light p-2 rounded-2 mt-2">
                              <span className="text-muted small d-block">
                                <strong>Ejemplos:</strong> {cat.examples}
                              </span>
                              <span className="text-muted small d-block mt-1">
                                <strong>Conservación:</strong> {cat.retention}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rights (ARCOP-B) Grid */}
                  {sec.rights && (
                    <div className="my-4">
                      <div className="row g-3">
                        {sec.rights.map((r) => (
                          <div key={r.code} className="col-md-6 col-lg-4">
                            <div className="card border-0 bg-light rounded-3 p-3 h-100 shadow-xs">
                              <span className="badge bg-danger bg-opacity-10 text-danger w-auto align-self-start mb-2 px-2 py-1">
                                Derecho de {r.code}
                              </span>
                              <p className="small text-secondary mb-0">{r.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {sec.howToExercise && (
                        <div className="alert alert-info border-info-subtle mt-4 mb-0 rounded-3 d-flex align-items-start gap-3">
                          <Info size={22} className="text-info flex-shrink-0 mt-1" />
                          <div className="small text-dark lh-base">
                            <strong>¿Cómo ejercer tus derechos?</strong> {sec.howToExercise}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Browser Links */}
                  {sec.browsers && (
                    <div className="row g-2 mt-2">
                      {sec.browsers.map((b) => (
                        <div key={b.name} className="col-sm-6 col-md-3">
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm w-100 d-inline-flex align-items-center justify-content-between p-2 rounded-3"
                          >
                            <span>{b.name}</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
