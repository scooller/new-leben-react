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

// Router
import { Link } from 'react-router-dom'

// Icons
import { Check, Mail, ChevronRight } from 'lucide-react'
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
  const [activeYear, setActiveYear] = useState(data.events.years[0])
  const [formData, setFormData] = useState({})

  const regRef = useRef(null)
  const benefitRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.lb-brokers-registration__bg img',
        { yPercent: -15, scale: 1.2 },
        { yPercent: 15, ease: 'none',
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
          className="lb-brokers-hero container position-relative d-flex align-items-center lb-radius-bl-br"
          image={data.hero.backgroundImage}
          bgWrapClassName="lb-brokers-hero__bg"
          overlayClassName="lb-brokers-hero__overlay"
        >
          <div className="container">
          <ScrollAnim animation="fade-up" className="lb-brokers-hero__content">
            <h1 className="lb-brokers-hero__title">{data.hero.title}</h1>
            <p className="lb-brokers-hero__subtitle">{data.hero.subtitle}</p>
            <div className="d-flex flex-wrap gap-3">
              <a href={data.hero.ctaHref} className="btn btn-danger fw-bold px-4">
                {data.hero.ctaText}
              </a>
              <Link to="/login" className="btn btn-outline-light fw-bold px-4">
                Conectarse
              </Link>
            </div>
          </ScrollAnim>
          </div>
        </HeroShell>

        {/* ======================= BENEFITS ======================= */}
        <section className="lb-brokers-benefits" id="beneficios">
          <div className="container">
            <div className="row align-items-center g-5">
              <ScrollAnim as="div" animation="fade-right" className="col-lg-5">
                <div className="lb-brokers-benefits__photo">
                  <img src={data.benefits.managerPhoto} alt="Manager Leben" />
                </div>
              </ScrollAnim>
              <div className="col-lg-7">
                <ScrollAnim animation="fade-up">
                  <p className="lb-eyebrow">{data.benefits.eyebrow}</p>
                  <SplitTitle as="h2" text={data.benefits.title} className="lb-brokers-section-title">
                    <span className="text-danger">{data.benefits.titleAccent}</span>
                  </SplitTitle>
                </ScrollAnim>
                <ScrollAnim animation="fade-up" delay={0.15} stagger={0.08} className="lb-brokers-benefits__list">
                  {data.benefits.items.map((item, i) => {
                    const Icon = benefitIcons[item.icon]
                    return (
                      <div
                        key={i}
                        className="lb-brokers-benefit-row"
                        onMouseEnter={() => benefitRefs.current[i]?.startAnimation()}
                        onMouseLeave={() => benefitRefs.current[i]?.stopAnimation()}
                      >
                        <span className="lb-brokers-benefit-icon">
                          <Icon size={16} ref={(el) => { benefitRefs.current[i] = el }} />
                        </span>
                        <span className="lb-brokers-benefit-text">{item.text}</span>
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
              <p className="lb-eyebrow">{data.tiers.eyebrow}</p>
              <SplitTitle as="h2" text={data.tiers.title} className="lb-brokers-section-title" />
            </ScrollAnim>
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
              <div className="lb-brokers-tiers__body">
                {data.tiers.rows.map((row, ri) => (
                  <div key={ri} className="lb-brokers-tiers__row">
                    <div className="lb-brokers-tiers__row-label">{row.label}</div>
                    {row.values.map((v, ci) => (
                      <div key={ci} className="lb-brokers-tiers__cell">
                        {v ? (
                          <span className="lb-brokers-tiers__check">
                            <Check size={18} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="lb-brokers-tiers__na">NO APLICA</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= KAM INFO BAR ======================= */}
        <section className="lb-brokers-kam">
          <div className="container">
            <ScrollAnim animation="fade-up" className="lb-brokers-kam__inner text-center">
              <div className="lb-brokers-kam__prompt">
                <Mail size={24} />
                <span>{data.kam.text}</span>
              </div>
              <div className="lb-brokers-kam__chevrons">
                {data.kam.tiers.map((tier, i) => (
                  <div key={i} className="lb-brokers-kam__chevron-group">
                    <div className={`lb-brokers-kam-chevron lb-brokers-kam-chevron--${i}`}>
                      <span className="lb-brokers-kam-chevron__label d-inline-block me-1">PARTNER</span>
                      <span className="lb-brokers-kam-chevron__name">{tier.label}</span>
                    </div>
                    {i < data.kam.tiers.length - 1 && <ChevronRight size={24} className="lb-brokers-kam__chevron-sep" />}
                  </div>
                ))}
              </div>
              <div className="lb-brokers-kam__labels">
                {data.kam.tiers.map((tier, i) => (
                  <span key={i} className="lb-brokers-kam__label-item">
                    <span className={`lb-brokers-kam__dot lb-brokers-kam__dot--${i}`} />
                    {tier.subtitle}
                    {i < data.kam.tiers.length - 1 && <ChevronRight size={16} className="lb-brokers-kam__arrow" />}
                  </span>
                ))}
              </div>
              <p className="lb-brokers-kam__footnote">{data.kam.footnote}</p>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= REGISTRATION ======================= */}
        <section className="lb-brokers-registration" id="registro" ref={regRef}>
          <div className="lb-brokers-registration__bg" aria-hidden>
            <img src={data.registration.backgroundImage} alt="" />
            <div className="lb-brokers-registration__overlay" />
          </div>
          <div className="container">
            <ScrollAnim animation="fade-up" className="lb-brokers-registration__form-card">
              <div className="lb-brokers-section-heading text-center">
                <p className="lb-eyebrow">{data.registration.eyebrow}</p>
                <SplitTitle as="h2" text={data.registration.title} className="lb-brokers-registration__title" />
              </div>
              <p className="lb-brokers-registration__desc text-center">{data.registration.description}</p>
              <form onSubmit={handleSubmit} className="lb-brokers-registration__form">
                <div className="row g-3">
                  {data.registration.fields.map((field) => (
                    <div key={field.name} className={field.col === 2 ? 'col-md-6' : 'col-12'}>
                      <label className="lb-brokers-field__label">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-control lb-brokers-field__input"
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 d-flex flex-column gap-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="brokerTerms" required />
                    <label className="form-check-label" htmlFor="brokerTerms">
                      He leído los términos y condiciones y los acepto
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="brokerData" required />
                    <label className="form-check-label" htmlFor="brokerData">
                      Acepto que usen mis datos para contactarme y marketing
                    </label>
                  </div>
                </div>
                <div className="lb-brokers-registration__footer">
                  <button type="submit" className="btn btn-danger fw-bold w-100 py-2">
                    {data.registration.submitText}
                  </button>
                  <p className="lb-brokers-registration__disclaimer">{data.registration.disclaimer}</p>
                </div>
              </form>
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= EVENTS ======================= */}
        <section className="lb-brokers-events" id="eventos">
          <div className="container">
            <ScrollAnim animation="fade-up" className="lb-brokers-section-heading text-center">
              <p className="lb-eyebrow">{data.events.eyebrow}</p>
              <SplitTitle as="h2" text={data.events.title} className="lb-brokers-section-title" />
            </ScrollAnim>
            <ScrollAnim animation="scale" delay={0.1} className="lb-brokers-events__tabs">
              {data.events.years.map((year) => (
                <button
                  key={year}
                  className={`lb-brokers-events__tab ${year === activeYear ? 'is-active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </ScrollAnim>
            <ScrollAnim animation="fade-up" delay={0.15} stagger={0.1} className="row g-4">
              {data.events.cards.map((card, i) => (
                <div key={i} className="col-md-4">
                  <article className="lb-brokers-event-card">
                    <div className="lb-brokers-event-card__image">
                      <img src={card.image} alt={card.title} />
                    </div>
                    <div className="lb-brokers-event-card__body">
                      <h3 className="lb-brokers-event-card__title">{card.title}</h3>
                      <p className="lb-brokers-event-card__desc">{card.description}</p>
                    </div>
                  </article>
                </div>
              ))}
            </ScrollAnim>
          </div>
        </section>

        {/* ======================= ALLIANCES ======================= */}
        <section className="lb-brokers-alliances" id="alianzas">
          <div className="container">
            <ScrollAnim animation="fade-up" className="text-center">
              <p className="lb-eyebrow">{data.alliances.title}</p>
            </ScrollAnim>
            <ScrollAnim animation="fade-up" delay={0.1} stagger={0.08} className="lb-brokers-alliances__grid">
              {data.alliances.logos.map((item, i) => (
                <div key={i} className="lb-brokers-alliance-logo">
                  <img src={item.logo} alt={item.name} />
                </div>
              ))}
            </ScrollAnim>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
