import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import Navbar from '../components/layout/Navbar.jsx'
import { ChevronLeft, ChevronRight, ChevronDown, Maximize2, MapPin } from 'lucide-react'
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
import ProjectPanoramasModal, { PANORAMAS_CATEGORIES } from '../components/proyecto/ProjectPanoramasModal.jsx'
import { ConciergeBellIcon } from '../components/icons/concierge-bell.jsx'
import { TableIcon } from '../components/icons/table.jsx'
import { ChefHatIcon } from '../components/icons/chef-hat.jsx'
import { DumbbellIcon } from '../components/icons/dumbbell.jsx'
import { WavesLadderIcon } from '../components/icons/waves-ladder.jsx'
import { KayakIcon } from '../components/icons/kayak.jsx'
import { HotTubIcon } from '../components/icons/hot-tub.jsx'
import { apiFetch } from '../lib/apiFetch.js'
import { formatPriceUF } from '../lib/projectUtils.js'
import { getProjectBySlug } from '../data/projects.js'

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

// --- DATOS CANÓNICOS (FALLBACK DE ALTA GAMA) ---
const INN_THEME = {
  accent: '#d8b35c',
  accentDark: '#422c15',
  accentLight: '#f9f2e7',
  accentBg: '#faf4e8',
  gradient: 'linear-gradient(180deg, rgba(158, 122, 76, 1) 0%, rgba(216, 178, 92, 1) 65%, rgba(216, 178, 92, 1) 100%)',
  shadow: 'rgba(158, 122, 76, 0.25)',
}

const INN_TABS = [
  { id: 'proyecto', label: 'Proyecto' },
  { id: 'departamentos', label: 'Equipamiento' },
  { id: 'cotizador', label: 'Cotizador', featured: true, class: 'btn-highlight' },
  { id: 'espacios', label: 'Espacios' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'interiorismo', label: 'Interiorismo' },
  { id: 'contacto', label: 'Contacto' },
]

const INN_INFO = [
  { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991,<br /> Puerto Varas' },
  { id: 'tipologias', label: 'Tipologías', value: 'Deptos de 2, 3 y 4 dormitorios, dúplex <br />y deptos con patio privado' },
  { id: 'metrajes', label: 'Metrajes', value: 'Desde 85 m²' },
  { id: 'precio', label: 'Precio desde', value: '—' },
  { id: 'estado', label: 'Estado del proyecto', value: 'Entrega futura' },
]

const INN_SLIDES = [
  { img: 'images/inn/proyecto/Proyecto_01_Acceso.jpg', alt: 'Acceso' },
  { img: 'images/inn/proyecto/Proyecto_02_Cocina.jpg', alt: 'Cocina' },
  { img: 'images/inn/proyecto/Proyecto_03_Living-Comedor.jpg', alt: 'Living Comedor' },
  { img: 'images/inn/proyecto/Proyecto_04_Vista-Acceso.jpg', alt: 'Vista Acceso' },
  { img: 'images/inn/proyecto/Proyecto_05_Isla.jpg', alt: 'Isla Cocina' },
  { img: 'images/inn/proyecto/Proyecto_06_Dorm-Ppal.jpg', alt: 'Dormitorio Principal' },
]

const INN_EQUIPMENT_LOGOS = [
  { src: 'images/logos/franke.png', alt: 'Franke' },
  { src: 'images/logos/mk.png', alt: 'MK' },
  { src: 'images/logos/paini.png', alt: 'Paini' },
  { src: 'images/logos/hansgrohe.png', alt: 'Hansgrohe' },
]

const INN_EQUIPMENT_SLIDES = [
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg', alt: 'Hall de acceso' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg', alt: 'Cocina' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg', alt: 'Living Comedor' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg', alt: 'Terraza' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg', alt: 'Dormitorio Principal' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg', alt: 'Baño' },
]

const INN_ESPACIOS_NAV_ITEMS = [
  { id: 'hall', label: 'Hall de acceso', icon: ConciergeBellIcon },
  { id: 'atrio', label: 'Atrio con 7<br />pisos de altura', icon: TableIcon },
  { id: 'gourmet', label: 'Sala gourmet con<br />quincho techado', icon: ChefHatIcon },
  { id: 'training', label: 'Training Zone', icon: DumbbellIcon },
  { id: 'jacuzzi', label: 'Rooftop con jacuzzi', icon: HotTubIcon },
  { id: 'piscina', label: 'Piscina climatizada', icon: WavesLadderIcon },
  { id: 'bodega', label: 'Bodega náutica', icon: KayakIcon },
]

const INN_ESPACIOS_SLIDES = [
  { navId: 'hall', img: 'images/inn/eecc/EECC_Hall_Acceso_Edificio.jpg', link: 'images/inn/eecc/EECC_Hall_Acceso_Edificio.jpg', alt: 'Hall de acceso' },
  { navId: 'atrio', img: 'images/inn/eecc/EECC_03.jpg', link: 'images/inn/eecc/EECC_Atrio_2.png', alt: 'Atrio' },
  { navId: 'gourmet', img: 'images/inn/eecc/EECC_01.jpg', link: 'images/inn/eecc/EECC_Quincho_Gourmet.jpg', alt: 'Gourmet + Quincho equipado' },
  { navId: 'training', img: 'images/inn/eecc/EECC_Training_Zone.jpg', alt: 'Training Zone' },
  { navId: 'jacuzzi', img: 'images/inn/eecc/EECC_Terraza_Jacuzzi.jpg', alt: 'Jacuzzi exterior', link: 'images/inn/eecc/EECC_Terraza_Jacuzzi_2.jpg' },
  { navId: 'piscina', img: 'images/inn/eecc/EECC_Piscina_Climatizada.jpg', alt: 'Piscina climatizada' },
  { navId: 'bodega', img: 'images/inn/eecc/EECC_02.jpg', link: 'images/inn/eecc/EECC_Bodega_Nautica.jpg', alt: 'Bodega náutica' },
]

const INN_LOCATION_POINTS = [
  { id: 1, name: 'Mesa Tropera', label: 'MESA TROPERA', distance: '1.2 km', category: 'Gastronomía', time: '12 minutos', img: 'images/inn/ubicacion/Mesa_Tropera_AI.jpg', x: 15.1, y: 33.2 },
  { id: 2, name: 'Jumbo', label: 'JUMBO', distance: '1.5 km', category: 'Supermercado', time: '15 minutos', img: 'images/inn/ubicacion/Supermercado_Jumbo_AI.jpg', x: 66.9, y: 55.1 },
  { id: 3, name: 'Casino Dreams', label: 'CASINO DREAMS', distance: '2.3 km', category: 'Entretenimiento', time: '22 minutos', img: 'images/inn/ubicacion/Casino_Dreams_01_IA.jpg', x: 15.9, y: 46.9 },
  { id: 4, name: 'Cassis', label: 'CASSIS', distance: '2.5 km', category: 'Cafetería', time: '25 minutos', img: 'images/inn/ubicacion/Cassis_IA.jpg', x: 14.9, y: 44.2 },
  { id: 5, name: 'Mall Paseo', label: 'MALL', distance: '3.1 km', category: 'Comercio', time: '30 minutos', img: 'images/inn/ubicacion/Paseo_Puerto_Varas_AI.jpg', x: 9.3, y: 47.7, direction: 'down' },
  { id: 6, name: 'La Olla', label: 'LA OLLA', distance: '3.8 km', category: 'Gastronomía', time: '20 minutos', img: 'images/inn/ubicacion/La Olla_IA.jpg', x: 63.4, y: 75.6 },
  { id: 7, name: 'Costane', label: 'Costanera', distance: '1.0 km', category: 'Interés', time: '10 minutos', img: 'images/inn/ubicacion/Costanera_2_IA.jpg', x: 15.6, y: 40.1 },
]

const INN_SPACES_MODAL_GALLERIES = [
  {
    label: 'Hall de acceso',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg', alt: 'Hall de acceso', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Cerradura_Digital.jpg', alt: 'Puerta de acceso con cerradura digital', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Cerradura_Digital.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Piso_SPC.jpg', alt: 'Piso vinilico SCP', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Piso_SPC.jpg' },
    ],
  },
  {
    label: 'Cocina',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg', alt: 'Cocina', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Cocina_Cubierta.jpg', alt: 'Cubierta ultracompacta terminación travertino' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Cocina_Refrigerador.jpg', alt: 'Refrigerador panelado Franke' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Cocina_Lavavajillas.jpg', alt: 'Lavavajillas panelado Franke' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Cocina_Encimera.jpg', alt: 'Encimera de inducción Franke' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Microondas_Horno_Franke.jpg', alt: 'Microondas y horno empotrados Franke' },
      { img: 'images/inn/equipamiento/cocina/Equipamiento_Detalle_Cocina_Griferia_Paini.jpg', alt: 'Grifería italiana Paini' },
    ],
  },
  {
    label: 'Living Comedor',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg', alt: 'Living comedor', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Puertas_Interiores.jpg', alt: 'Puertas enchapadas en madera de encina', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Puertas_Interiores.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Iluminación_Ventanales.jpg', alt: 'Iluminación incluida ventanas de termopanel de PVC', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Iluminación_Ventanales.jpg' },
    ],
  },
  {
    label: 'Terraza',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg', alt: 'Terraza', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Pavimento.jpg', alt: 'Terraza con pavimento Gres', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Pavimento.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Tejuelas.jpg', alt: 'Muros exteriores con revestimiento de tejuelas en madera nativa', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Tejuelas.jpg' },
    ],
  },
  {
    label: 'Dormitorios',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg', alt: 'Dormitorio principal', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Wallkincloset.jpg', alt: 'Walk in closet', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Wallkincloset.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_2.jpg', alt: 'Dormitorio 2', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_2.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_3.jpg', alt: 'Dormitorio 3', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_3.jpg' },
    ],
  },
  {
    label: 'Baños',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg', alt: 'Baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Mampara.jpg', alt: 'Mampara vidrio templado en baños', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Mampara.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Grifería_Hansgrohe.jpg', alt: 'Grifería Hansgrohe en baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Grifería_Hansgrohe.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg', alt: 'Columna de ducha Hansgrohe en baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Accesorios_MK.jpg', alt: 'Accesorios marca MK', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Accesorios_MK.jpg' },
    ],
  },
]

const INN_MAP = {
  eyebrow: 'Ubicación',
  title: 'Entorno INNigualable',
  descriptionHtml: `<p>Despertar con el lago Llanquihue y los volcanes enmarcando el paisaje es solo el comienzo. A un paso de INN, la costanera invita a caminar, disfrutar un café de especialidad, navegar o vivir nuevas aventuras.</p>
  <p>Puerto Varas ofrece también una reconocida gastronomía, calles con identidad y una conexión permanente con la naturaleza del sur de Chile. Desde aquí se abren rutas hacia Ensenada, Frutillar, Chiloé y algunas de las postales más inolvidables de la Región de Los Lagos. Una ubicación excepcional para integrar paisaje, gastronomía, aventura y vida al aire libre día a día</p>`,
  image: 'images/inn/Mapa_Ok_Sitio.png',
  logo: 'images/inn/E_titulo.png',
  btnText: 'Experiencias',
  address: 'Vicente Pérez Rosales 991, Puerto Varas',
}

const INN_TEAM = {
  eyebrow: 'Contacto',
  title: 'Conversemos',
  subtitle: '<b>Sala de ventas y piloto:</b> Vicente Pérez Rosales 991, Puerto Varas.<br /><b>Horario:</b> Lun a Dom. 10:00 a 14:00 y 15:00 a 19:00 horas.',
  wazeMap: 'https://embed.waze.com/es/iframe?zoom=16&lat=-41.326080&lon=-72.970514&ct=livemap&pin=1&desc=0',
  agents: [
    { name: 'Patricia Ramírez', phone: '+56 9 3420 4833', email: 'pramirez@ileben.cl', avatar: `${base}images/team/Ramirez.jpg` },
    { name: 'Catalina Cid', phone: '+56 9 9577 3431', email: 'ccid@ileben.cl', avatar: `${base}images/team/Cid.jpg` },
    { name: 'Patricia Singh', phone: '+56 9 3420 4832', email: 'psingh@ileben.cl', avatar: `${base}images/team/Singh.jpg` },
  ],
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
                        className="lb-inn-gallery__zoom position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={(e) => e.stopPropagation()}
                        title="Ver foto ampliada"
                        aria-label="Ver foto ampliada"
                        tabIndex={0}
                      >
                        <Maximize2 size={13} />
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
  const cleanSlug = (slug || 'inn').toLowerCase().replace(/edificio\s+/i, '').replace(/edificio-/i, '').trim()

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

  const activeTabLabel = INN_TABS.find((t) => t.id === activeTab)?.label || 'Proyecto'
  const [apiProjects, setApiProjects] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [selectedPlanta, setSelectedPlanta] = useState(null)
  const [projectContent, setProjectContent] = useState(null)

  // Cargar catálogo de proyectos
  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      setApiProjects(data)
      if (Array.isArray(data)) {
        const found = data.find((p) => {
          const s = (p.name || '').toLowerCase().replace(/edificio\s+/i, '').replace(/\s+/g, '-')
          return s === cleanSlug || (cleanSlug === 'inn' && p.id === 9)
        })
        if (found) setCurrentProject(found)
      }
    }).catch(() => { })
    return () => { cancelled = true }
  }, [cleanSlug])

  // Cargar contenido editorial 100% dinámico desde el backend
  useEffect(() => {
    let cancelled = false
    apiFetch(`/api/v1/proyectos/${cleanSlug}/content`).then(({ data, error }) => {
      if (cancelled || error || !data) return
      setProjectContent(data)
    }).catch(() => { })
    return () => { cancelled = true }
  }, [cleanSlug])

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

  // --- DERIVACIÓN DINÁMICA DE SECCIONES CON FALLBACK ---

  // Paleta de colores
  const theme = projectContent?.theme || INN_THEME
  const themeStyles = useMemo(() => ({
    '--lb-project-accent': theme.accent || INN_THEME.accent,
    '--lb-project-accent-dark': theme.accent_dark || INN_THEME.accentDark,
    '--lb-project-accent-light': theme.accent_light || INN_THEME.accentLight,
    '--lb-project-accent-bg': theme.accent_bg || INN_THEME.accentBg,
    '--lb-project-gradient': theme.gradient || INN_THEME.gradient,
    '--lb-project-btn-shadow': theme.btn_shadow || INN_THEME.shadow,
  }), [theme])

  // Hero
  const heroVideo = resolveUrl(projectContent?.hero?.video_url, 'video/inn-new.mp4')
  const heroLogo = resolveUrl(projectContent?.hero?.logo_url, 'images/inn/Logo_INN_Header.png')
  const heroTitle = formatMultiline(projectContent?.hero?.title || 'VIVE EL LUJO\nEN PUERTO VARAS')

  // Barra de especificaciones técnicas (INFO)
  const infoList = useMemo(() => {
    const raw = projectContent?.technical_info?.length ? projectContent.technical_info : INN_INFO
    const precio = currentProject?.precio_desde
      ? formatPriceUF(currentProject.precio_desde)
      : null
    if (!precio) return raw
    return raw.map((item) => (item.id === 'precio' ? { ...item, value: precio } : item))
  }, [projectContent, currentProject])

  // 1. Proyecto
  const [activeSlide, setActiveSlide] = useState(0)
  const projectEyebrow = projectContent?.project_section?.eyebrow || 'Proyecto'
  const projectTitle = formatMultiline(projectContent?.project_section?.title || 'LOS MEJORES DEPARTAMENTOS\nDE PUERTO VARAS')
  const projectDescHtml = projectContent?.project_section?.description || `<p>INN propone una nueva forma de vivir Puerto Varas, con espacios amplios y luminosos, terminaciones de alto estándar y distribuciones pensadas para disfrutar todo el año.</p>
  <p>Departamentos tradicionales, unidades con patio privado y exclusivos dúplex con vista al lago Llanquihue se complementan con una experiencia Home & Wellness que invita a relajarse, desconectarse y disfrutar el sur con la esencia de un hotel boutique</p>`
  const projectHighlightOffer = projectContent?.project_section?.highlight_offer ?? 'paga el pie en <b>60</b> cuotas'
  const projectSlides = useMemo(() => {
    const s = projectContent?.project_section?.slides || projectContent?.project_slides
    return (s && s.length) ? s : INN_SLIDES
  }, [projectContent])

  // Videos intermedios
  const videoInterstitials = projectContent?.video_interstitials || []
  const video1 = videoInterstitials[0] || {
    eyebrow: '',
    title: '',
    text: 'Un estilo de vida único frente al lago y los volcanes',
    video_url: 'video/video_reconfortante_a.mp4',
  }
  const video2 = videoInterstitials[1] || {
    eyebrow: '',
    title: '',
    text: 'Descubre todo lo que INN tiene para ofrecer',
    video_url: 'video/exterior.mp4',
  }
  const video3 = projectContent?.espacios?.video || videoInterstitials[2] || {
    eyebrow: '',
    title: '',
    text: 'Despierta tu espíritu aventurero en la Región de Los Lagos',
    video_url: 'video/lipsum.mp4',
  }

  // 2. Equipamiento
  const [activeEquipmentSlide, setActiveEquipmentSlide] = useState(0)
  const equipmentEyebrow = projectContent?.equipment?.eyebrow || 'Equipamiento'
  const equipmentTitle = formatMultiline(projectContent?.equipment?.title || 'SOFISTICACIÓN\nEN CADA DETALLE')
  const equipmentDescHtml = projectContent?.equipment?.description || `<p>Equipamiento y terminaciones de alto estándar: cocina Franke con refrigerador y lavavajillas panelables, cubiertas ultracompactas en terminación travertino, griferías Paini y Hansgrohe, puertas enchapadas en encina, piso vinílico SPC y ventanas termopanel PVC negras.</p>
  <p>Las terrazas incorporan revestimiento parcial de tejas, mientras cada departamento cuenta con calefacción por radiadores y caldera individual a gas natural.</p>`
  const equipmentBg = resolveUrl(projectContent?.equipment?.bg_image_url, 'images/inn/Perspectiva.svg')
  const equipmentBrands = projectContent?.equipment?.brands?.length ? projectContent.equipment.brands : INN_EQUIPMENT_LOGOS
  const equipmentSlides = projectContent?.equipment?.slides?.length ? projectContent.equipment.slides : INN_EQUIPMENT_SLIDES
  const equipmentSpacesModal = projectContent?.equipment?.spaces_modal?.length ? projectContent.equipment.spaces_modal : INN_SPACES_MODAL_GALLERIES

  // Recorridos 360
  const virtualTours = projectContent?.virtual_tours?.tours?.length ? projectContent.virtual_tours.tours : undefined
  const virtualToursTitle = projectContent?.virtual_tours?.title || `Descubre ${projectContent?.name || currentProject?.name || 'el Proyecto'}`
  const virtualToursEyebrow = projectContent?.virtual_tours?.eyebrow || 'Recorridos Virtuales'
  const virtualToursBrochure = projectContent?.virtual_tours?.brochure_url || projectContent?.brochure_pdf_url

  // 3. Espacios Comunes
  const [activeEspacioSlide, setActiveEspacioSlide] = useState(0)
  const espaciosEyebrow = projectContent?.espacios?.eyebrow || 'Espacios'
  const espaciosTitle = formatMultiline(projectContent?.espacios?.title || 'ESPACIOS DE\nOTRO NIVEL')
  const espaciosDescHtml = projectContent?.espacios?.description || `<p>Los espacios están concebidos como una extensión natural de tu departamento, donde la sensación hotelera se integra con la serenidad del entorno.</p><p>Cada ambiente ha sido cuidadosamente diseñado para enriquecer tu rutina diaria, ofreciendo espacios de encuentro, trabajo y descanso que combinan la calidez sureña, una delicada propuesta de interiorismo y vistas privilegiadas para disfrutar Puerto Varas al máximo</p>`
  const espaciosBg = resolveUrl(projectContent?.espacios?.bg_image_url, 'images/inn/Climbing.svg')

  const { espaciosNavItems, espaciosSlides } = useMemo(() => {
    const rawItems = projectContent?.espacios?.items
    if (!rawItems || !rawItems.length) {
      return { espaciosNavItems: INN_ESPACIOS_NAV_ITEMS, espaciosSlides: INN_ESPACIOS_SLIDES }
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
    const resolvedImage = isExplicitlyEmpty ? null : resolveUrl(rawImage, INN_MAP.image)

    return {
      hasMap: Boolean(resolvedImage),
      eyebrow: projectContent?.map?.eyebrow || INN_MAP.eyebrow,
      title: formatMultiline(projectContent?.map?.title || INN_MAP.title),
      descriptionHtml: projectContent?.map?.description || INN_MAP.descriptionHtml,
      image: resolvedImage,
      logo: resolveUrl(projectContent?.map?.logo_url, INN_MAP.logo),
      btnText: projectContent?.map?.btn_text || INN_MAP.btnText,
      address: projectContent?.map?.address || INN_MAP.address,
      pin: {
        x: projectContent?.map?.pin?.x ?? 33.3,
        y: projectContent?.map?.pin?.y ?? 72.4,
        logo: resolveUrl(projectContent?.map?.pin?.logo_url, 'images/inn/pin_logo.png'),
      },
    }
  }, [projectContent])

  const locationPoints = useMemo(() => {
    const p = projectContent?.map?.pois
    return (p && p.length) ? p : INN_LOCATION_POINTS
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

  // Sincronizar tab activo según visibilidad en scroll
  useEffect(() => {
    const ids = INN_TABS.map((t) => t.id)
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
  }, [])

  // 5. Interiorismo
  const interiorismoEyebrow = projectContent?.interiorismo?.eyebrow || 'Interiorismo'
  const interiorismoTitle = formatMultiline(projectContent?.interiorismo?.title || 'MAESTRÍA EN\nCADA DETALLE')
  const interiorismoDesc = projectContent?.interiorismo?.description || `<p>El interiorismo de <b>Sofía Iturralde</b> y la iluminación de <b>Rafael Rivera</b> se unen en INN para crear una experiencia integral de diseño. Sofía aporta cerca de 20 años de trayectoria en proyectos inmobiliarios, corporativos y residenciales en Chile y Argentina. Rafael, especializado en iluminación en el Istituto Europeo di Design de Milán, desarrolla proyectos lumínicos desde 2003.</p>
  <p>En <b>INN</b>, ambas disciplinas dialogan para que materiales, texturas, volúmenes y distintas escenas de luz construyan ambientes cálidos y sofisticados, conectados con la identidad del sur. Una propuesta que realza cada espacio y refuerza el carácter exclusivo de un proyecto pensado para vivir Puerto Varas desde el diseño, el confort y el bienestar</p>`
  const interiorismoBg = resolveUrl(projectContent?.interiorismo?.bg_image_url, 'images/inn/Interiorismo.svg')
  const designers = projectContent?.interiorismo?.designers?.length ? projectContent.interiorismo.designers : undefined

  // Modal Panoramas
  const panoramasCategories = projectContent?.panoramas?.categories?.length ? projectContent.panoramas.categories : PANORAMAS_CATEGORIES

  // 6. Contacto
  const contactData = useMemo(() => ({
    eyebrow: projectContent?.contact?.eyebrow || INN_TEAM.eyebrow,
    title: projectContent?.contact?.title || INN_TEAM.title,
    subtitle: projectContent?.contact?.subtitle || INN_TEAM.subtitle,
    wazeMap: projectContent?.contact?.waze_url || INN_TEAM.wazeMap,
    agents: projectContent?.contact?.agents?.length ? projectContent.contact.agents : INN_TEAM.agents,
  }), [projectContent])

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
            <ScrollAnim as='span' animation='zoom-in' className='mt-auto'>
              <img src={heroLogo} className="lb-inn-hero__logo" alt="Logo Proyecto" />
            </ScrollAnim>
            <SplitTitle as='h1' delay={0.2} stagger={0.05} className="lb-inn-hero__title p-0">
              {heroTitle}
            </SplitTitle>
          </div>
        </HeroShell>

        {/* Botonera desktop: pinneada debajo del header */}
        <nav className="lb-inn-hero-tabs d-none d-lg-block mx-auto" aria-label="Secciones del proyecto">
          <ScrollAnim animation='scale' className="card lb-inn-hero-tabs__inner rounded-pill shadow-lg">
            <div className="card-body py-4 px-4">
              <ul className="nav nav-pills nav-justified flex-nowrap align-items-center gap-3">
                {INN_TABS.map((t) => {
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

        {/* Botonera mobile: selector compacto flotante */}
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
                  <span className={`badge rounded-pill lb-inn-mobile-nav__badge ${INN_TABS.find((t) => t.id === activeTab)?.featured ? 'lb-inn-mobile-nav__badge--primary' : ''}`}>SECCIÓN</span>
                  <span className="fw-bold text-dark text-uppercase small">{activeTabLabel}</span>
                </div>
                <ChevronDown size={18} className={`lb-inn-mobile-nav__arrow ${mobileNavOpen ? 'open' : ''}`} />
              </button>

              {mobileNavOpen && (
                <div className="lb-inn-mobile-nav__menu shadow-lg rounded-4 p-2 mt-2">
                  {INN_TABS.map((t) => {
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

        {/* DATOS TÉCNICOS DEL PROYECTO */}
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

        {/* 1. SECCIÓN PROYECTO */}
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

        <VideoTextSection
          eyebrow={video1.eyebrow}
          title={video1.title}
          text={video1.text}
          videoSrc={resolveUrl(video1.video_url, 'video/video_reconfortante_a.mp4')}
        />

        {/* 2. SECCIÓN EQUIPAMIENTO */}
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
          spacesModal={{
            buttonLabel: 'Ver Detalles',
            galleries: equipmentSpacesModal,
          }}
        />

        <Recorridos360
          tours={virtualTours}
          title={virtualToursTitle}
          eyebrow={virtualToursEyebrow}
          brochureUrl={virtualToursBrochure}
        />

        {/* COTIZADOR */}
        <Cotizador
          className="lb-inn-cot"
          data={getProjectBySlug(cleanSlug)?.cotizador || getProjectBySlug('inn')?.cotizador}
          universal
          projects={apiProjects}
          selection={selection}
        />

        {/* PROYECTOS RELACIONADOS */}
        <RelatedProjects
          data={{
            eyebrow: `Alternativas a ${currentProject?.name || 'Edificio INN'}`,
            highlight: currentProject?.comuna || 'Puerto Varas',
            apiId: currentProject?.id || 9,
            projectName: currentProject?.name || 'Edificio INN',
          }}
          onCotizar={handleCotizarPlanta}
        />

        {/* OTRAS OPCIONES */}
        <Alternatives
          data={{
            title: '¿Buscas otras opciones?',
            excludeName: currentProject?.name || 'Edificio INN',
          }}
        />

        <VideoTextSection
          eyebrow={video2.eyebrow}
          title={video2.title}
          text={video2.text}
          videoSrc={resolveUrl(video2.video_url, 'video/exterior.mp4')}
        />

        {/* 3. SECCIÓN ESPACIOS COMUNES */}
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

        <CarouselNav
          items={espaciosNavItems}
          variant="stacked"
          activeIndex={activeEspacioSlide}
          onSelect={setActiveEspacioSlide}
        />

        <VideoTextSection
          eyebrow={video3.eyebrow}
          title={video3.title}
          text={video3.text}
          videoSrc={resolveUrl(video3.video_url, 'video/lipsum.mp4')}
        />

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
                    <button
                      type="button"
                      className="btn lb-inn-btn lb-project-btn"
                      onClick={() => setShowPanoramasModal(true)}
                    >
                      <span>{(mapData.btnText || 'Experiencias').toUpperCase()}</span>
                    </button>
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
                        <img
                          src={mapData.pin.logo}
                          alt={currentProject?.name || 'PROYECTO'}
                          className="lb-inn-map__pin-inn-img"
                        />
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
      </main>

      {/* MODAL DE PANORAMAS / EXPERIENCIAS */}
      <ProjectPanoramasModal
        show={showPanoramasModal}
        onClose={() => setShowPanoramasModal(false)}
        projectName={currentProject?.name || 'INN'}
        categories={panoramasCategories}
        backgroundImage={projectContent?.panoramas?.bg_image_url}
      />

      {/* SECCIÓN CONTACTO — ASESORES + MAPA */}
      <ProjectTeamAgents data={contactData} apiId={currentProject?.id || 9} />

      <Footer />
    </>
  )
}
