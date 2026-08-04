import { Link } from 'react-router-dom'
import { images } from '../data/content.js'

/**
 * Reusable project card — Bootstrap card structure.
 * Used in Proyectos listing and anywhere a project preview card is needed.
 * @param {object} project - { image, location, name, entrega, tipologia, equipacion?, price, slug? }
 * @param {string} [to]      - override link target
 * @param {string} [className] - extra classes on the card root
 */
export default function ProjectCard({ project, to, className = '' }) {
  const link = to || `/proyectos/${project.slug || project.name.toLowerCase().replace(/\s+/g, '-').replace(/edificio-/i, '')}`

  // Support both key-based images (from content.js) and full URL paths (from projects.js)
  const imgSrc = typeof project.image === 'string' && project.image.startsWith('/')
    ? project.image
    : images[project.image]

  return (
    <Link to={link} className={`card lb-proj-card h-100 text-decoration-none ${className}`}>
      {imgSrc && <img src={imgSrc} alt={project.name} className="card-img-top lb-proj-img" loading="lazy" />}
      <div className="card-body p-4 d-flex flex-column gap-2">
        <span className="lb-location">{project.location}</span>
        <h3 className="card-title mb-0 lb-proj-name">{project.name}</h3>
        <p className="card-text mb-0 lb-proj-meta">
          <span>Entrega: </span>
          <strong>{project.entrega}</strong>
          {'     '}
          <span>Tipología: </span>
          <strong>{project.tipologia}</strong>
          {project.equipacion && (
            <>
              {'     '}
              <span>Equipación: </span>
              <strong>{project.equipacion}</strong>
            </>
          )}
        </p>
      </div>
      <div className="card-footer lb-proj-bottom d-flex align-items-center justify-content-between p-4">
        <div className="d-flex flex-column">
          <span className="lb-price-label">Desde</span>
          <span className="lb-price-value">{project.price}</span>
        </div>
        <div className="lb-explore d-flex align-items-center gap-1">
          <span>Ver Proyecto</span>
          <img src={images.arrowRight} alt="" width="14" height="14" />
        </div>
      </div>
    </Link>
  )
}
