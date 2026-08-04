import ScrollAnim from '../ScrollAnim.jsx'
import AgentCard from './AgentCard.jsx'

/**
 * Team / Sales agents section.
 */
export default function TeamAgents({ data }) {
  return (
    <section className="lb-proj-det-team container text-center" id="contacto">
      <ScrollAnim as="div" animation="fade-up">
        <h2 className="lb-proj-det-section-title">{data.title}</h2>
        <p className="lb-proj-det-team-subtitle text-muted mx-auto">{data.subtitle}</p>
      </ScrollAnim>

      <ScrollAnim
        as="div"
        id="asesores"
        className="row g-4 mt-4 mx-auto"
        animation="fade-up"
        stagger={0.1}
        delay={0.1}
      >
        {data.agents.map((agent) => (
          <div key={agent.email} className="col-md-4 col-12 d-flex">
            <AgentCard {...agent} />
          </div>
        ))}
      </ScrollAnim>
    </section>
  )
}
