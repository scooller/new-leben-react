import { useState } from 'react'

const TOURS = [
  {
    label: 'Home & Wellness',
    src: 'https://www.youtube.com/embed/TQpR0wBv2a0',
    title: 'Home & Wellness',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
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

  if (!activeTour) return null

  return (
    <section className={`lb-inn-360 container-fluid ${className}`.trim()} id="recorridos-360" aria-labelledby="recorridos-360-title">
      <div className="container">
        <h2 id="recorridos-360-title" className="visually-hidden">Recorridos 360</h2>
        <h3 className="lb-inn-360__title">
          <img src={`${base}images/icons/360.svg`} alt="" aria-hidden="true" />
          <span>{activeTour.title}</span>
        </h3>
        <div className="ratio ratio-16x9 lb-inn-360__viewer">
          <iframe
            key={activeTour.src}
            src={activeTour.src}
            title={activeTour.title}
                allow={`${activeTour.allow}; fullscreen`}
            allowFullScreen
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
          />
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
