import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'

const base = import.meta.env.BASE_URL

export const PANORAMAS_CATEGORIES = [
  {
    id: 'ruta-del-lago',
    name: 'Ruta del lago',
    tabLabel: 'RUTA DEL LAGO',
    slides: [
      {
        id: 'ensenada',
        title: 'Ensenada',
        distance: '40 km',
        image: 'images/inn/panoramas/Ensenada_04_IA.jpg',
      },
      {
        id: 'playa-venado',
        title: 'Playa Venado, Ruta 225, km 16',
        distance: '14 km',
        image: 'images/inn/panoramas/Fundo Playa Venado_2.jpg',
      },
      {
        id: 'once-bellavista',
        title: 'Onces Bellavista',
        distance: '32 km',
        image: 'images/inn/panoramas/Onces_Bellavista_IA.jpg',
      },
    ],
  },
  {
    id: 'naturaleza-en-grande',
    name: 'Naturaleza en grande',
    tabLabel: 'NATURALEZA EN GRANDE',
    slides: [
      {
        id: 'saltos-del-petrohue',
        title: 'Saltos del Petrohué',
        distance: '53 km',
        image: 'images/inn/panoramas/Saltos_del_Petrohue_AI.jpg',
      },
      {
        id: 'todos-los-santos',
        title: 'Lago Todos los Santos',
        distance: '59 km',
        image: 'images/inn/panoramas/Lago_Todos_los Santos_AI.jpg',
      },
      {
        id: 'volcan-osorno',
        title: 'Volcán Osorno, Centro de Sky',
        distance: '57 km',
        image: 'images/inn/panoramas/Centro de Sky.jpg',
      },
      {
        id: 'volcan-calbuco',
        title: 'Volcán Calbuco, Reserva Nacional Llanquihue',
        distance: '60 km',
        image: 'images/inn/panoramas/Volcan_Calbuco_AI.jpg',
      },
    ],
  },
  {
    id: 'cultura-junto-al-lago',
    name: 'Cultura junto al lago',
    tabLabel: 'CULTURA JUNTO AL LAGO',
    slides: [
      {
        id: 'muelle-frutillar',
        title: 'Muelle de Frutillar',
        distance: '34 km',
        image: 'images/inn/panoramas/Muelle_Frutillar_AI.jpg',
      },
      {
        id: 'futrillar-teatro-del-lago',
        title: 'Frutillar, Teatro del Lago',
        distance: '32 km',
        image: 'images/inn/panoramas/Teatro_del_Lago_AI.jpg',
      },
      {
        id: 'futrillar-museo-colonial',
        title: 'Frutillar, Museo Colonial Alemán',
        distance: '32 km',
        image: 'images/inn/panoramas/Museo Aleman.jpg',
      },
      {
        id: 'casco-historico-puerto-octay',
        title: 'Casco histórico de Puerto Octay',
        distance: '55 km',
        image: 'images/inn/panoramas/Casco_historico_Puerto_Octay.jpg',
      },
    ],
  },
  {
    id: 'escapadas-memorables',
    name: 'Escapadas memorables',
    tabLabel: 'ESCAPADAS MEMORABLES',
    slides: [
      {
        id: 'cruce-a-chiloé-pargua',
        title: 'Cruce a Chiloé, Pargua',
        distance: '76 km',
        image: 'images/inn/panoramas/Cruce_Chiloe_Pargua_AI.jpg',
      },
      {
        id: 'isla-chiloe',
        title: 'Chiloé',
        distance: '115 km',
        image: 'images/inn/panoramas/Iglesia_Chiloe_AI.jpg',
      },
      {
        id: 'termas-del-sol',
        title: 'Termas del Sol',
        distance: '127 km',
        image: 'images/inn/panoramas/Termas_del_Sol_AI.jpg',
      },
    ],
  },
]

function chunkIntoPairs(cards) {
  if (!cards || cards.length === 0) return []
  if (cards.length <= 2) return [cards]
  const pairs = []
  for (let i = 0; i < cards.length; i += 2) {
    if (i + 1 < cards.length) {
      pairs.push([cards[i], cards[i + 1]])
    } else {
      pairs.push([cards[i - 1], cards[i]])
    }
  }
  return pairs
}

function CarFrontIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: '-2px', flexShrink: 0 }}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

export default function InnPanoramasModal({ show, onClose }) {
  const [activeCatIndex, setActiveCatIndex] = useState(0)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const carouselRef = useRef(null)
  const carouselInstance = useRef(null)

  const currentCategory = PANORAMAS_CATEGORIES[activeCatIndex] || PANORAMAS_CATEGORIES[0]
  const rawCards = (currentCategory.slides || []).flat()
  const slides = useMemo(() => chunkIntoPairs(rawCards), [rawCards])
  const totalSlides = slides.length

  useEffect(() => {
    const el = carouselRef.current
    if (!el || !show) return

    const instance = Carousel.getOrCreateInstance(el, {
      interval: false,
      ride: false,
      wrap: true,
    })
    carouselInstance.current = instance

    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })

    const onSlid = (e) => {
      if (typeof e.to === 'number') {
        setActiveSlideIndex(e.to)
      }
    }

    el.addEventListener('slid.bs.carousel', onSlid)
    return () => {
      el.removeEventListener('slid.bs.carousel', onSlid)
      Fancybox.unbind(el)
      instance.dispose()
      carouselInstance.current = null
    }
  }, [activeCatIndex, show])

  const handlePrevSlide = useCallback(() => {
    carouselInstance.current?.prev()
  }, [])

  const handleNextSlide = useCallback(() => {
    carouselInstance.current?.next()
  }, [])

  // Manejo de teclado (Escape y flechas)
  useEffect(() => {
    if (!show) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide()
      } else if (e.key === 'ArrowRight') {
        handleNextSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, onClose, handlePrevSlide, handleNextSlide])

  // Bloqueo de scroll con clase estándar modal-open de Bootstrap
  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(show))
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [show])

  if (!show) return null

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      id="innPanoramasModal"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panoramasModalTitle"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-fullscreen"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content lb-inn-panoramas-modal border-0 rounded-4 overflow-hidden position-relative"
          data-bs-theme="dark"
          style={{
            backgroundImage: `url('${base}images/inn/panoramas/bg-forest.jpg')`,
          }}
        >
          {/* Overlay oscuro para legibilidad sobre fondo de bosque */}
          <div className="lb-inn-panoramas-modal__backdrop-filter" />

          {/* Botón cerrar nativo Bootstrap */}
          <button
            type="button"
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3 m-md-4 z-3"
            onClick={onClose}
            aria-label="Cerrar modal"
          />

          <div className="modal-body lb-inn-panoramas-modal__content position-relative p-4 p-md-5">
            <div className="container">
              {/* Header */}
              <div className="lb-inn-panoramas-modal__header">
                <div className="lb-inn-panoramas-modal__eyebrow">
                  <span className="lb-inn-panoramas-modal__eyebrow-light">Ubicación</span>
                  <span className="lb-inn-panoramas-modal__eyebrow-pipe">|</span>
                  <span className="lb-inn-panoramas-modal__eyebrow-strong">Experiencias</span>
                </div>
                <h2 id="panoramasModalTitle" className="lb-inn-panoramas-modal__title">
                  EL SUR, A TU MANERA
                </h2>
                <p className="lb-inn-panoramas-modal__desc">
                  Desde INN, descubre paisajes, sabores y escapadas que hacen de cada día una experiencia inolvidable.
                </p>
              </div>

              {/* Categorías / Tabs */}
              <div className="lb-inn-panoramas-modal__tabs-nav">
                {PANORAMAS_CATEGORIES.map((cat, idx) => {
                  const isActive = activeCatIndex === idx
                  return (
                    <React.Fragment key={cat.id}>
                      {idx > 0 && <span className="lb-inn-panoramas-modal__tab-divider">|</span>}
                      <button
                        type="button"
                        className={`lb-inn-panoramas-modal__tab ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setActiveCatIndex(idx)
                          setActiveSlideIndex(0)
                        }}
                      >
                        <span>{cat.tabLabel}</span>
                      </button>
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Carousel Bootstrap (2 tarjetas por slide) */}
              <div
                key={activeCatIndex}
                ref={carouselRef}
                id="innPanoramasCarousel"
                className="carousel slide mb-4"
                data-bs-interval="false"
              >
                <div className="carousel-inner">
                  {slides.map((slideCards, slideIdx) => (
                    <div
                      key={slideIdx}
                      className={`carousel-item ${slideIdx === 0 ? 'active' : ''}`}
                    >
                      <div className="row g-4">
                        {slideCards.map((card) => (
                          <div key={card.id} className="col-12 col-md-6">
                            <div className="card lb-inn-panoramas-modal__card h-100 border-0 rounded-1 overflow-hidden">
                              <a
                                href={`${base}${card.image}`}
                                data-fancybox={`panoramas-${currentCategory.id}`}
                                data-caption={`${card.title} · a ${card.distance} de INN`}
                                className="d-block ratio ratio-16x9 text-decoration-none"
                                style={{ cursor: 'pointer' }}
                              >
                                <img
                                  src={`${base}${card.image}`}
                                  alt={card.title}
                                  className="object-fit-cover w-100 h-100 lb-inn-panoramas-modal__card-img"
                                  loading="lazy"
                                />
                              </a>
                              <div className="card-body p-1 px-4">
                                <h3 className="lb-inn-panoramas-modal__card-title m-0">{card.title}</h3>
                                <div className="d-flex align-items-center text-secondary small">
                                  <CarFrontIcon size={16} className="me-2" />
                                  <span>a {card.distance} de INN</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Barra de navegación inferior */}
              <div className="d-flex align-items-center justify-content-between pt-2">
                <div className="lb-inn-panoramas-modal__counter">
                  {currentCategory.name} [{activeSlideIndex + 1}/{totalSlides}]
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn lb-inn-panoramas-modal__arrow rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                    onClick={handlePrevSlide}
                    disabled={totalSlides <= 1}
                    aria-label="Panorama anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="btn lb-inn-panoramas-modal__arrow rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                    onClick={handleNextSlide}
                    disabled={totalSlides <= 1}
                    aria-label="Siguiente panorama"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
