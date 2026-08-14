import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { Layers, Expand, Home, Sun, Compass, Maximize } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import CotizadorForm from './CotizadorForm.jsx'
import { apiFetch } from '../../lib/apiFetch.js'
import { SendIcon } from '../icons/send.jsx'
import { WhatsAppIcon } from '../icons/whatsapp.jsx'
import { FacebookIcon } from '../icons/facebook.jsx'
import { LinkedinIcon } from '../icons/linkedin.jsx'
import { MailIcon } from '../icons/mail.jsx'
import { hover } from '../icons/animated-icon.jsx'

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

const DETAIL_ICONS = { layers: Layers, expand: Expand, home: Home, sun: Sun, compass: Compass, maximize: Maximize }

const ORIENTACION_LABELS = {
  N: 'Norte', S: 'Sur', E: 'Oriente', O: 'Poniente',
  NE: 'Nor-Oriente', NO: 'Nor-Poniente',
  SE: 'Sur-Oriente', SO: 'Sur-Poniente',
}

// Mockup gallery images — fallback when project data has no thumbnails
const MOCKUP_THUMBNAILS = [
  `${import.meta.env.BASE_URL}images/inn/planta/planta.jpg`,
  `${import.meta.env.BASE_URL}images/inn/planta/Cocina-Comedor-1.jpg`,
  `${import.meta.env.BASE_URL}images/inn/planta/Comedor-2.jpg`,
  `${import.meta.env.BASE_URL}images/inn/planta/Hall-de-acceso.jpg`,
  `${import.meta.env.BASE_URL}images/inn/planta/Living-Comedor-2.jpg`,
  `${import.meta.env.BASE_URL}images/inn/planta/Living-Comedor-3.jpg`,
]

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

export default function Cotizador({ data, plantasRelacionadas, apiId, initialFilters, universal, projects, onProjectChange, externalPlanta }) {
  const [activeData, setActiveData] = useState(data)
  const [selected, setSelected] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const ref = useRef(null)
  const shareIconRef = useRef(null)
  const [showCotizar, setShowCotizar] = useState(false)
  const [showShare, setShowShare] = useState(false)
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
  const [filters, setFilters] = useState(initialFilters || EMPTY_FILTERS)
  const [filtering, setFiltering] = useState(false)

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
    setFilters(initialFilters || EMPTY_FILTERS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, initialFilters, universal])

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
  const showEmptyState = universal && !urlPlantaId && !urlParams.slug && (!hasFilters || filteredPlantas.length === 0)

  // Active details: from filtered planta if available, else from data
  // Thumbnails: real planta image first, then the original mockup gallery
  const displayData = useMemo(() => {
    if ((universal && !plantas.length) || (!universal && (!apiId || !plantas.length))) return safeActiveData
    const planta = filteredPlantas[Math.min(selected, filteredPlantas.length - 1)]
    if (!planta) return { ...safeActiveData, details: [], pricing: { ...safeActiveData.pricing, price: 'Sin resultados' } }
    const enriched = plantaToDetails(planta)
    const mockups = safeActiveData.floorPlan.thumbnails.length
      ? safeActiveData.floorPlan.thumbnails
      : MOCKUP_THUMBNAILS
    const thumbnails = enriched.floorPlanImage
      ? [enriched.floorPlanImage, ...mockups]
      : mockups
    return {
      ...safeActiveData,
      details: enriched.details,
      pricing: enriched.pricing,
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

  // External planta selection (from RelatedProjects Cotizar button)
  useEffect(() => {
    if (!universal || !externalPlanta) return
    const planta = externalPlanta
    setFiltering(true)
    setFilters({
      comuna: planta.proyecto?.comuna || '',
      proyecto: planta.proyecto?.name || '',
      tipologia: planta.programa || '',
      orientacion: ORIENTACION_LABELS[planta.orientacion] || planta.orientacion || '',
    })
    // Scroll to top of cotizador
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [universal, externalPlanta])

  const openGallery = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const images = displayData.floorPlan.thumbnails.map((src) => ({ src, type: 'image' }))
    Fancybox.show(images, { startIndex: imgIndex })
  }

  const mainImage = displayData.floorPlan.thumbnails[imgIndex] ?? displayData.floorPlan.image

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
                  <span className="badge bg-secondary">
                    {(loading || filtering) ? 'Buscando deptos…' : (universal || apiId) ? `${filteredPlantas.length} depto${filteredPlantas.length !== 1 ? 's' : ''} encontrado${filteredPlantas.length !== 1 ? 's' : ''}` : 'Filtros demo'}
                  </span>
                  <button
                    className="btn btn-link btn-sm text-decoration-none px-0"
                    disabled={!hasFilters}
                    onClick={() => {
                      selectFilter(EMPTY_FILTERS)
                      sessionStorage.clear()
                      window.history.replaceState(null, '', '/cotizador/')
                    }}
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
        {/* Main row: map always visible + content area changes (skeleton/empty/plan) */}
        <div className="row g-4 mb-4 lb-proj-det-cot-main" id="detalle-cot">

          {/* Esquicio — hidden during empty state (no planta selected) */}
          {showEmptyState ? null : (
          <ScrollAnim as="div" className="col-lg-3 lb-proj-det-cot-map">
            {(loading || filtering) ? (
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
              </div>
            ) : null}
          </ScrollAnim>
          )}

          {/* Content: skeleton | empty state | floor plan + details */}
          {(loading || filtering) ? (
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
            <div onClick={openGallery} className="lb-img-trigger d-block" style={{ cursor: 'pointer' }} role="button" tabIndex={0}>
              <img
                src={mainImage}
                alt="Planta del departamento"
                className="lb-proj-det-cot-plan-img w-100 h-100 lb-img-interactive object-fit-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
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
              <span className="lb-proj-det-cot-price-label">{displayData.pricing.label}</span>
              <div className="lb-proj-det-cot-price-row d-flex justify-content-between align-items-center">
                <span className="lb-proj-det-cot-price">{displayData.pricing.price}</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="small">{displayData.pricing.shareLabel}</span>
                  <button
                    className="btn btn-link text-decoration-none p-0 lb-share-trigger d-flex align-items-center"
                    onClick={() => setShowShare(true)}
                    aria-label="Compartir"
                  >
                    <SendIcon ref={shareIconRef} size={24} />
                  </button>
                </div>
              </div>
            </ScrollAnim>
          </div>

          {/* Bottom row: map caption + thumbnails + CTA */}
          {displayData.mapImage && (
            <div className="col-lg-3 lb-proj-det-cot-bottom d-flex justify-content-center">
              <p className="lb-proj-det-cot-map-caption text-muted small mb-0">{displayData.mapCaption}</p>
            </div>
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
            <button
              className="btn btn-danger w-100 lb-proj-det-cot-cta"
              onClick={() => setShowCotizar(true)}
            >
              {displayData.ctaText}
            </button>
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
                    <ShareButton icon={FacebookIcon} label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} />
                  </div>
                  <div className="col-6 col-md-3">
                    <ShareButton icon={LinkedinIcon} label="LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} />
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
    </section>
  )
}
