import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects.js'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { apiFetch } from '../lib/apiFetch.js'
import { mapApiProject } from '../lib/projectUtils.js'

import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

import ProjectHero from '../components/proyecto/ProjectHero.jsx'
import ProjectTabs from '../components/proyecto/ProjectTabs.jsx'
import ProjectOverview from '../components/proyecto/ProjectOverview.jsx'
import FloorPlans from '../components/proyecto/FloorPlans.jsx'
import Vista360 from '../components/proyecto/Vista360.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
import Alternatives from '../components/proyecto/Alternatives.jsx'
import SpacesGallery from '../components/proyecto/SpacesGallery.jsx'
import LocationSection from '../components/proyecto/LocationSection.jsx'
import BottomGallery from '../components/proyecto/BottomGallery.jsx'
import TeamAgents from '../components/proyecto/TeamAgents.jsx'

export default function ProyectoDetalle() {
  const { slug } = useParams()
  const project = useMemo(() => getProjectBySlug(slug), [slug])
  const [apiProject, setApiProject] = useState(null)

  useEffect(() => {
    if (!project) return
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled || !Array.isArray(data)) return
      const found = data.find((p) => p.id === project.apiId || (p.name && project.name && p.name.toLowerCase() === project.name.toLowerCase()))
      if (found) setApiProject(found)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [project])

  const dynamicTabs = useMemo(() => {
    if (!project?.tabs) return []
    if (!apiProject) return project.tabs
    const mapped = mapApiProject(apiProject)
    return project.tabs.map((tab) =>
      tab.id === 'precio' ? { ...tab, value: mapped.precioDesde || tab.value } : tab
    )
  }, [project?.tabs, apiProject])

  useGsapAnimations([project])

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="container text-center py-5">
          <h1 className="display-6 mb-3">Proyecto no encontrado</h1>
          <p className="text-muted">El proyecto &ldquo;{slug}&rdquo; no existe o ha sido removido.</p>
          <a href="/proyectos" className="btn btn-outline-primary mt-3">Volver a proyectos</a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <ProjectHero data={project.hero} />
        <ProjectTabs tabs={dynamicTabs} />
        <ProjectOverview data={project.overview} />
        <FloorPlans data={project.floorPlans} />
        <Vista360 data={project.vista360} />
        <Cotizador data={project.cotizador} />
        <RelatedProjects data={{ ...project.relatedProjects, apiId: project.apiId, projectName: project.name }} />
        <Alternatives data={{ ...project.alternatives, excludeName: project.name }} />
        <SpacesGallery data={project.spacesGallery} />
        <LocationSection data={project.locationInfo} />
        <BottomGallery images={project.bottomGallery} />
        <TeamAgents data={project.team} apiId={project.apiId} />
      </main>
      <Footer />
    </>
  )
}
