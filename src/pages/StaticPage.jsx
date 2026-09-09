import { useParams } from 'react-router-dom'
import { FileText, Download, Building2, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import NotFound from './NotFound.jsx'
import { staticPages, slugAliases } from '../data/staticPages.js'

export default function StaticPage({ slug: propSlug }) {
  const { slug: routeSlug } = useParams()
  const rawSlug = propSlug || routeSlug
  const resolvedSlug = slugAliases[rawSlug] || rawSlug
  const page = staticPages[resolvedSlug]

  if (!page) {
    return <NotFound />
  }

  return (
    <>
      <Navbar />
      <main className="lb-static-page">
        {/* Hero Section */}
        <section
          className="position-relative text-white py-5 d-flex align-items-center"
          style={{
            minHeight: '300px',
            backgroundColor: '#1f1f1f',
            backgroundImage: page.heroImage ? `linear-gradient(rgba(15, 15, 15, 0.75), rgba(15, 15, 15, 0.85)), url(${page.heroImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container py-4">
            <div className="row">
              <div className="col-lg-8">
                {page.badge && (
                  <span className="badge bg-danger text-uppercase px-3 py-2 mb-3 rounded-pill" style={{ letterSpacing: '1px' }}>
                    {page.badge}
                  </span>
                )}
                <h1 className="display-5 fw-bold mb-2 text-white">{page.title}</h1>
                {page.subtitle && (
                  <p className="lead text-light opacity-75 mb-0">{page.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-5 my-3">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Main Paragraphs */}
              {page.paragraphs && page.paragraphs.length > 0 && (
                <div className="mb-5">
                  {page.paragraphs.map((p, idx) => (
                    <p key={idx} className="fs-5 lh-lg text-secondary mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Company Details (Información de la empresa) */}
              {page.companyDetails && (
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-light">
                  <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                    <Building2 size={32} className="text-danger flex-shrink-0" />
                    <div>
                      <h2 className="h4 mb-0 fw-bold text-dark">{page.companyDetails.razonSocial}</h2>
                      <span className="text-muted">RUT: {page.companyDetails.rut}</span>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <h3 className="h6 text-muted text-uppercase fw-semibold mb-1">Representante Legal</h3>
                      <p className="fw-medium text-dark mb-0">{page.companyDetails.representanteLegal}</p>
                      <small className="text-muted">RUT: {page.companyDetails.rutRepresentante}</small>
                    </div>

                    <div className="col-md-6">
                      <h3 className="h6 text-muted text-uppercase fw-semibold mb-1">Dirección Corporativa</h3>
                      <p className="fw-medium text-dark mb-0">{page.companyDetails.direccion}</p>
                    </div>

                    <div className="col-12 pt-2">
                      <div className="p-3 bg-white rounded-3 border d-flex align-items-center gap-3">
                        <ShieldCheck size={24} className="text-success flex-shrink-0" />
                        <span className="text-secondary small fw-medium">{page.companyDetails.seguridadDatos}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps (Proceso de reserva en línea) */}
              {page.intro && <p className="fw-bold fs-5 text-dark mb-4">{page.intro}</p>}

              {page.steps && (
                <div className="row g-3 mb-5">
                  {page.steps.map((step, idx) => (
                    <div key={idx} className="col-12">
                      <div className="p-4 bg-white border rounded-3 shadow-xs d-flex align-items-start gap-3">
                        <span
                          className="badge bg-danger text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                        >
                          {idx + 1}
                        </span>
                        <p className="mb-0 text-secondary lh-base fs-6">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Callout (Retracto) */}
              {page.callout && (
                <div className="alert alert-warning border-warning-subtle rounded-3 p-4 mb-5 shadow-xs">
                  <div className="d-flex align-items-start gap-3">
                    <CheckCircle2 size={24} className="text-warning flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="h6 fw-bold mb-1">{page.callout.title}</h3>
                      <p className="mb-0 text-dark small lh-base">{page.callout.text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Action (Bases legales) */}
              {page.pdfAction && (
                <div className="card border-danger border-opacity-25 bg-danger bg-opacity-10 rounded-4 p-4 p-md-5 my-4">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                    <div className="d-flex align-items-center gap-3">
                      <FileText size={40} className="text-danger flex-shrink-0" />
                      <div>
                        <h2 className="h5 fw-bold mb-1 text-dark">Documento Protocolizado</h2>
                        <span className="text-muted small">{page.pdfAction.protocol}</span>
                      </div>
                    </div>
                    <a
                      href={page.pdfAction.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-danger btn-lg d-inline-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
                    >
                      <Download size={18} />
                      {page.pdfAction.label}
                    </a>
                  </div>
                </div>
              )}

              {/* Highlight Section (Proyectos anteriores) */}
              {page.highlightSection && (
                <div className="mt-5 pt-4 border-top">
                  <h2 className="h4 fw-bold mb-4 text-dark">{page.highlightSection.title}</h2>
                  <div className="row g-3">
                    {page.highlightSection.items.map((item, idx) => (
                      <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="p-3 bg-light rounded-3 border-0 h-100 d-flex align-items-center gap-2">
                          <MapPin size={16} className="text-danger flex-shrink-0" />
                          <div>
                            <div className="small fw-semibold text-dark">{item.name}</div>
                            <small className="text-muted">{item.comuna}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
