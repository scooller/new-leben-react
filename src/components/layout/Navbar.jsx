import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { images } from '../../data/content.js'

/** Render a link from {label, to?, href?, route?, featured?, highlight?, badge?} config */
function Navlink({ link, className }) {
  const to = link.to || link.route
  const isFeatured = Boolean(link.featured || link.highlight)
  const isDropdown = className?.includes('lb-dropdown-link')

  const extraClass = isFeatured
    ? (isDropdown ? ' lb-dropdown-link--featured' : ' lb-nav-link--featured')
    : ''
  const fullClass = `${className || ''}${extraClass}`

  const content = (
    <>
      <span>{link.label}</span>
      {link.badge && (
        <span className={isDropdown ? 'lb-dropdown-badge' : 'lb-nav-badge'}>
          {link.badge}
        </span>
      )}
    </>
  )

  const target = link.target || (link.href?.startsWith('http') ? '_blank' : undefined)
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  return to
    ? <Link to={to} className={fullClass}>{content}</Link>
    : <a href={link.href} target={target} rel={rel} className={fullClass}>{content}</a>
}

const mainLinks = [
  { label: 'Mundo Invest', href: '#' },
  { label: 'Clientes', to: '/login' },
  { label: 'Cotizar', to: '/cotizador' },
  { label: 'Brokers', to: '/brokers' },
]

/** Links planos (sin submenú) */
const menuLinks = []
// const menuLinks = [
//   { label: 'Locales comerciales', href: 'https://locales.ileben.cl/', featured: true },
// ]

/** Links agrupados bajo un encabezado */
const menuGroups = [
  {
    title: 'Locales Comerciales',
    items: [
      { label: 'Independencia', href: 'https://locales.ileben.cl/#indi' },
      { label: 'Santiago Centro', href: 'https://locales.ileben.cl/#living-town' },
      { label: 'Puerto Montt', href: 'https://locales.ileben.cl/#parque-germania' },
    ],
  },
  {
    title: 'Nosotros',
    items: [
      { label: 'Quienes somos', to: '/quienes-somos' },
      { label: 'Información de la empresa', to: '/informacion-de-la-empresa' },
      { label: 'Proyectos realizados', to: '/nosotros' },
    ],
  },
  {
    title: 'Personas',
    items: [
      { label: 'Canal de denuncias y consultas', href: 'https://denuncias.ileben.cl/' },
      { label: 'Acceso Colaboradores', href: 'https://ileben.cl/organigrama/' },
    ],
  },
  {
    title: 'Información Corporativa',
    items: [
      { label: 'Trabaja en Leben', to: '/trabaja-en-leben' },
      { label: 'Bases legales', to: '/bases-legales' },
      { label: 'Proceso de Reserva en línea', to: '/proceso-reserva-en-linea' },
    ],
  }
]

const mainMobileLinks = mainLinks.slice(0, 1)

/** Links dinámicos por página — aparecen después del separador */
const pageLinksMap = {
  '/brokers': [
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Categorías', href: '#categorias' },
    { label: 'Registro', href: '#registro' },
    { label: 'Eventos', href: '#eventos' },
    { label: 'Alianzas', href: '#alianzas' },
  ],
  '/cotizador': [
    { label: 'Cotizador', href: '#cotizador' },
    { label: 'Proyectos destacados', href: '#proyectos' },
  ],
  '/inn-test': [
    { label: 'Proyecto', href: '#proyecto' },
    { label: 'Equipamiento', href: '#departamentos' },
    { label: 'Cotizador', href: '#cotizador' },
    { label: 'Espacios', href: '#espacios' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Interiorismo', href: '#interiorismo' },
    { label: 'Contacto', href: '#contacto' },
  ],
}

/** Coincidir path con prefijo para detectar página actual */
function getPageLinks(pathname) {
  // Rutas estáticas exactas
  if (pageLinksMap[pathname]) return pageLinksMap[pathname]
  // Detalle de proyecto: /proyectos/:slug
  if (pathname.startsWith('/proyectos/')) {
    return [
      { label: 'Resumen', href: '#resumen' },
      { label: 'Planos', href: '#planos' },
      { label: 'Vista 360°', href: '#vista360' },
      { label: 'Cotizador', href: '#cotizador' },
      { label: 'Galería', href: '#galeria' },
      { label: 'Ubicación', href: '#ubicacion' },
    ]
  }
  return []
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const pageLinks = getPageLinks(location.pathname)

  // Pages without hero need the navbar always in "scrolled" state
  const forceScrolled = location.pathname.startsWith('/cotizador')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`lb-navbar position-fixed top-0 start-0 end-0${scrolled || forceScrolled ? ' lb-navbar-scrolled' : ''}`} style={{ zIndex: 90 }}>
      <div className="container d-flex align-items-center justify-content-between g-5">
        {/* Logo group */}
        <Link className="d-flex align-items-center gap-2 text-decoration-none" to="/">
          <img src={images.logoIcon} alt="" width="23" height="22" className="flex-shrink-0" fetchPriority="high" />
          <img src={images.logoText} alt="iLeben" height="22" className="flex-shrink-0" fetchPriority="high" />
          <span className="lb-nav-separator d-none d-md-block" />
          <span className="d-none d-md-flex align-items-baseline gap-1 lh-1">
            <img src={images.logoBest} alt="iLeben" height="40" className="flex-shrink-0" fetchPriority="high" />
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
              {/* Flat links */}
              {menuLinks.map((link) =>
                <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
              )}
              <hr className="lb-dropdown-divider my-1" />
              {/* Grouped links with sub-headers */}
              {menuGroups.map((group) => (
                <div key={group.title} className="lb-dropdown-group">
                  <span className="lb-dropdown-header-text">{group.title}</span>
                  {group.items.map((link) =>
                    <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
                  )}
                </div>
              ))}
              {/* Dynamic page links under Navegación */}
              {pageLinks.length > 0 && (
                <div className="lb-dropdown-group">
                  <span className="lb-dropdown-header-text">Navegación</span>
                  {pageLinks.map((link) =>
                    <Navlink key={link.label} link={link} className="lb-dropdown-link dropdown-item text-decoration-none" />,
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
