import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectCardSkeleton from '../components/ProjectCardSkeleton.jsx'
import ValueProps from '../components/sections/ValueProps.jsx'
import { proyectosHero, proyectosCta, images } from '../data/content.js'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'
import { groupByComuna } from '../lib/projectUtils.js'

/** Fetch raw projects from API. */
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

export default function Proyectos() {
  useGsapAnimations()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: rawProjects, loading: projectsLoading, error: projectsError } = useApiProjects()
  const dynamicFilters = useDynamicFilters(rawProjects)
  const filteredGroups = useFilteredGroups(searchParams, rawProjects)
  const hasFilters = [...searchParams.keys()].length > 0

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
              <span className="lb-eyebrow">{proyectosHero.eyebrow}</span>
            </div>
            <h1 className="mb-0 lb-proj-hero-title">{proyectosHero.title}</h1>
            <p className="mb-0 lb-proj-hero-subtitle">{proyectosHero.subtitle}</p>
            <button className="btn btn-outline-light lb-proj-hero-btn">{proyectosHero.ctaText}</button>
          </ScrollAnim>
        </section>

        {/* Featured Projects */}
        <section className="lb-featured container-fluid" id="proyectos">
          <div className="container d-flex flex-column gap-5">
          {hasFilters && (
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={() => setSearchParams()}
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

        {/* Value Props */}
        <ValueProps />

        {/* CTA Banner */}
        <section className="lb-proj-cta container-fluid d-flex flex-column align-items-center gap-5" animation="fade-up" duration={1} style={{ '--lb-cta-bg': `url(${images.proyectosCta})` }}>
          <div className="container position-relative d-flex flex-column align-items-center gap-5">
            <div className="lb-proj-cta-bg-wrap position-relative h-100 p-4 rounded-4">
              <ScrollAnim as="div" className="position-relative d-flex flex-column align-items-center gap-3 text-center" style={{ zIndex: 1 }} animation="fade-in" duration={1}>            
                <span className="lb-vprops-eyebrow">{proyectosCta.eyebrow}</span>
                <h2 className="mb-0 lb-proj-cta-title">{proyectosCta.title}</h2>
                <p className="mb-0 lb-proj-cta-subtitle">{proyectosCta.subtitle}</p>
              </ScrollAnim>
              <form className="position-relative d-flex flex-column gap-3 lb-proj-cta-form" style={{ zIndex: 1 }} onSubmit={(e) => e.preventDefault()}>
                <div className="d-flex flex-column flex-md-row gap-3 my-4">
                  <input
                    type="email"
                    className="form-control border-0 lb-proj-cta-input"
                    placeholder={proyectosCta.inputPlaceholder}
                  />
                  <button type="submit" className="btn btn-danger lb-proj-cta-btn">{proyectosCta.buttonText}</button>
                </div>
                <div className="d-flex flex-column gap-2 mt-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="projCtaTerms" required />
                    <label className="form-check-label lb-price-label" htmlFor="projCtaTerms">
                      He leído los términos y condiciones y los acepto
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="projCtaData" required />
                    <label className="form-check-label lb-price-label" htmlFor="projCtaData">
                      Acepto que usen mis datos para contactarme y marketing
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
