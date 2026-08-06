import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadProject } from '../store/slices/projectSlice.js'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'

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
  useGsapAnimations()
  const { slug } = useParams()
  const dispatch = useDispatch()
  const project = useSelector((s) => s.project.project)
  const notFound = useSelector((s) => s.project.notFound)

  useEffect(() => {
    if (slug) dispatch(loadProject(slug))
  }, [slug, dispatch])

  if (notFound || !project) {
    return (
      <>
        <Navbar />
        <main className="container text-center py-5">
          <h1 className="display-6 mb-3">Proyecto no encontrado</h1>
          <p className="text-muted">El proyecto "{slug}" no existe o ha sido removido.</p>
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
        <ProjectTabs tabs={project.tabs} />
        <ProjectOverview data={project.overview} />
        <FloorPlans data={project.floorPlans} />
        <Vista360 data={project.vista360} />
        <Cotizador data={project.cotizador} />
        <RelatedProjects data={project.relatedProjects} />
        <Alternatives data={project.alternatives} />
        <SpacesGallery data={project.spacesGallery} />
        <LocationSection data={project.location} />
        <BottomGallery images={project.bottomGallery} />
        <TeamAgents data={project.team} />
      </main>
      <Footer />
    </>
  )
}
