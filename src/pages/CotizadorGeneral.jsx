import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
import Alternatives from '../components/proyecto/Alternatives.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectCardSkeleton from '../components/ProjectCardSkeleton.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'
import { groupByComuna } from '../lib/projectUtils.js'
import { getProjectBySlug } from '../data/projects.js'

const COTIZADOR_DATA = {
  title: getProjectBySlug('inn')?.cotizador?.title || 'Cotiza tu próximo departamento',
  filters: { row1: [], row2: [] },
  mapCaption: getProjectBySlug('inn')?.cotizador?.mapCaption || '',
  mapImage: getProjectBySlug('inn')?.cotizador?.mapImage || null,
  floorPlan: getProjectBySlug('inn')?.cotizador?.floorPlan || { thumbnails: [] },
  details: [],
  pricing: { label: getProjectBySlug('inn')?.cotizador?.pricing?.label || 'Precios desde', price: '—', shareLabel: 'Compartir' },
  ctaText: getProjectBySlug('inn')?.cotizador?.ctaText || 'Cotizar',
}

/** Fetch projects from API */
function useApiProjects() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data: all, error }) => {
      if (cancelled) return
      if (error || !Array.isArray(all)) {
        setState({ data: null, loading: false, error })
        return
      }
      setState({ data: all, loading: false, error: null })
    })
    return () => { cancelled = true }
  }, [])

  return state
}

/** Build dynamic filter options from real API data */
function useDynamicFilters(rawProjects) {
  return useMemo(() => {
    if (!rawProjects) return []
    const comunas = [...new Set(rawProjects.map((p) => (p.comuna || 'Otros').trim()))].sort()
    const tipologias = [...new Set(
      rawProjects.flatMap((p) => (p.tipologias || []).map((t) => t.programa).filter((t) => t && t !== 'LOCAL'))
    )].sort()
    const precios = rawProjects.map((p) => p.precio_desde).filter(Boolean)
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
  }, [rawProjects])
}

/** Filter raw projects by searchParams, then group by comuna */
function useFilteredGroups(searchParams, rawProjects) {
  return useMemo(() => {
    const ubicacion = searchParams.get('ubicacion')
    const tipo = searchParams.get('tipo')
    const precio = searchParams.get('precio')

    const filtered = (rawProjects || []).filter((p) => {
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

    const groups = groupByComuna(filtered)
    groups.forEach((g) => g.projects.sort((a, b) => a.name.localeCompare(b.name)))
    return groups
  }, [searchParams, rawProjects])
}

export default function CotizadorGeneral() {
  useGsapAnimations()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: rawProjects, loading: projectsLoading, error: projectsError } = useApiProjects()
  const dynamicFilters = useDynamicFilters(rawProjects)
  const filteredGroups = useFilteredGroups(searchParams, rawProjects)
  const hasFilters = [...searchParams.keys()].length > 0

  const [activeProject, setActiveProject] = useState(null)
  const [externalPlanta, setExternalPlanta] = useState(null)

  const handleProjectChange = useCallback((p) => setActiveProject(p), [])
  const handleCotizarPlanta = useCallback((planta) => setExternalPlanta(planta), [])

  return (
    <>
      <Navbar />
      <main>
        <section className="lb-cot-gen container-fluid px-0">
          <Cotizador data={COTIZADOR_DATA} universal showHeroPanel projects={rawProjects} onProjectChange={handleProjectChange} selection={externalPlanta ? { planta: externalPlanta } : undefined} />

          {activeProject && (
            <>
              <RelatedProjects
                data={{
                  eyebrow: `Alternativas en `.trim(),
                  highlight: activeProject.comuna || '',
                  title: 'Proyectos similares que te pueden interesar',
                  apiId: activeProject.id,
                  comuna: activeProject.comuna,
                  projectName: activeProject.name,
                }}
                onCotizar={handleCotizarPlanta}
              />
              <Alternatives data={{ excludeName: activeProject.name }} />
            </>
          )}
        </section>

        {/* Main Projects */}
        <section className="lb-featured container-fluid" id="proyectos">
          <div className="container d-flex flex-column gap-5">
            {hasFilters && (
              <div className="d-flex align-items-center justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                  onClick={() => setSearchParams({})}
                >
                  Resetear filtros
                </button>
              </div>
            )}
            {/* Filter bar */}
            <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between lb-filter-bar bg-white rounded-3 shadow-sm p-3">
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
            {projectsLoading ? (
              /* Skeleton grid while API loads */
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col">
                    <ProjectCardSkeleton />
                  </div>
                ))}
              </div>
            ) : projectsError ? (
              <div className="text-center py-5">
                <p className="text-danger mb-3">No se pudieron cargar los proyectos.</p>
                <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>Reintentar</button>
              </div>
            ) : (
              <>
                {filteredGroups.map((group, gi) => (
                  <div className="d-flex flex-column gap-4" key={group.zone}>
                    <ScrollAnim as="div" className="d-flex align-items-center justify-content-between" animation="fade-right" delay={gi * 0.1}>
                      <h2 className="mb-0 lb-group-zone">{group.zone}</h2>
                    </ScrollAnim>

                    <ScrollAnim as="div" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" animation="fade-up" stagger={0.15} delay={0.1}>
                      {group.projects.map((project) => (
                        <div key={project.name} className="col">
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </ScrollAnim>
                  </div>
                ))}
              </>
            )}
            {!projectsLoading && !projectsError && filteredGroups.length === 0 && (
              <p className="text-center text-muted py-5">No se encontraron proyectos con los filtros seleccionados.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

