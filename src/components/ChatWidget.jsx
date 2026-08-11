import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { BotIcon } from './icons/bot.jsx'
import { MessageCircleIcon } from './icons/message-circle.jsx'
import { SendIcon } from './icons/send.jsx'
import { hover } from './icons/animated-icon.jsx'

const MOCK_REPLIES = [
  '¡Hola! Soy LebenBot, tu asistente virtual. ¿En qué puedo ayudarte?',
  'Tenemos proyectos en Santiago Centro, La Florida, Providencia y Las Condes. ¿Qué zona te interesa?',
  'Nuestros proyectos cuentan con certificación CEV MINVU y eficiencia energética. ¿Te gustaría saber más?',
  'Puedo ayudarte a agendar una visita. Déjame tu correo y un asesor te contactará.',
  '¡Perfecto! Un asesor se comunicará contigo pronto. ¿Hay algo más en lo que pueda ayudarte?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: MOCK_REPLIES[0] },
  ])
  const [input, setInput] = useState('')
  const [replyIdx, setReplyIdx] = useState(1)
  const bodyRef = useRef(null)
  const bubbleIconRef = useRef(null)
  const botIconRef = useRef(null)
  const sendIconRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')

    // Mock reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: MOCK_REPLIES[replyIdx % MOCK_REPLIES.length] },
      ])
      setReplyIdx((i) => i + 1)
    }, 900)
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        className="lb-chat-bubble btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir chat de ayuda"
        {...(!open ? hover(bubbleIconRef) : {})}
      >
        {open ? <X size={24} /> : <MessageCircleIcon ref={bubbleIconRef} size={24} />}
      </button>

      {/* Modal — BS classes, React-driven */}
      {open && (
        <div className="lb-chat-dialog">
          <div className="card shadow-lg border-0 overflow-hidden">
            {/* Header */}
            <div className="card-header bg-danger text-white d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2" {...hover(botIconRef)}>
                <div className="lb-chat-avatar rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                  <BotIcon ref={botIconRef} size={20} />
                </div>
                <div className="d-flex flex-column">
                  <span className="fw-bold fs-6">LebenBot</span>
                  <small className="opacity-75">Asistente IA • En línea</small>
                </div>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={() => setOpen(false)} />
            </div>

            {/* Body — chat messages */}
            <div className="lb-chat-body" ref={bodyRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`d-flex mb-2 ${msg.from === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`rounded-3 px-3 py-2 lb-chat-msg ${msg.from === 'user' ? 'bg-danger text-white' : 'bg-light'}`}
                    style={{ maxWidth: '80%' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer — input */}
            <div className="card-footer p-2 bg-white">
              <form className="d-flex gap-2 w-100" onSubmit={send}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe tu mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="btn btn-danger px-3" {...hover(sendIconRef)}>
                  <SendIcon ref={sendIconRef} size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
