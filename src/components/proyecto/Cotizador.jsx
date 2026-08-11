import { useEffect, useMemo, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import { Layers, Expand, Home, Sun, Compass, Maximize } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import CotizadorForm from './CotizadorForm.jsx'
import { apiFetch } from '../../lib/apiFetch.js'

const DETAIL_ICONS = { layers: Layers, expand: Expand, home: Home, sun: Sun, compass: Compass, maximize: Maximize }

const ORIENTACION_LABELS = {
  N: 'Norte', S: 'Sur', E: 'Oriente', O: 'Poniente',
  NE: 'Nor-Oriente', NO: 'Nor-Poniente',
  SE: 'Sur-Oriente', SO: 'Sur-Poniente',
}

/** Build details + pricing from a single planta object */
function plantaToDetails(p) {
  return {
    details: [
      { icon: 'layers', label: 'Planta', value: p.name || '—' },
      { icon: 'expand', label: 'Superficie útil', value: `${Math.round(parseFloat(p.superficie_util) || 0)} m²` },
      { icon: 'home', label: 'Dorm + Baño', value: p.programa || '—' },
      { icon: 'compass', label: 'Orientación', value: ORIENTACION_LABELS[p.orientacion] || p.orientacion || '—' },
      ...(p.superficie_terraza ? [{ icon: 'sun', label: 'Terraza', value: `${Math.round(parseFloat(p.superficie_terraza))} m²` }] : []),
      ...(p.superficie_total_principal ? [{ icon: 'maximize', label: 'Superficie total', value: `${Math.round(parseFloat(p.superficie_total_principal))} m²` }] : []),
    ],
    pricing: {
      label: 'Precio',
      price: `UF ${Math.round(parseFloat(p.precio_lista) || 0).toLocaleString('es-CL')}`,
      shareLabel: 'Compartir',
    },
    floorPlanImage: p.interior_image_url || null,
  }
}

/** Dropdown filter component */
function FilterDropdown({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="dropdown lb-proj-det-filter-dropdown" ref={ref}>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm dropdown-toggle lb-proj-det-filter-btn"
        onClick={() => setOpen(!open)}
      >
        {selected || label}
      </button>
      {open && (
        <ul className="dropdown-menu show lb-proj-det-filter-menu">
          <li>
            <button className="dropdown-item" onClick={() => { onSelect(''); setOpen(false) }}>
              {label}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt}>
              <button
                className={`dropdown-item ${selected === opt ? 'active' : ''}`}
                onClick={() => { onSelect(opt); setOpen(false) }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Cotizador({ data, plantasRelacionadas, apiId, initialFilters }) {
  const [activeData, setActiveData] = useState(data)
  const [selected, setSelected] = useState(0)
  const ref = useRef(null)
  const [showCotizar, setShowCotizar] = useState(false)

  // API plantas
  const [plantas, setPlantas] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initialFilters || { tipologia: '', producto: '', piso: '', planta: '' })

  // Sync when parent swaps data
  useEffect(() => {
    setActiveData(data); setSelected(0)
    setFilters(initialFilters || { tipologia: '', producto: '', piso: '', planta: '' })
  }, [data, initialFilters])

  // Fetch plantas from API
  useEffect(() => {
    if (!apiId) { setPlantas([]); return }
    let cancelled = false
    setLoading(true)
    apiFetch(`/api/v1/plantas?proyecto_id=${apiId}`).then(({ data, error }) => {
      if (cancelled) return
      if (error || !Array.isArray(data)) {
        setPlantas([])
      } else {
        setPlantas(data.filter((p) => p.is_available))
      }
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [apiId])

  // Unique filter options from plantas
  const filterOptions = useMemo(() => ({
    tipologia: [...new Set(plantas.map((p) => p.programa).filter(Boolean))].sort(),
    producto: [...new Set(plantas.map((p) => p.tipo_producto).filter(Boolean))].sort(),
    piso: [...new Set(plantas.map((p) => p.piso).filter(Boolean))].sort((a, b) => a - b),
    planta: [...new Set(plantas.map((p) => p.name?.charAt(0)).filter(Boolean))].sort(),
  }), [plantas])

  // Filtered plantas
  const filteredPlantas = useMemo(() => {
    return plantas.filter((p) =>
      (!filters.tipologia || p.programa === filters.tipologia) &&
      (!filters.producto || p.tipo_producto === filters.producto) &&
      (!filters.piso || String(p.piso) === String(filters.piso)) &&
      (!filters.planta || p.name?.charAt(0) === filters.planta)
    )
  }, [plantas, filters])

  // Active details: from filtered planta if available, else from data
  const displayData = useMemo(() => {
    if (!apiId || !plantas.length) return activeData
    const planta = filteredPlantas[0]
    if (!planta) return { ...activeData, details: [], pricing: { ...activeData.pricing, price: 'Sin resultados' } }
    const enriched = plantaToDetails(planta)
    // Use API interior image as first thumbnail when available
    const thumbnails = enriched.floorPlanImage
      ? [enriched.floorPlanImage, ...activeData.floorPlan.thumbnails]
      : activeData.floorPlan.thumbnails
    return {
      ...activeData,
      details: enriched.details,
      pricing: enriched.pricing,
      floorPlan: { ...activeData.floorPlan, thumbnails },
    }
  }, [activeData, apiId, plantas, filteredPlantas])

  const hasFilters = filters.tipologia || filters.producto || filters.piso || filters.planta

  useEffect(() => {
    const el = ref.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="cotizador-plan"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  const mainImage = displayData.floorPlan.thumbnails[selected] ?? displayData.floorPlan.image

  return (
    <section className="lb-proj-det-cotizador" id="cotizador" ref={ref}>
      <div className="container">
        {/* Header + Filters */}
        <div className="row align-items-start g-4 mb-4" animation="fade-up">
          <div className="col-lg-4">
            <ScrollAnim as="h2" className="lb-proj-det-cot-title mb-0" dangerouslySetInnerHTML={{ __html: displayData.title }} />
          </div>

          {displayData.filters && (
          <ScrollAnim as="div" className="col-lg-8 lb-proj-det-cot-filters-col">
            <div className="lb-proj-det-cot-filters">
              {loading ? (
                <div className="lb-proj-det-cot-loading d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="text-muted small">Cargando plantas…</span>
                </div>
              ) : (<>
                <div className="d-flex flex-wrap gap-2">
                  <FilterDropdown
                    label="Todas las tipologías"
                    options={apiId ? filterOptions.tipologia : displayData.filters.row1[0].options}
                    selected={filters.tipologia}
                    onSelect={(v) => setFilters((f) => ({ ...f, tipologia: v }))}
                  />
                  <FilterDropdown
                    label="Todos los tipos de producto"
                    options={apiId ? filterOptions.producto : displayData.filters.row1[1].options}
                    selected={filters.producto}
                    onSelect={(v) => setFilters((f) => ({ ...f, producto: v }))}
                  />
                  <FilterDropdown
                    label="Todos los pisos"
                    options={apiId ? filterOptions.piso.map(String) : displayData.filters.row2[0].options}
                    selected={filters.piso ? String(filters.piso) : ''}
                    onSelect={(v) => setFilters((f) => ({ ...f, piso: v }))}
                  />
                  <FilterDropdown
                    label="Todas las plantas"
                    options={apiId ? filterOptions.planta : displayData.filters.row2[1].options}
                    selected={filters.planta}
                    onSelect={(v) => setFilters((f) => ({ ...f, planta: v }))}
                  />
                </div>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="badge bg-secondary">
                    {apiId ? `${filteredPlantas.length} depto${filteredPlantas.length !== 1 ? 's' : ''} encontrado${filteredPlantas.length !== 1 ? 's' : ''}` : 'Filtros demo'}
                  </span>
                  <button
                    className="btn btn-link btn-sm text-decoration-none px-0"
                    disabled={!hasFilters}
                    onClick={() => setFilters({ tipologia: '', producto: '', piso: '', planta: '' })}
                  >
                    <i className="fa-solid fa-rotate-left me-1" />Borrar filtros
                  </button>
                </div>
              </>)}
            </div>
          </ScrollAnim>
          )}
        </div>

        {/* Main: map + plan + details */}
        <div className="row g-4 lb-proj-det-cot-main" animation="fade-up" delay={0.1}>
          {/* Location sketch */}
          {displayData.mapImage && (
          <ScrollAnim as="div" className="col-lg-3 lb-proj-det-cot-map">
            <div className="lb-proj-det-cot-map-canvas">
              <img
                src={displayData.mapImage}
                alt="Esquicio del edificio"
                className="w-100 h-100"
                style={{ objectFit: 'contain' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="lb-proj-det-cot-map-caption text-muted small mt-2">{displayData.mapCaption}</p>
          </ScrollAnim>
          )}

          {/* Floor plan card */}
          <div className="col-lg-6 lb-proj-det-cot-plan-card">
            <ScrollAnim as="a" href={mainImage} data-fancybox="cotizador-plan" className="lb-img-trigger d-block" tabIndex={0}>
              <img
                src={mainImage}
                alt="Planta del departamento"
                className="lb-proj-det-cot-plan-img w-100 lb-img-interactive"
                loading="lazy"
                decoding="async"
              />
            </ScrollAnim>
            <ScrollAnim as="div" className="lb-proj-det-cot-thumbs d-flex gap-2 mt-3">
              {displayData.floorPlan.thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`lb-proj-det-cot-thumb${selected === i ? ' lb-proj-det-cot-thumb--active' : ''}`}
                  onClick={() => setSelected(i)}
                >
                  <img src={thumb} alt={`Planta ${i + 1}`} width="64" height="64" loading="lazy" />
                </button>
              ))}
            </ScrollAnim>
          </div>

          {/* Details grid */}
          <div className="col-lg-3 lb-proj-det-cot-details">
            {displayData.details?.length > 0 && (
            <ScrollAnim as="div" className="lb-proj-det-cot-detail-grid">
              {displayData.details.map((d) => (
                <div key={d.label} className="lb-proj-det-cot-detail-item d-flex align-items-center gap-2">
                  <span className="lb-proj-det-cot-detail-icon" data-icon={d.icon}>
                    {(() => { const Icon = DETAIL_ICONS[d.icon] ?? Layers; return <Icon size={24} /> })()}
                  </span>
                  <div className="d-flex flex-column">
                    <span className="lb-proj-det-cot-detail-label">{d.label}</span>
                    <span className="lb-proj-det-cot-detail-value">{d.value}</span>
                  </div>
                </div>
              ))}
            </ScrollAnim>
            )}

            {displayData.actions?.length > 0 && (
            <ScrollAnim as="div" className="d-flex gap-2 mt-3">
              {displayData.actions.map((a) => (
                <button key={a} className="btn btn-outline-dark flex-grow-1">{a}</button>
              ))}
            </ScrollAnim>
            )}

            {/* Pricing */}
            <ScrollAnim as="div" className="lb-proj-det-cot-pricing mt-4">
              <span className="lb-proj-det-cot-price-label">{displayData.pricing.label}</span>
              <div className="lb-proj-det-cot-price-row d-flex justify-content-between align-items-center">
                <span className="lb-proj-det-cot-price">{displayData.pricing.price}</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="small">{displayData.pricing.shareLabel}</span>
                  <img
                    src={`${import.meta.env.BASE_URL}images/share.svg`}
                    alt="Compartir"
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                </div>
              </div>
              <button
                className="btn btn-danger w-100 mt-3 lb-proj-det-cot-cta"
                onClick={() => setShowCotizar(true)}
              >
                {displayData.ctaText}
              </button>
            </ScrollAnim>
          </div>
        </div>

        {/* Plantas relacionadas */}
        {plantasRelacionadas?.length > 0 && (
          <div className="row g-4 mt-2" animation="fade-up">
            <ScrollAnim as="h3" className="lb-proj-det-cot-plantas-title mb-3 col-12">Plantas relacionadas</ScrollAnim>
            {plantasRelacionadas.map((p, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <button
                  className="card h-100 lb-proj-det-cot-planta-card"
                  onClick={() => { setActiveData(p.data); setSelected(0) }}
                >
                  {p.image && <img src={p.image} alt={p.label} className="card-img-top" loading="lazy" />}
                  <div className="card-body">
                    <h5 className="card-title mb-0">{p.label}</h5>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CotizadorForm
        show={showCotizar}
        onClose={() => setShowCotizar(false)}
        thumbnails={displayData.floorPlan.thumbnails}
      />
    </section>
  )
}
