import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { images } from '../../data/content.js'

const mainLinks = [
  { label: 'Cotizar', to: '/proyectos' },
  { label: 'Brokers', to: '/brokers' },
  { label: 'Clientes', href: 'https://www.pvi.cl/propietarios/leben/propietarios/login/' },
]

// Dynamic page menus shown in dropdown
const pageMenus = {
  home: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Diferenciadores', href: '#nosotros' },
    { label: 'Proyectos', href: '#proyectos' },
  ],
  proyectos: [
    { label: 'Todos los Proyectos', route: '/proyectos' },
  ],
  proyectoDetalle: [
    { label: 'Overview', href: '#overview' },
    { label: 'Cotizador', href: '#cotizador' },
    { label: 'Plantas', href: '#plantas' },
    { label: 'Espacios', href: '#espacios' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Vista 360°', href: '#vista360' },
    { label: 'Alternativas', href: '#alternativas' },
    { label: 'Relacionados', href: '#relacionados' },
  ],
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const dropdownLinks = useMemo(() => {
    const path = location.pathname
    if (path === '/proyectos') return pageMenus.proyectos
    if (path.startsWith('/proyectos/')) return pageMenus.proyectoDetalle
    return pageMenus.home
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`lb-navbar position-fixed top-0 start-0 end-0${scrolled ? ' lb-navbar-scrolled' : ''}`} style={{ zIndex: 90 }}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo group */}
        <Link className="d-flex align-items-center gap-2 text-decoration-none" to="/">
          <img src={images.logoIcon} alt="" width="23" height="22" className="flex-shrink-0" fetchPriority="high" />
          <img src={images.logoText} alt="iLeben" height="22" className="flex-shrink-0" fetchPriority="high" />
          <span className="lb-nav-separator" />
          <span className="d-flex align-items-baseline gap-1 lh-1">
            <span className="fs-6 fw-bolder text-white">4TO</span>
            <span className="fs-6 fw-semibold text-white">Bptl</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
          {mainLinks.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="lb-nav-link text-decoration-none">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="lb-nav-link text-decoration-none">
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* Mobile nav */}
        <div className="d-lg-none d-flex align-items-center gap-2 ms-auto">
          {mainLinks.filter((l) => l.to).map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="lb-nav-link text-decoration-none">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="lb-nav-link text-decoration-none">
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {/* <Link to="/" className="btn btn-danger btn-sm rounded-pill lb-nav-cta text-decoration-none">COTIZAR</Link> */}

          {/* Hamburger dropdown — Bootstrap native */}
          <div className="dropdown">
            <button
              className="btn btn-sm lb-hamburger dropdown-toggle"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-label="Menu"
            >
              <span className="lb-burger-line" />
              <span className="lb-burger-line" />
              <span className="lb-burger-line" />
            </button>

            <div className="dropdown-menu lb-dropdown end-0 rounded-3 shadow overflow-hidden">
              {/* Mobile: show main links first */}
              <div className="d-lg-none">
                {mainLinks.map((link) =>
                  link.to ? (
                    <Link key={link.label} to={link.to} className="lb-dropdown-link dropdown-item text-decoration-none">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href} className="lb-dropdown-link dropdown-item text-decoration-none">
                      {link.label}
                    </a>
                  ),
                )}
                {dropdownLinks.length > 0 && <hr className="lb-dropdown-divider my-1" />}
              </div>
              {/* Page section links (all breakpoints) */}
              {dropdownLinks.map((link) =>
                link.route ? (
                  <Link
                    key={link.label}
                    to={link.route}
                    className="lb-dropdown-link dropdown-item text-decoration-none"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="lb-dropdown-link dropdown-item text-decoration-none"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
