import { useState } from 'react'
import {
  User, Phone, Mail, Award, Home as HomeIcon, Calendar,
  Download, FileText, Trophy, DollarSign, BarChart3, Star, Medal,
  PieChart,
} from 'lucide-react'
import { brokersData } from '../data/brokers'

const TIER_LIST = brokersData.kam.tiers

export default function PerfilBroker({ user, activeTab }) {
  const { broker: b } = user
  const [resourceProject, setResourceProject] = useState('Todos')

  const currentTierIdx = TIER_LIST.findIndex((t) => t.label === b.tier)
  const currentTier = TIER_LIST[currentTierIdx]
  const nextTier = TIER_LIST[currentTierIdx + 1]
  const ufNeeded = nextTier ? nextTier.minUF - b.salesUF : 0
  const progressPct = nextTier
    ? Math.min(100, Math.round(((b.salesUF - currentTier.minUF) / (nextTier.minUF - currentTier.minUF)) * 100))
    : 100

  const totalSalesUF = (user.sales || []).reduce((sum, s) => sum + (s.priceUF || 0), 0)

  // Opciones de proyectos para filtro de recursos
  const projectTabs = ['Todos', 'Edificio INN', 'Baum', 'Capitanes', 'General']
  const filteredResources = (user.resources || []).filter((r) =>
    resourceProject === 'Todos' ? true : r.project === resourceProject
  )

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

          {/* Tarjeta KAM a cargo */}
          {user.assignedKam && (
            <div className="lb-dashboard__card lb-dashboard__card--kam">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="lb-dashboard__avatar-sm bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '42px', height: '42px' }}>
                    {user.assignedKam.name.charAt(0)}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge text-bg-danger text-uppercase" style={{ fontSize: '0.65rem' }}>KAM a cargo</span>
                      <h5 className="mb-0 fw-bold">{user.assignedKam.name}</h5>
                    </div>
                    <p className="lb-dashboard__muted small mb-0">{user.assignedKam.role}</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {user.assignedKam.whatsappUrl && (
                    <a href={user.assignedKam.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 rounded-pill px-3">
                      <Phone size={13} /> WhatsApp
                    </a>
                  )}
                  <a href={`mailto:${user.assignedKam.email}`} className="btn btn-sm btn-outline-dark d-inline-flex align-items-center gap-1 rounded-pill px-3">
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>
            </div>
          )}

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
                    <th>Precio (UF)</th>
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
                      <td className="fw-semibold text-dark">UF {s.priceUF ? s.priceUF.toLocaleString('es-CL') : '—'}</td>
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

          {/* 2 Gráficos: Ventas Totales en UF + Gráfico de Torta por Proyecto */}
          <div className="row g-3">
            {/* Gráfico 1: Ventas Totales en UF */}
            <div className="col-lg-6">
              <div className="lb-dashboard__card h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="lb-dashboard__card-title mb-0 fs-6">
                    <BarChart3 size={18} className="text-danger" /> Ventas Totales (UF)
                  </h5>
                  <span className="badge text-bg-light border text-dark fw-bold">
                    UF {totalSalesUF.toLocaleString('es-CL')}
                  </span>
                </div>
                <p className="text-muted small mb-3">Volumen de ventas cerradas acumulado por mes en UF.</p>

                {/* SVG Bar Chart */}
                <div className="w-100 py-2">
                  <svg viewBox="0 0 320 180" className="w-100" style={{ maxHeight: '180px' }}>
                    {/* Gridlines */}
                    <line x1="35" y1="20" x2="310" y2="20" stroke="#eee" strokeDasharray="3 3" />
                    <text x="30" y="24" fontSize="9" fill="#999" textAnchor="end">10K</text>

                    <line x1="35" y1="70" x2="310" y2="70" stroke="#eee" strokeDasharray="3 3" />
                    <text x="30" y="74" fontSize="9" fill="#999" textAnchor="end">5K</text>

                    <line x1="35" y1="120" x2="310" y2="120" stroke="#eee" strokeDasharray="3 3" />
                    <text x="30" y="124" fontSize="9" fill="#999" textAnchor="end">0</text>

                    {/* Bar 1: Oct 2025 (2.750 UF) -> Height = (2750/10000)*100 = 27.5 */}
                    <rect x="65" y={120 - 27.5} width="45" height="27.5" rx="4" fill="#0d6efd" opacity="0.85" />
                    <text x="87.5" y={120 - 32} fontSize="9" fontWeight="bold" fill="#0d6efd" textAnchor="middle">2.750</text>
                    <text x="87.5" y="140" fontSize="10" fill="#666" textAnchor="middle">Oct</text>

                    {/* Bar 2: Nov 2025 (8.250 UF) -> Height = (8250/10000)*100 = 82.5 */}
                    <rect x="150" y={120 - 82.5} width="45" height="82.5" rx="4" fill="#dc3545" opacity="0.9" />
                    <text x="172.5" y={120 - 87} fontSize="9" fontWeight="bold" fill="#dc3545" textAnchor="middle">8.250</text>
                    <text x="172.5" y="140" fontSize="10" fill="#666" textAnchor="middle">Nov</text>

                    {/* Bar 3: Dic 2025 (2.260 UF) -> Height = (2260/10000)*100 = 22.6 */}
                    <rect x="235" y={120 - 22.6} width="45" height="22.6" rx="4" fill="#198754" opacity="0.85" />
                    <text x="257.5" y={120 - 27} fontSize="9" fontWeight="bold" fill="#198754" textAnchor="middle">2.260</text>
                    <text x="257.5" y="140" fontSize="10" fill="#666" textAnchor="middle">Dic</text>

                    {/* Baseline */}
                    <line x1="35" y1="120" x2="310" y2="120" stroke="#ccc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Gráfico de Torta / Donut por Proyecto */}
            <div className="col-lg-6">
              <div className="lb-dashboard__card h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="lb-dashboard__card-title mb-0 fs-6">
                    <PieChart size={18} className="text-danger" /> Distribución por Proyecto
                  </h5>
                  <span className="badge text-bg-light border text-dark fw-bold">
                    5 Ventas
                  </span>
                </div>
                <p className="text-muted small mb-3">Participación por proyecto en ventas cerradas.</p>

                {/* SVG Donut Chart + Leyenda */}
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-around gap-3 pt-2">
                  <div style={{ width: '130px', height: '130px', position: 'relative' }}>
                    <svg viewBox="0 0 130 130" className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }}>
                      {/* Track background */}
                      <circle cx="65" cy="65" r="48" fill="none" stroke="#f0f0f0" strokeWidth="22" />

                      {/* INN: 3/5 = 60% -> length = 301.59 * 0.6 = 180.95, offset = 0 */}
                      <circle
                        cx="65" cy="65" r="48"
                        fill="none"
                        stroke="#dc3545"
                        strokeWidth="22"
                        strokeDasharray="180.95 301.59"
                        strokeDashoffset="0"
                      />

                      {/* BAUM: 1/5 = 20% -> length = 301.59 * 0.2 = 60.32, offset = -180.95 */}
                      <circle
                        cx="65" cy="65" r="48"
                        fill="none"
                        stroke="#0d6efd"
                        strokeWidth="22"
                        strokeDasharray="60.32 301.59"
                        strokeDashoffset="-180.95"
                      />

                      {/* CAPITANES: 1/5 = 20% -> length = 301.59 * 0.2 = 60.32, offset = -241.27 */}
                      <circle
                        cx="65" cy="65" r="48"
                        fill="none"
                        stroke="#198754"
                        strokeWidth="22"
                        strokeDasharray="60.32 301.59"
                        strokeDashoffset="-241.27"
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                      <span className="fw-bold fs-4 d-block lh-1 text-dark">5</span>
                      <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Ventas</span>
                    </div>
                  </div>

                  {/* Leyenda 3 INN – 1 BAUM – 1 CAPITANES */}
                  <div className="d-flex flex-column gap-2 small">
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block flex-shrink-0" style={{ width: '12px', height: '12px', backgroundColor: '#dc3545' }} />
                      <span className="fw-bold text-dark">3 INN</span>
                      <span className="text-muted">(60%)</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block flex-shrink-0" style={{ width: '12px', height: '12px', backgroundColor: '#0d6efd' }} />
                      <span className="fw-bold text-dark">1 BAUM</span>
                      <span className="text-muted">(20%)</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block flex-shrink-0" style={{ width: '12px', height: '12px', backgroundColor: '#198754' }} />
                      <span className="fw-bold text-dark">1 CAPITANES</span>
                      <span className="text-muted">(20%)</span>
                    </div>
                  </div>
                </div>
              </div>
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
                    <th>% Comisión</th>
                    <th>Comisión</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {user.sales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.client}</td>
                      <td>{s.project}</td>
                      <td><span className="badge text-bg-light border text-dark fw-semibold">{s.commissionPct || '2.0%'}</span></td>
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h4 className="lb-dashboard__card-title mb-0"><FileText size={20} /> Recursos de marketing</h4>
              <span className="text-muted small">{filteredResources.length} archivo{filteredResources.length !== 1 ? 's' : ''} disponible{filteredResources.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Pestañas de filtrado por proyecto */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {projectTabs.map((proj) => (
                <button
                  key={proj}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-medium ${resourceProject === proj ? 'btn-danger shadow-sm' : 'btn-outline-secondary'}`}
                  onClick={() => setResourceProject(proj)}
                >
                  {proj}
                </button>
              ))}
            </div>

            <div className="lb-dashboard__docs-grid">
              {filteredResources.map((r, i) => (
                <a key={`${r.name}-${i}`} href={r.file} className="lb-dashboard__doc-card text-decoration-none" download>
                  <div className="lb-dashboard__doc-icon"><FileText size={24} /></div>
                  <div className="w-100 mb-1 d-flex align-items-center justify-content-between">
                    <span className="badge text-bg-light border text-secondary" style={{ fontSize: '0.65rem' }}>{r.project || 'General'}</span>
                    <span className="lb-dashboard__doc-type">{r.type}</span>
                  </div>
                  <span className="lb-dashboard__doc-name">{r.name}</span>
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
