import { Link } from 'react-router-dom'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import ProjectCard from '../ProjectCard.jsx'

/**
 * Alternative projects — reuses ProjectCard in a responsive grid.
 */
export default function Alternatives({ data }) {
  return (
    <section className="lb-proj-det-alternatives container" id="alternativas">
      <ScrollAnim as="div" animation="fade-up">
        <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.04} />
      </ScrollAnim>

      <ScrollAnim as="div" className="row row-cols-1 row-cols-md-3 g-4 mt-2" animation="fade-up" stagger={0.1}>
        {data.cards.map((card) => (
          <div className="col" key={card.name}>
            <ProjectCard project={card} />
          </div>
        ))}
      </ScrollAnim>
      <div className="d-flex justify-content-end mt-4">
        <Link to="/proyectos" className="btn lb-btn-gallery text-decoration-none">Ver todos los proyectos</Link>
      </div> 
    </section>
  )
}
