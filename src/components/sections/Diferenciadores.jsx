import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { diferenciadores, diferenciadoresTitle, searchFilters, images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import { setFilterField, setFilters, toggleFilterItem, clearFilterField } from '../../store/slices/filterSlice.js'
import { apiFetch } from '../../lib/apiFetch.js'
import { toArray, formatComuna, getDynamicPriceRanges } from '../../lib/projectUtils.js'

function MultiselectPill({ label, options = [], selected = [], onToggle, onClear }) {
  const [open, setOpen] = useState(false)
  const pillRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCount = selected.length
  const displayText = selectedCount === 0
    ? label
    : selectedCount === 1
      ? selected[0]
      : selectedCount === 2 && selected.join(', ').length <= 22
        ? selected.join(', ')
        : `${selectedCount} seleccionados`

  return (
    <div className="position-relative d-inline-block" ref={pillRef}>
      <div className={`lb-search-pill d-inline-flex align-items-center bg-white rounded-pill ${open ? 'border-danger shadow-sm' : ''}`}>
        <button
          type="button"
          className="btn btn-sm border-0 bg-transparent lb-search-select d-flex align-items-center gap-2 text-start"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span className={selectedCount > 0 ? 'text-dark fw-semibold' : 'text-muted'}>
            {displayText}
          </span>
          <ChevronDown size={14} className="text-muted" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </button>
      </div>

      {open && (
        <div
          className="position-absolute start-0 top-100 mt-1 bg-white rounded-3 shadow border p-2 lb-multiselect-menu"
          style={{ minWidth: '190px', maxHeight: '250px', overflowY: 'auto', zIndex: 1050 }}
        >
          {selectedCount > 0 && (
            <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom px-2">
              <span className="small text-muted">{selectedCount} elegid{selectedCount > 1 ? 'os' : 'o'}</span>
              <button
                type="button"
                className="btn btn-link btn-sm text-danger text-decoration-none p-0 small"
                onClick={onClear}
              >
                Limpiar
              </button>
            </div>
          )}
          {options.map((opt) => {
            const isChecked = selected.includes(opt)
            return (
              <label
                key={opt}
                className="d-flex align-items-center gap-2 px-2 py-1 rounded cursor-pointer lb-multiselect-item"
                style={{ cursor: 'pointer', fontSize: '0.875rem' }}
              >
                <input
                  type="checkbox"
                  className="form-check-input mt-0"
                  checked={isChecked}
                  onChange={() => onToggle(opt)}
                />
                <span className={isChecked ? 'fw-semibold text-danger' : 'text-dark'}>
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Diferenciadores() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduxFilters = useSelector((s) => s.filters)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  const [comunaOptions, setComunaOptions] = useState([
    'Independencia',
    'La Florida',
    'Providencia',
    'Puerto Montt',
    'Puerto Varas',
    'Santiago',
    'Valdivia',
    'Ñuñoa',
  ])

  const [tipoOptions, setTipoOptions] = useState([
    'Studio',
    '1 Dorm',
    '2 Dorm',
    '3 Dorm',
    '4+ Dorm',
  ])

  const [precioOptions, setPrecioOptions] = useState([
    'Hasta 3.000 UF',
    '3.000-5.000 UF',
    '5.000+ UF',
  ])

  const sectionRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      if (Array.isArray(data) && data.length > 0) {
        // Dynamic comunas
        const rawComunas = [...new Set(data.map((p) => (p.comuna || '').trim()).filter(Boolean))]
        if (rawComunas.length) {
          const formatted = rawComunas.map(formatComuna).sort((a, b) => a.localeCompare(b, 'es'))
          setComunaOptions(formatted)
        }

        // Dynamic tipos from actual tipologias in projects
        const progs = data.flatMap((p) => (p.tipologias || []).map((t) => (t.programa || '').toUpperCase()))
        const types = []
        if (progs.some((p) => p.includes('STUDIO') || p.includes('ESTUDIO'))) types.push('Studio')
        if (progs.some((p) => /^1\s*D/i.test(p))) types.push('1 Dorm')
        if (progs.some((p) => /^2\s*D/i.test(p))) types.push('2 Dorm')
        if (progs.some((p) => /^3\s*D/i.test(p))) types.push('3 Dorm')
        if (progs.some((p) => /^[4-9]\s*D/i.test(p))) types.push('4+ Dorm')
        if (types.length) setTipoOptions(types)

        // Dynamic price ranges from real projects
        const rangos = getDynamicPriceRanges(data)
        if (rangos.length) setPrecioOptions(rangos)
      }
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const ctx = gsap.context(() => {
      // ponytail: scrub parallax with yPercent on stacked images instead of complex canvas/svg
      const st = { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      gsap.fromTo('.lb-diff-bg-logo',
        { yPercent: -10, scale: 1.05 },
        { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.lb-diff-pareja',
        { yPercent: 6 },
        { yPercent: -6, ease: 'none', scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [isLoaded])

  const selectedComunas = toArray(reduxFilters.comuna)
  const selectedTipos = toArray(reduxFilters.tipologia)

  const handleSearch = () => {
    dispatch(setFilters({ hasSubmitted: true }))
    const params = new URLSearchParams()
    if (selectedComunas.length) params.set('comuna', selectedComunas.join(','))
    if (selectedTipos.length) params.set('tipologia', selectedTipos.join(','))
    if (reduxFilters.precio) params.set('precio', reduxFilters.precio)
    const query = params.toString()
    navigate(query ? `/cotizador?${query}` : '/cotizador')
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
          {/* Multiselect Ubicación */}
          <MultiselectPill
            label="Ubicación"
            options={comunaOptions}
            selected={selectedComunas}
            onToggle={(item) => dispatch(toggleFilterItem({ field: 'comuna', item }))}
            onClear={() => dispatch(clearFilterField('comuna'))}
          />

          {/* Multiselect Tipo */}
          <MultiselectPill
            label="Tipo"
            options={tipoOptions}
            selected={selectedTipos}
            onToggle={(item) => dispatch(toggleFilterItem({ field: 'tipologia', item }))}
            onClear={() => dispatch(clearFilterField('tipologia'))}
          />

          {/* Select Precio */}
          <div className="lb-search-pill d-inline-flex align-items-center gap-1 bg-white rounded-pill">
            <select
              className="form-select border-0 bg-transparent lb-search-select"
              value={reduxFilters.precio || ''}
              onChange={(e) => dispatch(setFilterField({ field: 'precio', value: e.target.value }))}
            >
              <option value="">Precio UF</option>
              {precioOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-danger btn-sm fw-semibold rounded-pill px-3" onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </ScrollAnim>

      <div className="container-fluid diferenciadores">
        <div className="container mx-auto row g-0 align-items-stretch justify-content-center position-relative">
          <div className="col-md-5 order-md-0 order-1 position-relative d-flex align-items-center justify-content-center">
            <img
              src={images.bgLogo}
              alt=""
              className="lb-diff-bg-logo position-absolute top-0 start-0 w-100 h-100 object-fit-contain pe-none"
              loading="lazy"
              decoding="async"
            />
            <img
              src={images.pareja}
              alt=""
              className="lb-diff-pareja img-fluid position-relative"
              loading="lazy"
              decoding="async"
            />
          </div>
          <ScrollAnim as="div" className="col-md-7 order-md-1 order-0 d-flex flex-column gap-3 lb-diff-list" animation="fade-left" stagger={0.12}>
            {/* Title */}
            <ScrollAnim as="div" className="position-relative w-md-80 ms-4" animation="fade-right">
              <SplitTitle as="h2" className="lb-diff-title mb-4 mx-auto" text={diferenciadoresTitle.part1 + ' ' + diferenciadoresTitle.highlight + ' ' + diferenciadoresTitle.part2} />
            </ScrollAnim>
            {diferenciadores.map((item, i) => (
              <div
                className="lb-diff-row d-flex align-items-center gap-3 rounded-3 lb-img-trigger w-md-80 ms-4 me-auto"
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
