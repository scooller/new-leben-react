/**
 * Agent card — Bootstrap card, horizontal layout.
 * Figma node 2089:434: 64px avatar + name/phone/email.
 * Avatar + phone click opens WhatsApp.
 */
export default function AgentCard({ name, phone, email, avatar }) {
  const waUrl = `https://wa.me/${phone.replace(/\D/g, '')}`

  return (
    <div className="card lb-proj-det-agent-card h-100">
      <div className="card-body d-flex align-items-center gap-3">
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
            className="lb-proj-det-agent-avatar rounded-circle flex-shrink-0"
          />
        </a>
        <div className="d-flex flex-column">
          <span className="fw-bold">{name}</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="small text-muted text-decoration-none"
          >
            {phone}
          </a>
          <a href={`mailto:${email}`} className="small text-decoration-none">{email}</a>
        </div>
      </div>
    </div>
  )
}
