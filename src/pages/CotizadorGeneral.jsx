import { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
import Alternatives from '../components/proyecto/Alternatives.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'
import { getProjectBySlug } from '../data/projects.js'

const COTIZADOR_DATA = {
  title: getProjectBySlug('inn')?.cotizador?.title || 'Cotiza tu próximo departamento',
  filters: { row1: [], row2: [] },
  mapCaption: getProjectBySlug('inn')?.cotizador?.mapCaption || '',
  mapImage: getProjectBySlug('inn')?.cotizador?.mapImage || null,
  floorPlan: { thumbnails: [] },
  details: [],
  pricing: { label: getProjectBySlug('inn')?.cotizador?.pricing?.label || 'Precios desde', price: '—', shareLabel: 'Compartir' },
  ctaText: getProjectBySlug('inn')?.cotizador?.ctaText || 'Cotizar',
}

/** Fetch projects from API */
function useApiProjects() {
  const [projects, setProjects] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      setProjects(data)
    })
    return () => { cancelled = true }
  }, [])

  return projects
}

export default function CotizadorGeneral() {
  useGsapAnimations()
  const apiProjects = useApiProjects()
  const [activeProject, setActiveProject] = useState(null)
  const [externalPlanta, setExternalPlanta] = useState(null)

  const handleProjectChange = useCallback((p) => setActiveProject(p), [])
  const handleCotizarPlanta = useCallback((planta) => setExternalPlanta(planta), [])

  return (
    <>
      <Navbar />
      <main>
        <section className="lb-cot-gen container-fluid px-0">
          <Cotizador data={COTIZADOR_DATA} universal projects={apiProjects} onProjectChange={handleProjectChange} externalPlanta={externalPlanta} />

          {activeProject && (
            <>
              <RelatedProjects
                data={{
                  eyebrow: `Alternativas en ${activeProject.comuna || ''}`.trim(),
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
      </main>
      <Footer />
    </>
  )
}

