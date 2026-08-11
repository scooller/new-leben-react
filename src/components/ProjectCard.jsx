import { Link } from 'react-router-dom'
import { images } from '../data/content.js'

/**
 * Reusable project card — Bootstrap card structure.
 * Used in Proyectos listing and anywhere a project preview card is needed.
 * @param {object} project - { image, location, name, entrega, tipologia, equipacion?, price, slug? }
 * @param {string} [to]      - override link target
 * @param {string} [className] - extra classes on the card root
 */
export default function ProjectCard({ project, to, onClick, ctaLabel = 'Ver Proyecto', className = '' }) {
  const link = to || `/proyectos/${project.slug || project.name.toLowerCase().replace(/\s+/g, '-').replace(/edificio-/i, '')}`

  // Support both key-based images (from content.js) and full URL paths (from projects.js)
  const imgSrc = typeof project.image === 'string' && (project.image.startsWith('http') || project.image.startsWith('/'))
    ? project.image
    : images[project.image]

  const CardTag = onClick ? 'button' : Link
  const cardProps = onClick ? { onClick: () => onClick(project) } : { to: link }

  return (
    <CardTag {...cardProps} className={`card lb-proj-card h-100 text-decoration-none ${className}`}>
      {imgSrc && (
        <div className="lb-proj-img-wrap position-relative">
          <img src={imgSrc} alt={project.name} className="card-img-top lb-proj-img" loading="lazy" />
          {project.entrega && (
            <span className="badge bg-danger lb-proj-badge position-absolute top-0 start-0 m-2">
              {project.entrega}
            </span>
          )}
        </div>
      )}
      <div className="card-body p-4 d-flex flex-column gap-2">
        <h3 className="card-title mb-0 lb-proj-name">{project.name}</h3>
        {project.location && <span className="lb-location">{project.location}</span>}
        <div className="d-flex flex-column gap-1 mt-1">
          {project.tipologia && (
            <span className="lb-proj-info text-muted small">{project.tipologia}</span>
          )}
          <span className="lb-proj-price small fw-semibold">
            Desde {project.precioDesde || 'UF 0'}
          </span>
        </div>
      </div>
      <div className="card-footer lb-proj-bottom d-flex align-items-center justify-content-end p-4">
        <div className="lb-explore d-flex align-items-center gap-1">
          <span>{ctaLabel}</span>
          <img src={images.arrowRight} alt="" width="14" height="14" />
        </div>
      </div>
    </CardTag>
  )
}
