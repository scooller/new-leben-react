import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { Layers, Expand, Home, Sun, Compass, Maximize, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import CotizadorForm from './CotizadorForm.jsx'
import Room3DMockup from './Room3DMockup.jsx'
import { apiFetch } from '../../lib/apiFetch.js'
import { ExternalLinkIcon } from '../icons/external-link.jsx'
import { WhatsAppIcon } from '../icons/whatsapp.jsx'
import { MailIcon } from '../icons/mail.jsx'
import { hover } from '../icons/animated-icon.jsx'
import { DownloadIcon } from '../icons/download.jsx'
import { TelescopeIcon } from '../icons/telescope.jsx'
import { MapPinHouseIcon } from '../icons/map-pin-house.jsx'

/** Reusable share button with animated icon + hover */
function ShareButton({ icon: Icon, label, href, onClick }) {
  const ref = useRef(null)
  return (
    <a
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className="d-flex flex-column align-items-center gap-2 text-decoration-none text-dark p-3 rounded-3 lb-share-btn"
      {...hover(ref)}
    >
      <Icon ref={ref} size={32} />
      <span className="small fw-semibold">{label}</span>
    </a>
  )
}

/** Reusable action button with animated icon + hover */
function ActionButton({ icon: Icon, variant = 'btn-outline-dark', className = '', onClick, iconRef, children }) {
  const innerRef = useRef(null)
  const ref = iconRef || innerRef
  return (
    <button
      type="button"
      aria-label={typeof children === 'string' ? children : undefined}
      onClick={onClick}
      className={`btn ${variant} d-flex align-items-center justify-content-center gap-2 ${className}`}
      {...hover(ref)}
    >
      <Icon ref={ref} size={24} />
      {children}
    </button>
  )
}

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

const EMPTY_FILTERS_UNIVERSAL = Object.freeze({ comuna: '', proyecto: '', tipologia: '', orientacion: '' })
const EMPTY_FILTERS_PROJECT = Object.freeze({ tipologia: '', producto: '', piso: '', planta: '' })

/** Paginate through all available plantas from a base URL */
async function fetchPages(baseUrl) {
  const all = []
  let page = 1
  while (true) {
    const { data, error } = await apiFetch(`${baseUrl}&perPage=100&page=${page}`)
    if (error || !Array.isArray(data) || data.length === 0) break
    all.push(...data)
    if (data.length < 100) break
    page++
  }
  return all.filter((p) => p.is_available)
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

/** Derive universal filters from a selection ({ planta?, project? }) */
function filtersFromSelection(selection) {
  if (!selection) return null
  if (selection.planta) {
    const p = selection.planta
    return {
      comuna: p.proyecto?.comuna || '',
      proyecto: p.proyecto?.name || '',
      tipologia: p.programa || '',
      orientacion: ORIENTACION_LABELS[p.orientacion] || p.orientacion || '',
    }
  }
  if (selection.project) {
    return { comuna: selection.project.comuna || '', proyecto: selection.project.name || '', tipologia: '', orientacion: '' }
  }
  return null
}

export default function Cotizador({ data, plantasRelacionadas, apiId, selection, universal, projects, onProjectChange, className = '' }) {
  const [activeData, setActiveData] = useState(data)
  const [selected, setSelected] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const ref = useRef(null)
  const shareIconRef = useRef(null)
  const countIconRef = useRef(null)
  const [showCotizar, setShowCotizar] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showVistas, setShowVistas] = useState(false)
  const [copied, setCopied] = useState(false)

  // Resolve planta ID + project slug from URL — read once on mount
  const [urlParams] = useState(() => {
    const m = window.location.pathname.match(/\/cotizador\/proyecto\/([^/]+)(?:\/planta\/(\d+))?/)
    return { slug: m?.[1] || null, plantaId: m?.[2] ? parseInt(m[2], 10) : null }
  })
  const urlPlantaId = urlParams.plantaId

  const updateUrl = (plantaId, projectSlug) => {
    const slug = projectSlug || urlParams.slug
    if (!slug) return
    const path = plantaId
      ? `/cotizador/proyecto/${slug}/planta/${plantaId}`
      : `/cotizador/proyecto/${slug}`
    window.history.replaceState(null, '', `${path}${window.location.search}${window.location.hash}`)
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const EMPTY_FILTERS = universal ? EMPTY_FILTERS_UNIVERSAL : EMPTY_FILTERS_PROJECT

  // API plantas
  const [plantas, setPlantas] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(() => filtersFromSelection(selection) || EMPTY_FILTERS)
  const [filtering, setFiltering] = useState(false)
  const [switching, setSwitching] = useState(false)

  // Clear filtering flag after filters settle
  useEffect(() => {
    if (!filtering) return
    const t = setTimeout(() => setFiltering(false), 300)
    return () => clearTimeout(t)
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectFilter = (updater) => {
    setFiltering(true)
    setFilters(updater)
  }

  // Lookup project etapa by name for smart ordering
  const projectEtapaByName = useMemo(() => {
    const map = {}
    ;(projects || []).forEach((p) => { map[(p.name || '').trim().toLowerCase()] = p.etapa })
    return map
  }, [projects])

  // Normalize string for reliable comparison across API objects
  const norm = (s) => (s || '').trim().toLowerCase()

  // Enrich + sort: actively-selling projects first (drives default display)
  const enrichedPlantas = useMemo(() =>
    plantas
      .map((p) => ({
        ...p,
        proyecto_id: p.proyecto_id || p.proyecto?.id,
        _comuna: (p.proyecto?.comuna || '').trim(),
        _comunaNorm: norm(p.proyecto?.comuna),
      }))
      .sort((a, b) =>
        etapaRank(projectEtapaByName[(a.proyecto?.name || '').trim().toLowerCase()])
        - etapaRank(projectEtapaByName[(b.proyecto?.name || '').trim().toLowerCase()])
      ),
    [plantas, projectEtapaByName])

  // Sync when parent swaps data
  useEffect(() => {
    setActiveData(data); setSelected(0)
    setFilters(filtersFromSelection(selection) || EMPTY_FILTERS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selection, universal])

  // Fetch plantas from API — universal paginates through ALL available, otherwise per-project
  useEffect(() => {
    if (!universal && !apiId) { setPlantas([]); return }
    let cancelled = false
    setLoading(true)

    const url = universal
      ? '/api/v1/plantas?disponible=1'
      : `/api/v1/plantas?proyecto_id=${apiId}&disponible=1`

    fetchPages(url).then((all) => {
      if (!cancelled) setPlantas(all)
    }).finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [apiId, universal])

  // Unique filter options from enriched plantas — cascading in universal mode
  const filterOptions = useMemo(() => {
    if (universal) {
      // Step 1: all comunas from projects (not just plantas — some projects have no available plantas)
      const comuna = [...new Set((projects || []).map((p) => (p.comuna || '').trim()).filter(Boolean))].sort()

      // Step 2: proyectos filtered by selected comuna (from projects, not just plantas)
      const afterComunaProjects = filters.comuna
        ? (projects || []).filter((p) => norm(p.comuna) === norm(filters.comuna))
        : (projects || [])
      const proyecto = [...new Set(afterComunaProjects.map((p) => p.name).filter(Boolean))].sort()

      // Step 3: tipologías + orientaciones filtered by selected proyecto (from plantas)
      const afterProyecto = filters.proyecto
        ? enrichedPlantas.filter((p) => norm(p.proyecto?.name) === norm(filters.proyecto))
        : (filters.comuna
          ? enrichedPlantas.filter((p) => p._comunaNorm === norm(filters.comuna))
          : enrichedPlantas)
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
          (!filters.comuna || p._comunaNorm === norm(filters.comuna)) &&
          (!filters.proyecto || norm(p.proyecto?.name) === norm(filters.proyecto)) &&
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

  // Active planta object — derived from selected index
  const activePlanta = filteredPlantas[Math.min(selected, filteredPlantas.length - 1)]

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

  // Share URL with active planta ID so recipients land on the right departamento
  const shareUrl = (() => {
    const slug = activeProject?.slug || urlParams.slug
    if (!slug) return window.location.href
    const plantaId = activePlanta?.id
    const path = plantaId
      ? `/cotizador/proyecto/${slug}/planta/${plantaId}`
      : `/cotizador/proyecto/${slug}`
    return `${window.location.origin}${path}`
  })()

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
  // Respect urlPlantaId — if URL has a specific planta, never show empty state
  const showEmptyState = universal && !selection?.project && !urlPlantaId && !urlParams.slug && (!hasFilters || filteredPlantas.length === 0)

  // Skeleton while fetching/searching — EXCEPT the initial no-filter state,
  // where the empty-state message renders right away (no skeleton flash)
  const showSkeleton = (loading || filtering) && !(showEmptyState && !hasFilters)

  // Active details: from filtered planta if available, else from data
  // Thumbnails: real planta image only (no fake mockup fallback)
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
      pricing: { ...safeActiveData.pricing, ...enriched.pricing },
      floorPlan: { ...safeActiveData.floorPlan, thumbnails },
    }
}, [safeActiveData, apiId, plantas, filteredPlantas, selected, universal])

  // Resolve selected index from URL planta ID once filteredPlantas load
  useEffect(() => {
    if (!filteredPlantas.length) return
    const idx = urlPlantaId != null
      ? Math.max(0, filteredPlantas.findIndex((p) => p.id === urlPlantaId))
      : 0
    const valid = idx >= 0 ? idx : 0
    setSelected(valid)
    setImgIndex(0)
    if (urlPlantaId != null || urlParams.slug) {
      const planta = filteredPlantas.find((p) => p.id === urlPlantaId)
      if (planta) {
        setFilters({
          comuna: planta.proyecto?.comuna || '',
          proyecto: planta.proyecto?.name || '',
          tipologia: '',
          orientacion: '',
        })
      }
    }
  }, [filteredPlantas, urlPlantaId, urlParams.slug])

  // Update URL when selection changes — only if user navigated to a specific planta or has filters
  useEffect(() => {
    if (urlPlantaId != null || hasFilters) {
      updateUrl(activePlanta?.id, activeProject?.slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, filteredPlantas, activeProject])

  // External selection ({ planta?, project? }) — apply filters, scroll into view when planta-driven
  useEffect(() => {
    const next = filtersFromSelection(selection)
    if (!universal || !next) return
    setFiltering(true)
    setFilters(next)
    if (selection.planta) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [universal, selection])

  const openGallery = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const images = displayData.floorPlan.thumbnails.map((src) => ({ src, type: 'image' }))
    if (!images.length) return
    Fancybox.show(images, { startIndex: imgIndex })
  }

  // Navigate between plantas — show loading effect until the new image loads
  const changePlanta = (dir) => {
    const next = Math.min(filteredPlantas.length - 1, Math.max(0, selected + dir))
    if (next === selected || switching) return
    setSwitching(true)
    setSelected(next)
    setImgIndex(0)
  }

  // Safety: never get stuck in loading state (cached or failed images)
  useEffect(() => {
    if (!switching) return
    const t = setTimeout(() => setSwitching(false), 2000)
    return () => clearTimeout(t)
  }, [switching, selected])

  const mainImage = displayData.floorPlan.thumbnails[imgIndex] ?? displayData.floorPlan.image
  // Planta (floor plan) renders contained; gallery/mockup images render covered
  const plantaImageUrl = activePlanta?.interior_image_url || null
  const planFitClass = mainImage && mainImage === plantaImageUrl ? 'object-fit-contain' : 'object-fit-cover'

  return (
    <section className={`lb-proj-det-cotizador ${className}`.trim()} id="cotizador" ref={ref}>
      <div className="container">
        {/* Header + Filters */}
        <div className="row align-items-start g-4 mb-4" animation="fade-up">
          <div className="col-lg-3">
            <ScrollAnim as="h2" className="lb-proj-det-cot-title mb-0" dangerouslySetInnerHTML={{ __html: displayData.title }} />
          </div>

          {displayData.filters && (
          <ScrollAnim as="div" className="col-lg-6 lb-proj-det-cot-filters-col">
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
                      onSelect={(v) => selectFilter({ comuna: v, proyecto: '', tipologia: '', orientacion: '' })}
                    />
                    <FilterDropdown
                      label="Todos los proyectos"
                      options={filterOptions.proyecto}
                      selected={filters.proyecto}
                      onSelect={(v) => selectFilter((prev) => ({ ...prev, proyecto: v, tipologia: '', orientacion: '' }))}
                    />
                    <FilterDropdown
                      label="Todas las tipologías"
                      options={filterOptions.tipologia}
                      selected={filters.tipologia}
                      onSelect={(v) => selectFilter((f) => ({ ...f, tipologia: v }))}
                    />
                    <FilterDropdown
                      label="Todas las orientaciones"
                      options={filterOptions.orientacion}
                      selected={filters.orientacion}
                      onSelect={(v) => selectFilter((f) => ({ ...f, orientacion: v }))}
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
                      onSelect={(v) => selectFilter((f) => ({ ...f, producto: v }))}
                    />
                    <FilterDropdown
                      label="Todos los pisos"
                      options={apiId ? filterOptions.piso.map(String) : displayData.filters.row2[0].options}
                      selected={filters.piso ? String(filters.piso) : ''}
                      onSelect={(v) => selectFilter((f) => ({ ...f, piso: v }))}
                    />
                    <FilterDropdown
                      label="Todas las plantas"
                      options={apiId ? filterOptions.planta : displayData.filters.row2[1].options}
                      selected={filters.planta}
                      onSelect={(v) => selectFilter((f) => ({ ...f, planta: v }))}
                    />
                  </>)}
                </div>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="badge bg-secondary d-inline-flex align-items-center gap-1" {...hover(countIconRef)}>
                    <MapPinHouseIcon ref={countIconRef} size={14} />
                    {showSkeleton ? 'Buscando deptos…' : (universal || apiId) ? `${filteredPlantas.length} depto${filteredPlantas.length !== 1 ? 's' : ''} encontrado${filteredPlantas.length !== 1 ? 's' : ''}` : 'Filtros demo'}
                  </span>
                  <button
                    className="btn btn-danger btn-sm text-decoration-none"
                    disabled={!hasFilters}
                    onClick={() => {
                      selectFilter(EMPTY_FILTERS)
                      sessionStorage.clear()
                      window.history.replaceState(null, '', '/cotizador/')
                    }}
                  >
                    <RotateCcw size={14} className="me-1" />Borrar filtros
                  </button>
                </div>
              </>)}
            </div>
          </ScrollAnim>
          )}
        </div>

        {/* Main row: esquicio + plan + details (or empty state) */}
        {/* Main row: map always visible + content area changes (skeleton/empty/plan) */}
        <div className="row g-4 mb-4 lb-proj-det-cot-main" id="detalle-cot">

          {/* Esquicio — hidden during empty state (no planta selected) */}
          {showEmptyState ? null : (
          <ScrollAnim as="div" className="col-lg-3 lb-proj-det-cot-map">
            {showSkeleton ? (
              <div className="lb-skeleton" style={{ width: '100%', height: '100%', minHeight: '25rem', borderRadius: '0.5rem' }} />
            ) : displayData.mapImage ? (
              <div className="lb-proj-det-cot-map-canvas">
                <img
                  src={displayData.mapImage}
                  alt="Esquicio del edificio"
                  className="w-100 h-100 object-fit-contain"
                  loading="lazy"
                  decoding="async"
                />
                {displayData.mapCaption && (
                  <p className="lb-proj-det-cot-map-caption position-absolute start-0 bottom-0 text-muted small mb-0 m-2 px-2 py-1 bg-white bg-opacity-75 rounded">{displayData.mapCaption}</p>
                )}
              </div>
            ) : null}
          </ScrollAnim>
          )}

          {/* Content: skeleton | empty state | floor plan + details */}
          {/* Empty state renders immediately — initial fetch with no filters shouldn't skeleton */}
          {showSkeleton ? (
            <>
              {/* Skeleton: floor plan card */}
              <div className="col-lg-6 lb-proj-det-cot-plan-card">
                <div className="lb-skeleton" style={{ width: '100%', height: '300px', borderRadius: '0.5rem' }} />
              </div>

              {/* Skeleton: details grid (2 cols, 6 items) + pricing */}
              <div className="col-lg-3 lb-proj-det-cot-details">
                <div className="lb-proj-det-cot-detail-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <div className="lb-skeleton rounded-circle" style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                      <div className="flex-grow-1">
                        <div className="lb-skeleton" style={{ width: '4rem', height: '0.75rem' }} />
                        <div className="lb-skeleton mt-1" style={{ width: '5.5rem', height: '1rem' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="lb-skeleton" style={{ width: '6rem', height: '0.75rem' }} />
                  <div className="lb-skeleton mt-1" style={{ width: '8rem', height: '1.5rem' }} />
                </div>
              </div>

              {/* Skeleton: bottom row — thumbnails + CTA */}
              <div className="col-lg-6 lb-proj-det-cot-bottom d-flex justify-content-start">
                <div className="d-flex gap-2 flex-wrap">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="lb-skeleton" style={{ width: '64px', height: '64px', borderRadius: '0.375rem' }} />
                  ))}
                </div>
              </div>
              <div className="col-lg-3 lb-proj-det-cot-bottom">
                <div className="lb-skeleton" style={{ width: '100%', height: '2.5rem', borderRadius: '0.375rem' }} />
              </div>
            </>
          ) : showEmptyState ? (
            <div className="col-lg-9 offset-lg-4 text-start py-5 lb-cot-empty-state">
              <div className="alert alert-warning d-inline-block text-center" role="alert">
                <p className="text-muted mb-1">{hasFilters ? 'Sin resultados para tu búsqueda.' : 'Usa los filtros para encontrar tu departamento ideal.'}</p>
                {hasFilters && (
                <p className="text-muted small">Prueba con otra combinación de filtros.</p>
                )}
              </div>
            </div>
          ) : (
          <>

          {/* Floor plan card */}
          <div className="col-lg-6 lb-proj-det-cot-plan-card">
            <div onClick={openGallery} className="lb-img-trigger d-block" style={{ cursor: mainImage ? 'pointer' : 'default' }} role="button" tabIndex={0}>
              {switching && <div className="lb-skeleton lb-proj-det-cot-plan-loading" aria-hidden="true" />}
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Planta del departamento"
                  className={`lb-proj-det-cot-plan-img w-100 h-100 lb-img-interactive ${planFitClass}${switching ? ' is-loading' : ''}`}
                  onLoad={() => setSwitching(false)}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center text-muted small" style={{ minHeight: '18rem' }}>
                  Sin imágenes disponibles para esta planta
                </div>
              )}
            </div>
            {filteredPlantas.length > 1 && (<>
              <button
                className="lb-proj-det-gallery-arrow lb-proj-det-gallery-arrow--prev"
                onClick={() => changePlanta(-1)}
                disabled={selected <= 0}
                aria-label="Planta anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="lb-proj-det-gallery-arrow lb-proj-det-gallery-arrow--next"
                onClick={() => changePlanta(1)}
                disabled={selected >= filteredPlantas.length - 1}
                aria-label="Planta siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </>)}
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

            {/* Pricing */}
              <ScrollAnim as="div" className="lb-proj-det-cot-pricing mt-4">
                <div className="row align-items-end">
                  <div className="col-md">
                    <span className="lb-proj-det-cot-price-label">{displayData.pricing.label}</span>
                    <div className="lb-proj-det-cot-price-row d-flex justify-content-between align-items-center">
                      <span className="lb-proj-det-cot-price">{displayData.pricing.price}</span>                      
                    </div>
                  </div>
                  <div className="col-md">
                    <button
                      className="btn btn-danger w-100 lb-proj-det-cot-cta"
                      onClick={() => setShowCotizar(true)}
                    >
                      {displayData.ctaText}
                    </button>      
                  </div>
                </div>
              </ScrollAnim>
          </div>

          {/* Bottom row: map caption + thumbnails + CTA */}
          {displayData.mapImage && (
            <div className="col-lg-3 lb-proj-det-cot-bottom d-flex justify-content-center align-items-center flex-column">            
              <ActionButton className='w-100 h-100' icon={TelescopeIcon} onClick={() => setShowVistas(true)}>
                Vistas por piso de tu Dpto
              </ActionButton></div>
          )}
          <div className="col-lg-6 lb-proj-det-cot-bottom d-flex justify-content-start">
            <div className="lb-proj-det-cot-thumbs d-flex gap-2 flex-wrap justify-content-center">
              {displayData.floorPlan.thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`lb-proj-det-cot-thumb${imgIndex === i ? ' lb-proj-det-cot-thumb--active' : ''}`}
                  onClick={() => setImgIndex(i)}
                >
                  <img src={thumb} alt={`Planta ${i + 1}`} width="64" height="64" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-3 lb-proj-det-cot-bottom d-flex justify-content-start">
            <div className="btn-group w-100" role="group" aria-label="Acciones">
              <ActionButton icon={DownloadIcon}>
                Descargar Brochure
              </ActionButton>
              <ActionButton
                variant="btn-outline-primary"
                icon={ExternalLinkIcon}
                iconRef={shareIconRef}
                onClick={() => setShowShare(true)}
              >
                <span className="small me-2">{displayData.pricing.shareLabel || 'Compartir'}</span>
              </ActionButton>
            </div>
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

      {showShare && createPortal(
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowShare(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content lb-share-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title">Compartir</h5>
                <button type="button" className="btn-close" onClick={() => setShowShare(false)} aria-label="Cerrar" />
              </div>
              <div className="modal-body">
                <div className="row g-3 text-center">
                  <div className="col-6 col-md-3">
                    <ShareButton icon={WhatsAppIcon} label="WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} />
                  </div>
                  <div className="col-6 col-md-3">
                    <ShareButton icon={MailIcon} label="Email" href={`mailto:?subject=Mira%20este%20departamento&body=${encodeURIComponent(shareUrl)}`} />
                  </div>
                  <div className="col-12">
                    <div className="input-group">
                      <input type="text" className="form-control" readOnly value={shareUrl} aria-label="Enlace para copiar" />
                      <button className="btn btn-outline-dark" type="button" onClick={copyLink}>
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL VISTAS 3D POR PISO */}
      {showVistas && createPortal(
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowVistas(false)}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Vista 3D — Piso {activePlanta?.piso ?? '—'} · {activePlanta?.name || displayData.title}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowVistas(false)} aria-label="Cerrar" />
              </div>
              <div className="modal-body p-0">
                {activePlanta?.vista_360_url ? (
                  <iframe
                    src={activePlanta.vista_360_url}
                    title={`Vista 3D piso ${activePlanta?.piso}`}
                    className="w-100"
                    style={{ height: '70vh', border: 0 }}
                    allowFullScreen
                    allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                  />
                ) : (
                  <Room3DMockup orientacion={activePlanta?.orientacion} planta={activePlanta} />
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
