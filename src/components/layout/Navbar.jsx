import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../../data/content.js'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Diferenciadores', href: '#nosotros' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Proyectos', route: '/proyectos' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`lb-navbar position-fixed top-0 start-0 end-0${scrolled ? ' lb-navbar-scrolled' : ''}`} style={{ zIndex: 1030 }}>
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
        <div className="d-none d-lg-flex align-items-center gap-2">
          {navLinks.map((link) =>
            link.route ? (
              <Link key={link.label} to={link.route} className="lb-nav-link text-decoration-none">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="lb-nav-link text-decoration-none">
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="btn btn-danger btn-sm rounded-pill lb-nav-cta text-decoration-none">COTIZAR</Link>

          {/* Hamburger dropdown */}
          <div className="position-relative" ref={dropdownRef}>
            <button
              className={`btn btn-sm lb-hamburger ${dropdownOpen ? 'open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Menu"
            >
              <span className="lb-burger-line" />
              <span className="lb-burger-line" />
              <span className="lb-burger-line" />
            </button>

            {dropdownOpen && (
              <div className="lb-dropdown position-absolute end-0 bg-white rounded-3 shadow overflow-hidden">
                {navLinks.map((link) =>
                  link.route ? (
                    <Link
                      key={link.label}
                      to={link.route}
                      className="lb-dropdown-link d-block text-decoration-none"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="lb-dropdown-link d-block text-decoration-none"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
