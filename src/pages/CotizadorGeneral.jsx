import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import ProjectCardSkeleton from '../components/ProjectCardSkeleton.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
import ValueProps from '../components/sections/ValueProps.jsx'
import { SparklesIcon } from '../components/icons/sparkles.jsx'
import { LayoutGridIcon } from '../components/icons/layout-grid.jsx'
import { cotizadorHero, images } from '../data/content.js'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'
import { groupByComuna } from '../lib/projectUtils.js'

const SUELDOS = ['Hasta $800.000', '$800.000 — $1.500.000', '$1.500.000 — $2.500.000', '$2.500.000 — $4.000.000', 'Más de $4.000.000']

const ORIENTACION_LABELS = {
  N: 'Norte', S: 'Sur', E: 'Oriente', O: 'Poniente',
  NE: 'Nor-Oriente', NO: 'Nor-Poniente',
  SE: 'Sur-Oriente', SO: 'Sur-Poniente',
  P: 'Patio', SP: 'Sin Patio',
}

/** Fetch projects from API with loading/error states */
function useApiProjects() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data, error }) => {
      if (cancelled) return
      setState({ data, loading: false, error })
    })
    return () => { cancelled = true }
  }, [])

  return state
}

export default function CotizadorGeneral() {
  useGsapAnimations()
  const { data: apiProjects, loading: projectsLoading, error: projectsError } = useApiProjects()
  const location = useLocation()
  const navigate = useNavigate()

  const [mode, setMode] = useState('wizard') // 'wizard' | 'directo'
  const [wizardStep, setWizardStep] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)

  // If arriving from RelatedProjects "Cotizar", preselect project + filters
  const navPlanta = location.state?.planta
  const navProyectoId = location.state?.proyecto_id || navPlanta?.proyecto_id || navPlanta?.proyecto?.id
  const autoSelected = useRef(null)
  const sectionRef = useRef(null)

  const scrollToSection = () =>
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Directo mode filters — same as /proyectos
  const [searchParams, setSearchParams] = useSearchParams()

  // Build dynamic filter options from real API data
  const dynamicFilters = useMemo(() => {
    if (!apiProjects) return []
    const comunas = [...new Set(apiProjects.map((p) => (p.comuna || 'Otros').trim()))].sort()
    const tipologias = [...new Set(
      apiProjects.flatMap((p) => (p.tipologias || []).map((t) => t.programa).filter((t) => t && t !== 'LOCAL'))
    )].sort()
    const precios = apiProjects.map((p) => p.precio_desde).filter(Boolean)
    const minUF = Math.floor(Math.min(...precios) / 1000) * 1000
    const maxUF = Math.ceil(Math.max(...precios) / 1000) * 1000
    const rangos = []
    for (let lo = minUF; lo < maxUF; lo += 2000) {
      const hi = lo + 2000
      rangos.push(`${lo.toLocaleString('es-CL')}-${hi.toLocaleString('es-CL')} UF`)
    }
    rangos.push(`${maxUF.toLocaleString('es-CL')}+ UF`)
    return [
      { id: 'ubicacion', label: 'Ubicación', options: comunas },
      { id: 'tipo', label: 'Tipología', options: tipologias },
      { id: 'precio', label: 'Precio UF', options: rangos },
    ]
  }, [apiProjects])

  const filteredGroups = useMemo(() => {
    if (!apiProjects) return []
    const ubicacion = searchParams.get('ubicacion')
    const tipo = searchParams.get('tipo')
    const precio = searchParams.get('precio')

    // Filter raw projects before grouping
    const filtered = apiProjects.filter((p) => {
      if (ubicacion && !(p.comuna || 'Otros').trim().toLowerCase().includes(ubicacion.toLowerCase())) return false
      if (tipo && !(p.tipologias || []).some((t) => t.programa === tipo)) return false
      if (precio) {
        const uf = p.precio_desde || 0
        if (precio.endsWith('+ UF')) {
          const min = parseInt(precio.replace(/[^\d]/g, ''), 10)
          if (uf < min) return false
        } else {
          const [lo, hi] = precio.replace(' UF', '').split('-').map((s) => parseInt(s.replace(/\./g, ''), 10))
          if (uf < lo || uf >= hi) return false
        }
      }
      return true
    })

    let groups = groupByComuna(filtered)
    groups.forEach((g) => g.projects.sort((a, b) => a.name.localeCompare(b.name)))
    return groups
  }, [apiProjects, searchParams])

  const hasFilters = mode === 'directo' && [...searchParams.keys()].length > 0

  // Auto-select project + scroll when arriving from RelatedProjects "Cotizar"
  useEffect(() => {
    if (!navPlanta) return
    // Always scroll, even if it's the same planta
    requestAnimationFrame(scrollToSection)
    // Only re-select if it's a different planta or projects just loaded
    if (apiProjects && autoSelected.current !== navPlanta.id) {
      autoSelected.current = navPlanta.id
      const match = apiProjects.find((p) => String(p.id) === String(navProyectoId))
      if (match) {
        setSelectedProject(match)
        setMode('directo')
        // Clear location.state so 'Volver' shows wizard, not stuck loading fallback
        navigate('/cotizador', { replace: true, state: {} })
      }
    }
  }, [navPlanta, navProyectoId, apiProjects, navigate])

  // Build initial filters from the selected planta
  const initialFilters = useMemo(() => {
    if (!navPlanta) return null
    return {
      tipologia: navPlanta.programa || '',
      producto: navPlanta.tipo_producto || '',
      piso: navPlanta.piso ? String(navPlanta.piso) : '',
      planta: navPlanta.name?.charAt(0) || '',
    }
  }, [navPlanta])

  // GSAP wizard step animation
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  const stepRef = useRef(null)
  const prevStepRef = useRef(0)
  useEffect(() => {
    if (!isLoaded || !stepRef.current) return
    const dir = wizardStep >= prevStepRef.current ? 1 : -1
    prevStepRef.current = wizardStep
    const items = stepRef.current.children
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { opacity: 0, x: 60 * dir, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
      )
    }, stepRef)
    return () => ctx.revert()
  }, [wizardStep, isLoaded])

  // Wizard selections — pasos 1,3,4 son multi-selección
  const [wLugar, setWLugar] = useState([])
  const [wSueldo, setWSueldo] = useState('')
  const [wTipologia, setWTipologia] = useState([])
  const [wOrientacion, setWOrientacion] = useState([])

  const toggleMulti = (arr, setter, val) =>
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])

  const wizardIconRef = useRef(null)
  const directoIconRef = useRef(null)

  const lugares = useMemo(() => {
    if (!apiProjects) return []
    return [...new Set(apiProjects.map((p) => (p.comuna || 'Otros').trim()).filter(Boolean))]
  }, [apiProjects])

  // Fetch all plantas once to extract real tipologías + orientaciones for wizard
  const [wizardData, setWizardData] = useState({ tipologias: [], orientaciones: [] })
  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/plantas?disponible=1&perPage=100').then(({ data, error }) => {
      if (cancelled || error || !Array.isArray(data)) return
      const tipologias = [...new Set(data.map((p) => p.programa).filter(Boolean))].sort()
      const orientaciones = [...new Set(
        data.map((p) => p.orientacion).filter(Boolean)
            .map((code) => ORIENTACION_LABELS[code] || code)
      )].sort()
      setWizardData({ tipologias, orientaciones })
    })
    return () => { cancelled = true }
  }, [])

  // Build cotizador data — usa la estructura completa del INN como template
  const buildCotizadorData = useCallback((p) => {
    if (!p) return null
    const imgBase = `${import.meta.env.BASE_URL}images/inn/planta/`
    return {
      title: `Cotiza tu próximo depto en <span class="text-danger">${p.name}</span>`,
      filters: {
        row1: [
          { label: 'Todas las tipologías', options: ['2D+2B', '2D+3B', '3D+2B', '3D+3B', '3D+4B', '4D+4B'] },
          { label: 'Todos los tipos de producto', options: ['Departamento'] },
        ],
        row2: [
          { label: 'Todos los pisos', options: ['Piso 1-5', 'Piso 6-10', 'Piso 11+'] },
          { label: 'Todas las plantas', options: ['Planta A', 'Planta B', 'Planta C'] },
        ],
      },
      mapCaption: 'Esquicio',
      mapImage: `${import.meta.env.BASE_URL}images/inn/esquicio.jpg`,
      floorPlan: {
        thumbnails: [
          `${imgBase}planta.jpg`,
          `${imgBase}Cocina-Comedor-1.jpg`,
          `${imgBase}Comedor-2.jpg`,
          `${imgBase}Hall-de-acceso.jpg`,
          `${imgBase}Living-Comedor-2.jpg`,
          `${imgBase}Living-Comedor-3.jpg`,
        ],
      },
      details: [
        { icon: 'layers', label: 'Planta', value: '110' },
        { icon: 'expand', label: 'Superficie útil', value: '85,57 m²' },
        { icon: 'home', label: 'Dorm + Baño', value: '3 dorm + 2 baño' },
        { icon: 'sun', label: 'Terraza', value: '15,45 m²' },
        { icon: 'compass', label: 'Orientación', value: 'O' },
        { icon: 'maximize', label: 'Superficie total', value: '150,08 m²' },
      ],
      actions: ['Descargar Brochure', 'Vistas por piso'],
      pricing: {
        label: 'Precios desde',
        price: p.price || 'UF 9.816',
        shareLabel: 'Compartir',
      },
      ctaText: 'Cotizar',
    }
  }, [])

  // Build cotizador data from selected project
  const cotizadorData = useMemo(
    () => buildCotizadorData(selectedProject),
    [selectedProject, buildCotizadorData],
  )

  const wizardSteps = ['Lugar', 'Sueldo', 'Tipología', 'Orientación']

  const canAdvance = [wLugar.length, wSueldo, wTipologia.length, wOrientacion.length][wizardStep]

  const resetWizard = () => {
    setWizardStep(0)
    setWLugar([])
    setWSueldo('')
    setWTipologia([])
    setWOrientacion([])
    setSelectedProject(null)
  }

  const handleWizardFinish = () => {
    // Pick first project matching any selected lugar
    const match = apiProjects?.find((p) => wLugar.includes((p.comuna || 'Otros').trim()))
    setSelectedProject(match || apiProjects?.[0] || null)
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="lb-proj-hero container position-relative d-flex align-items-end lb-radius-bl lb-radius-br">
          <div className="lb-proj-hero-bg-wrap lb-radius-bl lb-radius-br">
            <img src={images.proyectosHero} alt="" className="lb-proj-hero-bg" />
            <div className="lb-proj-hero-overlay" />
          </div>
          <ScrollAnim as="div" className="position-relative d-flex flex-column gap-3 lb-proj-hero-content" animation="fade-up" stagger={0.12}>
            <div className="d-flex align-items-center gap-2">
              <img src={images.line} alt="" width="32" height="0" />
              <span className="lb-eyebrow">{cotizadorHero.eyebrow}</span>
            </div>
            <h1 className="mb-0 lb-proj-hero-title">{cotizadorHero.title}</h1>
            <p className="mb-0 lb-proj-hero-subtitle">{cotizadorHero.subtitle}</p>
          </ScrollAnim>
        </section>

        <section className="lb-cot-gen container py-5" ref={sectionRef}>
          {/* Mode toggle */}
          <div className="d-flex justify-content-center gap-3 mb-5">
            <button
              className={`btn ${mode === 'wizard' ? 'btn-dark' : 'btn-outline-dark'} lb-cot-gen-toggle-btn d-inline-flex align-items-center gap-2`}
              onClick={() => { setMode('wizard'); resetWizard(); scrollToSection() }}
              onMouseEnter={() => wizardIconRef.current?.startAnimation?.()}
              onMouseLeave={() => wizardIconRef.current?.stopAnimation?.()}
            >
              <SparklesIcon ref={wizardIconRef} size={20} className="d-inline-flex" />
              Asistente Guiado
            </button>
            <button
              className={`btn ${mode === 'directo' ? 'btn-dark' : 'btn-outline-dark'} lb-cot-gen-toggle-btn d-inline-flex align-items-center gap-2`}
              onClick={() => { setMode('directo'); setSelectedProject(null); scrollToSection() }}
              onMouseEnter={() => directoIconRef.current?.startAnimation?.()}
              onMouseLeave={() => directoIconRef.current?.stopAnimation?.()}
            >
              <LayoutGridIcon ref={directoIconRef} size={20} className="d-inline-flex" />
              Selección Directa
            </button>
          </div>

          {/* WIZARD MODE */}
          {mode === 'wizard' && !selectedProject && !navProyectoId && (
            <div className="lb-cot-gen-wizard mx-auto" style={{ maxWidth: '42rem' }}>
              {/* Step indicator */}
              <div className="d-flex justify-content-center gap-2 mb-4">
                {wizardSteps.map((s, i) => (
                  <div key={s} className="d-flex align-items-center gap-2">
                    <span className={`lb-cot-gen-step-dot ${i <= wizardStep ? 'active' : ''}`}>{i + 1}</span>
                    <span className={`lb-cot-gen-step-label d-none d-sm-inline ${i <= wizardStep ? 'active' : ''}`}>{s}</span>
                    {i < wizardSteps.length - 1 && <span className="lb-cot-gen-step-line" />}
                  </div>
                ))}
              </div>

              <div className="card lb-cot-gen-wizard-card lb-shadow-down rounded-4 overflow-hidden">
                <div className="lb-cot-gen-wizard-img-wrap">
                  <img
                    src={images.projInn}
                    alt="Asistente de cotización"
                    className="lb-cot-gen-wizard-img"
                    loading="lazy"
                  />
                  <div className="lb-cot-gen-wizard-img-overlay" />
                </div>
                <div className="card-body p-4 p-md-5">
                  {/* Step 0: Lugar */}
                  {wizardStep === 0 && (
                    <div ref={stepRef}>
                      <h3 className="mb-1">¿Dónde te gustaría vivir?</h3>
                      <p className="text-muted mb-4">Selecciona la zona o comuna de tu preferencia.</p>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {projectsLoading ? (
                          <p className="text-muted">Cargando proyectos…</p>
                        ) : projectsError ? (
                          <p className="text-danger small">{projectsError}. Reintentar en unos segundos.</p>
                        ) : lugares.length === 0 ? (
                          <p className="text-muted">No hay proyectos disponibles.</p>
                        ) : lugares.map((l) => (
                          <button
                            key={l}
                            className={`btn ${wLugar.includes(l) ? 'btn-danger' : 'btn-outline-secondary'} rounded-pill`}
                            onClick={() => toggleMulti(wLugar, setWLugar, l)}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Sueldo */}
                  {wizardStep === 1 && (
                    <div ref={stepRef}>
                      <h3 className="mb-1">¿Cuál es tu rango de renta?</h3>
                      <p className="text-muted mb-4">Esto nos ayuda a filtrar proyectos acordes a tu presupuesto.</p>
                      <div className="d-flex flex-column gap-2">
                        {SUELDOS.map((s) => (
                          <button
                            key={s}
                            className={`btn ${wSueldo === s ? 'btn-danger' : 'btn-outline-secondary'} text-start`}
                            onClick={() => setWSueldo(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Tipología */}
                  {wizardStep === 2 && (
                    <div ref={stepRef}>
                      <h3 className="mb-1">¿Cuántos dormitorios necesitas?</h3>
                      <p className="text-muted mb-4">Puedes elegir una o varias. La orientación afecta la luz natural y temperatura.</p>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {wizardData.tipologias.length === 0 ? (
                          <p className="text-muted">Cargando tipologías…</p>
                        ) : wizardData.tipologias.map((t) => (
                          <button
                            key={t}
                            className={`btn ${wTipologia.includes(t) ? 'btn-danger' : 'btn-outline-secondary'} rounded-pill`}
                            onClick={() => toggleMulti(wTipologia, setWTipologia, t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Orientación */}
                  {wizardStep === 3 && (
                    <div ref={stepRef}>
                      <h3 className="mb-1">¿Qué orientación prefieres?</h3>
                      <p className="text-muted mb-4">Puedes elegir una o varias orientaciones.</p>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {wizardData.orientaciones.length === 0 ? (
                          <p className="text-muted">Cargando orientaciones…</p>
                        ) : wizardData.orientaciones.map((o) => (
                          <button
                            key={o}
                            className={`btn ${wOrientacion.includes(o) ? 'btn-danger' : 'btn-outline-secondary'} rounded-pill`}
                            onClick={() => toggleMulti(wOrientacion, setWOrientacion, o)}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nav buttons */}
                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <button
                      className="btn btn-link text-decoration-none text-muted"
                      onClick={() => wizardStep === 0 ? resetWizard() : setWizardStep(wizardStep - 1)}
                    >
                      ← {wizardStep === 0 ? 'Cancelar' : 'Atrás'}
                    </button>
                    {wizardStep < wizardSteps.length - 1 ? (
                      <button
                        className="btn btn-dark px-4"
                        disabled={!canAdvance}
                        onClick={() => setWizardStep(wizardStep + 1)}
                      >
                        Siguiente →
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger px-4"
                        disabled={!canAdvance}
                        onClick={handleWizardFinish}
                      >
                        Ver resultados ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIRECTO MODE — grouped by comuna, same as /proyectos */}
          {mode === 'directo' && !selectedProject && !navProyectoId && (
            <div className="lb-cot-gen-grid">
              {projectsLoading ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="col"><ProjectCardSkeleton /></div>
                  ))}
                </div>
              ) : projectsError ? (
                <div className="text-center py-5">
                  <p className="text-danger mb-2">No se pudieron cargar los proyectos.</p>
                  <p className="text-muted small mb-0">{projectsError}</p>
                  <button className="btn btn-outline-dark btn-sm mt-3" onClick={() => window.location.reload()}>
                    Reintentar
                  </button>
                </div>
              ) : !apiProjects || apiProjects.length === 0 ? (
                <p className="text-center text-muted py-5">No hay proyectos disponibles.</p>
              ) : (
                <>
                  {hasFilters && (
                    <div className="d-flex align-items-center justify-content-end mb-3">
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                        onClick={() => setSearchParams()}
                      >
                        Resetear filtros
                      </button>
                    </div>
                  )}
                  {/* Filter bar */}
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between lb-filter-bar bg-white rounded-3 shadow-sm p-3 mb-4">
                    <div className="d-flex flex-wrap gap-2 align-items-center flex-fill">
                      {dynamicFilters.map((f) => (
                        <select
                          key={f.id}
                          className="form-select form-select-sm border-0 bg-transparent"
                          style={{ width: 'auto' }}
                          value={searchParams.get(f.id) || ''}
                          onChange={(e) => {
                            const next = new URLSearchParams(searchParams)
                            if (e.target.value) next.set(f.id, e.target.value)
                            else next.delete(f.id)
                            setSearchParams(next)
                          }}
                        >
                          <option value="">{f.label}</option>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                  {filteredGroups.map((group, gi) => (
                    <div className="d-flex flex-column gap-4 mb-4" key={group.zone}>
                      <ScrollAnim as="div" className="d-flex align-items-center justify-content-between" animation="fade-right" delay={gi * 0.1}>
                        <h2 className="mb-0 lb-group-zone">{group.zone}</h2>
                      </ScrollAnim>
                      <ScrollAnim as="div" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" animation="fade-up" stagger={0.15} delay={0.1}>
                        {group.projects.map((project) => (
                          <div key={project.name} className="col">
                            <ProjectCard
                              project={project}
                              onClick={(p) => setSelectedProject(p._raw)}
                              ctaLabel="Cotizar"
                            />
                          </div>
                        ))}
                      </ScrollAnim>
                    </div>
                  ))}
                  {filteredGroups.length === 0 && (
                    <p className="text-center text-muted py-5">No se encontraron proyectos con los filtros seleccionados.</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* LOADING FALLBACK — arriving from RelatedProjects, waiting for project match */}
          {navProyectoId && !selectedProject && (
            <div className="lb-cot-gen-grid">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col"><ProjectCardSkeleton /></div>
                ))}
              </div>
            </div>
          )}

          {/* COTIZADOR RESULT */}
          {selectedProject && cotizadorData && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="mb-0">Tu cotización: {selectedProject.name}</h2>
                <button className="btn btn-outline-dark btn-sm" onClick={() => { setSelectedProject(null); resetWizard() }}>
                  ← Volver
                </button>
              </div>
              <Cotizador data={cotizadorData} apiId={selectedProject.id} initialFilters={initialFilters} />
              <RelatedProjects
                data={{
                  eyebrow: `Alternativas a ${selectedProject.name} • ${selectedProject.comuna || ''}`.trim(),
                  title: 'Proyectos similares que te pueden interesar',
                  apiId: selectedProject.id,
                  projectName: selectedProject.name,
                }}
              />
              <div className="text-center mt-4">
                <Link to="/proyectos" className="btn btn-outline-dark px-4">
                  Ver todos los proyectos
                </Link>
              </div>
            </div>
          )}
        </section>

        <ValueProps />
      </main>
      <Footer />
    </>
  )
}
