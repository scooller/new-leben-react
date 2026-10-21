import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { brokersData as data } from '../data/brokers.js'

// Reusable
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import HeroShell from '../components/sections/HeroShell.jsx'

// Icons
import { Check, Mail, ChevronRight, ChevronLeft } from 'lucide-react'
import { BadgePercentIcon } from '../components/icons/badge-percent.jsx'
import { HomeIcon } from '../components/icons/home.jsx'
import { BellIcon } from '../components/icons/bell.jsx'
import { UserCheckIcon } from '../components/icons/user-check.jsx'
import { AwardIcon } from '../components/icons/award.jsx'
import { PartyPopperIcon } from '../components/icons/party-popper.jsx'

const benefitIcons = {
  percent: BadgePercentIcon,
  building: HomeIcon,
  bell: BellIcon,
  'user-check': UserCheckIcon,
  award: AwardIcon,
  gift: PartyPopperIcon,
}

export default function Brokers() {
  useGsapAnimations()
  const [activeEventTab, setActiveEventTab] = useState(data.events.tabs[0].id)
  const [eventSlideIndex, setEventSlideIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [categoryIndex, setCategoryIndex] = useState(0)

  const categories = data.tiers.categories || []
  const activeCategory = categories[categoryIndex] || categories[0]

  const currentEventPhotos = data.events.gallery[activeEventTab] || []
  const totalEventSlides = Math.ceil(currentEventPhotos.length / 3)

  const handlePrevEvent = () => {
    setEventSlideIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, totalEventSlides - 1)))
  }

  const handleNextEvent = () => {
    setEventSlideIndex((prev) => (prev < totalEventSlides - 1 ? prev + 1 : 0))
  }

  const handleEventTabChange = (tabId) => {
    setActiveEventTab(tabId)
    setEventSlideIndex(0)
  }

  const handlePrevCategory = () => {
    setCategoryIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1))
  }

  const handleNextCategory = () => {
    setCategoryIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0))
  }

  const regRef = useRef(null)
  const benefitRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.lb-brokers-registration__bg img',
        { yPercent: -15, scale: 1.2 },
        {
          yPercent: 15, ease: 'none',
          scrollTrigger: {
            trigger: regRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
    }, regRef)
    return () => ctx.revert()
  }, [])

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = Object.entries(formData)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    window.open(`https://wa.me/56991297804?text=${encodeURIComponent(`Hola, quiero postular al Círculo de Brokers Leben:\n\n${msg}`)}`)
  }

  return (
    <>
      <Navbar />
      <main className="lb-brokers">
        {/* ======================= HERO ======================= */}
        <HeroShell
          className="lb-brokers-hero container-fluid position-relative d-flex align-items-center"
          image={data.hero.backgroundImage}
          bgWrapClassName="lb-brokers-hero__bg"
          overlayClassName="lb-brokers-hero__overlay"
        >
          <div className="container">
            <ScrollAnim animation="fade-up" className="d-flex flex-column gap-4" style={{ maxWidth: '640px' }}>
              <h1
                className="lb-brokers-hero__title mb-0"
                dangerouslySetInnerHTML={{ __html: data.hero.title }}
              />
              <p className="lead text-white text-opacity-90 mb-0">{data.hero.subtitle}</p>
              <div>
                <a href={data.hero.ctaHref} className="btn btn-danger fw-bold px-4 py-2 rounded-pill shadow">
                  {data.hero.ctaText}
                </a>
              </div>
            </ScrollAnim>
          </div>
        </HeroShell>

        {/* ======================= BENEFITS ======================= */}
        <section className="py-5 bg-white" id="beneficios">
          <div className="container py-lg-4">
            <div className="row align-items-center g-5">
              <ScrollAnim as="div" animation="fade-right" className="col-lg-5">
                <div className="rounded-4 overflow-hidden shadow-sm" style={{ aspectRatio: '480 / 400' }}>
                  <img src={data.benefits.managerPhoto} alt="Manager Leben" className="w-100 h-100 object-fit-cover d-block" />
                </div>
              </ScrollAnim>
              <div className="col-lg-7">
                <ScrollAnim animation="fade-up">
                  <p className="lb-eyebrow">{data.benefits.eyebrow}</p>
                  <SplitTitle as="h2" text={data.benefits.title} className="lb-brokers-section-title">
                    <span className="text-danger">{data.benefits.titleAccent}</span>
                  </SplitTitle>
                </ScrollAnim>
                <ScrollAnim animation="fade-up" delay={0.15} stagger={0.08} className="d-flex flex-column gap-3 mt-4">
                  {data.benefits.items.map((item, i) => {
                    const Icon = benefitIcons[item.icon]
                    return (
                      <div
                        key={i}
                        className="d-flex align-items-center gap-3"
                        onMouseEnter={() => benefitRefs.current[i]?.startAnimation()}
                        onMouseLeave={() => benefitRefs.current[i]?.stopAnimation()}
                      >
                        <span
                          className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Icon size={16} ref={(el) => { benefitRefs.current[i] = el }} />
                        </span>
                        <span className="text-dark fw-medium">{item.text}</span>
                      </div>
                    )
                  })}
                </ScrollAnim>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= TIERS TABLE ======================= */}
        <section className="lb-brokers-tiers" id="categorias">
          <div className="container">
            <ScrollAnim animation="fade-up" className="lb-brokers-section-heading text-center">
              <p className="lb-eyebrow text-uppercase">{data.tiers.eyebrow}</p>
              <SplitTitle as="h2" text={data.tiers.title} className="lb-brokers-section-title" />
            </ScrollAnim>

            {/* Category Carousel Tabs */}
            <div className="lb-brokers-tiers__tabs" role="tablist">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === categoryIndex}
                  className={`lb-brokers-tiers__tab ${idx === categoryIndex ? 'lb-brokers-tiers__tab--active' : ''}`}
                  onClick={() => setCategoryIndex(idx)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="lb-brokers-tiers__wrapper">
              <button
                type="button"
                className="lb-brokers-tiers__nav-btn lb-brokers-tiers__nav-btn--prev"
                aria-label="Categoría anterior"
                onClick={handlePrevCategory}
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              <ScrollAnim animation="fade-up" delay={0.15} className="lb-brokers-tiers__table">
                <div className="lb-brokers-tiers__header">
                  <div className="lb-brokers-tiers__col-label">
                    <span className="lb-brokers-tiers__col-title">CATEGORÍAS DE BROKERS PARTNER</span>
                    <span className="lb-brokers-tiers__col-sub">CON BENEFICIOS EXCLUSIVOS</span>
                  </div>
                  {data.tiers.columns.map((col, i) => (
                    <div key={i} className={`lb-brokers-tiers__col-tier lb-brokers-tiers__col-tier--${i}`}>
                      <span className="lb-brokers-tiers__tier-name">{col.name}</span>
                      <span className="lb-brokers-tiers__tier-sub">{col.subtitle}</span>
                    </div>
                  ))}
                </div>

                <div className="lb-brokers-tiers__body-grid" key={activeCategory?.id}>
                  <div className="lb-brokers-tiers__col-category">
                    <span className="lb-brokers-tiers__category-badge">{activeCategory?.name}</span>
                  </div>

                  <div className="lb-brokers-tiers__rows">
                    {activeCategory?.rows.map((row, ri) => (
                      <div key={ri} className="lb-brokers-tiers__row">
                        <div className="lb-brokers-tiers__row-label">{row.label}</div>
                        {row.values.map((v, ci) => (
                          <div key={ci} className={`lb-brokers-tiers__cell lb-brokers-tiers__cell--${ci}`}>
                            {v ? (
                              <span className={`lb-brokers-tiers__check lb-brokers-tiers__check--${ci}`}>
                                <Check size={18} strokeWidth={2.5} />
                              </span>
                            ) : (
                              <span className="lb-brokers-tiers__na">NO APLICA</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnim>

              <button
                type="button"
                className="lb-brokers-tiers__nav-btn lb-brokers-tiers__nav-btn--next"
                aria-label="Siguiente categoría"
                onClick={handleNextCategory}
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Pagination dots & counter */}
            <div className="lb-brokers-tiers__pagination">
              <div className="lb-brokers-tiers__dots">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`lb-brokers-tiers__dot ${idx === categoryIndex ? 'lb-brokers-tiers__dot--active' : ''}`}
                    onClick={() => setCategoryIndex(idx)}
                    aria-label={`Ir a ${cat.name}`}
                  />
                ))}
              </div>
              <span className="lb-brokers-tiers__counter">
                {categoryIndex + 1} / {categories.length}
              </span>
            </div>
          </div>
        </section>

        {/* ======================= KAM INFO BAR ======================= */}
        <section className="py-5 bg-white">
          <div className="container">
            <ScrollAnim animation="fade-up" className="d-flex flex-column align-items-center gap-4 text-center">
              <div className="d-flex align-items-center gap-2 fs-5 fw-bold text-dark">
                <Mail size={22} className="text-danger flex-shrink-0" />
                <span>{data.kam.text}</span>
              </div>
              <div className="lb-brokers-kam__chevrons">
                {data.kam.tiers.map((tier, i) => (
                  <div key={i} className={`lb-brokers-kam-chevron lb-brokers-kam-chevron--${i}`}>
                    <span className="lb-brokers-kam-chevron__label">PARTNER</span>
                    <span className="lb-brokers-kam-chevron__name">{tier.label}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                {data.kam.tiers.map((tier, i) => (
                  <span key={i} className="d-flex align-items-center gap-2 small fw-semibold text-secondary">
                    <span className={`lb-brokers-kam__dot lb-brokers-kam__dot--${i}`} />
                    {tier.subtitle}
                    {i < data.kam.tiers.length - 1 && <span className="ms-2 text-muted fw-bold">→</span>}
                  </span>
                ))}
              </div>
              <p className="small fw-bold text-secondary text-uppercase tracking-wider mt-2 mb-0">{data.kam.footnote}</p>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= REGISTRATION ======================= */}
        <section className="lb-brokers-registration py-5" id="registro" ref={regRef}>
          <div className="lb-brokers-registration__bg" aria-hidden>
            <img src={data.registration.backgroundImage} alt="" />
            <div className="lb-brokers-registration__overlay" />
          </div>
          <div className="container position-relative z-1 py-lg-4">
            <ScrollAnim animation="fade-up" className="card bg-black text-white border border-light border-opacity-10 rounded-4 p-4 p-md-5 mx-auto shadow-lg" style={{ maxWidth: '840px' }}>
              <div className="lb-brokers-section-heading text-center mb-3">
                <p className="lb-eyebrow">{data.registration.eyebrow}</p>
                <SplitTitle as="h2" text={data.registration.title} className="lb-brokers-registration__title text-white" />
              </div>
              <p className="text-white text-opacity-75 text-center mb-4">{data.registration.description}</p>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  {data.registration.fields.map((field) => (
                    <div key={field.name} className={field.col === 2 ? 'col-md-6' : 'col-12'}>
                      <label className="form-label text-light text-opacity-75 small fw-semibold mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-control bg-white text-dark rounded-2 py-2 px-3"
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.name !== 'empresa'}
                      />
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-column align-items-center gap-3 mt-4">
                  <button type="submit" className="btn btn-danger fw-bold w-100 py-3 rounded-pill shadow">
                    {data.registration.submitText}
                  </button>
                  <p className="small text-white text-opacity-50 text-center mb-0">{data.registration.disclaimer}</p>
                </div>
              </form>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= EVENTS ======================= */}
        <section className="py-5 bg-white" id="eventos">
          <div className="container py-lg-4">
            <ScrollAnim animation="fade-up" className="lb-brokers-section-heading text-center mb-4">
              <p className="lb-eyebrow">{data.events.eyebrow}</p>
              <SplitTitle as="h2" text={data.events.title} className="lb-brokers-section-title" />
            </ScrollAnim>

            <ScrollAnim animation="scale" delay={0.1} className="d-flex justify-content-center flex-wrap gap-2 my-4">
              {data.events.tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`btn rounded-pill px-4 py-2 fw-bold ${tab.id === activeEventTab ? 'btn-danger shadow-sm' : 'btn-light text-secondary'}`}
                  onClick={() => handleEventTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </ScrollAnim>

            {/* 3-by-3 Carousel with Controls */}
            <div className="position-relative px-md-5 my-4">
              {totalEventSlides > 1 && (
                <>
                  <button
                    type="button"
                    className="btn btn-danger position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow z-2"
                    style={{ width: '42px', height: '42px', marginLeft: '-10px' }}
                    onClick={handlePrevEvent}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={22} strokeWidth={2.5} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow z-2"
                    style={{ width: '42px', height: '42px', marginRight: '-10px' }}
                    onClick={handleNextEvent}
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </button>
                </>
              )}

              <div className="row g-4 justify-content-center">
                {currentEventPhotos
                  .slice(eventSlideIndex * 3, eventSlideIndex * 3 + 3)
                  .map((src, i) => (
                    <div key={i} className="col-12 col-md-4">
                      <div
                        className="rounded-4 overflow-hidden shadow-sm h-100"
                        style={{ height: '260px', transition: 'transform 0.25s ease' }}
                      >
                        <img
                          src={src}
                          alt={`Evento Broker ${activeEventTab} - ${eventSlideIndex * 3 + i + 1}`}
                          className="w-100 h-100 object-fit-cover d-block"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination Dots */}
              {totalEventSlides > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pt-2">
                  {Array.from({ length: totalEventSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn p-0 border-0 rounded-pill ${idx === eventSlideIndex ? 'bg-danger' : 'bg-secondary bg-opacity-25'}`}
                      style={{
                        width: idx === eventSlideIndex ? '26px' : '10px',
                        height: '10px',
                        transition: 'all 0.25s ease',
                      }}
                      onClick={() => setEventSlideIndex(idx)}
                      aria-label={`Ir a grupo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================= ALLIANCES ======================= */}
        <section className="py-5 border-top border-bottom bg-white overflow-hidden" id="alianzas">
          <div className="container py-lg-3">
            <ScrollAnim animation="fade-up" className="text-center mb-4">
              <p className="lb-eyebrow mb-0">{data.alliances.title}</p>
            </ScrollAnim>
          </div>

          <div className="lb-brokers-alliances-marquee py-2">
            <div className="lb-brokers-alliances-track">
              {[...data.alliances.logos, ...data.alliances.logos].map((item, i) => (
                <div key={i} className="lb-brokers-alliance-item d-flex align-items-center justify-content-center px-4">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxHeight: '60px', maxWidth: '160px', objectFit: 'contain' }}
                    loading="lazy"
                  />
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
