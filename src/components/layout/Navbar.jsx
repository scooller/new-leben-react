import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../../data/content.js'

/** Render a link from {label, to?, href?, route?} config */
function Navlink({ link, className }) {
  const to = link.to || link.route
  return to
    ? <Link key={link.label} to={to} className={className}>{link.label}</Link>
    : <a key={link.label} href={link.href} className={className}>{link.label}</a>
}

const mainLinks = [
  { label: 'Cotizar', to: '/proyectos' },
  { label: 'Brokers', to: '/brokers' },
  { label: 'Clientes', href: 'https://www.pvi.cl/propietarios/leben/propietarios/login/' },
]

const fixedMenuLinks = [
  { label: 'Proyectos realizados', href: '#' },
  { label: 'Sala de ventas', href: '#' },
  { label: 'Servicio al cliente', href: '#' },
  { label: 'Portal de proveedores', href: '#' },
  { label: 'Preguntas frecuentes', href: '#' },
  { label: 'Pagar reserva', href: '#' },
  { label: 'Prevención del delito', href: '#' },
  { label: 'Contáctanos', href: '#' },
]

const mainMobileLinks = [
  { label: 'Cotizar', to: '/proyectos' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`lb-navbar position-fixed top-0 start-0 end-0${scrolled ? ' lb-navbar-scrolled' : ''}`} style={{ zIndex: 90 }}>
      <div className="container d-flex align-items-center justify-content-between g-5">
        {/* Logo group */}
        <Link className="d-flex align-items-center gap-2 text-decoration-none" to="/">
          <img src={images.logoIcon} alt="" width="23" height="22" className="flex-shrink-0" fetchPriority="high" />
          <img src={images.logoText} alt="iLeben" height="22" className="flex-shrink-0" fetchPriority="high" />
          <span className="lb-nav-separator" />
          <span className="d-flex align-items-baseline gap-1 lh-1">
            <img src={images.logoBest} alt="iLeben" height="22" className="flex-shrink-0" fetchPriority="high" />
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
          {mainLinks.map((link) =>
            <Navlink key={link.label} link={link} className="lb-nav-link text-decoration-none" />,
          )}
        </div>

        {/* Mobile nav */}
        <div className="d-lg-none d-flex align-items-center gap-2 ms-auto">
          {mainMobileLinks.map((link) =>
            <Navlink key={link.label} link={link} className="lb-nav-link text-decoration-none" />,
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
                  <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
                )}
                {/* {dropdownLinks.length > 0 && <hr className="lb-dropdown-divider my-1" />} */}
                <hr className="lb-dropdown-divider my-1" />
              </div>
              {/* TEMP: Page section links disabled — using fixedMenuLinks
              {dropdownLinks.map((link) =>
                <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
              )}
              */}
              {/* Fixed menu links (all breakpoints) */}
              {fixedMenuLinks.map((link) =>
                <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
