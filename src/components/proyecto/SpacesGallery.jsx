import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Spaces gallery: 3-column image strip + designer quote.
 */
export default function SpacesGallery({ data }) {
  return (
    <section className="lb-proj-det-spaces container" id="espacios">
      <div className="row g-5 align-items-center">
        <ScrollAnim
          as="div"
          className="col-lg-6 lb-proj-det-spaces-gallery"
          animation="fade-right"
        >
          <div className="d-flex gap-2">
            {data.images.map((src, i) => (
              <div key={i} className="lb-img-trigger" tabIndex={0}>
                <img
                  src={src}
                  alt={`Espacio ${i + 1}`}
                  className="lb-proj-det-space-img lb-img-interactive"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </ScrollAnim>

        <ScrollAnim as="div" className="col-lg-6" animation="fade-left">
          <span className="lb-eyebrow text-uppercase d-block mb-2">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>

          <div className="lb-proj-det-designer d-flex align-items-center gap-3 mt-4">
            <img
              src={data.designer.avatar}
              alt={data.designer.name}
              className="lb-proj-det-designer-avatar rounded-circle"
              width="56"
              height="56"
              loading="lazy"
            />
            <div className="d-flex flex-column">
              <span className="fw-bold">{data.designer.name}</span>
              <span className="text-muted small">{data.designer.role}</span>
            </div>
          </div>
        </ScrollAnim>
      </div>
    </section>
  )
}
