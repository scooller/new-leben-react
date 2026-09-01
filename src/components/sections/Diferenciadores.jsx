import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { diferenciadores, diferenciadoresTitle, searchFilters, images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

export default function Diferenciadores() {
  const navigate = useNavigate()
  const [values, setValues] = useState({})
  const sectionRef = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  useEffect(() => {
    if (!isLoaded) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.lb-diff-bg img',
        { yPercent: -8 },
        { yPercent: 8, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, sectionRef)
    return () => ctx.revert()
  }, [isLoaded])

  const handleChange = (id, val) => setValues((p) => ({ ...p, [id]: val }))

  const handleSearch = () => {
    const params = new URLSearchParams()
    searchFilters.filters.forEach((f) => {
      if (values[f.id]) params.set(f.id, values[f.id])
    })
    navigate(`/proyectos?${params.toString()}`)
  }

  return (
    <section ref={sectionRef} className="lb-diff d-flex flex-column align-items-center justify-content-center" id="nosotros">
      {/* Search card overlapping */}
      <ScrollAnim as="div" className="lb-search-card bg-white rounded-3 shadow" animation="scale" delay={0.2} duration={0.6}>
        <p className="fs-4 fw-bold text-center mb-3 text-dark lb-search-card-title">
          {searchFilters.title1}
          <span className="text-danger">{searchFilters.title2}</span>
        </p>
        <div className="d-flex gap-2 align-items-center justify-content-center flex-wrap">
          {searchFilters.filters.map((f) => (
            <div className="lb-search-pill d-inline-flex align-items-center gap-1 bg-white rounded-pill" key={f.id}>
              <select
                className="form-select border-0 bg-transparent lb-search-select"
                value={values[f.id] || ''}
                onChange={(e) => handleChange(f.id, e.target.value)}
              >
                <option value="">{f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          <button className="btn btn-danger btn-sm fw-semibold rounded-pill px-3" onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </ScrollAnim>

      <div className="container-fluid diferenciadores">
        {/* Background image with GSAP parallax (see useEffect → .lb-diff-bg img) */}
        <div className="lb-diff-bg">
          <img src={images.capa21} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="container mx-auto row g-0 align-items-stretch justify-content-center position-relative">
          <div className="col-12 text-center mb-4">
            {/* Title */}
            <ScrollAnim as="div" className="position-relative" animation="fade-right">
              <SplitTitle as="h2" className="lb-diff-title mb-4 mx-auto" text={diferenciadoresTitle.part1 + ' ' + diferenciadoresTitle.highlight + ' ' + diferenciadoresTitle.part2} />
            </ScrollAnim>
          </div>
          <div className="col-md-5" />
          <ScrollAnim as="div" className="col-md-7 d-flex flex-column gap-3 lb-diff-list" animation="fade-left" stagger={0.12}>
            {diferenciadores.map((item, i) => (
              <div
                className="lb-diff-row d-flex align-items-center gap-3 rounded-3 lb-img-trigger w-80 ms-auto"
                key={i}
                tabIndex={0}
              >
                <div className="flex-shrink-0 lb-diff-badge d-flex align-items-center justify-content-center">
                  <img src={images[item.image]} alt="" className="lb-diff-badge-img lb-img-interactive" loading="lazy" decoding="async" />
                </div>
                {/* dangerouslySetInnerHTML: los textos traen <b> desde content.js */}
                <p className="flex-grow-1 mb-0 lb-diff-text" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </ScrollAnim>
        </div>
      </div>
    </section>
  )
}
