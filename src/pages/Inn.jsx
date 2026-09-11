import { useEffect, useMemo, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import Navbar from '../components/layout/Navbar.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
import { getProjectBySlug } from '../data/projects.js'
import { apiFetch } from '../lib/apiFetch.js'
import { mapApiProject } from '../lib/projectUtils.js'

const INFO = [
  { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991, Puerto Varas' },
  { id: 'tipologias', label: 'Tipologías', value: '2, 3 y dorms, Deptos, dúplex y deptos con patio privado' },
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
  { id: 'hall', label: 'Hall de acceso<br />con doble altura', icon: ConciergeBellIcon },
  { id: 'atrio', label: 'Atrio con 6<br />pisos de altura', icon: TableIcon },
  { id: 'gourmet', label: 'Sala gourmet con<br />quincho techado', icon: ChefHatIcon },
  { id: 'training', label: 'Training Zone', icon: DumbbellIcon },
  { id: 'jacuzzi', label: 'Rooftop con jacuzzi', icon: HotTubIcon },
  { id: 'piscina', label: 'Piscina climatizada', icon: WavesLadderIcon },
  { id: 'bodega', label: 'Bodega náutica', icon: KayakIcon },
]

// Un slide por espacio, vinculado por navId (mismas claves que ESPACIOS_COMUNES_NAV_ITEMS.id)
// Para asignar imagen real a un espacio: edita el img de su navId
const ESPACIOS_COMUNES_SLIDES = [
  { navId: 'hall', img: 'images/inn/galerias/EECC_01.jpg', alt: 'Hall de acceso' },
  { navId: 'atrio', img: 'images/inn/galerias/EECC_02.jpg', alt: 'Atrio' },
  { navId: 'gourmet', img: 'images/inn/galerias/EECC_03.jpg', alt: 'Gourmet + Quincho equipado' },
  { navId: 'training', img: 'images/inn/galerias/EECC_01.jpg', alt: 'Training Zone' },
  { navId: 'jacuzzi', img: 'images/inn/galerias/EECC_02.jpg', alt: 'Jacuzzi exterior' },
  { navId: 'piscina', img: 'images/inn/galerias/EECC_03.jpg', alt: 'Piscina climatizada' },
  { navId: 'bodega', img: 'images/inn/galerias/EECC_01.jpg', alt: 'Bodega náutica' },
]

const GALLERY_IMAGES = [
  { img: 'images/inn/Ubicacion_01_Color.jpg', alt: 'Galería 1' },
  { img: 'images/inn/Ubicacion_02_Color.jpg', alt: 'Galería 2' },
  { img: 'images/inn/Ubicacion_03_Color.jpg', alt: 'Galería 3' },
  { img: 'images/inn/Ubicacion_01_Color.jpg', alt: 'Galería 4' },
  { img: 'images/inn/Ubicacion_02_Color.jpg', alt: 'Galería 5' },
]

const LOCATION_DATA = {
  walking: [
    { id: 1, name: 'Museo Pablo Fierro', distance: '0.4 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 2, name: 'Costanera', distance: '0.6 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 3, name: 'Muelle Piedraplen', distance: '0.8 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
    { id: 4, name: 'Muelle Puerto Varas', distance: '0.9 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 5, name: 'Centro de Puerto Varas', distance: '1.0 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 6, name: 'Monumento Héroes Patrios', distance: '1.2 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
  ],
  vehicle: [
    { id: 1, name: 'Mesa Tropera', distance: '1.8 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 2, name: 'Hotel Cumbres', distance: '2.1 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 3, name: 'Casino', distance: '2.3 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
    { id: 4, name: 'Cassis', distance: '2.5 km', img: 'images/inn/Ubicacion_01_Color.jpg' },
    { id: 5, name: 'Mall - Supermercado', distance: '3.1 km', img: 'images/inn/Ubicacion_02_Color.jpg' },
    { id: 6, name: 'La Olla', distance: '3.8 km', img: 'images/inn/Ubicacion_03_Color.jpg' },
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

// Cada slide muestra 3 imágenes consecutivas empezando en la i-ésima,
// avanzando de 1 en 1 (wrap-around para loop infinito)
const GALLERY_SLIDES = GALLERY_IMAGES.map((_, i) =>
  [0, 1, 2].map((offset) => GALLERY_IMAGES[(i + offset) % GALLERY_IMAGES.length])
)

const MAP = {
  eyebrow: <>Ubicación</>,
  title: <>VISTAS<br />INSUPERABLES</>,
  description: 'Despertar con el marco imponente del lago Llanquihue y los volcanes es solo el comienzo. Imagina tan solo cruzar la calle y sentir el aire fresco del sur mientras caminas por la costanera, disfrutar un café de especialidad a pocos pasos de tu puerta o terminar la tarde cenando en los mejores restaurantes de Puerto Varas. Una ubicación privilegiada para disfrutar el lago, la ciudad y el sur como parte de tu rutina.',
  image: 'images/inn/mapa.png',
  logo: 'images/inn/V.png',
  features: [
    { id: 'direccion', icon: 'direccion', heading: 'Vicente Pérez Rosales 991', text: 'Puerto Varas, Región de Los Lagos' },
    { id: 'telefono', icon: 'telefono', heading: '+56 9 1234 5678', text: 'Contacto directo' },
  ],
}

const base = import.meta.env.BASE_URL

const TEAM_DATA = {
  eyebrow: 'Contactos',
  title: 'TE ACOMPAÑAMOS EN<br />CADA DECISIÓN',
  subtitle: '<b>Sala de ventas y departamento piloto</b> disponible en Vicente Pérez Rosales 991, Puerto Varas<br /><b>Horario:</b> Lunes a domingo de 10:00 a 14:00 horas y de 15:00 a 19:00 horas.',
  wazeMap: 'https://embed.waze.com/es/iframe?zoom=16&lat=-41.326080&lon=-72.970514&ct=livemap&pin=1&desc=0',
  agents: [
    { name: 'Patricia Ramírez', phone: '+56 9 3420 4833', email: 'pramirez@ileben.cl', avatar: `${base}images/team/Ramirez.jpg` },
    { name: 'Catalina Cid', phone: '+56 9 9577 3431', email: 'ccid@ileben.cl', avatar: `${base}images/team/Cid.jpg` },
    { name: 'Patricia Singh', phone: '+56 9 3420 4832', email: 'psingh@ileben.cl', avatar: `${base}images/team/Singh.jpg` },
  ],
}

export default function Inn() {
  const [activeTab, setActiveTab] = useState('proyecto')
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapTab, setMapTab] = useState('walking')
  const [activeLocationIndex, setActiveLocationIndex] = useState(0)
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

  useEffect(() => {
    const galleryEl = galleryRef.current
    if (!galleryEl) return
    Fancybox.bind(galleryEl, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(galleryEl)
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
            <ScrollAnim as='span' animation='zoom-in' className='mt-auto'><img src={`${base}images/inn/inn-logo.png`} className="lb-inn-hero__logo" alt="Logo INN" /></ScrollAnim>
            <SplitTitle as='h1' delay={0.2} stagger={0.05} className="lb-inn-hero__title p-0">VIVE EL LUJO<br /> EN PUERTO VARAS</SplitTitle>
          </div>
        </HeroShell>

        {/* Botonera pinneada debajo del header (sticky se confina al padre, por eso vive fuera del hero) */}
        <nav className="lb-inn-hero-tabs mx-auto" aria-label="Secciones del proyecto">
          <ScrollAnim animation='scale' className="card lb-inn-hero-tabs__inner shadow-lg">
            <div className="card-body py-4 px-4">
              <ul className="nav nav-pills nav-justified flex-nowrap align-items-center gap-5">
                {TABS.map((t) => (
                  <li className="nav-item" key={t.id}>
                    <button
                      type="button"
                      className={`nav-link nav-link__border ${t.id === activeTab ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(t.id)
                        // "Plantas" vive en la sección del cotizador
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

        {/* DATOS DEL PROYECTO */}
        <section className="lb-inn-info" aria-label="Datos del proyecto">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-5 text-center gx-4 gy-3">
              {infoList.map((t, i) => (
                <ScrollAnim animation='scale' delay={0.2 * (i + 1)} className="col" key={t.id}>
                  <div className="d-flex flex-column gap-1">
                    <small className="lb-inn-info__label text-uppercase">{t.label}</small>
                    <span className="fw-bold">{t.value}</span>
                  </div>
                </ScrollAnim>
              ))}
            </div>
          </div>
        </section>

        <ProjectFeatureSection
          eyebrow={<>Proyecto</>}
          title={<>LOS MEJORES DEPARTAMENTOS<br />DE PUERTO VARAS</>}
          description="Ubicado en primera línea frente al lago Llanquihue, INN combina la experiencia Home & Wellness con la sofisticación y comodidad de un hotel boutique. Sus departamentos de 2, 3 y 4 dormitorios, dúplex y deptos con patio privado ofrecen un refugio exclusivo donde el diseño y la naturaleza se integran para brindarte una experiencia de bienestar inigualable."
          highlight="Departamentos, dúplex y deptos. con patio privado."
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
            eyebrow: 'Alternativas a Edificio INN • Puerto Varas',
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
          targetId="espacios"
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
              <div className="col-12 col-lg-7 order-2 order-lg-1 p-5 d-flex flex-column justify-content-center">
                <div className="mb-5 lb-inn-map__header">
                  <ScrollAnim as="span" animation="flip-x" className="lb-inn-proyecto__eyebrow d-block mb-5">{MAP.eyebrow}</ScrollAnim>
                  <div className="d-flex align-items-center gap-4">
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
                <div className="lb-inn-map__text text-center text-lg-start">
                  <ScrollAnim animation="fade-up" className="lh-lg mb-5 w-md-80">
                    {MAP.description}
                  </ScrollAnim>
                  <button
                    ref={mapRef}
                    type="button"
                    className="btn btn-primary lb-inn-map__btn"
                    onClick={() => setShowMapModal(true)}
                  >
                    Ver mapa ampliado
                  </button>
                </div>
              </div>
              <div className="col-12 col-lg-5 order-1 order-lg-2">
                <ScrollAnim animation="fade-right">
                  <button
                    ref={mapRef}
                    type="button"
                    className="lb-inn-map__image position-relative h-100 border-0 bg-transparent p-0 w-100"
                    onClick={() => setShowMapModal(true)}
                    aria-label="Ver mapa de ubicación ampliado"
                  >
                    <img
                      src={`${base}${MAP.image}`}
                      alt="Mapa de ubicación (clic para ampliar)"
                      className="img-fluid w-100 h-100 object-fit-contain"
                    />
                  </button>
                </ScrollAnim>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel de imágenes en blanco y negro */}
        <section className="lb-inn-gallery pt-3 pb-3" id="galeria">
          <ScrollAnim className='container' animation="fade-up">
            <div ref={galleryRef} id="innGalleryCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
              <div className="carousel-inner">
                {GALLERY_SLIDES.map((slideImages, slideIndex) => (
                  <div className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`} key={slideIndex}>
                    <div className="row g-2">
                      {slideImages.map((image, imageIndex) => (
                        <div className="col-4" key={imageIndex}>
                          <a href={`${base}${image.img}`} data-fancybox="inn-galeria" tabIndex={0}>
                            <img
                              src={`${base}${image.img}`}
                              alt={image.alt}
                              className="d-block w-100 lb-inn-gallery__img rounded rounded-3"
                            />
                          </a>
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
          </ScrollAnim>
        </section>

        <InteriorismoSection
          eyebrow={<>Interiorismo</>}
          title={<>MAESTRÍA EN<br />CADA DETALLE</>}
          parallaxStrength={PARALLAX_STRENGTH}
          description="La experiencia de la reconocida interiorista Sofía Iturralde se une con la maestría en iluminación de Rafael Rivera para crear entornos en los que cada textura, línea y matriz de luz dialogan en armonía estética sureña y posicionan a este proyecto como el residencial más exclusivo para vivir en Puerto Varas."
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
            <div className="modal-header border-0 px-4 pt-4 pb-0" data-bs-theme="dark">
              <h2 className="modal-title lb-inn-proyecto__title mb-0">UBICACIÓN</h2>
              <button type="button" className="btn-close btn-close-white ms-auto" aria-label="Cerrar" onClick={() => setShowMapModal(false)} />
            </div>
            <div className="modal-body p-4">
              <div className="row g-4 align-items-center">
                {/* Columna izquierda: Tabs + Lista */}
                <div className="col-12 col-lg-5">
                  <div className="lb-inn-map-modal__list p-3 rounded-4">
                    {/* Tabs con Bootstrap nav-pills e iconos animados */}
                    <ul className="nav nav-pills nav-fill gap-2 mb-3 lb-inn-map-modal__tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          type="button"
                          className={`nav-link d-inline-flex align-items-center justify-content-center gap-2 ${
                            mapTab === 'walking' ? 'active' : ''
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
                          className={`nav-link d-inline-flex align-items-center justify-content-center gap-2 ${
                            mapTab === 'vehicle' ? 'active' : ''
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
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 rounded-3 mb-1 text-white lb-inn-map-modal__item ${
                              isSelected ? 'active' : ''
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
