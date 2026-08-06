import { useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarCheckIcon } from '../icons/calendar-check.jsx'
import { MailIcon } from '../icons/mail.jsx'
import { MessageCircleIcon } from '../icons/message-circle.jsx'
import { WhatsAppIcon } from '../icons/whatsapp.jsx'

/**
 * Agent card — Bootstrap card, horizontal layout.
 * Figma node 2089:434: 64px avatar + name/phone/email.
 * Avatar + phone click opens WhatsApp.
 */
export default function AgentCard({ name, phone, email, avatar }) {
  const waUrl = `https://wa.me/${phone.replace(/\D/g, '')}`
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
  const today = new Date().toISOString().split('T')[0]

  const handleSchedule = (e) => {
    e.preventDefault()
    const msg = `Hola ${name}, quiero agendar una visita para el ${selectedDate} a las ${selectedTime}.`
    window.open(`${waUrl}?text=${encodeURIComponent(msg)}`, '_blank')
    setShowModal(false)
    setSelectedDate('')
    setSelectedTime('')
  }

  return (
    <>
      <div className="card lb-proj-det-agent-card h-100">
        <div className="card-body row align-items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${name}`}
            className="text-decoration-none"
          >
            <img
              src={avatar}
              alt={name}
              width={64}
              height={64}
              loading="lazy"
              className="lb-proj-det-agent-avatar rounded-circle flex-shrink-0 col-12 col-md"
            />
          </a>
          <div className="d-flex flex-column col-12 col-md">
            <span className="fw-bold">{name}</span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="small text-muted text-decoration-none d-flex align-items-center gap-1"
            >
              <WhatsAppIcon size={14} /> {phone}
            </a>
            <a href={`mailto:${email}`} className="small text-decoration-none d-flex align-items-center gap-1">
              <MailIcon size={14} /> {email}
            </a>
            <button
              className="btn btn-outline-dark btn-sm mt-2 lb-btn-agent-card d-inline-flex align-items-center justify-content-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <CalendarCheckIcon size={16} /> Agendar cita
            </button>
          </div>
        </div>
      </div>

      {/* Modal — portal to body to escape card overflow */}
      {showModal && createPortal(
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content lb-schedule-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <CalendarCheckIcon size={20} /> Agendar visita
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Cerrar" />
              </div>
              <form onSubmit={handleSchedule}>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    Selecciona día y hora. Te redirigiremos a WhatsApp con el mensaje listo.
                  </p>
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
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success d-inline-flex align-items-center gap-2"
                    disabled={!selectedDate || !selectedTime}
                  >
                    <MessageCircleIcon size={16} /> Confirmar por WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>, document.body)}
    </>
  )
}
