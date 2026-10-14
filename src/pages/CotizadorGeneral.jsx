import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
// import Alternatives from '../components/proyecto/Alternatives.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import ProjectsCatalog from '../components/sections/ProjectsCatalog.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'

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

export default function CotizadorGeneral() {
  useGsapAnimations()
  const { data: rawProjects, loading: projectsLoading, error: projectsError } = useApiProjects()

  const [activeProject, setActiveProject] = useState(null)
  const [externalPlanta, setExternalPlanta] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const scroll = () => {
      if (id === 'cotizador-gral') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return true
      }
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }
      return false
    }
    if (!scroll()) {
      const t1 = setTimeout(scroll, 150)
      const t2 = setTimeout(scroll, 450)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [location.hash])

  const handleProjectChange = useCallback((p) => setActiveProject(p), [])
  const handleCotizarPlanta = useCallback((planta) => setExternalPlanta(planta), [])

  return (
    <>
      <Navbar />
      <main className="lb-cot-gen" id="cotizador-gral">
        {/* Banner encima del cotizador */}
        <section className="lb-cot-gen-banner position-relative">
          <div className="lb-cot-gen-banner__bg" />
          <div className="lb-cot-gen-banner__overlay" />
          <div className="container position-relative lb-cot-gen-banner__content">
            <ScrollAnim animation="fade-up">
              <span className="lb-cot-gen-banner__eyebrow">COTIZADOR ONLINE</span>
              <h1 className="lb-cot-gen-banner__title">Encuentra tu espacio ideal en simples pasos</h1>
              {/* <p className="lb-cot-gen-banner__subtitle">
                Encuentra tu espacio ideal y simula tu cotización en línea en simples pasos
              </p> */}
            </ScrollAnim>
          </div>
          <div className="lb-cot-gen-banner__arrow" aria-hidden="true" />
        </section>

        {/* Cotizador en container tal como en Inn.jsx */}
        <Cotizador
          universal
          projects={rawProjects}
          onProjectChange={handleProjectChange}
          selection={externalPlanta ? { planta: externalPlanta } : undefined}
        />

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
            {/* <Alternatives data={{ excludeName: activeProject.name }} /> */}
          </>
        )}

        {/* Main Projects Catalog */}
        <hr />
        <ProjectsCatalog
          id="proyectos"
          projects={rawProjects}
          loading={projectsLoading}
          error={projectsError}
          groupByZone={false}
        />
      </main>
      <Footer />
    </>
  )
}

