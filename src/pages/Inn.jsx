import { useEffect, useMemo, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import Navbar from '../components/layout/Navbar.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import CarouselNav from '../components/sections/CarouselNav.jsx'
import ProjectFeatureSection from '../components/sections/ProjectFeatureSection.jsx'
import HeroShell from '../components/sections/HeroShell.jsx'
import Recorridos360 from '../components/sections/Recorridos360.jsx'
import VideoTextSection from '../components/sections/VideoTextSection.jsx'
import Cotizador from '../components/proyecto/Cotizador.jsx'
import InteriorismoSection from '../components/sections/InteriorismoSection.jsx'
import InnTeamAgents from '../components/proyecto/InnTeamAgents.jsx'
import { ConciergeBellIcon } from '../components/icons/concierge-bell.jsx'
import { TableIcon } from '../components/icons/table.jsx'
import { ChefHatIcon } from '../components/icons/chef-hat.jsx'
import { DumbbellIcon } from '../components/icons/dumbbell.jsx'
import { WavesLadderIcon } from '../components/icons/waves-ladder.jsx'
import { KayakIcon } from '../components/icons/kayak.jsx'
import { HotTubIcon } from '../components/icons/hot-tub.jsx'
import { getProjectBySlug } from '../data/projects.js'
import { apiFetch } from '../lib/apiFetch.js'

const INFO = [
  { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991, Puerto Varas' },
  { id: 'tipologias', label: 'Tipologías', value: '2, 3 y dorms, Deptos, dúplex y deptos con patio privado' },
  { id: 'metrajes', label: 'Metrajes', value: 'Desde 85 m²' },
  { id: 'precio', label: 'Precio desde', value: 'UF 9.816' },
  { id: 'estado', label: 'Estado del proyecto', value: 'Entrega futura' },
]

// Fuerza global del parallax (en % del alto del elemento). Un solo knob para todas las secciones de INN.
// Negativo = el elemento sube al hacer scroll (parallax clásico).
const PARALLAX_STRENGTH = -14

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

// Espacios comunes: iconos animados (pqoqubbw/icons). Jacuzzi exterior sin icono por ahora.
const ESPACIOS_COMUNES_NAV_ITEMS = [
  { id: 'hall', label: 'Hall de acceso', icon: ConciergeBellIcon },
  { id: 'atrio', label: 'Atrio', icon: TableIcon },
  { id: 'gourmet', label: 'Gourmet + Quincho equipado', icon: ChefHatIcon },
  { id: 'training', label: 'Training Zone', icon: DumbbellIcon },
  { id: 'jacuzzi', label: 'Jacuzzi exterior', icon: HotTubIcon },
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

const MAP_FEATURES = [
  'Museo Pablo Fierro',
  'Monumento Héroes Patrios',
  'Casino',
  'Centro de Puerto Varas',
  'Mall - Supermercado',
  'Costanera',
  'Muelle Piedralplen',
  'Muelle Puerto Varas',
  'Mesa Tropera',
  'Hotel Cumbres',
  'Cassis',
  'La Olla',
]

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
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Cubierta.jpg', alt: 'Cubierta ultracompacta terminación traventino', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Cubierta.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Encimera.jpg', alt: 'Encimera', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Encimera.jpg' },
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Refrigerador.jpg', alt: 'Refrigerador panelado', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Cocina_Refrigerador.jpg' },
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
      { img: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg', alt: 'Ducha Hansgrohe en baño principal', thumb: 'images/inn/equipamiento/Equipamiento_Detalle_Baño_Ducha_Hansgrohe.jpg' },
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
  title: <>VISTAS<br/>INSUPERABLES</>,
  description: 'Descubre el privilegio de vivir con vistas incomparables y despejadas al Lago Llanquihue, los volcanes Osorno y Calbuco, en un entorno privilegiado y en el edificio más moderno y exclusivo de Puerto Varas.',
  image: 'images/inn/mapa.png',
  logo: 'images/inn/V.png',
  features: [
    { id: 'direccion', icon: 'direccion', heading: 'Vicente Pérez Rosales 991', text: 'Puerto Varas, Región de Los Lagos' },
    { id: 'telefono', icon: 'telefono', heading: '+56 9 1234 5678', text: 'Contacto directo' },
  ],
}

const base = import.meta.env.BASE_URL

export default function Inn() {
  const [activeTab, setActiveTab] = useState('proyecto')
  const [showMapModal, setShowMapModal] = useState(false)
  const [apiProjects, setApiProjects] = useState(null)
  const [innProject, setInnProject] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data }) => {
      if (cancelled) return
      setApiProjects(data)
      // Preselección del proyecto INN (apiId 9)
      const inn = Array.isArray(data) ? data.find((p) => p.id === 9) : null
      if (inn) setInnProject(inn)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])
  // Selección estable: misma referencia entre renders para que el Cotizador
  // no se resetee (sus efectos dependen de la identidad de `selection`)
  const selection = useMemo(
    () => (innProject ? { project: innProject } : undefined),
    [innProject]
  )

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
          className="lb-inn-hero justify-content-center"
          video={`${base}video/inn-new.mp4`}
          bgWrapClassName="lb-inn-hero__bg-wrap"
          overlayClassName="lb-inn-hero__overlay"
        >
          <ScrollAnim animation='zoom-in' className="position-absolute d-flex align-items-start flex-column align-self-center container h-100 mx-auto">
            <img src={`${base}images/inn/inn-logo.png`} className="lb-inn-hero__logo mt-auto" alt="Logo INN" />
            <h1 className="lb-inn-hero__title p-0">VIVE EL LUJO<br/> EN PUERTO VARAS</h1>
          </ScrollAnim>
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
            <ScrollAnim className="row row-cols-1 row-cols-lg-5 text-center gx-4 gy-3">
              {INFO.map((t) => (
                <div className="col" key={t.id}>
                  <div className="d-flex flex-column gap-1">
                    <small className="lb-inn-info__label text-uppercase">{t.label}</small>
                    <span className="fw-bold">{t.value}</span>
                  </div>
                </div>
              ))}
            </ScrollAnim>
          </div>
        </section>

        <ProjectFeatureSection
          eyebrow={<>Proyecto</>}
          title={<>EXCLUSIVIDAD<br />FRENTE AL LAGO</>}
          description="Descubre el privilegio de vivir en primera línea con vistas incomparables y despejadas al Lago Llanquihue y los volcanes Osorno y Calbuco, en el edificio más moderno y exclusivo de Puerto Varas."
          highlight="Departamentos, dúplex y deptos. con patio privado."
          highlightOffer="paga el pien en <b>60</b> cuotas"
          slides={SLIDES}
          carouselId="innCarousel"
          parallaxStrength={PARALLAX_STRENGTH}
          activeSlide={activeSlide}
          onSlideChange={setActiveSlide}
          showIndicators={false}
          id="proyecto"
          ariaLabel="Proyecto"
        />

        <VideoTextSection
          text="Edificio de solo 8 pisos, 78 departamentos exclusivosde 2 a 4 dormitorios. Departamentos tradicionales, dúplex y en primer piso, con patio privado."
          videoSrc="video/video_reconfortante_a.mp4"
        />

        <ProjectFeatureSection
          title={<>EQUIPAMIENTO<br /><small>y terminaciones</small></>}
          description="Incluye refrigerador y lavavajillas panelado, horno y microondas empotrado Franke. Cubierta ultra compacta MK, grifería italiana Paini y grifería alemana Hansgrohe."
          highlightLogos={EQUIPMENT_LOGOS}
          slides={EQUIPMENT_SLIDES}
          carouselId="innDepartamentosCarousel"
          parallaxStrength={PARALLAX_STRENGTH}
          backgroundImage="images/inn/edificio.svg"
          id="departamentos"
          className='pb-2 mb-2'
          ariaLabel="Departamentos"
          showIndicators={false}
          activeSlide={activeEquipmentSlide}
          onSlideChange={setActiveEquipmentSlide}
          spacesModal={{
            buttonLabel: 'Mas detalles...',
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

        <VideoTextSection
          text="Edificio inn, home & wellness redefine la vidafrente al Lago Llanquihue con espacios premium para el descanso,conexión y bienestar."
          videoSrc="video/exterior.mp4"
        />

        <ProjectFeatureSection
          title={<>ESPACIOS<br />COMUNES</>}
          description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. "
          slides={ESPACIOS_COMUNES_SLIDES}
          carouselId="innEspaciosCarousel"
          parallaxStrength={PARALLAX_STRENGTH}
          backgroundImage="images/inn/espacio.svg"
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
          text="Lorem ipsum dolor sit amet, consectetuer adipiscingelit nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam."
          videoSrc="video/lipsum.mp4"
        />

        {/* SECCIÓN MAPA */}
        <section className="container-fluid lb-inn-map" id="ubicacion">
          <div className="container">
            <div className="row g-0">
              <div className="col-12 col-lg-7 order-2 order-lg-1 p-5 d-flex flex-column justify-content-center">
                <ScrollAnim className="mb-5 lb-inn-map__header">
                  <span className="lb-inn-proyecto__eyebrow d-block mb-5">{MAP.eyebrow}</span>
                  <div className="d-flex align-items-center gap-4">
                    <img
                      src={`${base}${MAP.logo}`}
                      alt="Logo INN"
                      className="lb-inn-map__header-logo"
                    />
                    <div className='lb-inn-map__titulos-right'>
                      <h2 className="lb-inn-proyecto__title mb-0">{MAP.title}</h2>
                    </div>
                  </div>
                </ScrollAnim>
                <div className="lb-inn-map__text text-center text-lg-start">
                  <p className="lh-lg mb-5">
                    {MAP.description}
                  </p>                  
                </div>
              </div>
              <div className="col-12 col-lg-5 order-1 order-lg-2">
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
              </div>
            </div>
          </div>
        </section>

        {/* Carousel de imágenes en blanco y negro */}
        <section className="lb-inn-gallery pt-3 pb-3" id="galeria">
          <ScrollAnim className='container' animation="fade-in">
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
          title={<>DISEÑO EXCLUSIVO</>}
          parallaxStrength={PARALLAX_STRENGTH}
          description="Nuestros departamentos han sido diseñados por renombrados arquitectos y diseñadores, combinando estética contemporánea con funcionalidad superior. Cada espacio refleja un equilibrio perfecto entre lujo, confort y estilo, creando ambientes únicos que se adaptan a tus necesidades y preferencias personales. Los materiales de alta calidad, las terminaciones impecables y la atención al detalle en cada rincón garantizan una experiencia de vida excepcional en el corazón de Puerto Varas."
          backgroundImage="images/inn/interiorismo.svg"
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
          <div className="modal-content border-0 rounded-4 overflow-hidden">
            <div className="modal-header border-0">
              <h2 className="modal-title lb-inn-proyecto__title">UBICACIÓN</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowMapModal(false)} />
            </div>
            <div className="modal-body p-0">
              <div className="row g-0">
                <div className="col-12 col-md-4 lb-inn-map-modal__list p-4">
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                    {MAP_FEATURES.map((feature, i) => (
                      <li key={feature} className="d-flex align-items-center gap-2 lb-inn-map-modal__item">
                        <span className="lb-inn-map-modal__number">{i + 1}</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-12 col-md-8">
                  <img
                    src={`${base}images/inn/mapa-big.jpg`}
                    alt="Mapa ampliado de Puerto Varas"
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CONTACTO — asesores + mapa (misma referencia que ProyectoDetalle) */}
      <InnTeamAgents
        data={innProject?.team || getProjectBySlug('inn')?.team}
        apiId={innProject?.apiId ?? getProjectBySlug('inn')?.apiId}
      />

      <Footer />
    </>
  )
}
