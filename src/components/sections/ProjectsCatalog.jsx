import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ScrollAnim from '../ScrollAnim.jsx'
import ProjectCard from '../ProjectCard.jsx'
import ProjectCardSkeleton from '../ProjectCardSkeleton.jsx'
import { apiFetch } from '../../lib/apiFetch.js'
import { groupByComuna, mapApiProject } from '../../lib/projectUtils.js'

/** Fetch raw projects from API when not supplied by parent */
function useInternalApiProjects(enabled) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null })

  useEffect(() => {
    if (!enabled) return
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
  }, [enabled])

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

/** Filter raw projects by searchParams and optionally group by comuna/zone */
function useFilteredProjects(searchParams, rawProjects, groupByZone) {
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

    if (groupByZone) {
      const groups = groupByComuna(filtered)
      groups.forEach((g) => g.projects.sort((a, b) => a.name.localeCompare(b.name)))
      return { groups, flat: [], count: filtered.length }
    }

    const flat = filtered
      .map(mapApiProject)
      .sort((a, b) => {
        const comp = (a.comuna || '').localeCompare(b.comuna || '', 'es', { sensitivity: 'base' })
        if (comp !== 0) return comp
        return (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' })
      })

    return { groups: [], flat, count: flat.length }
  }, [searchParams, rawProjects, groupByZone])
}

export default function ProjectsCatalog({
  projects: externalProjects,
  loading: externalLoading,
  error: externalError,
  groupByZone = true,
  id = 'proyectos',
  className = '',
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const internalFetch = useInternalApiProjects(!externalProjects)

  const rawProjects = externalProjects ?? internalFetch.data
  const projectsLoading = externalLoading ?? (externalProjects ? false : internalFetch.loading)
  const projectsError = externalError ?? internalFetch.error

  const dynamicFilters = useDynamicFilters(rawProjects)
  const { groups: filteredGroups, flat: filteredFlat, count: filteredCount } = useFilteredProjects(
    searchParams,
    rawProjects,
    groupByZone
  )
  const hasFilters = [...searchParams.keys()].length > 0

  return (
    <section className={`lb-featured container-fluid ${className}`.trim()} id={id}>
      <div className="container d-flex flex-column gap-5">
        {hasFilters && (
          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
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
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : groupByZone ? (
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
        ) : (
          <ScrollAnim as="div" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" animation="fade-up" stagger={0.15} delay={0.1}>
            {filteredFlat.map((project) => (
              <div key={project.name} className="col">
                <ProjectCard project={project} />
              </div>
            ))}
          </ScrollAnim>
        )}

        {!projectsLoading && !projectsError && filteredCount === 0 && (
          <p className="text-center text-muted py-5">No se encontraron proyectos con los filtros seleccionados.</p>
        )}
      </div>
    </section>
  )
}
