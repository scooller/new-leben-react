import { useState, useRef, useEffect } from 'react'
import { hover } from '../icons/animated-icon.jsx'
import { WhatsAppIcon } from '../icons/whatsapp.jsx'
import { apiFetch } from '../../lib/apiFetch.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Project Team Agents section — standard canonical contact section
 * Uses project theme background and fetches project advisors if apiId is present
 */
function AgentRow({ agent, onSchedule }) {
  const waRef = useRef(null)

  return (
    <ScrollAnim as='div' animation='fade-up' className="lb-inn-team-agents__agent-row">
      <div className="lb-inn-team-agents__agent-info-card">
        <div className="lb-inn-team-agents__agent-data">
          <p className="lb-inn-team-agents__name">
            <button
              type="button"
              className="lb-inn-team-agents__name-btn"
              onClick={() => onSchedule(agent.email)}
            >
              {agent.name}
            </button>
            {agent.phone && (
              <a
                href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lb-inn-team-agents__phone"
              >
                {agent.phone}
              </a>
            )}
          </p>
          {agent.email && (
            <a href={`mailto:${agent.email}`} className="lb-inn-team-agents__email">
              {agent.email}
            </a>
          )}
        </div>
        {agent.phone && (
          <a
            href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lb-inn-team-agents__wa-btn"
            aria-label={`WhatsApp ${agent.name}`}
            {...hover(waRef)}
          >
            <WhatsAppIcon ref={waRef} size={25} />
          </a>
        )}
      </div>

      {agent.avatar && (
        <div className="lb-inn-team-agents__avatar-wrapper">
          <img
            src={agent.avatar}
            alt={agent.name}
            width={90}
            height={90}
            loading="lazy"
            className="lb-inn-team-agents__avatar"
          />
        </div>
      )}
    </ScrollAnim>
  )
}

export default function ProjectTeamAgents({ data = {}, apiId }) {
  const [agents, setAgents] = useState(data?.agents || [])
  const [showModal, setShowModal] = useState(false)

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (data?.agents) setAgents(data.agents)
  }, [data?.agents])

  useEffect(() => {
    if (!apiId) return
    let cancelled = false
    apiFetch(`/api/v1/proyectos/${apiId}?include_asesores=1`).then(({ data: resData, error }) => {
      if (cancelled || error) return
      const apiAgents = resData?.asesores
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

  const handleSchedule = (e) => {
    e.preventDefault()
    const agent = agents.find(a => a.email === selectedAgent) || agents[0]
    if (!agent) return

    const msg = `Hola ${agent.name}, quiero agendar una visita para el ${selectedDate} a las ${selectedTime}.`
    window.open(`https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    setShowModal(false)
    setSelectedDate('')
    setSelectedTime('')
  }

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')

  return (
    <section className="lb-inn-team-agents" id="contacto">
      <div className="container">
        <div className="row">
          {/* Left column - Agents */}
          <div className="lb-inn-team-agents__left col-md col-12">
            {data?.eyebrow && (
              <ScrollAnim as='span' animation='flip-x' className="lb-inn-team-agents__eyebrow">
                {data.eyebrow}
              </ScrollAnim>
            )}
            {data?.title && (
              <SplitTitle
                as='h2'
                delay={0.2}
                stagger={0.05}
                className="lb-inn-team-agents__title"
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
            )}

            <div className="lb-inn-team-agents__agents-list w-md-75">
              {agents.map((agent) => (
                <AgentRow
                  key={agent.email || agent.name}
                  agent={agent}
                  onSchedule={(email) => { setSelectedAgent(email); setShowModal(true) }}
                />
              ))}
            </div>

            {agents.length > 0 && (
              <button
                className="btn lb-inn-btn mt-3 px-4"
                onClick={() => {
                  setSelectedAgent(agents[0]?.email || '')
                  setShowModal(true)
                }}
              >
                AGENDA TU VISITA
              </button>
            )}
          </div>

          {/* Right column - Info + Map */}
          <div className="col-md col-12">
            <div className='d-flex flex-column w-md-80 h-100 ms-auto'>
              {data?.subtitle && (
                <ScrollAnim
                  as='p'
                  animation='fade-up'
                  delay={0.2}
                  className="lb-inn-team-agents__subtitle"
                  dangerouslySetInnerHTML={{ __html: data.subtitle }}
                />
              )}
              {data?.wazeMap && (
                <ScrollAnim as='div' animation='scale' delay={0.4} className="lb-inn-team-agents__map w-100">
                  <iframe
                    src={data.wazeMap}
                    title="Ubicación Waze"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                  />
                </ScrollAnim>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agendar */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Agenda tu Visita</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSchedule}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-muted">Asesor</label>
                    <select
                      className="form-select"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      required
                    >
                      {agents.map(a => (
                        <option key={a.email} value={a.email}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Fecha de visita</label>
                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Horario preferente</label>
                    <div className="d-flex flex-wrap gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          className={`btn btn-sm ${selectedTime === time ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-link text-muted" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={!selectedDate || !selectedTime}>Confirmar vía WhatsApp</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
