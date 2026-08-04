import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Floor plans / terminaciones section.
 * Blueprint image + toggle buttons (2D/3D/4D).
 */
export default function FloorPlans({ data }) {
  return (
    <section className="lb-proj-det-floor-plans container" id="plantas">
      <div className="row align-items-center g-5">
        <ScrollAnim as="div" className="col-lg-5" animation="fade-right">
          <span className="lb-eyebrow text-uppercase d-block mb-2 text-danger">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>

          <div className="lb-proj-det-floor-btns d-flex flex-wrap gap-2 mt-4">
            {data.buttons.map((btn) => (
              <button key={btn} className="btn btn-outline-dark btn-pill">
                {btn}
              </button>
            ))}
          </div>
        </ScrollAnim>

        <ScrollAnim
          as="div"
          className="col-lg-7"
          animation="fade-left"
        >
          <div className="lb-proj-det-blueprint-wrap lb-img-trigger" tabIndex={0}>
            <img
              src={data.blueprint}
              alt="Planta del departamento"
              className="lb-proj-det-blueprint lb-img-interactive w-100"
              loading="lazy"
              decoding="async"
            />
          </div>
        </ScrollAnim>
      </div>
    </section>
  )
}
