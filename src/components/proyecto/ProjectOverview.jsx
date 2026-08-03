import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Overview section: 3-image collage + text + stats grid.
 * Reuses lb-img-trigger / lb-img-interactive.
 */
export default function ProjectOverview({ data }) {
  return (
    <section className="lb-proj-det-overview container" id="overview">
      <div className="row align-items-center g-5">
        {/* Collage */}
        <ScrollAnim
          as="div"
          className="col-lg-6 lb-proj-det-collage"
          animation="fade-right"
        >
          <div className="lb-proj-det-collage-left lb-img-trigger" tabIndex={0}>
            <img
              src={data.collage.left}
              alt=""
              className="lb-img-interactive"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="lb-proj-det-collage-right d-flex flex-column gap-3">
            <div className="lb-img-trigger" tabIndex={0}>
              <img
                src={data.collage.rightTop}
                alt=""
                className="lb-img-interactive"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="lb-img-trigger" tabIndex={0}>
              <img
                src={data.collage.rightBottom}
                alt=""
                className="lb-img-interactive"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </ScrollAnim>

        {/* Details */}
        <ScrollAnim as="div" className="col-lg-6" animation="fade-left">
          <span className="lb-eyebrow text-uppercase d-block mb-2">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>

          <div className="lb-proj-det-stats d-flex flex-wrap gap-4 mt-4">
            {data.stats.map((s) => (
              <div key={s.label} className="lb-proj-det-stat">
                <span className="lb-proj-det-stat-value">{s.value}</span>
                <span className="lb-proj-det-stat-label d-block">{s.label}</span>
              </div>
            ))}
          </div>
        </ScrollAnim>
      </div>
    </section>
  )
}
