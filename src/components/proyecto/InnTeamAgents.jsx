import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { hover } from '../icons/animated-icon.jsx'
import { CalendarCheckIcon } from '../icons/calendar-check.jsx'
import { WhatsAppIcon } from '../icons/whatsapp.jsx'
import { apiFetch } from '../../lib/apiFetch.js'

/**
 * Inn Team Agents section — adapted from the screenshot
 * Uses $inn-gold-bg background and matches the layout from the image
 */
export default function InnTeamAgents({ data, apiId }) {
  const [agents, setAgents] = useState(data?.agents || [])
  const [showModal, setShowModal] = useState({})
  const waRef = useRef(null)
  const calendarRef = useRef(null)

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
  const today = new Date().toISOString().split('T')[0]

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
        <div className="lb-inn-team-agents__layout">
          {/* Left column - Agents */}
          <div className="lb-inn-team-agents__left">
            <span className="lb-inn-team-agents__eyebrow">{data.eyebrow}</span>
            <h2 className="lb-inn-team-agents__title" dangerouslySetInnerHTML={{ __html: data.title }} />

            <div className="lb-inn-team-agents__agents-list">
              {agents.map((agent) => (
                <div key={agent.email} className="lb-inn-team-agents__agent-row">
                  <div className="lb-inn-team-agents__agent-data">
                    <p className="lb-inn-team-agents__name">
                      <strong>{agent.name}</strong>
                      <span className="lb-inn-team-agents__phone"> | {agent.phone}</span>
                    </p>
                    <a href={`mailto:${agent.email}`} className="lb-inn-team-agents__email">
                      {agent.email}
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lb-inn-team-agents__wa-btn"
                    aria-label={`WhatsApp ${agent.name}`}
                    {...hover(waRef)}
                  >
                    <WhatsAppIcon ref={waRef} size={20} />
                  </a>
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    width={72}
                    height={72}
                    loading="lazy"
                    className="lb-inn-team-agents__avatar"
                  />
                </div>
              ))}
            </div>

            <button
              className="lb-inn-team-agents__cta"
              onClick={() => {
                setSelectedAgent(agents[0]?.email || '')
                setShowModal(true)
              }}
              {...hover(calendarRef)}
            >
              <CalendarCheckIcon ref={calendarRef} size={18} />
              Agenda tu visita
            </button>
          </div>

          {/* Right column - Info + Map */}
          <div className="lb-inn-team-agents__right">
            <p className="lb-inn-team-agents__subtitle" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
            <div className="lb-inn-team-agents__map">
              <iframe
                src={data.wazeMap}
                title="Ubicación Waze"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal agendar visita */}
      {showModal && createPortal(
          <div className="modal d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content lb-inn-team-agents__modal">
                <div className="modal-header border-0">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <CalendarCheckIcon size={20} /> Agenda tu visita
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Cerrar" />
                </div>
                <form onSubmit={handleSchedule}>
                  <div className="modal-body">
                    <p className="text-muted small mb-3">
                      Selecciona asesor, día y hora. Te redirigiremos a WhatsApp con el mensaje listo.
                    </p>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Asesor</label>
                      <select
                        className="form-select"
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        required
                      >
                        {agents.map((a) => (
                          <option key={a.email} value={a.email}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        min={today}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold">Hora</label>
                      <div className="d-flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`btn btn-sm ${selectedTime === slot ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-dark">
                      Confirmar por WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}