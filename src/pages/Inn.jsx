import { useState } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import CarouselNav from '../components/sections/CarouselNav.jsx'
import ProjectFeatureSection from '../components/sections/ProjectFeatureSection.jsx'
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
  { id: 'wellness', label: 'Home & Wellness' },
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
  { label: 'Refrigerador', icon: 'images/logos/refrigerador.svg' },
  { label: 'Horno', icon: 'images/logos/horno.svg' },
  { label: 'Microondas', icon: 'images/logos/microhondas.svg' },
  { label: 'Encimera y campana', icon: 'images/logos/encimera.svg' },
  { label: 'Lavavajillas', icon: 'images/logos/lavavajillas.svg' },
  { label: 'Cubierta cocina', icon: 'images/logos/cubierta cocina.svg' },
  { label: 'Grifería cocina', icon: 'images/logos/griferia.svg' },
  { label: 'Grifería baño', icon: 'images/logos/bano.svg' },
]

const base = import.meta.env.BASE_URL

export default function Inn() {
  const [activeTab, setActiveTab] = useState('proyecto')
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeEquipmentSlide, setActiveEquipmentSlide] = useState(0)

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
          videoSrc="video/inn-test.mp4"
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
      </main>
      <Footer />
    </>
  )
}
