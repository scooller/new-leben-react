import ScrollAnim from '../ScrollAnim.jsx'
import AgentCard from './AgentCard.jsx'

/**
 * Team / Sales agents section.
 */
export default function TeamAgents({ data }) {
  return (
    <section className="lb-proj-det-team container text-center" id="contacto">
      <div className="row">
        <ScrollAnim as="div" className='col-12' animation="fade-up">
          <h2 className="lb-proj-det-section-title mb-4">{data.title}</h2>
        </ScrollAnim>
        <div className="col-12 col-md-7">
          <ScrollAnim as="div" animation="fade-up">
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
              <div key={agent.email} className="col-12 col-md-6 d-flex">
                <AgentCard {...agent} />
              </div>
            ))}
          </ScrollAnim>
        </div>
        <div className="col-12 col-md-5">
          <ScrollAnim as="div" animation="fade-up" className="h-100">
            <iframe
              src={data.wazeMap}
              title="Ubicación Waze"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
              style={{ border: 0, borderRadius: 'var(--lb-radius-md, 1rem)' }}
            />
          </ScrollAnim>
        </div>
      </div>
    </section>
  )
}
