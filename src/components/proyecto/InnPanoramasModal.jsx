import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const base = import.meta.env.BASE_URL

export const PANORAMAS_CATEGORIES = [
  {
    id: 'ruta-del-lago',
    name: 'Ruta del lago',
    tabLabel: 'RUTA DEL LAGO',
    slides: [
      [
        {
          id: 'ensenada',
          title: 'ENSENADA',
          distance: 'a 40 km de INN',
          image: 'images/inn/panoramas/ensenada.jpg',
        },
        {
          id: 'playa-venado',
          title: 'PLAYA VENADO',
          distance: 'a 14 km de INN · Ruta 225,km 16',
          image: 'images/inn/panoramas/playa-venado.jpg',
        },
      ],
      [
        {
          id: 'los-riscos',
          title: 'LOS RISCOS',
          distance: 'a 25 km de INN · Ruta 225, km 25',
          image: 'images/inn/Ubicacion_02_Color.jpg',
        },
        {
          id: 'cascadas',
          title: 'CASCADAS',
          distance: 'a 55 km de INN · Ribera este del lago',
          image: 'images/inn/Ubicacion_01_Color.jpg',
        },
      ],
      [
        {
          id: 'puerto-octay',
          title: 'PUERTO OCTAY',
          distance: 'a 50 km de INN · Tradición y arquitectura',
          image: 'images/inn/Ubicacion_03_Color.jpg',
        },
        {
          id: 'playa-hermosa',
          title: 'PLAYA HERMOSA',
          distance: 'a 9 km de INN · Camino a Ensenada',
          image: 'images/inn/panoramas/playa-venado.jpg',
        },
      ],
    ],
  },
  {
    id: 'naturaleza-en-grande',
    name: 'Naturaleza en grande',
    tabLabel: 'NATURALEZA EN GRANDE',
    slides: [
      [
        {
          id: 'saltos-del-petrohue',
          title: 'SALTOS DEL PETROHUÉ',
          distance: 'a 54 km de INN · Parque Nac. Vicente Pérez Rosales',
          image: 'images/inn/panoramas/saltos-petrohue.jpg',
        },
        {
          id: 'volcan-osorno',
          title: 'VOLCÁN OSORNO',
          distance: 'a 59 km de INN · Centro de Montaña y Esquí',
          image: 'images/inn/panoramas/ensenada.jpg',
        },
      ],
      [
        {
          id: 'lago-todos-los-santos',
          title: 'LAGO TODOS LOS SANTOS',
          distance: 'a 58 km de INN · Navegación lago esmeralda',
          image: 'images/inn/panoramas/peulla.jpg',
        },
        {
          id: 'laguna-verde',
          title: 'LAGUNA VERDE',
          distance: 'a 43 km de INN · Sendero y bosque nativo',
          image: 'images/inn/Ubicacion_01_Color.jpg',
        },
      ],
      [
        {
          id: 'termas-del-sol',
          title: 'TERMAS DEL SOL',
          distance: 'a 85 km de INN · Relajo en aguas termales',
          image: 'images/inn/Ubicacion_02_Color.jpg',
        },
        {
          id: 'parque-alerce-andino',
          title: 'PARQUE ALERCE ANDINO',
          distance: 'a 60 km de INN · Bosques milenarios',
          image: 'images/inn/Ubicacion_03_Color.jpg',
        },
      ],
    ],
  },
  {
    id: 'cultura-junto-al-lago',
    name: 'Cultura junto al lago',
    tabLabel: 'CULTURA JUNTO AL LAGO',
    slides: [
      [
        {
          id: 'teatro-del-lago',
          title: 'TEATRO DEL LAGO',
          distance: 'a 30 km de INN · Frutillar Bajo',
          image: 'images/inn/panoramas/teatro-lago.jpg',
        },
        {
          id: 'museo-pablo-fierro',
          title: 'MUSEO PABLO FIERRO',
          distance: 'a 1.2 km de INN · Costanera Puerto Varas',
          image: 'images/inn/Ubicacion_03_Color.jpg',
        },
      ],
      [
        {
          id: 'iglesia-sagrado-corazon',
          title: 'IGLESIA DEL SAGRADO CORAZÓN',
          distance: 'a 1.5 km de INN · Patrimonio histórico',
          image: 'images/inn/Ubicacion_01_Color.jpg',
        },
        {
          id: 'museo-colonial-aleman',
          title: 'MUSEO COLONIAL ALEMÁN',
          distance: 'a 30 km de INN · Frutillar',
          image: 'images/inn/Ubicacion_02_Color.jpg',
        },
      ],
      [
        {
          id: 'costanera-puerto-varas',
          title: 'COSTANERA Y MUELLE',
          distance: 'a 0.6 km de INN · Puerto Varas',
          image: 'images/inn/Ubicacion_02_Color.jpg',
        },
        {
          id: 'mercado-puerto-varas',
          title: 'MERCADO DE PUERTO VARAS',
          distance: 'a 1.8 km de INN · Gastronomía y artesanía',
          image: 'images/inn/Ubicacion_03_Color.jpg',
        },
      ],
    ],
  },
  {
    id: 'escapadas-memorables',
    name: 'Escapadas memorables',
    tabLabel: 'ESCAPADAS MEMORABLES',
    slides: [
      [
        {
          id: 'peulla',
          title: 'PEULLA',
          distance: 'a 75 km de INN · Cruce Andino hacia la cordillera',
          image: 'images/inn/panoramas/peulla.jpg',
        },
        {
          id: 'isla-chiloe',
          title: 'ISLA DE CHILOÉ',
          distance: 'a 95 km de INN · Ancud y Castro',
          image: 'images/inn/panoramas/playa-venado.jpg',
        },
      ],
      [
        {
          id: 'valle-cochamo',
          title: 'VALLE DE COCHAMÓ',
          distance: 'a 92 km de INN · Paredes de granito y aventura',
          image: 'images/inn/panoramas/saltos-petrohue.jpg',
        },
        {
          id: 'caleta-condor',
          title: 'CALETA CÓNDOR',
          distance: 'a 110 km de INN · Paraíso costero virgen',
          image: 'images/inn/panoramas/ensenada.jpg',
        },
      ],
      [
        {
          id: 'hornopiren',
          title: 'HORNOPIREN',
          distance: 'a 105 km de INN · Puerta norte Carretera Austral',
          image: 'images/inn/Ubicacion_01_Color.jpg',
        },
        {
          id: 'frutillar-bajo',
          title: 'FRUTILLAR BAJO',
          distance: 'a 28 km de INN · Tradición y lago',
          image: 'images/inn/panoramas/teatro-lago.jpg',
        },
      ],
    ],
  },
]

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

  const currentCategory = PANORAMAS_CATEGORIES[activeCatIndex] || PANORAMAS_CATEGORIES[0]
  const currentSlides = currentCategory.slides || []
  const totalSlides = currentSlides.length
  const currentCards = currentSlides[activeSlideIndex] || []

  const handlePrevSlide = useCallback(() => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))
  }, [totalSlides])

  const handleNextSlide = useCallback(() => {
    setActiveSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0))
  }, [totalSlides])

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
        className="modal-dialog modal-xl modal-dialog-centered"
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

            {/* Grilla de Panoramas (2 tarjetas por slide) */}
            <div className="row g-4 mb-4">
              {currentCards.map((card) => (
                <div key={card.id} className="col-12 col-md-6">
                  <div className="card lb-inn-panoramas-modal__card h-100 border-0 rounded-1 overflow-hidden">
                    <div className="ratio ratio-16x9">
                      <img
                        src={`${base}${card.image}`}
                        alt={card.title}
                        className="object-fit-cover w-100 h-100 lb-inn-panoramas-modal__card-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body p-3 px-4">
                      <h3 className="lb-inn-panoramas-modal__card-title mb-1">{card.title}</h3>
                      <div className="d-flex align-items-center text-secondary small">
                        <CarFrontIcon size={16} className="me-2" />
                        <span>{card.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  aria-label="Panorama anterior"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="btn lb-inn-panoramas-modal__arrow rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                  onClick={handleNextSlide}
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
  )
}
