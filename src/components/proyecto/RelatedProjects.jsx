import { Link } from 'react-router-dom'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Related projects table.
 * Reuses Bootstrap table classes.
 */
export default function RelatedProjects({ data }) {
  return (
    <section className="lb-proj-det-related container" id="relacionados">
      <ScrollAnim as="div" animation="fade-up">
        <span className="lb-eyebrow text-uppercase d-block mb-2">{data.eyebrow}</span>
        <h2 className="lb-proj-det-section-title">{data.title}</h2>
      </ScrollAnim>

      <ScrollAnim as="div" className="lb-proj-det-related-table mt-4" animation="fade-up" delay={0.1}>
        <div className="lb-proj-det-table-head d-none d-lg-flex">
          {data.columns.map((col) => (
            <span key={col} className="lb-proj-det-table-hdr text-uppercase">{col}</span>
          ))}
        </div>

        {data.rows.map((row) => (
          <div key={row.name} className="lb-proj-det-table-row d-flex align-items-center">
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--name fw-semibold">{row.name}</span>
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--location">{row.location}</span>
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--tipo">{row.tipologia}</span>
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--sup">{row.superficie}</span>
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--price">{row.precio}</span>
            <span className="lb-proj-det-table-cell lb-proj-det-table-cell--action">
              <Link to="/proyectos" className="lb-proj-det-table-link">
                Ver proyecto
                <img
                  src={`${import.meta.env.BASE_URL}images/arrow-right.svg`}
                  alt=""
                  width="14"
                  height="14"
                  loading="lazy"
                />
              </Link>
            </span>
          </div>
        ))}
      </ScrollAnim>
    </section>
  )
}
