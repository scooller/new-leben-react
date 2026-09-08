import { useEffect, useState } from 'react'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import AgentCard from './AgentCard.jsx'
import { apiFetch } from '../../lib/apiFetch.js'

/**
 * Team / Sales agents section.
 * Fetches real asesoros from API if apiId is provided, falls back to data.agents.
 */
export default function TeamAgents({ data, apiId }) {
  const [agents, setAgents] = useState(data?.agents || [])

  useEffect(() => {
    if (!apiId) return
    let cancelled = false
    apiFetch(`/api/v1/proyectos/${apiId}?include_asesores=1`).then(({ data, error }) => {
      if (cancelled || error) return
      const apiAgents = data?.asesores
      if (apiAgents?.length) {
        setAgents(apiAgents.map((a) => ({
          name: a.full_name,
          phone: a.whatsapp_owner || '',
          email: a.email || '',
          avatar: a.avatar_url || a.avatar_manual_url || '',
        })))
      }
    })
    return () => { cancelled = true }
  }, [apiId])

  if (!data && !apiId) return null

  const title = data?.title || 'Te acompañamos en cada decisión'
  const subtitle = data?.subtitle || ''
  const wazeMap = data?.wazeMap

  return (
    <section className="lb-proj-det-team container text-center" id="contacto">
      <div className="row">
        <div className='col-12'>
          <SplitTitle
            as="h2"
            className="lb-proj-det-section-title mb-4"
            text={title}
          />
        </div>
        <div className={wazeMap ? "col-12 col-md-7" : "col-12 col-md-10 mx-auto"}>
          {subtitle && (
            <SplitTitle
              as="p"
              className="lb-proj-det-team-subtitle text-muted mx-auto"
              text={subtitle}
            />
          )}

          <ScrollAnim
            as="div"
            id="asesores"
            className="row g-4 mt-4 mx-auto"
            animation="fade-up"
            stagger={0.1}
            delay={0.1}
          >
            {agents.map((agent) => (
              <div key={agent.email} className="col-12 col-md-6 d-flex">
                <AgentCard {...agent} />
              </div>
            ))}
          </ScrollAnim>
        </div>
        {wazeMap && (
          <div className="col-12 col-md-5">
            <ScrollAnim as="div" animation="fade-up" className="h-100">
              <iframe
                src={wazeMap}
                title="Ubicación Waze"
                width="100%"
                height="450"
                allowFullScreen
                loading="lazy"
                style={{ border: 0, borderRadius: 'var(--lb-radius-md, 1rem)' }}
              />
            </ScrollAnim>
          </div>
        )}
      </div>
    </section>
  )
}
