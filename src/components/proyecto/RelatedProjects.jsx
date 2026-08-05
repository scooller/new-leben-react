import { Link } from 'react-router-dom'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Related projects table.
 */
export default function RelatedProjects({ data }) {
  return (
    <section className="lb-proj-det-related" id="relacionados">
      <div className="container">
        <ScrollAnim as="div" animation="fade-up">
          <span className="lb-eyebrow text-uppercase d-block mb-2">{data.eyebrow}</span>
          <h2 className="lb-proj-det-section-title">{data.title}</h2>
        </ScrollAnim>

        <ScrollAnim as="div" className="mt-4" animation="fade-up" delay={0.1}>
          <table className="table table-hover lb-proj-det-table align-middle">
            <thead className="d-lg-table-row-group">
              <tr>
                <th className="text-uppercase lb-proj-det-table-hdr">Departamento</th>
                <th className="text-uppercase lb-proj-det-table-hdr">Proyecto</th>
                <th className="d-none d-lg-table-cell text-uppercase lb-proj-det-table-hdr">Ubicación</th>
                <th className="d-none d-lg-table-cell text-uppercase lb-proj-det-table-hdr">Tipología</th>
                <th className="d-none d-lg-table-cell text-uppercase lb-proj-det-table-hdr">Superficie</th>
                <th className="d-none d-lg-table-cell text-uppercase lb-proj-det-table-hdr">Precio</th>
                <th className="text-uppercase lb-proj-det-table-hdr"></th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.name}>
                  <td className="fw-semibold">{row.dpto}</td>
                  <td className="fw-semibold">{row.name}</td>
                  <td className="d-none d-lg-table-cell">{row.location}</td>
                  <td className="d-none d-lg-table-cell">{row.tipologia}</td>
                  <td className="d-none d-lg-table-cell">{row.superficie}</td>
                  <td className="d-none d-lg-table-cell">{row.precio}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollAnim>
      </div>
    </section>
  )
}
