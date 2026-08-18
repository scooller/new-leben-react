import { useState, useEffect, useRef } from 'react'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'

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

const base = import.meta.env.BASE_URL

export default function Inn() {
  const [activeTab, setActiveTab] = useState('proyecto')
  const [activeSlide, setActiveSlide] = useState(0)
  const carouselEl = useRef(null)

  useEffect(() => {
    // React nulifica los refs antes de correr los cleanups: capturar el nodo localmente
    const el = carouselEl.current
    if (!el) return
    // Bootstrap no auto-inicializa carruseles montados por React Router
    const c = new Carousel(el, { interval: 5000, ride: 'carousel' })
    // Click en imagen del carrusel abre Fancybox (mismo patrón que BottomGallery)
    Fancybox.bind(el, '[data-fancybox="inn-carousel"]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    // Bootstrap solo sincroniza los indicators internos: sync manual del estado
    const onSlid = (e) => setActiveSlide(e.to)
    el.addEventListener('slid.bs.carousel', onSlid)
    return () => {
      el.removeEventListener('slid.bs.carousel', onSlid)
      Fancybox.unbind(el)
      c.dispose()
    }
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

        {/* PROYECTO — texto izquierda + carrusel Bootstrap derecha */}
        <section className="lb-inn-proyecto" id="proyecto" aria-label="Proyecto">
          <div className="container lb-shadow-box px-5 py-4 pt-8">
            <div className="row align-items-center g-5">
              <div className="col-lg-5 align-self-stretch position-relative">
                <div className='h-100 pe-4' animation="fade-up">
                  <ScrollAnim as="span" className="lb-inn-proyecto__eyebrow">
                    1<span className="mx-2">|</span>Proyecto
                  </ScrollAnim>
                  <ScrollAnim as="h2" className="lb-inn-proyecto__title">
                    EXCLUSIVIDAD
                    <br />
                    FRENTE AL LAGO
                  </ScrollAnim>
                  <ScrollAnim as="p" className="lb-inn-proyecto__text">
                    Descubre el privilegio de vivir en primera línea con vistas incomparables y
                    despejadas al Lago Llanquihue y los volcanes Osorno y Calbuco, en el edificio
                    más moderno y exclusivo de Puerto Varas.
                  </ScrollAnim>
                  <ScrollAnim as="p" className="fw-bold">
                    Departamentos, dúplex y deptos. con patio privado.
                  </ScrollAnim>
                  <div className="carousel-indicators position-absolute bottom-0 left-0 lb-inn-proyecto__indicators">
                    {SLIDES.map((s, i) => (
                      <button
                        type="button"
                        data-bs-target="#innCarousel"
                        data-bs-slide-to={i}
                        className={i === activeSlide ? 'active' : ''}
                        aria-label={`Imagen ${i + 1}`}
                        key={s.img}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <ScrollAnim className="col-lg-7">
                <div ref={carouselEl} id="innCarousel" className="carousel slide carousel-fade">
                  <div className="carousel-inner lb-inn-proyecto__frame">
                    {SLIDES.map((s, i) => (
                      <div
                        className={`carousel-item ${i === 0 ? 'active' : ''}`}
                        data-bs-interval="5000"
                        key={s.img}
                      >
                        <a
                          href={`${base}${s.img}`}
                          data-fancybox="inn-carousel"
                          tabIndex={0}
                        >
                          <img src={`${base}${s.img}`} className="d-block w-100" alt={s.alt} />
                        </a>
                      </div>
                    ))}
                  </div>

                </div>
              </ScrollAnim>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
