import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
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
import InnTeamAgents from '../components/proyecto/InnTeamAgents.jsx'
import { ConciergeBellIcon } from '../components/icons/concierge-bell.jsx'
import { TableIcon } from '../components/icons/table.jsx'
import { ChefHatIcon } from '../components/icons/chef-hat.jsx'
import { DumbbellIcon } from '../components/icons/dumbbell.jsx'
import { WavesLadderIcon } from '../components/icons/waves-ladder.jsx'
import { KayakIcon } from '../components/icons/kayak.jsx'
import { HotTubIcon } from '../components/icons/hot-tub.jsx'
import { hover } from '../components/icons/animated-icon.jsx'
import { FootprintsIcon } from '../components/icons/footprints.jsx'
import { CarIcon } from '../components/icons/car.jsx'
import { MapPinIcon } from '../components/icons/map-pin.jsx'
import { getProjectBySlug } from '../data/projects.js'
import { apiFetch } from '../lib/apiFetch.js'
import { mapApiProject } from '../lib/projectUtils.js'

const INFO = [
  { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991,<br /> Puerto Varas' },
  { id: 'tipologias', label: 'Tipologías', value: '2, 3 y 4 dormitorios<br />Deptos, dúplex y deptos con patio privado' },
  { id: 'metrajes', label: 'Metrajes', value: 'Desde 85 m²' },
  { id: 'precio', label: 'Precio desde', value: '—' },
  { id: 'estado', label: 'Estado del proyecto', value: 'Entrega futura' },
]

// Fuerza global del parallax (en % del alto del elemento). Un solo knob para todas las secciones de INN.
// Negativo = el elemento sube al hacer scroll (parallax clásico).
const PARALLAX_STRENGTH = -12

const TABS = [
  { id: 'proyecto', label: 'Proyecto' },
  { id: 'departamentos', label: 'Equipamiento' },
  { id: 'cotizador', label: 'Cotizador' },
  { id: 'espacios', label: 'Espacios' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'interiorismo', label: 'Interiorismo' },
  { id: 'contacto', label: 'Contacto' },
]

const SLIDES = [
  { img: 'images/inn/proyecto/Proyecto_01_Acceso.jpg', alt: 'Acceso' },
  { img: 'images/inn/proyecto/Proyecto_02_Cocina.jpg', alt: 'Cocina' },
  { img: 'images/inn/proyecto/Proyecto_03_Living-Comedor.jpg', alt: 'Living Comedor' },
  { img: 'images/inn/proyecto/Proyecto_04_Vista-Acceso.jpg', alt: 'Vista Acceso' },
  { img: 'images/inn/proyecto/Proyecto_05_Isla.jpg', alt: 'Isla Cocina' },
  { img: 'images/inn/proyecto/Proyecto_06_Dorm-Ppal.jpg', alt: 'Dormitorio Principal' },
]

const EQUIPMENT_LOGOS = [
  { src: 'images/logos/franke.png', alt: 'Franke' },
  { src: 'images/logos/mk.png', alt: 'MK' },
  { src: 'images/logos/paini.png', alt: 'Paini' },
  { src: 'images/logos/hansgrohe.png', alt: 'Hansgrohe' },
]

const EQUIPMENT_SLIDES = [
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg', alt: 'Hall de acceso' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg', alt: 'Cocina' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg', alt: 'Living Comedor' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg', alt: 'Terraza' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg', alt: 'Dormitorio Principal' },
  { img: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg', alt: 'Baño' },
]

// Espacios comunes: iconos animados (pqoqubbw/icons).
const ESPACIOS_COMUNES_NAV_ITEMS = [
  { id: 'hall', label: 'Hall de acceso', icon: ConciergeBellIcon },
  { id: 'atrio', label: 'Atrio con 7<br />pisos de altura', icon: TableIcon },
  { id: 'gourmet', label: 'Sala gourmet con<br />quincho techado', icon: ChefHatIcon },
  { id: 'training', label: 'Training Zone', icon: DumbbellIcon },
  { id: 'jacuzzi', label: 'Rooftop con jacuzzi', icon: HotTubIcon },
  { id: 'piscina', label: 'Piscina climatizada', icon: WavesLadderIcon },
  { id: 'bodega', label: 'Bodega náutica', icon: KayakIcon },
]

// Un slide por espacio, vinculado por navId (mismas claves que ESPACIOS_COMUNES_NAV_ITEMS.id)
// Para asignar imagen real a un espacio: edita el img de su navId
const ESPACIOS_COMUNES_SLIDES = [
  { navId: 'hall', img: 'images/inn/eecc/EECC_Hall_Acceso_Edificio.jpg', link: 'images/inn/eecc/EECC_Hall_Acceso_Edificio.jpg', alt: 'Hall de acceso' },
  { navId: 'atrio', img: 'images/inn/eecc/EECC_03.jpg', link: 'images/inn/eecc/EECC_Atrio_2.png', alt: 'Atrio' },
  { navId: 'gourmet', img: 'images/inn/eecc/EECC_01.jpg', link: 'images/inn/eecc/EECC_Quincho_Gourmet.jpg', alt: 'Gourmet + Quincho equipado' },
  { navId: 'training', img: 'images/inn/eecc/EECC_03.jpg', alt: 'Training Zone' },
  { navId: 'jacuzzi', img: 'images/inn/eecc/EECC_02.jpg', alt: 'Jacuzzi exterior' },
  { navId: 'piscina', img: 'images/inn/eecc/EECC_Piscina_Climatizada.jpg', alt: 'Piscina climatizada' },
  { navId: 'bodega', img: 'images/inn/eecc/EECC_02.jpg', link: 'images/inn/eecc/EECC_Bodega_Nautica.jpg', alt: 'Bodega náutica' },
]

const LOCATION_POINTS = [
  { id: 1, name: 'Mesa Tropera', label: 'MESA TROPERA', distance: '1.8 km', category: 'Gastronomía', img: 'images/inn/Ubicacion_01_Color.jpg', x: 14.6, y: 35.8 },
  { id: 2, name: 'Costanera', label: 'COSTANERA', distance: '0.6 km', category: 'Paseo', img: 'images/inn/Ubicacion_02_Color.jpg', x: 15.1, y: 46.2 },
  { id: 3, name: 'Mesa Tropera', label: 'MESA TROPERA', distance: '1.2 km', category: 'Gastronomía', img: 'images/inn/Ubicacion_01_Color.jpg', x: 10.7, y: 49.9 },
  { id: 4, name: 'Mall Paseo', label: 'MALL', distance: '3.1 km', category: 'Comercio', img: 'images/inn/Ubicacion_03_Color.jpg', x: 5.1, y: 52.6 },
  { id: 5, name: 'Cassis', label: 'CASSIS', distance: '2.5 km', category: 'Cafetería', img: 'images/inn/Ubicacion_02_Color.jpg', x: 14.7, y: 51.3 },
  { id: 6, name: 'Casino Dreams', label: 'CASINO DREAMS', distance: '2.3 km', category: 'Entretenimiento', img: 'images/inn/Ubicacion_01_Color.jpg', x: 15.7, y: 54.7 },
  { id: 7, name: 'Playa Puerto Chico', label: 'PLAYA PUERTO CHICO', distance: '0.3 km', category: 'Playa & Paseo', img: 'images/inn/Ubicacion_02_Color.jpg', x: 42.7, y: 75.1 },
  { id: 8, name: 'Jumbo', label: 'JUMBO', distance: '1.5 km', category: 'Supermercado', img: 'images/inn/Ubicacion_03_Color.jpg', x: 85.3, y: 66.4 },
  { id: 9, name: 'La Olla', label: 'LA OLLA', distance: '3.8 km', category: 'Gastronomía', img: 'images/inn/Ubicacion_01_Color.jpg', x: 79.3, y: 81.1 },
]

const LOCATION_DATA = {
  walking: [
    { id: 1, name: 'Playa Puerto Chico', distance: '0.3 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 2, name: 'Costanera', distance: '0.6 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 3, name: 'Muelle Puerto Varas', distance: '0.9 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
    { id: 4, name: 'Centro de Puerto Varas', distance: '1.0 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 5, name: 'Mesa Tropera', distance: '1.2 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 6, name: 'Cassis', distance: '1.4 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
  ],
  vehicle: [
    { id: 1, name: 'Playa Puerto Chico', distance: '0.3 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 2, name: 'Costanera', distance: '0.6 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 3, name: 'Jumbo', distance: '1.5 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
    { id: 4, name: 'Mesa Tropera', distance: '1.8 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 5, name: 'Casino Dreams', distance: '2.3 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 6, name: 'Cassis', distance: '2.5 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 7, name: 'Mall Paseo Puerto Varas', distance: '3.1 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
    { id: 8, name: 'La Olla', distance: '3.8 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
  ],
}

// Espacios para el modal "Conoce los espacios" con múltiples galerías (estructura de prueba)
const SPACES_MODAL_GALLERIES = [
  {
    label: 'Hall de acceso',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg', alt: 'Hall de acceso', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Hall_Acceso.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Cerradura_Digital.jpg', alt: 'Puerta de acceso con cerradura digital', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Cerradura_Digital.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Piso_SPC.jpg', alt: 'Piso vinilico SCP', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Acceso_Piso_SPC.jpg' },
    ]
  },
  {
    label: 'Cocina',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg', alt: 'Cocina', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Cocina.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Cubierta.jpg', alt: 'Cubierta ultracompacta terminación travertino', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Cubierta.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Encimera.jpg', alt: 'Encimera', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Encimera.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Refrigerador.jpg', alt: 'Refrigerador y freezer panelado', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Refrigerador.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Lavavajillas.jpg', alt: 'Lavavajillas panelado', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Lavavajillas.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Franke.jpg', alt: 'Equipamiento Franke', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Franke.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Griferia_Paini.jpg', alt: 'Grifería italiana Paini', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Griferia_Paini.jpg' },
    ]
  },
  {
    label: 'Living Comedor',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg', alt: 'Living comedor', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Living-Comedor.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Puertas_Interiores.jpg', alt: 'Puertas enchapadas en madera de encina', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Puertas_Interiores.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Iluminación_Ventanales.jpg', alt: 'Iluminación incluida ventanas de termopanel de PVC', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Liv-Com_Iluminación_Ventanales.jpg' },
    ]
  },
  {
    label: 'Terraza',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg', alt: 'Terraza', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Terraza.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Pavimento.jpg', alt: 'Terraza con pavimento Gres', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Pavimento.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Tejuelas.jpg', alt: 'Muros exteriores con revestimiento de tejuelas en madera nativa', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Terraza_Tejuelas.jpg' },
    ]
  },
  {
    label: 'Dormitorios',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg', alt: 'Dormitorio principal', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Dormitorios.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Wallkincloset.jpg', alt: 'Walk in closet', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Wallkincloset.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_2.jpg', alt: 'Dormitorio 2', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_2.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_3.jpg', alt: 'Dormitorio 3', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Dormitorios_Dorm_3.jpg' },
    ]
  },
  {
    label: 'Baños',
    images: [
      { img: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg', alt: 'Baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Principal_Banos.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Mampara.jpg', alt: 'Mampara vidrio templado en baños', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Mampara.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Grifería_Hansgrohe.jpg', alt: 'Grifería Hansgrohe en baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Grifería_Hansgrohe.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg', alt: 'Columna de ducha Hansgrohe en baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Accesorios_MK.jpg', alt: 'Accesorios marca MK', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Accesorios_MK.jpg' },
    ]
  },
]

// Cada slide muestra 3 lugares empezando en la i-ésima posición (wrap-around para loop)
const GALLERY_SLIDES = LOCATION_POINTS.map((_, i) =>
  [0, 1, 2].map((offset) => {
    const locIndex = (i + offset) % LOCATION_POINTS.length
    return {
      ...LOCATION_POINTS[locIndex],
      itemIndex: locIndex,
    }
  })
)

const MAP = {
  eyebrow: <>Ubicación</>,
  title: <>ntorno<br />INNigualable</>,
  description: 'Despertar con el lago Llanquihue y los volcanes enmarcando el paisaje es solo el comienzo. Desde INN, basta cruzar la calle para recorrer la costanera, disfrutar un café de especialidad, salir a navegar o vivir nuevas aventuras junto al lago. Puerto Varas también invita a descubrir una reconocida propuesta gastronómica, recorrer sus calles y conectar con la naturaleza que define al sur de Chile. Y cuando quieras ir más allá, estás en un punto ideal para explorar destinos como Ensenada, Frutillar, Chiloé y algunas de las postales más inolvidables de la Región de Los Lagos. Una ubicación excepcional para hacer del paisaje, la gastronomía, la aventura y la vida al aire libre parte de tu día a día.',
  image: 'images/inn/Mapa_PV.png',
  logo: 'images/inn/E_titulo.png',
  btnText: 'Descubrir panoramas',
  address: 'Vicente Pérez Rosales 991, Puerto Varas',
  features: [
    { id: 'direccion', icon: 'direccion', heading: 'Vicente Pérez Rosales 991', text: 'Puerto Varas, Región de Los Lagos' },
    { id: 'telefono', icon: 'telefono', heading: '+56 9 1234 5678', text: 'Contacto directo' },
  ],
}

const base = import.meta.env.BASE_URL

const TEAM_DATA = {
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

const InnGalleryCarousel = memo(function InnGalleryCarousel({
  slides,
  galleryRef,
  onSelectLocation,
}) {
  return (
    <div ref={galleryRef} id="innGalleryCarousel" className="carousel slide" data-bs-interval="false">
      <div className="carousel-inner">
        {slides.map((slideItems, slideIndex) => (
          <div className={`carousel-item ${slideIndex === 4 ? 'active' : ''}`} key={slideIndex}>
            <div className="row g-3">
              {slideItems.map((loc, cardIdx) => (
                <div className="col-12 col-md-4" key={`${slideIndex}-${loc.id}`}>
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
                    className={`lb-inn-gallery__card rounded rounded-3 overflow-hidden position-relative h-100 ${cardIdx === 0 ? 'lb-inn-gallery__card--main' : ''}`}
                    aria-label={`${loc.name} - ${loc.distance}`}
                  >
                    <div className="lb-inn-gallery__img-wrap position-relative">
                      <img
                        src={`${base}${loc.img}`}
                        alt={loc.name}
                        className="d-block w-100 lb-inn-gallery__img"
                        loading="lazy"
                      />
                      <div className="lb-inn-gallery__badge position-absolute top-0 start-0 m-2">
                        <span className="lb-inn-gallery__number me-1">{loc.id}</span>
                        <span>{loc.distance}</span>
                      </div>
                      <a
                        href={`${base}${loc.img}`}
                        data-fancybox="inn-galeria"
                        className="lb-inn-gallery__zoom position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={(e) => e.stopPropagation()}
                        title="Ver foto ampliada"
                        aria-label="Ver foto ampliada"
                        tabIndex={0}
                      >
                        <Maximize2 size={13} />
                      </a>
                    </div>
                    <div className="lb-inn-gallery__info p-2 px-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="lb-inn-gallery__title mb-0">{loc.name}</h4>
                        <small className="lb-inn-gallery__cat">{loc.category}</small>
                      </div>
                      <span className="lb-inn-gallery__badge-active">Activo</span>
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

export default function Inn() {
  const [activeTab, setActiveTab] = useState('proyecto')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileNavRef = useRef(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapTab, setMapTab] = useState('walking')
  const [activeLocationIndex, setActiveLocationIndex] = useState(4)

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

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label || 'Proyecto'
  const walkingIconRef = useRef(null)
  const vehicleIconRef = useRef(null)
  const [apiProjects, setApiProjects] = useState(null)
  const [innProject, setInnProject] = useState(null)
  const [selectedPlanta, setSelectedPlanta] = useState(null)

  const handleMapTabChange = (tab) => {
    setMapTab(tab)
    setActiveLocationIndex(0)
  }

  // API - Proyectos con ID:9 proyecto INN precargado
  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      setApiProjects(data)
      // Preselección del proyecto INN (apiId 9)
      const inn = Array.isArray(data) ? data.find((p) => p.id === 9) : null
      if (inn) setInnProject(inn)
    }).catch(() => { })
    return () => { cancelled = true }
  }, [])
  // Selección estable: misma referencia entre renders para que el Cotizador
  // no se resetee (sus efectos dependen de la identidad de `selection`)
  const selection = useMemo(
    () => (selectedPlanta ? { planta: selectedPlanta } : innProject ? { project: innProject } : undefined),
    [selectedPlanta, innProject]
  )

  const handleCotizarPlanta = (planta) => {
    setSelectedPlanta(planta)
    const cot = document.getElementById('cotizador')
    if (cot) {
      cot.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const infoList = useMemo(() => {
    if (!innProject) return INFO
    const mapped = mapApiProject(innProject)
    return INFO.map((item) =>
      item.id === 'precio' ? { ...item, value: mapped.precioDesde || item.value } : item
    )
  }, [innProject])

  const [activeSlide, setActiveSlide] = useState(0)
  const [activeEquipmentSlide, setActiveEquipmentSlide] = useState(0)
  const [activeEspacioSlide, setActiveEspacioSlide] = useState(0)
  // Slide vinculado al espacio seleccionado en el nav (fallback: primer slide)
  const espaciosSlideIndex = Math.max(0, ESPACIOS_COMUNES_SLIDES.findIndex(
    (s) => s.navId === ESPACIOS_COMUNES_NAV_ITEMS[activeEspacioSlide]?.id
  ))
  const mapRef = useRef(null)
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
    if (!c) return

    const activeItem = galleryEl.querySelector('.carousel-item.active')
    if (activeItem) {
      const allItems = Array.from(galleryEl.querySelectorAll('.carousel-item'))
      if (allItems.indexOf(activeItem) === index) {
        return
      }
    }

    if (c._isSliding) {
      galleryEl.addEventListener(
        'slid.bs.carousel',
        () => {
          c.to(index)
        },
        { once: true }
      )
    } else {
      c.to(index)
    }
  }, [])

  // Scrollspy: activa el tab segun la seccion visible (sin cambiar nombres)
  useEffect(() => {
    const sections = TABS
      .map((t) => document.getElementById(t.id))
      .filter(Boolean)
    if (!sections.length) return

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

  return (
    <>
      <Navbar />
      <main className="lb-inn">
        {/* HERO */}
        <HeroShell
          id="inicio"
          className="lb-inn-hero justify-content-center position-relative"
          video={`${base}video/inn-new.mp4`}
          bgWrapClassName="lb-inn-hero__bg-wrap"
          overlayClassName="lb-inn-hero__overlay"
        >
          <div className="position-absolute d-flex align-items-start flex-column align-self-center container h-100 mx-auto">
            <ScrollAnim as='span' animation='zoom-in' className='mt-auto'><img src={`${base}images/inn/Logo_INN_Header.png`} className="lb-inn-hero__logo" alt="Logo INN" /></ScrollAnim>
            <SplitTitle as='h1' delay={0.2} stagger={0.05} className="lb-inn-hero__title p-0">VIVE EL LUJO<br /> EN PUERTO VARAS</SplitTitle>
          </div>
        </HeroShell>

        {/* Botonera desktop: pinneada debajo del header */}
        <nav className="lb-inn-hero-tabs d-none d-lg-block mx-auto" aria-label="Secciones del proyecto">
          <ScrollAnim animation='scale' className="card lb-inn-hero-tabs__inner shadow-lg">
            <div className="card-body py-4 px-4">
              <ul className="nav nav-pills nav-justified flex-nowrap align-items-center gap-3">
                {TABS.map((t) => (
                  <li className="nav-item" key={t.id}>
                    <button
                      type="button"
                      className={`nav-link nav-link__border ${t.id === activeTab ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(t.id)
                        const target = document.getElementById(t.id)
                        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                    >
                      {t.label.toUpperCase()}
                    </button>
                  </li>
                ))}
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
                  <span className="badge rounded-pill lb-inn-mobile-nav__badge">SECCIÓN</span>
                  <span className="fw-bold text-dark text-uppercase small">{activeTabLabel}</span>
                </div>
                <ChevronDown size={18} className={`lb-inn-mobile-nav__arrow ${mobileNavOpen ? 'open' : ''}`} />
              </button>

              {mobileNavOpen && (
                <div className="lb-inn-mobile-nav__menu shadow-lg rounded-4 p-2 mt-2">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`dropdown-item py-2 px-3 rounded-3 d-flex align-items-center justify-content-between ${t.id === activeTab ? 'active fw-bold' : ''}`}
                      onClick={() => {
                        setActiveTab(t.id)
                        setMobileNavOpen(false)
                        const target = document.getElementById(t.id)
                        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                    >
                      <span>{t.label}</span>
                      {t.id === activeTab && <span className="lb-inn-dot" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DATOS DEL PROYECTO */}
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

        <ProjectFeatureSection
          eyebrow={<>Proyecto</>}
          title={<>LOS MEJORES DEPARTAMENTOS<br />DE PUERTO VARAS</>}
          description="El proyecto INN propone una forma de vivir Puerto Varas con mayor comodidad, amplitud y calidad en cada detalle con terminaciones de alto estándar, espacios amplios, luminosos y distribuciones pensadas para disfrutar cada ambiente durante todo el año. Con tipologías que se adaptan a distintas formas de vivir, el proyecto ofrece departamentos en formato tradicional, unidades con patio privado y exclusivos dúplex con vista al lago Llanquihue. Todo esto se complementa con una experiencia Home & Wellness con espacios comunes como sauna, bodega náutica y piscina climatizada invitan a relajarse, desconectarse y disfrutar el sur con una sensación de hotel boutique inigualable."
          highlightOffer="paga el pie en <b>60</b> cuotas"
          slides={SLIDES}
          carouselId="innCarousel"
          parallaxStrength={10}
          activeSlide={activeSlide}
          onSlideChange={setActiveSlide}
          showIndicators={false}
          id="proyecto"
          ariaLabel="Proyecto"
        />

        <VideoTextSection
          text="Un estilo de vida único frente al lago y los volcanes"
          videoSrc="video/video_reconfortante_a.mp4"
        />

        <ProjectFeatureSection
          eyebrow={<>Equipamiento y terminaciones</>}
          title={<>SOFISTICACIÓN<br />EN CADA DETALLE</>}
          description="Elevamos cada espacio con equipamiento y terminaciones de alto estándar: marca suiza Franke en cocina con refrigerador y lavavajillas panelables, cubiertas ultracompactas en terminación travertino, griferías Paini y Hansgrohe, puertas enchapadas en encina, piso vinílico SPC y ventanas termopanel PVC negras. Las terrazas incorporan revestimiento parcial de tejas y cada departamento cuenta con calefacción por radiadores y caldera individual a gas natural para completar una experiencia de diseño, confort y calidad."
          highlightLogos={EQUIPMENT_LOGOS}
          slides={EQUIPMENT_SLIDES}
          carouselId="innDepartamentosCarousel"
          parallaxStrength={PARALLAX_STRENGTH}
          backgroundImage="images/inn/Perspectiva.svg"
          id="departamentos"
          className='pb-2 mb-2'
          ariaLabel="Departamentos"
          showIndicators={false}
          activeSlide={activeEquipmentSlide}
          onSlideChange={setActiveEquipmentSlide}
          spacesModal={{
            buttonLabel: 'Ver Detalles',
            galleries: SPACES_MODAL_GALLERIES,
          }}
        />

        <Recorridos360 />

        {/* Cotizador */}
        <Cotizador
          className="lb-inn-cot"
          data={getProjectBySlug('inn')?.cotizador}
          universal
          projects={apiProjects}
          selection={selection}
        />

        {/* Plantas relacionadas */}
        <RelatedProjects
          data={{
            eyebrow: 'Alternativas a Edificio INN',
            highlight: 'Puerto Varas',
            apiId: innProject?.id || 9,
            projectName: innProject?.name || 'Edificio INN',
          }}
          onCotizar={handleCotizarPlanta}
        />

        {/* ¿Buscas otras opciones? */}
        <Alternatives
          data={{
            title: '¿Buscas otras opciones?',
            excludeName: innProject?.name || 'Edificio INN',
          }}
        />

        <VideoTextSection
          text="Descubre todo lo que Puerto Varas tiene para ofrecerte"
          videoSrc="video/exterior.mp4"
        />

        <ProjectFeatureSection
          title={<>ESPACIOS DE<br />OTRO NIVEL</>}
          description="Los espacios están concebidos como una extensión natural de tu departamento, donde la sensación hotelera se integra con la serenidad del entorno. Cada ambiente ha sido cuidadosamente diseñado para enriquecer tu rutina diaria, ofreciendo espacios de encuentro, trabajo y descanso que combinan la calidez sureña, una delicada propuesta de interiorismo y vistas privilegiadas para disfrutar Puerto Varas al máximo."
          slides={ESPACIOS_COMUNES_SLIDES}
          carouselId="innEspaciosCarousel"
          parallaxStrength={PARALLAX_STRENGTH}
          backgroundImage="images/inn/Climbing.svg"
          id="espacios"
          className='pb-2 mb-2'
          ariaLabel="Espacios"
          showIndicators={false}
          activeSlide={espaciosSlideIndex}
        />

        <CarouselNav
          items={ESPACIOS_COMUNES_NAV_ITEMS}
          variant="stacked"
          activeIndex={activeEspacioSlide}
          onSelect={setActiveEspacioSlide}
        />

        <VideoTextSection
          text="Despierta tu espíritu aventurero en la Región de Los Lagos"
          videoSrc="video/lipsum.mp4"
        />

        {/* SECCIÓN MAPA */}
        <section className="container-fluid lb-inn-map" id="ubicacion">
          <div className="container">
            <div className="row g-0">
              <div className="col-12 col-lg-5 ps-3 ps-md-4 ps-lg-5 d-flex flex-column justify-content-center">
                <div className="mb-4 mb-md-5 lb-inn-map__header">
                  <ScrollAnim as="span" animation="flip-x" className="lb-inn-proyecto__eyebrow d-block mb-3 mb-md-5">{MAP.eyebrow}</ScrollAnim>
                  <div className="d-flex align-items-center gap-3 gap-md-4">
                    <ScrollAnim as="span" animation="fade-left">
                      <img
                        src={`${base}${MAP.logo}`}
                        alt="Logo INN"
                        className="lb-inn-map__header-logo"
                      />
                    </ScrollAnim>
                    <div className='lb-inn-map__titulos-right'>
                      <SplitTitle as="h2" className="lb-inn-proyecto__title mb-0" text={MAP.title} stagger={0.06} />
                    </div>
                  </div>
                </div>
                <div className="lb-inn-map__text text-start">
                  <ScrollAnim animation="fade-up" className="lb-inn-proyecto__text lh-lg mb-4 mb-md-5 w-md-80">
                    <span dangerouslySetInnerHTML={{ __html: MAP.description }} />
                  </ScrollAnim>
                  <button
                    type="button"
                    className="btn btn-gold"
                    onClick={() => {
                      const el = document.getElementById('galeria')
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                    {...hover(mapRef)}
                  >
                    <MapPinIcon ref={mapRef} size={18} />
                    <span>{MAP.btnText}</span>
                  </button>
                </div>
              </div>
              <div className="col-12 col-lg-7">
                <ScrollAnim animation="fade-right">
                  <div className="lb-inn-map__interactive-wrap position-relative w-100">
                    <img
                      src={`${base}${MAP.image}`}
                      alt="Mapa interactivo de ubicación"
                      className="img-fluid w-100 h-100 object-fit-contain d-block"
                      loading="lazy"
                    />

                    {/* Pin INN */}
                    <div
                      className="lb-inn-map__pin-inn position-absolute"
                      style={{ left: '40.0%', top: '68.1%' }}
                      title="Proyecto INN - Vicente Pérez Rosales 991"
                    >
                      <img
                        src={`${base}images/inn/pin_logo.png`}
                        alt="Proyecto INN - Vicente Pérez Rosales 991"
                        className="lb-inn-map__pin-inn-img"
                      />
                    </div>

                    {/* Pines interactivos */}
                    {LOCATION_POINTS.map((point, index) => {
                      const isSelected = activeLocationIndex === index
                      return (
                        <button
                          key={point.id}
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
                          className={`lb-inn-map__pin position-absolute ${isSelected ? 'active' : ''}`}
                          style={{ left: `${point.x}%`, top: `${point.y}%` }}
                          aria-label={`${point.name} (${point.distance})`}
                        >
                          <span className="lb-inn-map__pin-dot-wrap">
                            <span className="lb-inn-map__pin-dot" />
                          </span>
                          <span className="lb-inn-map__pin-line" />
                          <span className="lb-inn-map__pin-pill">{point.label || point.name}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dirección bajo el mapa */}
                  <div className="lb-inn-map__address d-flex align-items-center justify-content-center gap-2 mb-3 mb-md-4">
                    <MapPin size={22} className="lb-inn-map__address-icon" />
                    <span className="lb-inn-map__address-text">{MAP.address}</span>
                  </div>
                </ScrollAnim>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel de imágenes con interacción sincronizada */}
        <section className="lb-inn-gallery py-2 py-md-3" id="galeria">
          <ScrollAnim className='container' animation="fade-up">
            <InnGalleryCarousel
              slides={GALLERY_SLIDES}
              galleryRef={galleryRef}
              onSelectLocation={handleSelectLocation}
            />
          </ScrollAnim>
        </section>

        <InteriorismoSection
          eyebrow={<>Interiorismo</>}
          title={<>MAESTRÍA EN<br />CADA DETALLE</>}
          parallaxStrength={PARALLAX_STRENGTH}
          description="
          <p>El interiorismo de <b>Sofía Iturralde</b> y la iluminación de <b>Rafael Rivera</b> se unen 
          en INN para crear una experiencia integral de diseño. Sofía aporta cerca
          de 20 años de trayectoria en proyectos inmobiliarios, corporativos y
          residenciales en Chile y Argentina. Rafael, especializado en iluminación en
          el Istituto Europeo di Design de Milán, desarrolla proyectos lumínicos
          desde 2003.</p>
          <p>En <b>INN</b>, ambas disciplinas dialogan para que materiales, texturas,
            volúmenes y distintas escenas de luz construyan ambientes cálidos y
            sofisticados, conectados con la identidad del sur. Una propuesta que
            realza cada espacio y refuerza el carácter exclusivo de un proyecto
            pensado para vivir Puerto Varas desde el diseño, el confort y el bienestar
          </p>"
          backgroundImage="images/inn/Interiorismo.svg"
          id="interiorismo"
          ariaLabel="Interiorismo"
        />


      </main>

      {/* MODAL MAPA DE UBICACIÓN */}
      <div
        className={`modal fade ${showMapModal ? 'show d-block' : ''}`}
        id="innMapModal"
        tabIndex={-1}
        aria-label="Mapa de ubicación ampliado"
        style={{ backgroundColor: 'rgba(0,0,0,.9)' }}
        onClick={() => setShowMapModal(false)}
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 rounded-4 overflow-hidden" data-bs-theme="dark">
            <div className="modal-header border-0" data-bs-theme="dark">
              <h2 className="modal-title lb-inn-proyecto__title mb-0">UBICACIÓN</h2>
              <button type="button" className="btn-close btn-close-white ms-auto" aria-label="Cerrar" onClick={() => setShowMapModal(false)} />
            </div>
            <div className="modal-body">
              <div className="row g-4 align-items-center">
                {/* Columna izquierda: Tabs + Lista */}
                <div className="col-12 col-lg-5">
                  <div className="lb-inn-map-modal__list p-3 rounded-4">
                    {/* Tabs con Bootstrap nav-pills e iconos animados */}
                    <ul className="nav nav-pills nav-fill gap-2 mb-3 lb-inn-map-modal__tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          type="button"
                          className={`nav-link d-inline-flex align-items-center justify-content-center gap-2 ${mapTab === 'walking' ? 'active' : ''
                            }`}
                          onClick={() => handleMapTabChange('walking')}
                          {...hover(walkingIconRef)}
                        >
                          <FootprintsIcon ref={walkingIconRef} size={18} />
                          <span>A pie</span>
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          type="button"
                          className={`nav-link d-inline-flex align-items-center justify-content-center gap-2 ${mapTab === 'vehicle' ? 'active' : ''
                            }`}
                          onClick={() => handleMapTabChange('vehicle')}
                          {...hover(vehicleIconRef)}
                        >
                          <CarIcon ref={vehicleIconRef} size={18} />
                          <span>En vehículo</span>
                        </button>
                      </li>
                    </ul>

                    {/* Lista interactiva */}
                    <div className="list-group list-group-flush lb-inn-map-modal__group">
                      {LOCATION_DATA[mapTab].map((item, i) => {
                        const isSelected = i === activeLocationIndex
                        return (
                          <button
                            key={item.id || i}
                            type="button"
                            onClick={() => setActiveLocationIndex(i)}
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 rounded-3 mb-1 text-white lb-inn-map-modal__item ${isSelected ? 'active' : ''
                              }`}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <span className="lb-inn-map-modal__number">{i + 1}</span>
                              <span className="lb-inn-map-modal__name">{item.name}</span>
                            </div>
                            <span className="badge rounded-pill lb-inn-map-modal__badge">
                              {item.distance}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Galería con máscara circular vinculada al item activo */}
                <div className="col-12 col-lg-7 d-flex flex-column align-items-center justify-content-center py-3">
                  <div className="lb-inn-map-modal__circle-frame">
                    {LOCATION_DATA[mapTab][activeLocationIndex] && (
                      <img
                        key={`${mapTab}-${activeLocationIndex}`}
                        src={`${base}${LOCATION_DATA[mapTab][activeLocationIndex].img}`}
                        alt={LOCATION_DATA[mapTab][activeLocationIndex].name}
                        className="lb-inn-map-modal__circle-img"
                      />
                    )}
                  </div>
                  {LOCATION_DATA[mapTab][activeLocationIndex] && (
                    <div className="text-center mt-3">
                      <h3 className="h5 text-white fw-bold mb-1">
                        {LOCATION_DATA[mapTab][activeLocationIndex].name}
                      </h3>
                      <span className="lb-inn-map-modal__caption-distance">
                        A {LOCATION_DATA[mapTab][activeLocationIndex].distance} de distancia
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CONTACTO — asesores + mapa */}
      <InnTeamAgents data={TEAM_DATA} />

      <Footer />
    </>
  )
}
