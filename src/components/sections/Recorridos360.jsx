import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'

const isImage = (src) => /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(src)

const TOURS = [
  {
    label: 'Masterplan',
    src: '/images/inn/inn-vista360.jpg',
    title: 'Masterplan',
    allow: 'fullscreen',
  },
  {
    label: 'Piloto 360',
    src: 'https://my.matterport.com/show/?m=hQ8Fm33FqFY&brand=0',
    title: 'Conoce tu próximo departamento',
    allow: 'fullscreen; autoplay',
  },
  {
    label: 'Vista 360',
    src: 'https://www.lanube360.com/ileben1/',
    title: 'En primera línea frente al lago',
    allow: 'fullscreen',
  },
]

export default function Recorridos360({ tours = TOURS, className = '' }) {
  const base = import.meta.env.BASE_URL
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTour = tours[activeIndex]
  const viewerRef = useRef(null)

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(el)
  }, [])

  if (!activeTour) return null

  return (
    <section className={`lb-inn-360 container-fluid ${className}`.trim()} id="recorridos-360" aria-labelledby="recorridos-360-title">
      <div className="container">
        <h2 id="recorridos-360-title" className="visually-hidden">Recorridos 360</h2>
        <h3 className="lb-inn-360__title">
          <img src={`${base}images/icons/360.svg`} alt="" aria-hidden="true" />
          <span>{activeTour.title}</span>
        </h3>
        <div className="ratio ratio-16x9 lb-inn-360__viewer" ref={viewerRef}>
          {isImage(activeTour.src) ? (
            <a
              href={activeTour.src}
              data-fancybox="recorridos-360"
              data-caption={activeTour.title}
              className="d-block w-100 h-100"
              aria-label={`Ampliar ${activeTour.title}`}
            >
              <img
                key={activeTour.src}
                src={activeTour.src}
                alt={activeTour.title}
                className="w-100 h-100 object-fit-contain bg-white"
              />
            </a>
          ) : (
            <iframe
              key={activeTour.src}
              src={activeTour.src}
              title={activeTour.title}
                  allow={`${activeTour.allow}; fullscreen`}
              allowFullScreen
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
            <div className="text-end mt-2">
              <a href={activeTour.src} target="_blank" rel="noreferrer" className="small text-muted">
                Abrir recorrido en una nueva ventana
              </a>
            </div>

        <div className="card lb-inn-hero-tabs__inner shadow-lg mt-3 mx-auto">
          <div className="card-body p-2 p-md-4">
            <ul className="nav nav-pills nav-justified flex-wrap gap-5" role="tablist" aria-label="Recorridos del proyecto">
              {tours.map((tour, index) => (
                <li className="nav-item" key={tour.src} role="presentation">
                  <button
                    type="button"
                    className={`nav-link nav-link__border w-100 ${index === activeIndex ? 'active' : ''}`}
                    role="tab"
                    aria-selected={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  >
                    {tour.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
