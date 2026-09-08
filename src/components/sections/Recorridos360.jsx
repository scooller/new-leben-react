import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import ScrollAnim from '../ScrollAnim'
import SplitTitle from '../SplitTitle'

const isImage = (src) => /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(src)

const TOURS = [
  {
    label: 'Masterplan',
    title: 'Masterplan',
    images: [
      { title: 'Masterplan', src: '/images/inn/masterplan-1.jpg' },
      { title: 'Masterplan Primer Piso', src: '/images/inn/masterplan-2.jpg' },
    ],
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
  const [activeSubIndex, setActiveSubIndex] = useState(0)
  const activeTour = tours[activeIndex]
  const viewerRef = useRef(null)

  useEffect(() => {
    setActiveSubIndex(0)
  }, [activeIndex])

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(el)
  }, [activeIndex, activeSubIndex])

  if (!activeTour) return null

  const subImages = activeTour.images || []
  const hasSubImages = subImages.length > 1
  const currentItem = hasSubImages ? subImages[activeSubIndex] : (subImages[0] || activeTour)
  const currentSrc = currentItem?.src || activeTour.src
  const currentTitle = currentItem?.title || activeTour.title

  return (
    <section className={`lb-inn-360 container-fluid ${className}`.trim()} id="recorridos-360" aria-labelledby="recorridos-360-title">
      <div className="container">
        <SplitTitle id="recorridos-360-title" as='h2' text="Recorridos 360" />

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          <ScrollAnim as='h3' animation='fade-up' className="lb-inn-360__title mb-0">
            <img src={`${base}images/icons/360.svg`} alt="" aria-hidden="true" />
            <span>{currentTitle}</span>
          </ScrollAnim>

          {hasSubImages && (
            <div className="d-inline-flex gap-1 p-1 bg-white rounded-pill shadow-sm border" role="tablist" aria-label="Subvistas de Masterplan">
              {subImages.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${idx === activeSubIndex ? 'btn-dark' : 'btn-light border-0 text-muted'}`}
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                  role="tab"
                  aria-selected={idx === activeSubIndex}
                  onClick={() => setActiveSubIndex(idx)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <ScrollAnim as='div' animation='fade' className="ratio ratio-16x9 lb-inn-360__viewer" ref={viewerRef}>
          {isImage(currentSrc) ? (
            <a
              href={currentSrc}
              data-fancybox="recorridos-360"
              data-caption={currentTitle}
              className="d-block w-100 h-100"
              aria-label={`Ampliar ${currentTitle}`}
            >
              <img
                key={currentSrc}
                src={currentSrc}
                alt={currentTitle}
                className="w-100 h-100 object-fit-contain bg-white"
              />
            </a>
          ) : (
            <iframe
              key={currentSrc}
              src={currentSrc}
              title={currentTitle}
              allow={`${activeTour.allow}; fullscreen`}
              allowFullScreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </ScrollAnim>
        <div className="text-end mt-2">
          <a href={currentSrc} target="_blank" rel="noreferrer" className="small text-muted">
            Abrir {isImage(currentSrc) ? 'imagen' : 'recorrido'} en una nueva ventana
          </a>
        </div>

        <ScrollAnim as='div' animation='fade-up' className="card lb-inn-hero-tabs__inner shadow-lg mt-3 mx-auto">
          <div className="card-body p-2 p-md-4">
            <ul className="nav nav-pills nav-justified flex-wrap gap-5" role="tablist" aria-label="Recorridos del proyecto">
              {tours.map((tour, index) => (
                <li className="nav-item" key={tour.label || index} role="presentation">
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
        </ScrollAnim>
      </div>
    </section>
  )
}
