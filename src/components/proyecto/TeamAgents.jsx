import ScrollAnim from '../ScrollAnim.jsx'

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
        className="lb-proj-det-agents d-flex flex-wrap justify-content-center gap-4 mt-4"
        animation="fade-up"
        stagger={0.1}
        delay={0.1}
      >
        {data.agents.map((agent) => (
          <div key={agent.email} className="lb-proj-det-agent d-flex align-items-center gap-3">
            <div className="lb-proj-det-agent-avatar rounded-circle" />
            <div className="d-flex flex-column text-start">
              <span className="fw-bold">{agent.name}</span>
              <span className="small">{agent.phone}</span>
              <a href={`mailto:${agent.email}`} className="small text-decoration-none">{agent.email}</a>
            </div>
          </div>
        ))}
      </ScrollAnim>
    </section>
  )
}
