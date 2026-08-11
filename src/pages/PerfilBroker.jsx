import {
  User, Phone, Mail, Award, Home as HomeIcon, Calendar,
  Download, FileText, Trophy, DollarSign, BarChart3, Star, Medal,
} from 'lucide-react'
import { brokersData } from '../data/brokers'

const TIER_LIST = brokersData.kam.tiers

export default function PerfilBroker({ user, activeTab }) {
  const { broker: b } = user

  const currentTierIdx = TIER_LIST.findIndex((t) => t.label === b.tier)
  const currentTier = TIER_LIST[currentTierIdx]
  const nextTier = TIER_LIST[currentTierIdx + 1]
  const ufNeeded = nextTier ? nextTier.minUF - b.salesUF : 0
  const progressPct = nextTier
    ? Math.min(100, Math.round(((b.salesUF - currentTier.minUF) / (nextTier.minUF - currentTier.minUF)) * 100))
    : 100

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
                <p className="lb-dashboard__muted">Broker asociado · Leben</p>
              </div>
            </div>
            <div className="lb-dashboard__data-grid">
              <div className="lb-dashboard__data-item"><User size={16} /><div><span className="lb-dashboard__label">RUT</span><span className="lb-dashboard__value">{user.rut}</span></div></div>
              <div className="lb-dashboard__data-item"><Phone size={16} /><div><span className="lb-dashboard__label">Teléfono</span><span className="lb-dashboard__value">{user.phone}</span></div></div>
              <div className="lb-dashboard__data-item"><Mail size={16} /><div><span className="lb-dashboard__label">Email</span><span className="lb-dashboard__value">{user.email}</span></div></div>
            </div>
          </div>

          <div className="lb-dashboard__stats-row">
            <div className="lb-dashboard__stat-card">
              <div className="lb-dashboard__stat-icon"><Medal size={22} /></div>
              <span className="lb-dashboard__stat-value">{b.tier}</span>
              <span className="lb-dashboard__stat-label">Categoría actual</span>
            </div>
            <div className="lb-dashboard__stat-card">
              <div className="lb-dashboard__stat-icon"><HomeIcon size={22} /></div>
              <span className="lb-dashboard__stat-value">{b.totalSales}</span>
              <span className="lb-dashboard__stat-label">Ventas totales</span>
            </div>
            <div className="lb-dashboard__stat-card">
              <div className="lb-dashboard__stat-icon"><Trophy size={22} /></div>
              <span className="lb-dashboard__stat-value">#{b.rank}</span>
              <span className="lb-dashboard__stat-label">Ranking general</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Mi Categoría */}
      {activeTab === 1 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card lb-dashboard__tier-card">
            <div className="lb-dashboard__tier-header">
              <div className="lb-dashboard__tier-badge">
                <Award size={32} />
              </div>
              <div>
                <span className="lb-dashboard__label">Categoría actual</span>
                <h3 className="lb-dashboard__tier-name">{b.tier}</h3>
              </div>
            </div>

            <div className="lb-dashboard__progress">
              <div className="lb-dashboard__progress-info">
                <span>Ventas acumuladas: <strong>UF {b.salesUF.toLocaleString('es-CL')}</strong></span>
                <span>{progressPct}%</span>
              </div>
              <div className="lb-dashboard__progress-bar">
                <div className="lb-dashboard__progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              {nextTier ? (
                <p className="lb-dashboard__progress-hint">
                  Te faltan <strong>UF {ufNeeded.toLocaleString('es-CL')}</strong> para subir a {nextTier.label}
                </p>
              ) : (
                <p className="lb-dashboard__progress-hint">
                  ¡Estás en la categoría máxima!
                </p>
              )}
            </div>
          </div>

          <div className="lb-dashboard__tier-ladder">
            {TIER_LIST.map(({ label, minUF, maxUF }, idx) => (
              <div key={label} className={`lb-dashboard__tier-step ${label === b.tier ? 'current' : ''} ${idx < currentTierIdx ? 'passed' : ''}`}>
                <span className="lb-dashboard__tier-step-icon"><Medal size={18} /></span>
                <span>{label}</span>
                <small className="lb-dashboard__tier-step-range">
                  {minUF.toLocaleString('es-CL')}{maxUF ? `–${maxUF.toLocaleString('es-CL')}` : '+'} UF
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Mis Ventas */}
      {activeTab === 2 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title"><HomeIcon size={20} /> Historial de ventas</h4>
            <div className="lb-dashboard__table-wrap">
              <table className="lb-dashboard__table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Proyecto</th>
                    <th>Unidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {user.sales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.client}</td>
                      <td>{s.project}</td>
                      <td>{s.unit}</td>
                      <td className="lb-dashboard__muted">{s.date}</td>
                      <td>
                        <span className={`lb-dashboard__badge lb-dashboard__badge--${s.status === 'pagada' ? 'green' : 'yellow'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Comisiones */}
      {activeTab === 3 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card lb-dashboard__commission-summary">
            <h4 className="lb-dashboard__card-title"><DollarSign size={20} /> Resumen de comisiones</h4>
            <div className="lb-dashboard__stats-row">
              <div className="lb-dashboard__stat-card">
                <span className="lb-dashboard__stat-value lb-dashboard__stat-value--green">
                  {user.sales.filter(s => s.status === 'pagada').reduce((sum, s) => sum + parseFloat(s.commission.replace(/[^\d.]/g, '')), 0).toFixed(1)} UF
                </span>
                <span className="lb-dashboard__stat-label">Pagadas</span>
              </div>
              <div className="lb-dashboard__stat-card">
                <span className="lb-dashboard__stat-value lb-dashboard__stat-value--yellow">
                  {user.sales.filter(s => s.status === 'pendiente').reduce((sum, s) => sum + parseFloat(s.commission.replace(/[^\d.]/g, '')), 0).toFixed(1)} UF
                </span>
                <span className="lb-dashboard__stat-label">Pendientes</span>
              </div>
            </div>
          </div>

          <div className="lb-dashboard__card">
            <div className="lb-dashboard__table-wrap">
              <table className="lb-dashboard__table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Proyecto</th>
                    <th>Comisión</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {user.sales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.client}</td>
                      <td>{s.project}</td>
                      <td className="lb-dashboard__value">{s.commission}</td>
                      <td>
                        <span className={`lb-dashboard__badge lb-dashboard__badge--${s.status === 'pagada' ? 'green' : 'yellow'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Eventos */}
      {activeTab === 4 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__events-list">
            {user.events.map((ev) => (
              <div key={ev.id} className="lb-dashboard__card lb-dashboard__event-item">
                <div className="lb-dashboard__event-date">
                  <span className="lb-dashboard__event-day">{ev.date.split(' ')[0]}</span>
                  <span className="lb-dashboard__event-month">{ev.date.split(' ')[1]}</span>
                </div>
                <div className="lb-dashboard__event-info">
                  <h4 className="lb-dashboard__event-title">{ev.title}</h4>
                  <div className="lb-dashboard__event-meta">
                    <span className="lb-dashboard__muted"><Calendar size={14} /> {ev.date} · {ev.time}</span>
                    <span className="lb-dashboard__muted">📍 {ev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Recursos */}
      {activeTab === 5 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title"><FileText size={20} /> Recursos de marketing</h4>
            <div className="lb-dashboard__docs-grid">
              {user.resources.map((r) => (
                <a key={r.name} href={r.file} className="lb-dashboard__doc-card" download>
                  <div className="lb-dashboard__doc-icon"><FileText size={24} /></div>
                  <span className="lb-dashboard__doc-name">{r.name}</span>
                  <span className="lb-dashboard__doc-type">{r.type}</span>
                  <Download size={18} className="lb-dashboard__doc-download" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Ranking */}
      {activeTab === 6 && (
        <div className="lb-dashboard__section">
          <div className="lb-dashboard__card">
            <h4 className="lb-dashboard__card-title"><BarChart3 size={20} /> Ranking de brokers</h4>
            <div className="lb-dashboard__ranking-summary">
              <div className="lb-dashboard__rank-position">
                <Trophy size={28} />
                <div>
                  <span className="lb-dashboard__rank-num">#{b.rank}</span>
                  <span className="lb-dashboard__muted">de {b.totalBrokers} brokers</span>
                </div>
              </div>
            </div>

            <div className="lb-dashboard__table-wrap">
              <table className="lb-dashboard__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Broker</th>
                    <th>Ventas</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pos: 1, name: 'Fernanda Sandoval', sales: 14, tier: 'BLACK' },
                    { pos: 2, name: 'Herman Kipping', sales: 12, tier: 'GOLD' },
                    { pos: 3, name: 'Maximiliano Rojas', sales: 10, tier: 'GOLD' },
                    { pos: b.rank, name: `${user.name} (tú)`, sales: b.totalSales, tier: b.tier, you: true },
                    { pos: 5, name: 'Valentina Díaz', sales: 7, tier: 'SILVER' },
                    { pos: 6, name: 'Rodrigo Fuentes', sales: 5, tier: 'SILVER' },
                  ].map((row) => (
                    <tr key={row.pos} className={row.you ? 'lb-dashboard__table-row--you' : ''}>
                      <td className="lb-dashboard__rank-cell">
                        {row.pos <= 3 && <Star size={14} className="lb-dashboard__rank-star" />}
                        {row.pos}
                      </td>
                      <td>{row.name}</td>
                      <td>{row.sales}</td>
                      <td><span className="lb-dashboard__badge lb-dashboard__badge--outline">{row.tier}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
