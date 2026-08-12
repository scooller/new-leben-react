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

// Etapa priority — actively selling projects first, postventa last
const ETAPA_RANK = {
  terminaciones: 1,
  obra_gruesa: 2,
  inicio_obra: 3,
  recepcion_municipal_y_copropiedad: 4,
  postventa: 5,
}
const etapaRank = (etapa) => ETAPA_RANK[(etapa || '').trim().toLowerCase()] ?? 3

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

export default function Cotizador({ data, plantasRelacionadas, apiId, initialFilters, universal, projects, onProjectChange, externalPlanta }) {
  const [activeData, setActiveData] = useState(data)
  const [selected, setSelected] = useState(0)
  const ref = useRef(null)
  const [showCotizar, setShowCotizar] = useState(false)

  const EMPTY_FILTERS = universal
    ? { comuna: '', proyecto: '', tipologia: '', orientacion: '' }
    : { tipologia: '', producto: '', piso: '', planta: '' }

  // API plantas
  const [plantas, setPlantas] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initialFilters || EMPTY_FILTERS)

  // Build a comuna lookup from projects array
  const comunaByProjectId = useMemo(() => {
    const map = {}
    ;(projects || []).forEach((p) => { if (p.id != null) map[String(p.id)] = (p.comuna || '').trim() })
    return map
  }, [projects])

  // Lookup project etapa by name for smart ordering
  const projectEtapaByName = useMemo(() => {
    const map = {}
    ;(projects || []).forEach((p) => { map[(p.name || '').trim().toLowerCase()] = p.etapa })
    return map
  }, [projects])

  // Enrich each planta with comuna from project data, then sort so plantas
  // from actively-selling projects appear first (drives the default display).
  // API embeds proyecto.id (not proyecto_id), so look up by proyecto.id too
  const enrichedPlantas = useMemo(() =>
    plantas
      .map((p) => ({
        ...p,
        proyecto_id: p.proyecto_id || p.proyecto?.id,
        _comuna: p.proyecto?.comuna || comunaByProjectId[String(p.proyecto_id || p.proyecto?.id)] || '',
      }))
      .sort((a, b) =>
        etapaRank(projectEtapaByName[(a.proyecto?.name || '').trim().toLowerCase()])
        - etapaRank(projectEtapaByName[(b.proyecto?.name || '').trim().toLowerCase()])
      ),
    [plantas, comunaByProjectId, projectEtapaByName])

  // Sync when parent swaps data
  useEffect(() => {
    setActiveData(data); setSelected(0)
    setFilters(initialFilters || (universal ? { comuna: '', proyecto: '', tipologia: '', orientacion: '' } : { tipologia: '', producto: '', piso: '', planta: '' }))
  }, [data, initialFilters, universal])

  // Fetch plantas from API — universal paginates through ALL available, otherwise per-project
  useEffect(() => {
    if (!universal && !apiId) { setPlantas([]); return }
    let cancelled = false
    setLoading(true)

    async function loadAll() {
      if (universal) {
        // API caps at 100 per page regardless of perPage — paginate through all
        const all = []
        let page = 1
        while (true) {
          const { data, error } = await apiFetch(`/api/v1/plantas?disponible=1&perPage=100&page=${page}`)
          if (cancelled || error || !Array.isArray(data) || data.length === 0) break
          all.push(...data)
          if (data.length < 100) break
          page++
        }
        if (!cancelled) setPlantas(all.filter((p) => p.is_available))
      } else {
        // Per-project: paginate through available plantas only
        const all = []
        let page = 1
        while (true) {
          const { data, error } = await apiFetch(`/api/v1/plantas?proyecto_id=${apiId}&disponible=1&perPage=100&page=${page}`)
          if (cancelled || error || !Array.isArray(data) || data.length === 0) break
          all.push(...data)
          if (data.length < 100) break
          page++
        }
        if (!cancelled) setPlantas(all.filter((p) => p.is_available))
      }
    }

    loadAll().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [apiId, universal])

  // Unique filter options from enriched plantas — cascading in universal mode
  const filterOptions = useMemo(() => {
    if (universal) {
      // Step 1: all comunas from projects (not just plantas — some projects have no available plantas)
      const comuna = [...new Set((projects || []).map((p) => (p.comuna || '').trim()).filter(Boolean))].sort()

      // Step 2: proyectos filtered by selected comuna (from projects, not just plantas)
      const afterComunaProjects = filters.comuna
        ? (projects || []).filter((p) => (p.comuna || '').trim() === filters.comuna)
        : (projects || [])
      const proyecto = [...new Set(afterComunaProjects.map((p) => p.name).filter(Boolean))].sort()

      // Step 3: tipologías + orientaciones filtered by selected proyecto (from plantas)
      const afterProyecto = filters.proyecto
        ? enrichedPlantas.filter((p) => p.proyecto?.name === filters.proyecto)
        : enrichedPlantas
      const tipologia = [...new Set(afterProyecto.map((p) => p.programa).filter(Boolean))].sort()
      const orientacion = [...new Set(
        afterProyecto.map((p) => p.orientacion).filter(Boolean)
            .map((code) => ORIENTACION_LABELS[code] || code)
      )].sort()

      return { comuna, proyecto, tipologia, orientacion }
    }
    return {
      tipologia: [...new Set(plantas.map((p) => p.programa).filter(Boolean))].sort(),
      producto: [...new Set(plantas.map((p) => p.tipo_producto).filter(Boolean))].sort(),
      piso: [...new Set(plantas.map((p) => p.piso).filter(Boolean))].sort((a, b) => a - b),
      planta: [...new Set(plantas.map((p) => p.name?.charAt(0)).filter(Boolean))].sort(),
    }
  }, [enrichedPlantas, plantas, projects, universal, filters.comuna, filters.proyecto])

  // Filtered plantas — cheapest first so the most affordable option shows by default
  const filteredPlantas = useMemo(() => {
    if (universal) {
      return enrichedPlantas
        .filter((p) =>
          (!filters.comuna || p._comuna === filters.comuna) &&
          (!filters.proyecto || p.proyecto?.name === filters.proyecto) &&
          (!filters.tipologia || p.programa === filters.tipologia) &&
          (!filters.orientacion || (ORIENTACION_LABELS[p.orientacion] || p.orientacion) === filters.orientacion)
        )
        .sort((a, b) => (parseFloat(a.precio_lista) || Infinity) - (parseFloat(b.precio_lista) || Infinity))
    }
    return plantas
      .filter((p) =>
        (!filters.tipologia || p.programa === filters.tipologia) &&
        (!filters.producto || p.tipo_producto === filters.producto) &&
        (!filters.piso || String(p.piso) === String(filters.piso)) &&
        (!filters.planta || p.name?.charAt(0) === filters.planta)
      )
      .sort((a, b) => (parseFloat(a.precio_lista) || Infinity) - (parseFloat(b.precio_lista) || Infinity))
  }, [enrichedPlantas, plantas, filters, universal])

  // Whether any filter is currently applied
  const hasFilters = universal
    ? !!(filters.comuna || filters.proyecto || filters.tipologia || filters.orientacion)
    : !!(filters.tipologia || filters.producto || filters.piso || filters.planta)

  // Universal mode: notify parent when the active project changes
  // Derive from the first filtered planta so it works even without selecting a specific project.
  // When no filters are active (empty state), return null so the parent hides related/alternatives.
  const activeProject = useMemo(() => {
    if (!universal || !projects || !hasFilters) return null
    // Use the first filtered planta's proyecto name to find the project
    const planta = filteredPlantas[0]
    const name = filters.proyecto || planta?.proyecto?.name
    if (!name) return null
    const target = name.trim().toLowerCase()
    return projects.find((p) => (p.name || '').trim().toLowerCase() === target)
      || projects.find((p) => (p.name || '').trim().toLowerCase().includes(target))
      || null
  }, [universal, hasFilters, filters.proyecto, filteredPlantas, projects])

  useEffect(() => {
    if (universal && onProjectChange) {
      onProjectChange(activeProject)
    }
  }, [universal, activeProject, onProjectChange])

  // Ensure activeData always has floorPlan
  const safeActiveData = useMemo(() => ({
    ...activeData,
    floorPlan: activeData.floorPlan || { thumbnails: [] },
  }), [activeData])

  // Universal mode: show placeholder until filters produce results
  const showEmptyState = universal && (!hasFilters || filteredPlantas.length === 0)

  // Active details: from filtered planta if available, else from data
  // Thumbnails: real planta image first, then the original mockup gallery
  const displayData = useMemo(() => {
    if ((universal && !plantas.length) || (!universal && (!apiId || !plantas.length))) return safeActiveData
    const planta = filteredPlantas[Math.min(selected, filteredPlantas.length - 1)]
    if (!planta) return { ...safeActiveData, details: [], pricing: { ...safeActiveData.pricing, price: 'Sin resultados' } }
    const enriched = plantaToDetails(planta)
    const thumbnails = enriched.floorPlanImage
      ? [enriched.floorPlanImage, ...safeActiveData.floorPlan.thumbnails]
      : safeActiveData.floorPlan.thumbnails
    return {
      ...safeActiveData,
      details: enriched.details,
      pricing: enriched.pricing,
      floorPlan: { ...safeActiveData.floorPlan, thumbnails },
    }
}, [safeActiveData, apiId, plantas, filteredPlantas, selected, universal])

  // Reset thumbnail selection when filtered plantas change
  useEffect(() => { setSelected(0) }, [filteredPlantas])

  // External planta selection (from RelatedProjects Cotizar button)
  useEffect(() => {
    if (!universal || !externalPlanta) return
    const planta = externalPlanta
    setFilters({
      comuna: planta.proyecto?.comuna || '',
      proyecto: planta.proyecto?.name || '',
      tipologia: planta.programa || '',
      orientacion: ORIENTACION_LABELS[planta.orientacion] || planta.orientacion || '',
    })
    // Scroll to top of cotizador
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [universal, externalPlanta])

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
              {(loading && !universal) ? (
                <div className="lb-proj-det-cot-loading d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="text-muted small">Cargando plantas…</span>
                </div>
              ) : (<>
                <div className="d-flex flex-wrap gap-2">
                  {universal ? (<>
                    <FilterDropdown
                      label="Todas las comunas"
                      options={filterOptions.comuna}
                      selected={filters.comuna}
                      onSelect={(v) => setFilters({ comuna: v, proyecto: '', tipologia: '', orientacion: '' })}
                    />
                    <FilterDropdown
                      label="Todos los proyectos"
                      options={filterOptions.proyecto}
                      selected={filters.proyecto}
                      onSelect={(v) => setFilters((prev) => ({ ...prev, proyecto: v, tipologia: '', orientacion: '' }))}
                    />
                    <FilterDropdown
                      label="Todas las tipologías"
                      options={filterOptions.tipologia}
                      selected={filters.tipologia}
                      onSelect={(v) => setFilters((f) => ({ ...f, tipologia: v }))}
                    />
                    <FilterDropdown
                      label="Todas las orientaciones"
                      options={filterOptions.orientacion}
                      selected={filters.orientacion}
                      onSelect={(v) => setFilters((f) => ({ ...f, orientacion: v }))}
                    />
                  </>) : (<>
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
                  </>)}
                </div>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="badge bg-secondary">
                    {(universal || apiId) ? `${filteredPlantas.length} depto${filteredPlantas.length !== 1 ? 's' : ''} encontrado${filteredPlantas.length !== 1 ? 's' : ''}` : 'Filtros demo'}
                  </span>
                  <button
                    className="btn btn-link btn-sm text-decoration-none px-0"
                    disabled={!hasFilters}
                    onClick={() => setFilters(universal ? { comuna: '', proyecto: '', tipologia: '', orientacion: '' } : { tipologia: '', producto: '', piso: '', planta: '' })}
                  >
                    <i className="fa-solid fa-rotate-left me-1" />Borrar filtros
                  </button>
                </div>
              </>)}
            </div>
          </ScrollAnim>
          )}
        </div>

        {/* Main row: esquicio + plan + details (or empty state) */}
        <div className="row g-4 mb-4 lb-proj-det-cot-main">

          {/* Esquicio — always visible (mockup) */}
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

          {/* Empty state — universal mode, no filters or no results */}
          {loading && !showEmptyState ? (
            <div className="col-lg-9">
              <div className="row g-3">
                {/* Skeleton: floor plan image */}
                <div className="col-lg-8">
                  <div className="lb-skeleton" style={{ width: '100%', height: '300px', borderRadius: '0.5rem' }} />
                  <div className="d-flex gap-2 mt-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="lb-skeleton" style={{ width: '64px', height: '64px', borderRadius: '0.375rem' }} />
                    ))}
                  </div>
                </div>
                {/* Skeleton: details + pricing */}
                <div className="col-lg-4 d-flex flex-column gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <div className="lb-skeleton rounded-circle" style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                      <div className="flex-grow-1">
                        <div className="lb-skeleton" style={{ width: '5rem', height: '0.75rem' }} />
                        <div className="lb-skeleton mt-1" style={{ width: '7rem', height: '1rem' }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-3">
                    <div className="lb-skeleton" style={{ width: '6rem', height: '0.75rem' }} />
                    <div className="lb-skeleton mt-1" style={{ width: '8rem', height: '1.5rem' }} />
                    <div className="lb-skeleton mt-3" style={{ width: '100%', height: '2.5rem', borderRadius: '0.375rem' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : showEmptyState ? (
            <div className="col-lg-9 text-center py-5 lb-cot-empty-state">
              <p className="text-muted mb-1">{hasFilters ? 'Sin resultados para tu búsqueda.' : 'Usa los filtros para encontrar tu departamento ideal.'}</p>
              {hasFilters && (
                <p className="text-muted small">Prueba con otra combinación de filtros.</p>
              )}
            </div>
          ) : (
          <>

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
          </>
          )}
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
