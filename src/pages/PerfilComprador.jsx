import {
  User, Phone, Mail, FileText, Download, Building2, MapPin, Calendar,
  TrendingUp, Send, CheckCircle2, Circle, Clock,
} from 'lucide-react'

export default function PerfilComprador({ user, activeTab }) {
  const { property: p, progress: prog } = user

  return (
    <div className="lb-dashboard">
      {/* TAB 0: Mis Datos */}
      {activeTab === 0 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card lb-dashboard__card--profile">
            <div className="lb-dashboard__profile-header">
              <div className="lb-dashboard__avatar-lg">
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name.charAt(0)}</span>}
              </div>
              <div>
                <h3>{user.name}</h3>
                <p className="lb-dashboard__muted">Cliente Leben</p>
              </div>
            </div>
            <div className="lb-dashboard__data-grid">
              <div className="lb-dashboard__data-item">
                <User size={16} />
                <div>
                  <span className="lb-dashboard__label">RUT</span>
                  <span className="lb-dashboard__value">{user.rut}</span>
                </div>
              </div>
              <div className="lb-dashboard__data-item">
                <Phone size={16} />
                <div>
                  <span className="lb-dashboard__label">Teléfono</span>
                  <span className="lb-dashboard__value">{user.phone}</span>
                </div>
              </div>
              <div className="lb-dashboard__data-item">
                <Mail size={16} />
                <div>
                  <span className="lb-dashboard__label">Email</span>
                  <span className="lb-dashboard__value">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title">Broker asignado</h4>
            <div className="lb-dashboard__broker-info">
              <div className="lb-dashboard__avatar-sm">{user.assignedBroker.name.charAt(0)}</div>
              <div>
                <p className="lb-dashboard__value">{user.assignedBroker.name}</p>
                <p className="lb-dashboard__muted">{user.assignedBroker.phone} · {user.assignedBroker.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Mi Propiedad */}
      {activeTab === 1 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <div className="lb-dashboard__card-header">
              <h4 className="lb-dashboard__card-title"><Building2 size={20} /> {p.projectName}</h4>
              <span className="lb-dashboard__badge lb-dashboard__badge--green">En construcción</span>
            </div>
            <div className="lb-dashboard__data-grid">
              <div className="lb-dashboard__data-item"><MapPin size={16} /><div><span className="lb-dashboard__label">Dirección</span><span className="lb-dashboard__value">{p.address}</span></div></div>
              <div className="lb-dashboard__data-item"><Building2 size={16} /><div><span className="lb-dashboard__label">Unidad</span><span className="lb-dashboard__value">{p.unit} · {p.floor}</span></div></div>
              <div className="lb-dashboard__data-item"><Building2 size={16} /><div><span className="lb-dashboard__label">Tipología</span><span className="lb-dashboard__value">{p.typology}</span></div></div>
              <div className="lb-dashboard__data-item"><Building2 size={16} /><div><span className="lb-dashboard__label">Superficie</span><span className="lb-dashboard__value">{p.surface}</span></div></div>
              <div className="lb-dashboard__data-item"><Building2 size={16} /><div><span className="lb-dashboard__label">Orientación</span><span className="lb-dashboard__value">{p.orientation}</span></div></div>
              <div className="lb-dashboard__data-item"><Building2 size={16} /><div><span className="lb-dashboard__label">Precio</span><span className="lb-dashboard__value">{p.price}</span></div></div>
            </div>
            <div className="lb-dashboard__payment-info">
              <span className="lb-dashboard__label">Forma de pago</span>
              <p>{p.paymentMethod}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Estado de Avance */}
      {activeTab === 2 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title"><TrendingUp size={20} /> Progreso de obra</h4>
            <div className="lb-dashboard__progress">
              <div className="lb-dashboard__progress-bar">
                <div className="lb-dashboard__progress-fill" style={{ width: `${prog.percent}%` }} />
              </div>
              <span className="lb-dashboard__progress-value">{prog.percent}%</span>
            </div>

            <div className="lb-dashboard__timeline">
              {prog.milestones.map((m) => (
                <div key={m.label} className={`lb-dashboard__milestone lb-dashboard__milestone--${m.status}`}>
                  <div className="lb-dashboard__milestone-icon">
                    {m.status === 'done' && <CheckCircle2 size={20} />}
                    {m.status === 'current' && <Clock size={20} />}
                    {m.status === 'pending' && <Circle size={20} />}
                  </div>
                  <div className="lb-dashboard__milestone-info">
                    <span className="lb-dashboard__milestone-label">{m.label}</span>
                    <span className="lb-dashboard__milestone-date">{m.date}</span>
                  </div>
                  {m.status === 'current' && <span className="lb-dashboard__badge lb-dashboard__badge--red">En curso</span>}
                  {m.status === 'done' && <span className="lb-dashboard__badge lb-dashboard__badge--green">Completado</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Documentos */}
      {activeTab === 3 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title"><FileText size={20} /> Documentos para descargar</h4>
            <div className="lb-dashboard__docs-grid">
              {user.documents.map((doc) => (
                <a key={doc.name} href={doc.file} className="lb-dashboard__doc-card" download>
                  <div className="lb-dashboard__doc-icon"><FileText size={24} /></div>
                  <span className="lb-dashboard__doc-name">{doc.name}</span>
                  <Download size={18} className="lb-dashboard__doc-download" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Noticias */}
      {activeTab === 4 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__news-list">
            {user.news.map((n) => (
              <article key={n.id} className="lb-dashboard__card lb-dashboard__news-item">
                <div className="lb-dashboard__news-meta">
                  <span className="lb-dashboard__news-tag">{n.tag}</span>
                  <span className="lb-dashboard__muted"><Calendar size={14} /> {n.date}</span>
                </div>
                <h4 className="lb-dashboard__news-title">{n.title}</h4>
                <p className="lb-dashboard__news-excerpt">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Mensajería */}
      {activeTab === 5 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card lb-dashboard__chat">
            <div className="lb-dashboard__chat-header">
              <div className="lb-dashboard__avatar-sm">{user.assignedBroker.name.charAt(0)}</div>
              <div>
                <p className="lb-dashboard__value">{user.assignedBroker.name}</p>
                <p className="lb-dashboard__muted">Tu broker</p>
              </div>
            </div>
            <div className="lb-dashboard__chat-body">
              <div className="lb-dashboard__chat-msg lb-dashboard__chat-msg--in">
                Hola {user.name.split(' ')[0]}, bienvenido al portal. Cualquier duda sobre tu departamento estoy disponible.
              </div>
              <div className="lb-dashboard__chat-msg lb-dashboard__chat-msg--out">
                Gracias Fernanda, ¿cuándo podré visitar el departamento?
              </div>
              <div className="lb-dashboard__chat-msg lb-dashboard__chat-msg--in">
                Te agendo para la próxima semana, te escribo por WhatsApp.
              </div>
            </div>
            <div className="lb-dashboard__chat-input">
              <input type="text" placeholder="Escribe un mensaje..." />
              <button><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
