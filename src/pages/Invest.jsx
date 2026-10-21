// ============================================================
// Invest Page — from Figma "Invest" (node 2260:1044)
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import Turnstile from '../components/common/Turnstile.jsx'
import { investData as data } from '../data/invest.js'
import { formatRut, validateRut, formatPhone, validatePhone, validateEmail } from '../lib/chileUtils.js'

import {
  Check,
  CheckCircle2,
  Users,
  Search,
  Building,
  FileText,
  ChevronDown,
  ArrowRight,
  MapPin,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Invest() {
  useGsapAnimations()

  const [activeFilter, setActiveFilter] = useState('SANTIAGO')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    renta: '',
    comuna: '',
    proyecto: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [formError, setFormError] = useState('')

  const heroBgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroBgRef.current) {
        gsap.fromTo(
          heroBgRef.current,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: '.lb-invest-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateRut(formData.rut)) {
      setFormError('RUT inválido. Por favor, verifica el número y dígito verificador.')
      return
    }

    if (!validateEmail(formData.email)) {
      setFormError('Correo electrónico no válido.')
      return
    }

    if (!validatePhone(formData.telefono)) {
      setFormError('Teléfono no válido. Debe tener 9 dígitos chilenos.')
      return
    }

    if (!turnstileToken) {
      setFormError('Por favor, completa la verificación de seguridad Turnstile.')
      return
    }

    setFormError('')
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  const filteredProjects =
    activeFilter === 'TODOS'
      ? data.projects.items
      : data.projects.items.filter((p) => p.region === activeFilter)

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="lb-invest-page">
      <Navbar />

      <main id="main-invest">
        {/* ======================= HERO ======================= */}
        <section className="lb-invest-hero position-relative d-flex align-items-center text-center overflow-hidden">
          <div className="lb-invest-hero__bg" aria-hidden>
            <img ref={heroBgRef} src={data.hero.backgroundImage} alt="" />
            <div className="lb-invest-hero__overlay" />
          </div>

          <div className="container position-relative z-2">
            <div className="mx-auto text-center" style={{ maxWidth: '1044px' }}>
              <ScrollAnim animation="fade-up" delay={0.1}>
                <p className="text-uppercase text-white fw-semibold small mb-2" style={{ letterSpacing: '0.12em' }}>
                  {data.hero.eyebrow}
                </p>
              </ScrollAnim>

              <ScrollAnim animation="fade-up" delay={0.2}>
                <h1
                  className="display-4 fw-semibold text-white mx-auto mb-3"
                  style={{ maxWidth: '1044px' }}
                  dangerouslySetInnerHTML={{ __html: data.hero.title }}
                />
              </ScrollAnim>

              <ScrollAnim animation="fade-up" delay={0.3}>
                <p className="lead text-white text-opacity-75 mx-auto mb-4" style={{ maxWidth: '720px' }}>
                  {data.hero.subtitle}
                </p>
              </ScrollAnim>

              <ScrollAnim animation="fade-up" delay={0.4}>
                <div className="d-flex justify-content-center">
                  <a href={data.hero.ctaHref} className="btn btn-danger fw-bold text-uppercase px-4 py-3 rounded-3 shadow">
                    {data.hero.ctaText}
                  </a>
                </div>
              </ScrollAnim>
            </div>
          </div>
        </section>

        {/* ======================= VALUE PROP ======================= */}
        <section className="py-5 bg-white" id="oportunidad">
          <div className="container py-lg-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <ScrollAnim animation="fade-up">
                  <p className="lb-invest-eyebrow">{data.valueProp.eyebrow}</p>
                  <h2 className="h2 fw-semibold text-dark mb-3" dangerouslySetInnerHTML={{ __html: data.valueProp.title }}></h2>
                  <p className="text-secondary mb-3">{data.valueProp.description}</p>
                  <p className="fw-semibold text-dark mb-4">{data.valueProp.prompt}</p>

                  <div className="d-flex flex-column gap-3">
                    {data.valueProp.items.map((item, i) => (
                      <div key={i} className="d-flex align-items-start gap-3">
                        <div
                          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                          style={{ width: '24px', height: '24px' }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <div>
                          <span className="text-dark">{item.text}</span>
                          {item.footnote && (
                            <span className="small text-muted d-block mt-1">{item.footnote}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollAnim>
              </div>

              <div className="col-lg-6">
                <ScrollAnim animation="fade-up" delay={0.15} className="rounded-4 overflow-hidden shadow-sm">
                  <img src={data.valueProp.image} alt="Oportunidad Única" className="img-fluid w-100 d-block" />
                </ScrollAnim>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= SERVICES (THE FORM) ======================= */}
        <section className="pb-5 bg-white" id="formulario">
          <div className="container">
            <ScrollAnim animation="fade-up" className="card bg-dark text-white rounded-4 p-4 p-md-5 border-0 shadow-lg mx-auto" style={{ maxWidth: '1248px' }}>
              <div className="text-center mb-4">
                <h2 className="h2 fw-bold text-white mb-2">{data.leadForm.title}</h2>
                <p className="text-secondary mb-0">{data.leadForm.subtitle}</p>
              </div>

              {formSubmitted && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                  <Check size={20} />
                  <span>¡Gracias! Tu solicitud ha sido enviada con éxito. Te contactaremos a la brevedad.</span>
                </div>
              )}

              {formError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Row 1 */}
                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Nombre*</label>
                    <input
                      type="text"
                      className="form-control rounded-2 bg-white text-dark"
                      value={formData.nombre}
                      onChange={(e) => handleFieldChange('nombre', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Apellido*</label>
                    <input
                      type="text"
                      className="form-control rounded-2 bg-white text-dark"
                      value={formData.apellido}
                      onChange={(e) => handleFieldChange('apellido', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">RUT*</label>
                    <input
                      type="text"
                      maxLength={12}
                      className="form-control rounded-2 bg-white text-dark"
                      placeholder="12.345.678-9"
                      value={formData.rut}
                      onChange={(e) => handleFieldChange('rut', formatRut(e.target.value))}
                      required
                    />
                  </div>

                  {/* Row 2 */}
                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Correo Electrónico*</label>
                    <input
                      type="email"
                      className="form-control rounded-2 bg-white text-dark"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Teléfono*</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-secondary fw-semibold border-end-0">+56</span>
                      <input
                        type="tel"
                        maxLength={9}
                        className="form-control rounded-2 bg-white text-dark"
                        placeholder="9 1234 5678"
                        value={formData.telefono}
                        onChange={(e) => handleFieldChange('telefono', formatPhone(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">
                      ¿En qué rango se encuentra tu renta líquida?*
                    </label>
                    <select
                      className="form-select rounded-2 bg-white text-dark"
                      value={formData.renta}
                      onChange={(e) => handleFieldChange('renta', e.target.value)}
                      required
                    >
                      <option value="">—Por favor, elige una opción—</option>
                      {data.leadForm.rentOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 3 */}
                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Comuna*</label>
                    <select
                      className="form-select rounded-2 bg-white text-dark"
                      value={formData.comuna}
                      onChange={(e) => handleFieldChange('comuna', e.target.value)}
                      required
                    >
                      <option value="">Comuna donde quieres invertir</option>
                      {data.leadForm.communes.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-light text-opacity-75 small fw-medium mb-1">Proyecto*</label>
                    <select
                      className="form-select rounded-2 bg-white text-dark"
                      value={formData.proyecto}
                      onChange={(e) => handleFieldChange('proyecto', e.target.value)}
                      required
                    >
                      <option value="">Proyecto</option>
                      {data.leadForm.projects.map((p, i) => (
                        <option key={i} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Turnstile Antispam */}
                  <div className="col-md-8 pt-2">
                    <Turnstile
                      theme="dark"
                      onVerify={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-danger w-100 fw-bold py-2 rounded-2 shadow-sm">
                      {data.leadForm.submitText}
                    </button>
                  </div>
                </div>
              </form>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= EXPERT ADVISORY ======================= */}
        <section className="py-5 bg-white">
          <div className="container py-lg-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <ScrollAnim animation="fade-up" className="rounded-4 overflow-hidden shadow-sm">
                  <img src={data.advisory.image} alt="Asesoría experta" className="img-fluid w-100 d-block" style={{ minHeight: '440px', objectFit: 'cover' }} />
                </ScrollAnim>
              </div>

              <div className="col-lg-6">
                <ScrollAnim animation="fade-up" delay={0.15}>
                  <p className="lb-invest-eyebrow">{data.advisory.eyebrow}</p>
                  <h2 className="h2 fw-semibold text-dark mb-3">{data.advisory.title}</h2>
                  <p className="text-secondary mb-4">{data.advisory.description}</p>

                  <div className="d-flex flex-column gap-3">
                    {data.advisory.cards.map((c, i) => (
                      <div key={i} className="d-flex align-items-start gap-3">
                        <div className="text-success flex-shrink-0 mt-1">
                          <CheckCircle2 size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="h6 fw-semibold text-dark mb-1">{c.title}</h4>
                          <p className="small text-muted mb-0">{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollAnim>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= PROJECTS SECTION ======================= */}
        <section className="py-5" style={{ backgroundColor: '#faf9f6' }} id="proyectos">
          <div className="container py-lg-4">
            <div className="d-flex flex-column align-items-center flex-wrap gap-3 mb-4">
              <h2 className="h3 fw-bold text-dark mb-0">{data.projects.title}</h2>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className={`btn btn-link p-0 text-decoration-none fs-5 ${activeFilter === 'SANTIAGO' ? 'text-dark fw-bold' : 'text-secondary'}`}
                  onClick={() => setActiveFilter('SANTIAGO')}
                >
                  SANTIAGO
                </button>
                <span className="text-danger fw-bold fs-5 user-select-none">I</span>
                <button
                  type="button"
                  className={`btn btn-link p-0 text-decoration-none fs-5 ${activeFilter === 'REGIONES' ? 'text-dark fw-bold' : 'text-secondary'}`}
                  onClick={() => setActiveFilter('REGIONES')}
                >
                  REGIONES
                </button>
              </div>
            </div>

            <div className="row g-4 mt-1">
              {filteredProjects.map((p, i) => {
                const isBlanco = p.tag.toLowerCase().includes('blanco')
                return (
                  <div key={p.id} className="col-md-6 col-lg-3">
                    <ScrollAnim animation="fade-up" delay={0.08 * i} className="card h-100 border-0 rounded-3 overflow-hidden shadow-sm lb-invest-card">
                      <div className="lb-invest-card__image-container">
                        <img src={p.image} alt={p.title} className="lb-invest-card__image" />
                      </div>

                      <div
                        className={`badge rounded-0 py-2 w-100 text-center fw-semibold text-white ${isBlanco ? 'bg-secondary' : 'bg-danger'}`}
                      >
                        {p.tag}
                      </div>

                      <div className="card-body p-3 d-flex flex-column">
                        <h3 className="card-title h6 fw-semibold text-dark mb-1">{p.title}</h3>
                        <p className="text-muted small d-flex align-items-center mb-1">
                          <MapPin size={13} className="me-1 text-danger flex-shrink-0" />
                          <span>{p.location}</span>
                        </p>
                        <p className="small text-secondary mb-2">{p.typology}</p>
                        <div className="h5 fw-bold text-dark mt-auto mb-0">{p.price}</div>
                      </div>

                      <div className="card-footer bg-transparent border-top p-3">
                        <Link to={p.href} className="d-flex align-items-center justify-content-between text-decoration-none text-dark fw-semibold small lb-invest-card__action-link">
                          <span>Conocer proyecto</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </ScrollAnim>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ======================= PROCESS SECTION ======================= */}
        <section className="py-5" style={{ backgroundColor: '#eef2f6' }}>
          <div className="container py-lg-4">
            <ScrollAnim animation="fade-up" className="text-center mb-5">
              <h2 className="h2 fw-bold text-dark mb-2">{data.process.title}</h2>
              <p className="text-secondary mx-auto mb-0" style={{ maxWidth: '680px' }}>{data.process.subtitle}</p>
            </ScrollAnim>

            <div className="row g-4">
              {data.process.steps.map((st, i) => {
                const icons = {
                  users: Users,
                  search: Search,
                  building: Building,
                  'file-text': FileText,
                }
                const Icon = icons[st.icon] || FileText
                return (
                  <div key={i} className="col-md-6 col-lg-3">
                    <ScrollAnim animation="fade-up" delay={0.1 * i} className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm bg-body-tertiary lb-invest-step">
                      <div className="position-relative" style={{ height: '160px' }}>
                        <img src={st.image} alt={st.title} className="w-100 h-100 object-fit-cover" />
                        <div
                          className="position-absolute rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow"
                          style={{ bottom: '-22px', left: '20px', width: '44px', height: '44px', zIndex: 2 }}
                        >
                          <Icon size={18} />
                        </div>
                      </div>

                      <div className="card-body p-4 pt-4 mt-2">
                        <h4 className="card-title h6 fw-bold text-dark mb-2">{st.title}</h4>
                        <p className="card-text small text-secondary mb-0">{st.description}</p>
                      </div>
                    </ScrollAnim>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ======================= SMART SECTION ======================= */}
        <section className="bg-dark text-white p-0 overflow-hidden">
          <div className="container">
            <ScrollAnim animation="fade-up" className="row g-0 align-items-center">
              <div className="col-lg-5">
                <div style={{ height: '515px', overflow: 'hidden' }}>
                  <img src={data.smartBanner.image} alt="Tranquilidad Total" className="w-100 h-100 object-fit-cover" />
                </div>
              </div>

              <div className="col-lg-7">
                <div className="p-4 p-md-5 d-flex flex-column justify-content-center">
                  <p className="lb-invest-eyebrow">{data.smartBanner.eyebrow}</p>
                  <h2 className="display-6 fw-bold text-white mb-3" dangerouslySetInnerHTML={{ __html: data.smartBanner.title }}></h2>
                  <p className="xs-small fw-bold text-white text-opacity-75 mb-2">{data.smartBanner.disclaimer}</p>
                  <p className="text-white text-opacity-90 mb-4">{data.smartBanner.description}</p>
                  <div>
                    <a href={data.smartBanner.ctaHref} className="btn btn-danger rounded-pill px-4 py-2 fw-semibold w-100">
                      {data.smartBanner.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= FAQ SECTION ======================= */}
        <section className="py-5" style={{ backgroundColor: '#faf9f6' }} id="faq">
          <div className="container py-lg-4">
            <ScrollAnim animation="fade-up" className="text-center mb-4">
              <p className="lb-invest-eyebrow">{data.faq.eyebrow}</p>
              <h2 className="h2 fw-semibold text-dark mb-0">{data.faq.title}</h2>
            </ScrollAnim>

            <div className="row g-4 mt-2">
              <div className="col-lg-6">
                {data.faq.items.slice(0, 5).map((item, i) => (
                  <div key={i} className={`card border-0 rounded-3 shadow-sm mb-3 overflow-hidden ${openFaqIndex === i ? 'border border-danger border-opacity-25' : ''}`}>
                    <button
                      type="button"
                      className="btn btn-link w-100 text-start text-dark text-decoration-none d-flex justify-content-between align-items-center p-3 fw-semibold"
                      onClick={() => toggleFaq(i)}
                      aria-expanded={openFaqIndex === i}
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-secondary transition-transform ${openFaqIndex === i ? 'rotate-180 text-danger' : ''}`}
                        style={{ transform: openFaqIndex === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
                      />
                    </button>
                    {openFaqIndex === i && (
                      <div className="card-body pt-0 px-3 pb-3 text-secondary small">
                        <p className="mb-0">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="col-lg-6">
                {data.faq.items.slice(5).map((item, i) => {
                  const actualIdx = i + 5
                  return (
                    <div
                      key={actualIdx}
                      className={`card border-0 rounded-3 shadow-sm mb-3 overflow-hidden ${openFaqIndex === actualIdx ? 'border border-danger border-opacity-25' : ''}`}
                    >
                      <button
                        type="button"
                        className="btn btn-link w-100 text-start text-dark text-decoration-none d-flex justify-content-between align-items-center p-3 fw-semibold"
                        onClick={() => toggleFaq(actualIdx)}
                        aria-expanded={openFaqIndex === actualIdx}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          size={18}
                          className={`text-secondary transition-transform ${openFaqIndex === actualIdx ? 'rotate-180 text-danger' : ''}`}
                          style={{ transform: openFaqIndex === actualIdx ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
                        />
                      </button>
                      {openFaqIndex === actualIdx && (
                        <div className="card-body pt-0 px-3 pb-3 text-secondary small">
                          <p className="mb-0">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom FAQ CTA */}
            <div className="mt-5 text-center">
              <h3 className="h5 fw-normal text-dark mb-3">{data.faq.bottomCta.text}</h3>
              <a href={data.faq.bottomCta.href} className="btn btn-danger rounded-3 px-4 py-3 fw-semibold text-white">
                {data.faq.bottomCta.btnText}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
