import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../store/slices/authSlice.js'
import { images } from '../data/content.js'
import { Bell, LogOut, Home, Menu, X } from 'lucide-react'
import PerfilComprador from './PerfilComprador.jsx'
import PerfilBroker from './PerfilBroker.jsx'
import { useBsTooltips } from '../hooks/useBsTooltips.js'

export default function Perfil() {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useBsTooltips([user?.name])

  if (!user) return <Navigate to="/login" replace />

  const isBroker = user.role === 'broker'

  const compradorTabs = ['Mis Datos', 'Mi Propiedad', 'Estado de Avance', 'Documentos', 'Noticias', 'Mensajería']
  const brokerTabs = ['Mis Datos', 'Mi Categoría', 'Mis Ventas', 'Comisiones', 'Eventos', 'Recursos', 'Ranking']
  const tabs = isBroker ? brokerTabs : compradorTabs

  const unreadCount = user.notifications?.filter((n) => n.unread).length || 0

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="lb-perfil">
      {/* Sidebar */}
      <aside className={`lb-perfil__sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="lb-perfil__sidebar-header">
          <Link to="/"><img src={images.logoText} alt="Leben" className="lb-perfil__sidebar-logo" /></Link>
          <button className="lb-perfil__sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="lb-perfil__user-block">
          <div className="lb-perfil__avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="lb-perfil__user-info">
            <p className="lb-perfil__user-name" data-bs-toggle="tooltip" data-bs-title={user.name}>{user.name}</p>
            <span className={`lb-perfil__user-role lb-perfil__user-role--${user.role}`}>
              {isBroker ? 'Broker' : 'Comprador'}
            </span>
          </div>
        </div>

        <nav className="lb-perfil__nav">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`lb-perfil__nav-item ${activeTab === i ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(i)
                setSidebarOpen(false)
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="lb-perfil__sidebar-footer">
          <a href="/" className="lb-perfil__nav-item">
            <Home size={16} /> Ir al sitio
          </a>
          <button className="lb-perfil__nav-item lb-perfil__nav-item--logout" onClick={handleLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="lb-perfil__overlay show" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="lb-perfil__main">
        <header className="lb-perfil__topbar">
          <button className="lb-perfil__menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="lb-perfil__topbar-title">{tabs[activeTab]}</h2>
          <div className="lb-perfil__topbar-right">
            <button className="lb-perfil__bell" onClick={() => setShowNotif((v) => !v)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="lb-perfil__bell-badge">{unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="lb-perfil__notif-dropdown">
                <p className="lb-perfil__notif-title">Notificaciones</p>
                {user.notifications?.map((n) => (
                  <div key={n.id} className={`lb-perfil__notif-item ${n.unread ? 'unread' : ''}`}>
                    <span className="lb-perfil__notif-text">{n.text}</span>
                    <span className="lb-perfil__notif-date">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="lb-perfil__content">
          {isBroker
            ? <PerfilBroker user={user} activeTab={activeTab} />
            : <PerfilComprador user={user} activeTab={activeTab} />}
        </div>
      </div>
    </div>
  )
}
