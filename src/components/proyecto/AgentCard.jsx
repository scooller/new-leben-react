/**
 * Agent card — Bootstrap card, horizontal layout.
 * Figma node 2089:434: 64px avatar + name/phone/email.
 */
export default function AgentCard({ name, phone, email, avatar, className, classBody, classImg, classText }) {
  return (
    <div className={`card lb-proj-det-agent-card h-100 ${className || ''}`}>
      <div className={`card-body d-flex align-items-center gap-3 ${classBody || ''}`}>
        <img
          src={avatar}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          className={`lb-proj-det-agent-avatar rounded-circle flex-shrink-0 ${classImg || ''}`}
        />
        <div className={`d-flex flex-column ${classText || ''}`}>
          <span className="fw-bold">{name}</span>
          <span className="small text-muted">{phone}</span>
          <a href={`mailto:${email}`} className="small text-decoration-none">{email}</a>
        </div>
      </div>
    </div>
  )
}
