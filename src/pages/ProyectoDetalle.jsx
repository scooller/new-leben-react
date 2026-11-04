import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import Navbar from '../components/layout/Navbar.jsx'
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, ZoomIn } from 'lucide-react'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import CarouselNav from '../components/sections/CarouselNav.jsx'
import ProjectFeatureSection from '../components/sections/ProjectFeatureSection.jsx'
import HeroShell from '../components/sections/HeroShell.jsx'
import Recorridos360 from '../components/sections/Recorridos360.jsx'
import VideoTextSection from '../components/sections/VideoTextSection.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import RelatedProjects from '../components/proyecto/RelatedProjects.jsx'
import Alternatives from '../components/proyecto/Alternatives.jsx'
import InteriorismoSection from '../components/sections/InteriorismoSection.jsx'
import ProjectTeamAgents from '../components/proyecto/ProjectTeamAgents.jsx'
import ProjectPanoramasModal from '../components/proyecto/ProjectPanoramasModal.jsx'
import { ConciergeBellIcon } from '../components/icons/concierge-bell.jsx'
import { TableIcon } from '../components/icons/table.jsx'
import { ChefHatIcon } from '../components/icons/chef-hat.jsx'
import { DumbbellIcon } from '../components/icons/dumbbell.jsx'
import { WavesLadderIcon } from '../components/icons/waves-ladder.jsx'
import { KayakIcon } from '../components/icons/kayak.jsx'
import { HotTubIcon } from '../components/icons/hot-tub.jsx'
import { apiFetch } from '../lib/apiFetch.js'

const base = import.meta.env.BASE_URL

// Parallax estándar para secciones de ficha
const PARALLAX_STRENGTH = -12

// Helper para resolver rutas relativas locales y URLs absolutas/Curator
const resolveUrl = (path, fallback = '') => {
  if (!path) {
    if (!fallback) return ''
    return fallback.startsWith('http://') || fallback.startsWith('https://') || fallback.startsWith('data:')
      ? fallback
      : `${base}${fallback.replace(/^\/+/, '')}`
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  return `${base}${path.replace(/^\/+/, '')}`
}

// Helper para formatear títulos multilínea con saltos de línea (\n)
const formatMultiline = (text) => {
  if (!text) return null
  if (typeof text !== 'string') return text
  const lines = text.split('\n')
  if (lines.length <= 1) return text
  return lines.map((line, idx) => (
    <span key={idx}>
      {line}
      {idx < lines.length - 1 && <br />}
    </span>
  ))
}

// Mapa de íconos para navegación de amenidades / espacios
const ICON_MAP = {
  bell: ConciergeBellIcon,
  table: TableIcon,
  'chef-hat': ChefHatIcon,
  dumbbell: DumbbellIcon,
  'hot-tub': HotTubIcon,
  'waves-ladder': WavesLadderIcon,
  kayak: KayakIcon,
}

function WalkIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-block', verticalAlign: '-1px', flexShrink: 0 }}
    >
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z" />
    </svg>
  )
}

function generateGallerySlides(points) {
  if (!points || !points.length) return []
  return points.map((_, i) =>
    [-1, 0, 1].map((offset) => {
      const locIndex = (i + offset + points.length) % points.length
      return {
        ...points[locIndex],
        itemIndex: locIndex,
        isCenter: offset === 0,
      }
    })
  )
}

const ProjectGalleryCarousel = memo(function ProjectGalleryCarousel({
  slides,
  galleryRef,
  onSelectLocation,
}) {
  return (
    <div ref={galleryRef} id="innGalleryCarousel" className="carousel slide" data-bs-interval="false">
      <div className="carousel-inner">
        {slides.map((slideItems, slideIndex) => (
          <div className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`} key={slideIndex}>
            <div className="row g-3">
              {slideItems.map((loc, cardIdx) => (
                <div
                  className={`col-12 col-md-4 ${cardIdx !== 1 ? 'd-none d-md-block' : ''}`}
                  key={`${slideIndex}-${loc.id}-${cardIdx}`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectLocation(loc.itemIndex)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelectLocation(loc.itemIndex)
                      }
                    }}
                    className={`lb-inn-gallery__card ${cardIdx === 1 ? 'lb-inn-gallery__card--main lb-inn-gallery__card--active' : ''}`}
                    aria-label={`${loc.label || loc.name} - a ${loc.time || '15 minutos'}`}
                  >
                    <div className="lb-inn-gallery__img-wrap position-relative">
                      <img
                        src={resolveUrl(loc.img, 'images/inn/ubicacion/nuevo.jpg')}
                        alt={loc.name}
                        className="d-block w-100 lb-inn-gallery__img"
                        loading="lazy"
                        onError={(e) => {
                          const fallback = resolveUrl('images/inn/ubicacion/nuevo.jpg')
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback
                          }
                        }}
                      />
                      <a
                        href={resolveUrl(loc.img, 'images/inn/ubicacion/nuevo.jpg')}
                        data-fancybox="inn-galeria"
                        className="lb-inn-gallery__zoom lb-img-zoom-badge position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={(e) => e.stopPropagation()}
                        title="Ver foto ampliada"
                        aria-label="Ver foto ampliada"
                        tabIndex={0}
                      >
                        <ZoomIn size={15} />
                      </a>
                      <div className="lb-inn-gallery__overlay">
                        <h4 className="lb-inn-gallery__title">{loc.label || loc.name}</h4>
                        <div className="lb-inn-gallery__time">
                          <WalkIcon size={14} />
                          <span>a {loc.time || '15 minutos'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="lb-inn-gallery__nav lb-inn-gallery__nav--prev" type="button" data-bs-target="#innGalleryCarousel" data-bs-slide="prev" aria-label="Anterior">
        <ChevronLeft size={20} />
      </button>
      <button className="lb-inn-gallery__nav lb-inn-gallery__nav--next" type="button" data-bs-target="#innGalleryCarousel" data-bs-slide="next" aria-label="Siguiente">
        <ChevronRight size={20} />
      </button>
    </div>
  )
})

export default function ProyectoDetalle() {
  const { slug } = useParams()
  const cleanSlug = useMemo(() => {
    if (!slug) return 'inn'
    return slug.toLowerCase().replace(/edificio\s+/i, '').replace(/^edificio-/, '').trim()
  }, [slug])

  const [activeTab, setActiveTab] = useState('proyecto')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileNavRef = useRef(null)
  const [showPanoramasModal, setShowPanoramasModal] = useState(false)
  const [activeLocationIndex, setActiveLocationIndex] = useState(0)

  // Cerrar selector mobile al hacer click fuera
  useEffect(() => {
    if (!mobileNavOpen) return
    const handleClickOutside = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileNavOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileNavOpen])

  const [apiProjects, setApiProjects] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [selectedPlanta, setSelectedPlanta] = useState(null)
  const [projectContent, setProjectContent] = useState(null)

  // Cargar catálogo de proyectos desde el backend
  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      setApiProjects(data)
      if (Array.isArray(data)) {
        const found = data.find((p) => {
          const s = (p.name || '').toLowerCase().replace(/edificio\s+/i, '').replace(/\s+/g, '-')
          const pSlug = (p.slug || '').toLowerCase().replace(/^edificio-/, '')
          return (
            pSlug === cleanSlug ||
            s === cleanSlug ||
            p.slug === cleanSlug ||
            p.slug === `edificio-${cleanSlug}`
          )
        })
        if (found) setCurrentProject(found)
      }
    }).catch(() => { })
    return () => { cancelled = true }
  }, [cleanSlug])

  // Cargar contenido editorial 100% dinámico desde el backend (única fuente de verdad)
  useEffect(() => {
    let cancelled = false
    apiFetch(`/api/v1/proyectos/${cleanSlug}/content`).then(({ data, error }) => {
      if (cancelled || error || !data) return
      setProjectContent(data)
    }).catch(() => { })
    return () => { cancelled = true }
  }, [cleanSlug])

  // Sincronizar currentProject con el id devuelto por projectContent si la carga asíncrona se desfasa
  useEffect(() => {
    if (projectContent?.project_id && Array.isArray(apiProjects) && !currentProject) {
      const match = apiProjects.find((p) => p.id === projectContent.project_id)
      if (match) setCurrentProject(match)
    }
  }, [projectContent?.project_id, apiProjects, currentProject])

  const selection = useMemo(
    () => (selectedPlanta ? { planta: selectedPlanta } : currentProject ? { project: currentProject } : undefined),
    [selectedPlanta, currentProject]
  )

  const handleCotizarPlanta = (planta) => {
    setSelectedPlanta(planta)
    const cot = document.getElementById('cotizador')
    if (cot) {
      cot.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // --- DERIVACIÓN DINÁMICA DE SECCIONES DESDE EL BACKEND ---

  // Paleta de colores
  const themeStyles = useMemo(() => {
    const theme = projectContent?.theme || {}
    return {
      '--lb-project-accent': theme.accent || '#d9bc70',
      '--lb-project-accent-dark': theme.accent_dark || '#422c15',
      '--lb-project-accent-light': theme.accent_light || '#f9f2e7',
      '--lb-project-accent-bg': theme.accent_bg || '#faf4e8',
      '--lb-project-gradient': theme.gradient || 'linear-gradient(180deg, rgba(158, 122, 76, 1) 0%, rgba(216, 178, 92, 1) 65%, rgba(216, 178, 92, 1) 100%)',
      '--lb-project-btn-shadow': theme.btn_shadow || 'rgba(158, 122, 76, 0.25)',
    }
  }, [projectContent?.theme])

  // Hero
  const heroVideo = resolveUrl(projectContent?.hero?.video_url)
  const heroLogo = resolveUrl(projectContent?.hero?.logo_url)
  const heroTitle = formatMultiline(projectContent?.hero?.title || currentProject?.name || '')

  // Barra de especificaciones técnicas (INFO)
  const infoList = useMemo(() => {
    const raw = projectContent?.technical_info?.length ? projectContent.technical_info : []
    const precio = currentProject?.precio_desde
      ? `UF ${Math.round(currentProject.precio_desde).toLocaleString('es-CL')}`
      : null
    if (!precio) return raw
    return raw.map((item) => (item.id === 'precio' ? { ...item, value: precio } : item))
  }, [projectContent, currentProject])

  // 1. Proyecto
  const [activeSlide, setActiveSlide] = useState(0)
  const projectEyebrow = projectContent?.project_section?.eyebrow || 'Proyecto'
  const projectTitle = formatMultiline(projectContent?.project_section?.title || currentProject?.name || '')
  const projectDescHtml = projectContent?.project_section?.description || currentProject?.descripcion || ''
  const projectHighlightOffer = projectContent?.project_section?.highlight_offer ?? null
  const projectSlides = useMemo(() => {
    return projectContent?.project_section?.slides || projectContent?.project_slides || []
  }, [projectContent])

  // Videos intermedios
  const videoInterstitials = projectContent?.video_interstitials || []
  const video1 = videoInterstitials[0] || null
  const video2 = videoInterstitials[1] || null
  const video3 = projectContent?.espacios?.video || videoInterstitials[2] || null

  // 2. Equipamiento
  const [activeEquipmentSlide, setActiveEquipmentSlide] = useState(0)
  const equipmentEyebrow = projectContent?.equipment?.eyebrow || 'Equipamiento'
  const equipmentTitle = formatMultiline(projectContent?.equipment?.title || 'SOFISTICACIÓN EN CADA DETALLE')
  const equipmentDescHtml = projectContent?.equipment?.description || ''
  const equipmentBg = resolveUrl(projectContent?.equipment?.bg_image_url)
  const equipmentBrands = useMemo(() => projectContent?.equipment?.brands || [], [projectContent?.equipment?.brands])
  const equipmentSlides = useMemo(() => projectContent?.equipment?.slides || [], [projectContent?.equipment?.slides])
  const equipmentSpacesModal = projectContent?.equipment?.spaces_modal || []

  // Recorridos 360
  const virtualTours = projectContent?.virtual_tours?.tours?.length ? projectContent.virtual_tours.tours : undefined
  const virtualToursTitle = projectContent?.virtual_tours?.title || `Descubre ${projectContent?.name || currentProject?.name || 'el Proyecto'}`
  const virtualToursEyebrow = projectContent?.virtual_tours?.eyebrow || 'Recorridos Virtuales'
  const virtualToursBrochure = projectContent?.virtual_tours?.brochure_url || projectContent?.brochure_pdf_url

  // 3. Espacios Comunes
  const [activeEspacioSlide, setActiveEspacioSlide] = useState(0)
  const espaciosEyebrow = projectContent?.espacios?.eyebrow || 'Espacios'
  const espaciosTitle = formatMultiline(projectContent?.espacios?.title || 'ESPACIOS DE OTRO NIVEL')
  const espaciosDescHtml = projectContent?.espacios?.description || ''
  const espaciosBg = resolveUrl(projectContent?.espacios?.bg_image_url)

  const { espaciosNavItems, espaciosSlides } = useMemo(() => {
    const rawItems = projectContent?.espacios?.items || []
    if (!rawItems.length) {
      return { espaciosNavItems: [], espaciosSlides: [] }
    }
    const navItems = rawItems.map((item) => ({
      id: item.id || item.navId,
      label: item.label || item.name,
      icon: ICON_MAP[item.icon_key] || ConciergeBellIcon,
    }))
    const slides = rawItems.map((item) => ({
      navId: item.id || item.navId,
      img: item.img || item.image_url,
      link: item.link || item.img || item.image_url,
      alt: item.alt || item.label || item.name,
    }))
    return { espaciosNavItems: navItems, espaciosSlides: slides }
  }, [projectContent])

  const espaciosSlideIndex = useMemo(() => {
    const targetNavId = espaciosNavItems[activeEspacioSlide]?.id
    const idx = espaciosSlides.findIndex((s) => s.navId === targetNavId)
    return idx !== -1 ? idx : activeEspacioSlide
  }, [activeEspacioSlide, espaciosNavItems, espaciosSlides])

  // 4. Mapa & Ubicación (si no tiene imagen de mapa, no se renderiza)
  const mapData = useMemo(() => {
    const rawImage = projectContent?.map?.image_url
    const isExplicitlyEmpty = rawImage === '' || rawImage === null
    const resolvedImage = isExplicitlyEmpty ? null : resolveUrl(rawImage)

    return {
      hasMap: Boolean(resolvedImage),
      eyebrow: projectContent?.map?.eyebrow || 'Ubicación',
      title: formatMultiline(projectContent?.map?.title || 'Ubicación'),
      descriptionHtml: projectContent?.map?.description || '',
      image: resolvedImage,
      logo: resolveUrl(projectContent?.map?.logo_url),
      btnText: projectContent?.map?.btn_text || 'Experiencias',
      address: projectContent?.map?.address || currentProject?.direccion || '',
      pin: {
        x: projectContent?.map?.pin?.x ?? 33.3,
        y: projectContent?.map?.pin?.y ?? 72.4,
        logo: resolveUrl(projectContent?.map?.pin?.logo_url),
      },
    }
  }, [projectContent, currentProject])

  const locationPoints = useMemo(() => {
    return projectContent?.map?.pois || []
  }, [projectContent])

  const gallerySlides = useMemo(() => generateGallerySlides(locationPoints), [locationPoints])

  const galleryRef = useRef(null)
  const galleryCarouselInstance = useRef(null)

  useEffect(() => {
    const galleryEl = galleryRef.current
    if (!galleryEl) return

    const c = Carousel.getOrCreateInstance(galleryEl, { interval: false, ride: false, wrap: true })
    galleryCarouselInstance.current = c

    Fancybox.bind(galleryEl, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })

    const onSlid = (event) => {
      if (typeof event.to === 'number') {
        setActiveLocationIndex(event.to)
      }
    }

    galleryEl.addEventListener('slid.bs.carousel', onSlid)

    return () => {
      galleryEl.removeEventListener('slid.bs.carousel', onSlid)
      Fancybox.unbind(galleryEl)
      c.dispose()
      galleryCarouselInstance.current = null
    }
  }, [])

  const handleSelectLocation = useCallback((index) => {
    setActiveLocationIndex(index)
    const galleryEl = galleryRef.current
    if (!galleryEl) return
    const c = galleryCarouselInstance.current || Carousel.getOrCreateInstance(galleryEl, {
      interval: false,
      ride: false,
      wrap: true,
    })
    c.to(index)
  }, [])

  // 5. Interiorismo
  const interiorismoEyebrow = projectContent?.interiorismo?.eyebrow || 'Interiorismo'
  const interiorismoTitle = formatMultiline(projectContent?.interiorismo?.title || 'MAESTRÍA EN CADA DETALLE')
  const interiorismoDesc = projectContent?.interiorismo?.description || ''
  const interiorismoBg = resolveUrl(projectContent?.interiorismo?.bg_image_url)
  const designers = projectContent?.interiorismo?.designers?.length ? projectContent.interiorismo.designers : undefined

  // Modal Panoramas
  const panoramasCategories = projectContent?.panoramas?.categories || []

  // 6. Contacto
  const contactData = useMemo(() => ({
    eyebrow: projectContent?.contact?.eyebrow || 'Contacto',
    title: projectContent?.contact?.title || 'Conversemos',
    subtitle: projectContent?.contact?.subtitle || currentProject?.horario_atencion || '',
    wazeMap: projectContent?.contact?.waze_url || null,
    agents: projectContent?.contact?.agents || [],
  }), [projectContent, currentProject])

  // Tabs de navegación dinámicos según contenido disponible en backend
  const projectTabs = useMemo(() => {
    const tabs = []
    if (projectContent?.project_section || (projectSlides && projectSlides.length > 0)) {
      tabs.push({ id: 'proyecto', label: 'Proyecto' })
    }
    if (projectContent?.equipment || (equipmentSlides && equipmentSlides.length > 0) || (equipmentBrands && equipmentBrands.length > 0)) {
      tabs.push({ id: 'departamentos', label: 'Equipamiento' })
    }
    // Cotizador siempre presente si hay proyecto
    tabs.push({ id: 'cotizador', label: 'Cotizador', featured: true, class: 'btn-highlight' })

    if (espaciosSlides && espaciosSlides.length > 0) {
      tabs.push({ id: 'espacios', label: 'Espacios' })
    }
    if (mapData.hasMap) {
      tabs.push({ id: 'ubicacion', label: 'Ubicación' })
    }
    if (interiorismoDesc || (designers && designers.length > 0)) {
      tabs.push({ id: 'interiorismo', label: 'Interiorismo' })
    }
    tabs.push({ id: 'contacto', label: 'Contacto' })
    return tabs
  }, [projectContent, projectSlides, equipmentSlides, equipmentBrands, espaciosSlides, mapData.hasMap, interiorismoDesc, designers])

  const activeTabLabel = projectTabs.find((t) => t.id === activeTab)?.label || 'Proyecto'

  // Sincronizar tab activo según visibilidad en scroll
  useEffect(() => {
    const ids = projectTabs.map((t) => t.id)
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [projectTabs])

  return (
    <>
      <Navbar />
      <main className="lb-inn lb-project-detail" style={themeStyles}>
        {/* HERO */}
        <HeroShell
          id="inicio"
          className="lb-inn-hero justify-content-center position-relative"
          video={heroVideo}
          bgWrapClassName="lb-inn-hero__bg-wrap"
          overlayClassName="lb-inn-hero__overlay"
        >
          <div className="position-absolute d-flex align-items-start flex-column align-self-center container h-100 mx-auto">
            {heroLogo && (
              <ScrollAnim as='span' animation='zoom-in' className='mt-auto'>
                <img src={heroLogo} className="lb-inn-hero__logo" alt="Logo Proyecto" />
              </ScrollAnim>
            )}
            <SplitTitle as='h1' delay={0.2} stagger={0.05} className="lb-inn-hero__title p-0">
              {heroTitle}
            </SplitTitle>
          </div>
        </HeroShell>

        {/* Botonera desktop: pinneada debajo del header */}
        {projectTabs.length > 0 && (
          <nav className="lb-inn-hero-tabs d-none d-lg-block mx-auto" aria-label="Secciones del proyecto">
            <ScrollAnim animation='scale' className="card lb-inn-hero-tabs__inner rounded-pill shadow-lg">
              <div className="card-body py-4 px-4">
                <ul className="nav nav-pills nav-justified flex-nowrap align-items-center gap-3">
                  {projectTabs.map((t) => {
                    const isFeatured = Boolean(t.featured)
                    const isPermanentActive = Boolean(t.active)
                    const isCurrentActive = t.id === activeTab

                    let buttonClasses = 'nav-link'
                    buttonClasses += t.class ? ` ${t.class}` : ''
                    if (isFeatured) {
                      buttonClasses += ' nav-link--featured btn btn-outline-primary'
                      if (isPermanentActive || isCurrentActive) {
                        buttonClasses += ' active'
                      }
                    } else {
                      buttonClasses += ` nav-link__border ${isCurrentActive ? 'active' : ''}`
                    }

                    return (
                      <li className="nav-item" key={t.id}>
                        <button
                          type="button"
                          className={buttonClasses}
                          onClick={() => {
                            setActiveTab(t.id)
                            const target = document.getElementById(t.id)
                            target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                        >
                          {t.label.toUpperCase()}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </ScrollAnim>
          </nav>
        )}

        {/* Botonera mobile: selector compacto flotante */}
        {projectTabs.length > 0 && (
          <div className="d-lg-none lb-inn-mobile-nav" ref={mobileNavRef}>
            <div className="container px-3">
              <div className="lb-inn-mobile-nav__bar shadow-sm">
                <button
                  type="button"
                  className="btn w-100 d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  onClick={() => setMobileNavOpen((prev) => !prev)}
                  aria-expanded={mobileNavOpen}
                  aria-label="Seleccionar sección"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-pill lb-inn-mobile-nav__badge ${projectTabs.find((t) => t.id === activeTab)?.featured ? 'lb-inn-mobile-nav__badge--primary' : ''}`}>SECCIÓN</span>
                    <span className="fw-bold text-dark text-uppercase small">{activeTabLabel}</span>
                  </div>
                  <ChevronDown size={18} className={`lb-inn-mobile-nav__arrow ${mobileNavOpen ? 'open' : ''}`} />
                </button>

                {mobileNavOpen && (
                  <div className="lb-inn-mobile-nav__menu shadow-lg rounded-4 p-2 mt-2">
                    {projectTabs.map((t) => {
                      const isFeatured = Boolean(t.featured)
                      const isPermanentActive = Boolean(t.active)
                      const isCurrentActive = t.id === activeTab
                      const isTabActive = isPermanentActive || isCurrentActive

                      let itemClasses = 'dropdown-item py-2 px-3 rounded-3 d-flex align-items-center justify-content-between'
                      if (isFeatured) {
                        itemClasses += ' dropdown-item--featured'
                        if (isTabActive) {
                          itemClasses += ' active fw-bold'
                        }
                      } else if (isCurrentActive) {
                        itemClasses += ' active fw-bold'
                      }

                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={itemClasses}
                          onClick={() => {
                            setActiveTab(t.id)
                            setMobileNavOpen(false)
                            const target = document.getElementById(t.id)
                            target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                        >
                          <span>{t.label}</span>
                          {isTabActive && <span className={`lb-inn-dot ${isFeatured ? 'lb-inn-dot--primary' : ''}`} />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DATOS TÉCNICOS DEL PROYECTO */}
        {infoList.length > 0 && (
          <section className="lb-inn-info" aria-label="Datos del proyecto">
            <div className="container">
              <div className="row row-cols-1 row-cols-lg-5 text-center gx-4 gy-3">
                {infoList.map((t, i) => (
                  <ScrollAnim animation='scale' delay={0.2 * (i + 1)} className="col" key={t.id}>
                    <div className="d-flex flex-column gap-1">
                      <small className="lb-inn-info__label text-uppercase">{t.label}</small>
                      <span className="fw-bold" dangerouslySetInnerHTML={{ __html: t.value }} />
                    </div>
                  </ScrollAnim>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 1. SECCIÓN PROYECTO */}
        {(projectDescHtml || projectSlides.length > 0) && (
          <ProjectFeatureSection
            eyebrow={projectEyebrow}
            title={projectTitle}
            descriptionHtml={projectDescHtml}
            highlightOffer={projectHighlightOffer}
            slides={projectSlides}
            carouselId="projectCarousel"
            parallaxStrength={10}
            activeSlide={activeSlide}
            onSlideChange={setActiveSlide}
            showIndicators={false}
            id="proyecto"
            ariaLabel="Proyecto"
          />
        )}

        {video1?.video_url && (
          <VideoTextSection
            eyebrow={video1.eyebrow}
            title={video1.title}
            text={video1.text}
            videoSrc={resolveUrl(video1.video_url)}
          />
        )}

        {/* 2. SECCIÓN EQUIPAMIENTO */}
        {(equipmentDescHtml || equipmentSlides.length > 0 || equipmentBrands.length > 0) && (
          <ProjectFeatureSection
            eyebrow={equipmentEyebrow}
            title={equipmentTitle}
            descriptionHtml={equipmentDescHtml}
            highlightLogos={equipmentBrands}
            slides={equipmentSlides}
            carouselId="projectEquipmentCarousel"
            parallaxStrength={PARALLAX_STRENGTH}
            backgroundImage={equipmentBg}
            id="departamentos"
            className='pb-2 mb-2'
            ariaLabel="Departamentos"
            showIndicators={false}
            activeSlide={activeEquipmentSlide}
            onSlideChange={setActiveEquipmentSlide}
            spacesModal={equipmentSpacesModal.length > 0 ? {
              buttonLabel: 'Ver Detalles',
              galleries: equipmentSpacesModal,
            } : undefined}
          />
        )}

        {virtualTours && virtualTours.length > 0 && (
          <Recorridos360
            tours={virtualTours}
            title={virtualToursTitle}
            eyebrow={virtualToursEyebrow}
            brochureUrl={virtualToursBrochure}
          />
        )}

        {/* COTIZADOR */}
        <Cotizador
          className="lb-inn-cot"
          universal
          projects={apiProjects}
          selection={selection}
          brochureUrl={virtualToursBrochure}
        />

        {/* PROYECTOS RELACIONADOS */}
        <RelatedProjects
          data={{
            eyebrow: `Alternativas a ${currentProject?.name || projectContent?.name || 'Proyecto'}`,
            highlight: currentProject?.comuna || projectContent?.hero?.location || '',
            apiId: currentProject?.id || projectContent?.project_id,
            projectName: currentProject?.name || projectContent?.name || '',
          }}
          onCotizar={handleCotizarPlanta}
        />

        {/* OTRAS OPCIONES */}
        <Alternatives
          data={{
            title: '¿Buscas otras opciones?',
            excludeName: currentProject?.name || projectContent?.name || '',
          }}
        />

        {video2?.video_url && (
          <VideoTextSection
            eyebrow={video2.eyebrow}
            title={video2.title}
            text={video2.text}
            videoSrc={resolveUrl(video2.video_url)}
          />
        )}

        {/* 3. SECCIÓN ESPACIOS COMUNES */}
        {(espaciosDescHtml || espaciosSlides.length > 0) && (
          <>
            <ProjectFeatureSection
              title={espaciosTitle}
              eyebrow={espaciosEyebrow}
              descriptionHtml={espaciosDescHtml}
              slides={espaciosSlides}
              carouselId="projectEspaciosCarousel"
              parallaxStrength={PARALLAX_STRENGTH}
              backgroundImage={espaciosBg}
              id="espacios"
              className='pb-2 mb-2'
              ariaLabel="Espacios"
              showIndicators={false}
              activeSlide={espaciosSlideIndex}
            />

            {espaciosNavItems.length > 0 && (
              <CarouselNav
                items={espaciosNavItems}
                variant="stacked"
                activeIndex={activeEspacioSlide}
                onSelect={setActiveEspacioSlide}
              />
            )}
          </>
        )}

        {video3?.video_url && (
          <VideoTextSection
            eyebrow={video3.eyebrow}
            title={video3.title}
            text={video3.text}
            videoSrc={resolveUrl(video3.video_url)}
          />
        )}

        {/* 4. SECCIÓN MAPA Y UBICACIÓN */}
        {mapData.hasMap && (
          <section className="container-fluid lb-inn-map" id="ubicacion">
            <div className="container">
              <div className="row g-0">
                <div className="col-12 col-lg-5 ps-3 ps-md-4 ps-lg-5 d-flex flex-column justify-content-center">
                  <div className="mb-4 mb-md-5 mt-3 lb-inn-map__header">
                    <ScrollAnim as="span" animation="flip-x" className="lb-inn-proyecto__eyebrow d-block mb-3">{mapData.eyebrow}</ScrollAnim>
                    <div className="d-flex align-items-center gap-3 gap-md-4">
                      {mapData.logo && (
                        <ScrollAnim as="span" animation="fade-left">
                          <img
                            src={mapData.logo}
                            alt="Logo Proyecto"
                            className="lb-inn-map__header-logo"
                          />
                        </ScrollAnim>
                      )}
                      <div className='lb-inn-map__titulos-right'>
                        <SplitTitle as="h2" className="lb-inn-proyecto__title mb-0" text={mapData.title} stagger={0.06} />
                      </div>
                    </div>
                  </div>
                  <div className="lb-inn-map__text text-start">
                    <ScrollAnim animation="fade-up" className="lb-inn-proyecto__text lh-lg mb-4 mb-md-5 w-md-80">
                      <span dangerouslySetInnerHTML={{ __html: mapData.descriptionHtml }} />
                    </ScrollAnim>
                    {panoramasCategories.length > 0 && (
                      <button
                        type="button"
                        className="btn lb-inn-btn lb-project-btn"
                        onClick={() => setShowPanoramasModal(true)}
                      >
                        <span>{(mapData.btnText || 'Experiencias').toUpperCase()}</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-12 col-lg-7">
                  <ScrollAnim animation="fade-right">
                    <div className="lb-inn-map__interactive-wrap position-relative w-100">
                      <img
                        src={mapData.image}
                        alt="Mapa interactivo de ubicación"
                        className="img-fluid w-100 h-100 object-fit-contain d-block"
                        loading="lazy"
                      />

                      {/* Pin PROYECTO */}
                      <div
                        className="lb-inn-map__pin-inn position-absolute"
                        style={{ left: `${mapData.pin.x}%`, top: `${mapData.pin.y}%` }}
                        title={currentProject?.name || 'PROYECTO'}
                      >
                        {mapData.pin.logo && (
                          <img
                            src={mapData.pin.logo}
                            alt={currentProject?.name || 'PROYECTO'}
                            className="lb-inn-map__pin-inn-img"
                          />
                        )}
                      </div>

                      {/* Pines interactivos */}
                      {locationPoints.map((point, index) => {
                        const isSelected = activeLocationIndex === index
                        const dir = point.direction || point.dir || 'right'
                        return (
                          <button
                            key={point.id || index}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              handleSelectLocation(index)
                            }}
                            onPointerDown={(e) => {
                              if (e.button === 0) {
                                handleSelectLocation(index)
                              }
                            }}
                            className={`lb-inn-map__pin lb-inn-map__pin--${dir} position-absolute ${isSelected ? 'active' : ''}`}
                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            aria-label={`${point.name} (${point.distance})`}
                          >
                            <span className={`lb-inn-map__pin-dot-wrap ${isSelected ? 'dot-highlight' : ''}`}>
                              <span className="lb-inn-map__pin-dot" />
                            </span>
                            <span className="lb-inn-map__pin-line" />
                            <span className="lb-inn-map__pin-pill">
                              <strong>{point.label || point.name}</strong>
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Dirección bajo el mapa */}
                    {mapData.address && (
                      <div className="lb-inn-map__address d-flex align-items-center justify-content-center gap-2 mb-3 mb-md-4">
                        <MapPin size={22} className="lb-inn-map__address-icon" />
                        <span className="lb-inn-map__address-text">{mapData.address}</span>
                      </div>
                    )}
                  </ScrollAnim>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Carousel de imágenes con interacción sincronizada */}
        {mapData.hasMap && gallerySlides.length > 0 && (
          <section className="lb-inn-gallery py-2 py-md-3" id="galeria">
            <ScrollAnim className='container' animation="fade-up">
              <ProjectGalleryCarousel
                slides={gallerySlides}
                galleryRef={galleryRef}
                onSelectLocation={handleSelectLocation}
              />
            </ScrollAnim>
          </section>
        )}

        {/* 5. INTERIORISMO */}
        {(interiorismoDesc || (designers && designers.length > 0)) && (
          <InteriorismoSection
            eyebrow={interiorismoEyebrow}
            title={interiorismoTitle}
            parallaxStrength={PARALLAX_STRENGTH}
            description={interiorismoDesc}
            backgroundImage={interiorismoBg}
            designers={designers}
            id="interiorismo"
            ariaLabel="Interiorismo"
          />
        )}
      </main>

      {/* MODAL DE PANORAMAS / EXPERIENCIAS */}
      {panoramasCategories.length > 0 && (
        <ProjectPanoramasModal
          show={showPanoramasModal}
          onClose={() => setShowPanoramasModal(false)}
          projectName={currentProject?.name || projectContent?.name || 'Proyecto'}
          categories={panoramasCategories}
          backgroundImage={projectContent?.panoramas?.bg_image_url}
        />
      )}

      {/* SECCIÓN CONTACTO — ASESORES + MAPA */}
      <ProjectTeamAgents data={contactData} apiId={currentProject?.id || projectContent?.project_id} />

      <Footer />
    </>
  )
}
