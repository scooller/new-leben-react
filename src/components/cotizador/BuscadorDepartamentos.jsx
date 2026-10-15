import { useState, useMemo, useRef, useEffect } from 'react'
import { MapPin, Building2, Home, Compass, Search, ChevronDown, Check, ArrowRightLeft } from 'lucide-react'
import { sortProjectsByCustomOrder, ORIENTACION_LABELS } from '../../lib/projectUtils.js'

const CATEGORY_TABS = [
  { id: 'todos', label: 'Departamentos' },
  { id: 'vivir', label: 'Para vivir' },
  { id: 'invertir', label: 'Para inversión' },
  { id: 'entrega_inmediata', label: 'Entrega inmediata' },
]

const INTENT_PILLS = [
  { id: 'todos', label: 'Todos los proyectos' },
  { id: 'entrega_inmediata', label: 'Entrega inmediata' },
  { id: 'construccion', label: 'En construcción' },
]

const DORMITORIOS_OPTIONS = [
  { value: '', label: 'Cualquier distribución' },
  { value: '1D', label: '1 Dormitorio' },
  { value: '2D', label: '2 Dormitorios' },
  { value: '3D', label: '3 Dormitorios' },
  { value: '4D', label: '4+ Dormitorios' },
]

const ORIENTACIONES = [
  { value: '', label: 'Cualquier orientación' },
  ...Object.entries(ORIENTACION_LABELS).map(([k, label]) => ({ value: label, label, code: k })),
]

export default function BuscadorDepartamentos({
  projects = [],
  onSearch,
  initialFilters = {},
  className = '',
}) {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [intentPill, setIntentPill] = useState('todos')
  const [comuna, setComuna] = useState(initialFilters.comuna || '')
  const [proyecto, setProyecto] = useState(initialFilters.proyecto || '')
  const [dormitorios, setDormitorios] = useState(initialFilters.tipologia || '')
  const [orientacion, setOrientacion] = useState(initialFilters.orientacion || '')

  const [openDropdown, setOpenDropdown] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Filter projects by intent / category
  const filteredProjectsByIntent = useMemo(() => {
    if (!projects || !projects.length) return []
    let list = projects
    const filterType = intentPill !== 'todos' ? intentPill : activeCategory
    if (filterType === 'entrega_inmediata') {
      list = list.filter((p) => /venta|recepcion/i.test(p.etapa || ''))
    } else if (filterType === 'construccion') {
      list = list.filter((p) => /obra|construccion/i.test(p.etapa || ''))
    }
    return list
  }, [projects, activeCategory, intentPill])

  // Comunas with project count
  const comunasWithCount = useMemo(() => {
    const counts = {}
    filteredProjectsByIntent.forEach((p) => {
      const c = (p.comuna || 'Otros').trim()
      counts[c] = (counts[c] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [filteredProjectsByIntent])

  // Available projects filtered by selected comuna
  const availableProjects = useMemo(() => {
    let list = filteredProjectsByIntent
    if (comuna) {
      list = list.filter((p) => (p.comuna || '').trim().toLowerCase() === comuna.trim().toLowerCase())
    }
    const names = [...new Set(list.map((p) => p.name).filter(Boolean))]
    return sortProjectsByCustomOrder(names)
  }, [filteredProjectsByIntent, comuna])

  // Quick chips
  const popularComunas = useMemo(() => {
    return comunasWithCount.slice(0, 6).map((c) => c.name)
  }, [comunasWithCount])

  const handleSelectComuna = (selectedComuna) => {
    setComuna(selectedComuna)
    setProyecto('')
    setOpenDropdown(null)
  }

  const handleSelectProyecto = (selectedProject) => {
    setProyecto(selectedProject)
    if (selectedProject) {
      const pObj = projects.find((p) => p.name === selectedProject)
      if (pObj?.comuna && !comuna) {
        setComuna(pObj.comuna.trim())
      }
    }
    setOpenDropdown(null)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setOpenDropdown(null)
    onSearch?.({
      comuna,
      proyecto,
      tipologia: dormitorios,
      orientacion,
      tab: activeCategory,
    })
  }

  return (
    <div className={`lb-buscador-search-container ${className}`} ref={formRef} id="buscador-departamentos">
      {/* 1. Category Navigation Tabs (Dark Bar like LATAM) */}
      <div className="lb-buscador-category-bar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`lb-buscador-category-tab ${activeCategory === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(tab.id)
              setProyecto('')
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Main White Card */}
      <div className="lb-buscador-search-card">
        {/* Card Header: Title + Intent Pills */}
        <div className="lb-buscador-card-header">
          <h2 className="lb-buscador-card-title mb-0">¿Dónde quieres vivir?</h2>
          <div className="lb-buscador-intent-pills">
            {INTENT_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`lb-buscador-intent-pill ${intentPill === pill.id ? 'active' : ''}`}
                onClick={() => {
                  setIntentPill(pill.id)
                  setProyecto('')
                }}
              >
                {intentPill === pill.id && <Check size={14} className="me-1 text-danger" />}
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lb-buscador-card-body">
          {/* Top Row: Origin & Destination style box (Comuna + Proyecto) */}
          <div className="lb-buscador-route-box">
            {/* Ubicación / Comuna */}
            <div className="lb-buscador-route-segment">
              <button
                type="button"
                className={`lb-buscador-route-btn ${openDropdown === 'comuna' ? 'is-open' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'comuna' ? null : 'comuna')}
                aria-label="Seleccionar comuna"
                aria-expanded={openDropdown === 'comuna'}
              >
                <div className="lb-buscador-route-icon">
                  <MapPin size={22} className="text-danger" />
                </div>
                <div className="lb-buscador-route-text">
                  <span className="lb-buscador-route-label">Comuna / Ubicación</span>
                  <span className={`lb-buscador-route-value ${!comuna ? 'is-placeholder' : ''}`}>
                    {comuna || 'Ingresa una comuna'}
                  </span>
                </div>
                <ChevronDown size={16} className="lb-buscador-chevron" />
              </button>

              {openDropdown === 'comuna' && (
                <div className="lb-buscador-dropdown-menu">
                  <div className="lb-buscador-dropdown-header">Comunas disponibles</div>
                  <button
                    type="button"
                    className={`lb-buscador-dropdown-item ${!comuna ? 'active' : ''}`}
                    onClick={() => handleSelectComuna('')}
                  >
                    <span>Todas las comunas</span>
                    {!comuna && <Check size={16} className="text-danger" />}
                  </button>
                  {comunasWithCount.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`lb-buscador-dropdown-item ${comuna === c.name ? 'active' : ''}`}
                      onClick={() => handleSelectComuna(c.name)}
                    >
                      <span>{c.name}</span>
                      <span className="badge rounded-pill bg-light text-dark border">
                        {c.count} {c.count === 1 ? 'proyecto' : 'proyectos'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Central divider with swap/route icon */}
            <div className="lb-buscador-route-divider">
              <div className="lb-buscador-swap-badge" aria-hidden="true">
                <ArrowRightLeft size={14} />
              </div>
            </div>

            {/* Proyecto */}
            <div className="lb-buscador-route-segment">
              <button
                type="button"
                className={`lb-buscador-route-btn ${openDropdown === 'proyecto' ? 'is-open' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'proyecto' ? null : 'proyecto')}
                aria-label="Seleccionar proyecto"
                aria-expanded={openDropdown === 'proyecto'}
              >
                <div className="lb-buscador-route-icon">
                  <Building2 size={22} className="text-secondary" />
                </div>
                <div className="lb-buscador-route-text">
                  <span className="lb-buscador-route-label">Proyecto</span>
                  <span className={`lb-buscador-route-value ${!proyecto ? 'is-placeholder' : ''}`}>
                    {proyecto || 'Ingresa o selecciona un proyecto'}
                  </span>
                </div>
                <ChevronDown size={16} className="lb-buscador-chevron" />
              </button>

              {openDropdown === 'proyecto' && (
                <div className="lb-buscador-dropdown-menu">
                  <div className="lb-buscador-dropdown-header">
                    {comuna ? `Proyectos en ${comuna}` : 'Todos los proyectos'}
                  </div>
                  <button
                    type="button"
                    className={`lb-buscador-dropdown-item ${!proyecto ? 'active' : ''}`}
                    onClick={() => handleSelectProyecto('')}
                  >
                    <span>Todos los proyectos</span>
                    {!proyecto && <Check size={16} className="text-danger" />}
                  </button>
                  {availableProjects.map((pName) => (
                    <button
                      key={pName}
                      type="button"
                      className={`lb-buscador-dropdown-item ${proyecto === pName ? 'active' : ''}`}
                      onClick={() => handleSelectProyecto(pName)}
                    >
                      <span>{pName}</span>
                      {proyecto === pName && <Check size={16} className="text-danger" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Row: Dormitorios + Orientación + CTA Button */}
          <div className="lb-buscador-secondary-row mt-3">
            <div className="row g-3 align-items-stretch">
              {/* Dormitorios */}
              <div className="col-12 col-md-4">
                <div className="lb-buscador-sub-segment">
                  <button
                    type="button"
                    className={`lb-buscador-sub-btn ${openDropdown === 'dormitorios' ? 'is-open' : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === 'dormitorios' ? null : 'dormitorios')}
                    aria-label="Seleccionar dormitorios"
                    aria-expanded={openDropdown === 'dormitorios'}
                  >
                    <Home size={20} className="text-secondary me-2 flex-shrink-0" />
                    <div className="lb-buscador-route-text">
                      <span className="lb-buscador-route-label">Dormitorios</span>
                      <span className={`lb-buscador-route-value ${!dormitorios ? 'is-placeholder' : ''}`}>
                        {dormitorios
                          ? (DORMITORIOS_OPTIONS.find((d) => d.value === dormitorios)?.label || dormitorios)
                          : 'Cualquier distribución'}
                      </span>
                    </div>
                    <ChevronDown size={16} className="lb-buscador-chevron" />
                  </button>

                  {openDropdown === 'dormitorios' && (
                    <div className="lb-buscador-dropdown-menu">
                      <div className="lb-buscador-dropdown-header">Distribución y dormitorios</div>
                      {DORMITORIOS_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          className={`lb-buscador-dropdown-item ${dormitorios === d.value ? 'active' : ''}`}
                          onClick={() => {
                            setDormitorios(d.value)
                            setOpenDropdown(null)
                          }}
                        >
                          <span>{d.label}</span>
                          {dormitorios === d.value && <Check size={16} className="text-danger" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Orientación */}
              <div className="col-12 col-md-4">
                <div className="lb-buscador-sub-segment">
                  <button
                    type="button"
                    className={`lb-buscador-sub-btn ${openDropdown === 'orientacion' ? 'is-open' : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === 'orientacion' ? null : 'orientacion')}
                    aria-label="Seleccionar orientación"
                    aria-expanded={openDropdown === 'orientacion'}
                  >
                    <Compass size={20} className="text-secondary me-2 flex-shrink-0" />
                    <div className="lb-buscador-route-text">
                      <span className="lb-buscador-route-label">Orientación</span>
                      <span className={`lb-buscador-route-value ${!orientacion ? 'is-placeholder' : ''}`}>
                        {orientacion || 'Cualquier orientación'}
                      </span>
                    </div>
                    <ChevronDown size={16} className="lb-buscador-chevron" />
                  </button>

                  {openDropdown === 'orientacion' && (
                    <div className="lb-buscador-dropdown-menu">
                      <div className="lb-buscador-dropdown-header">Orientación solar</div>
                      {ORIENTACIONES.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          className={`lb-buscador-dropdown-item ${orientacion === o.value ? 'active' : ''}`}
                          onClick={() => {
                            setOrientacion(o.value)
                            setOpenDropdown(null)
                          }}
                        >
                          <span>{o.label}</span>
                          {orientacion === o.value && <Check size={16} className="text-danger" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botón CTA */}
              <div className="col-12 col-md-4">
                <button type="submit" className="lb-buscador-submit-btn w-100">
                  <Search size={20} className="me-2" />
                  <span>Buscar departamentos</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Comunas frecuentes */}
      {popularComunas.length > 0 && (
        <div className="lb-buscador-search-quick">
          <span className="lb-buscador-quick-label">Comunas frecuentes:</span>
          <div className="lb-buscador-quick-chips">
            {popularComunas.map((cName) => (
              <button
                key={cName}
                type="button"
                className={`lb-buscador-chip ${comuna === cName ? 'active' : ''}`}
                onClick={() => handleSelectComuna(comuna === cName ? '' : cName)}
              >
                {cName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
