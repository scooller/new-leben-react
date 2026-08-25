import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Navbar from '../components/layout/Navbar.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import CarouselNav from '../components/sections/CarouselNav.jsx'
import ProjectFeatureSection from '../components/sections/ProjectFeatureSection.jsx'
import Recorridos360 from '../components/sections/Recorridos360.jsx'
import VideoTextSection from '../components/sections/VideoTextSection.jsx'

const INFO = [
  { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991' },
  { id: 'tipologias', label: 'Tipologías', value: '2 · 3 · 4 dorms, dúplex y deptos con patio' },
  { id: 'metrajes', label: 'Metrajes', value: 'Desde 85 m²' },
  { id: 'precio', label: 'Precio desde', value: 'UF 9.816' },
  { id: 'estado', label: 'Estado del proyecto', value: 'Entrega futura' },
]

const TABS = [
  { id: 'proyecto', label: 'Proyecto' },
  { id: 'departamentos', label: 'Departamentos' },
  { id: 'plantas', label: 'Plantas' },
  { id: 'espacios', label: 'Home & Wellness' },
  { id: 'ubicacion', label: 'Ubicación' },
]

const SLIDES = [
  { img: 'images/inn/slides/02_DEPORTE-NAUTICO.jpg', alt: 'Deportes náuticos' },
  { img: 'images/inn/slides/foto1.jpg', alt: 'Trekking' },
  { img: 'images/inn/slides/foto2.jpg', alt: 'Pesca' },
]

const EQUIPMENT_LOGOS = [
  { src: 'images/logos/franke.png', alt: 'Franke' },
  { src: 'images/logos/mk.png', alt: 'MK' },
  { src: 'images/logos/paini.png', alt: 'Paini' },
  { src: 'images/logos/hansgrohe.png', alt: 'Hansgrohe' },
]

const EQUIPMENT_SLIDES = [
  { img: 'images/inn/terminacion-puertas.jpg', alt: 'Refrigerador' },
  { img: 'images/inn/terminacion-horno.jpg', alt: 'Horno' },
  { img: 'images/inn/terminacion-microondas.jpg', alt: 'Microondas' },
  { img: 'images/inn/terminacion-encimera-campana.jpg', alt: 'Encimera y campana' },
  { img: 'images/inn/terminacion-lavavajillas.jpg', alt: 'Lavavajillas' },
  { img: 'images/inn/terminacion-cubierta-cocina.jpg', alt: 'Cubierta cocina' },
  { img: 'images/inn/terminacion-griferia-cocina.jpg', alt: 'Grifería cocina' },
  { img: 'images/inn/terminacion-griferia-bano.jpg', alt: 'Grifería baño' },
]

const EQUIPMENT_NAV_ITEMS = [
  { label: 'Refrigerador', icon: 'images/icons/refrigerador.svg' },
  { label: 'Horno', icon: 'images/icons/horno.svg' },
  { label: 'Microondas', icon: 'images/icons/microhondas.svg' },
  { label: 'Encimera y campana', icon: 'images/icons/encimera.svg' },
  { label: 'Lavavajillas', icon: 'images/icons/lavavajillas.svg' },
  { label: 'Cubierta cocina', icon: 'images/icons/cubierta cocina.svg' },
  { label: 'Grifería cocina', icon: 'images/icons/griferia.svg' },
  { label: 'Grifería baño', icon: 'images/icons/bano.svg' },
]

const GALLERY_IMAGES = [
  { img: 'images/inn/galeria1.jpg', alt: 'Galería 1' },
  { img: 'images/inn/galeria2.jpg', alt: 'Galería 2' },
  { img: 'images/inn/galeria3.jpg', alt: 'Galería 3' },
  { img: 'images/inn/galeria4.jpg', alt: 'Galería 4' },
  { img: 'images/inn/galeria5.jpg', alt: 'Galería 5' },
]

// Cada slide muestra 3 imágenes consecutivas empezando en la i-ésima,
// avanzando de 1 en 1 (wrap-around para loop infinito)
const GALLERY_SLIDES = GALLERY_IMAGES.map((_, i) =>
  [0, 1, 2].map((offset) => GALLERY_IMAGES[(i + offset) % GALLERY_IMAGES.length])
)

const MAP = {
  eyebrow: <>5<span className="mx-2">|</span>Ubicación</>,
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
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeEquipmentSlide, setActiveEquipmentSlide] = useState(0)
  const mapRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    const mapEl = mapRef.current
    if (!mapEl) return
    Fancybox.bind(mapEl, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(mapEl)
  }, [])

  useEffect(() => {
    const galleryEl = galleryRef.current
    if (!galleryEl) return
    Fancybox.bind(galleryEl, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(galleryEl)
  }, [])

  // Scrollspy: activa el tab según la sección visible (sin cambiar nombres)
  useEffect(() => {
    const sections = TABS
      .map((t) => document.getElementById(t.id))
      .filter(Boolean)
    if (!sections.length) return

    const onScroll = () => {
      const offset = window.scrollY + window.innerHeight * 0.35
      let current = null
      sections.forEach((section) => {
        if (section.offsetTop <= offset) current = section.id
      })
      if (current) setActiveTab(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar />
      <main className="lb-inn">
        {/* HERO */}
        <section className="lb-inn-hero justify-content-center" id="inicio">
          <div className="lb-inn-hero__bg-wrap">
            <video src={`${base}video/inn-test.mp4`} autoPlay muted loop playsInline fetchPriority="high" />
            <div className="lb-inn-hero__overlay" />
          </div>
          <ScrollAnim animation='zoom-in' className="position-absolute d-flex align-items-start flex-column align-self-center container h-100 mx-auto">
            <img src={`${base}images/inn-logo.png`} className="lb-inn-hero__logo mt-auto" alt="Logo INN" />
            <h1 className="lb-inn-hero__title p-0">VIVE EL LUJO<br/> EN PUERTO VARAS</h1>
          </ScrollAnim>

        </section>

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
                      onClick={() => setActiveTab(t.id)}
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
          eyebrow={<>1<span className="mx-2">|</span>Proyecto</>}
          title={<>EXCLUSIVIDAD<br />FRENTE AL LAGO</>}
          description="Descubre el privilegio de vivir en primera línea con vistas incomparables y despejadas al Lago Llanquihue y los volcanes Osorno y Calbuco, en el edificio más moderno y exclusivo de Puerto Varas."
          highlight="Departamentos, dúplex y deptos. con patio privado."
          slides={SLIDES}
          carouselId="innCarousel"
          activeSlide={activeSlide}
          onSlideChange={setActiveSlide}
          id="proyecto"
          ariaLabel="Proyecto"
        />

        <VideoTextSection
          text="Edificio de solo 8 pisos, 78 departamentos exclusivosde 2 a 4 dormitorios. Departamentos tradicionales, dúplex y en primer piso,con patio privado."
          videoSrc="video/video_reconfortante_a.mp4"
        />

        <ProjectFeatureSection
          eyebrow={<>2<span className="mx-2">|</span>Departamentos</>}
          title={<>EQUIPAMIENTO<br /><small>y terminaciones</small></>}
          description="Incluye refrigerador y lavavajillas panelado, horno y microondas empotrado Franke. Cubierta ultra compacta MK, grifería italiana Paini y grifería alemana Hansgrohe."
          highlightLogos={EQUIPMENT_LOGOS}
          slides={EQUIPMENT_SLIDES}
          carouselId="innDepartamentosCarousel"
          backgroundImage="images/inn/edificio.svg"
          id="departamentos"
          className='pb-2 mb-2'
          ariaLabel="Departamentos"
          showIndicators={false}
          activeSlide={activeEquipmentSlide}
          onSlideChange={setActiveEquipmentSlide}
        />

        <CarouselNav
          items={EQUIPMENT_NAV_ITEMS}
          targetId="departamentos"
          activeIndex={activeEquipmentSlide}
          onSelect={setActiveEquipmentSlide}
        />

        <Recorridos360 />

        {/* Aqui va la seccion plantas/cotizador */}

        <VideoTextSection
          text="Edificio inn, home & wellness redefine la vidafrente al Lago Llanquihue con espacios premium para el descanso,conexión y bienestar."
          videoSrc="video/exterior.mp4"
        />

        <ProjectFeatureSection
          eyebrow={<>4<span className="mx-2">|</span>Home & Wellness</>}
          title={<>ESPACIOS COMUNES</>}
          description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. "
          slides={EQUIPMENT_SLIDES}
          carouselId="innEspaciosCarousel"
          backgroundImage="images/inn/edificio.svg"
          id="espacios"
          className='pb-2 mb-2'
          ariaLabel="Espacios"
          showIndicators={false}
          activeSlide={activeEquipmentSlide}
          onSlideChange={setActiveEquipmentSlide}
        />

        <CarouselNav
          items={EQUIPMENT_NAV_ITEMS}
          targetId="espacios"
          variant="stacked"
          activeIndex={activeEquipmentSlide}
          onSelect={setActiveEquipmentSlide}
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
                <ScrollAnim className="d-flex align-items-center gap-4 mb-5 lb-inn-map__header">
                  <img
                    src={`${base}${MAP.logo}`}
                    alt="Logo INN"
                    className="lb-inn-map__header-logo"
                  />
                  <div className='lb-inn-map__titulos-right'>
                    <span className="lb-inn-proyecto__eyebrow mb-0">{MAP.eyebrow}</span>
                    <h2 className="lb-inn-proyecto__title mb-0">{MAP.title}</h2>
                  </div>
                </ScrollAnim>
                <div className="lb-inn-map__text text-center text-lg-start">
                  <p className="lh-lg mb-5">
                    {MAP.description}
                  </p>                  
                </div>
              </div>
              <div className="col-12 col-lg-5 order-1 order-lg-2">
                <div ref={mapRef} className="lb-inn-map__image position-relative h-100">
                  <a href={`${base}${MAP.image}`} data-fancybox="inn-mapa" tabIndex={0} className="d-block h-100">
                    <img 
                      src={`${base}${MAP.image}`} 
                      alt="Mapa de ubicación (clic para ampliar)" 
                      className="img-fluid w-100 h-100 object-fit-contain"
                    />
                  </a>
                </div>
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
                      {slideImages.map((image) => (
                        <div className="col-4" key={image.img}>
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

      </main>
      <Footer />
    </>
  )
}
