/**
 * Skeleton placeholder matching ProjectCard structure.
 * Shows shimmer blocks while API data loads.
 */
export default function ProjectCardSkeleton() {
  return (
    <div className="card lb-proj-card lb-skeleton-card h-100">
      <div className="lb-skeleton lb-skeleton-img" />
      <div className="card-body p-4 d-flex flex-column gap-2">
        <div className="lb-skeleton" style={{ width: '5rem', height: '0.875rem' }} />
        <div className="lb-skeleton" style={{ width: '70%', height: '1.5rem' }} />
        <div className="lb-skeleton" style={{ width: '90%', height: '0.875rem' }} />
      </div>
      <div className="card-footer lb-proj-bottom p-4">
        <div className="d-flex align-items-center justify-content-end">
          <div className="lb-skeleton" style={{ width: '6rem', height: '0.875rem' }} />
        </div>
      </div>
    </div>
  )
}
