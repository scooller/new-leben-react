import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import { ZoomIn } from 'lucide-react'
import ScrollAnim from '../ScrollAnim'
import SplitTitle from '../SplitTitle'

const isImage = (src) => /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(src)


export default function Recorridos360({
  tours = [],
  title,
  eyebrow,
  brochureUrl,
  className = '',
}) {
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

  const subImages = (activeTour.interiores && activeTour.interiores.length > 0)
    ? activeTour.interiores
    : (activeTour.images || [])
  const hasSubImages = subImages.length > 1
  const currentItem = hasSubImages ? subImages[activeSubIndex] : (subImages[0] || activeTour)
  const currentSrc = currentItem?.src || activeTour.src
  const currentTitle = currentItem?.title || activeTour.title

  return (
    <section className={`lb-inn-360 container-fluid ${className}`.trim()} id="recorridos-360" aria-labelledby="recorridos-360-title">
      <div className="container">
        {eyebrow && (
          <span className="lb-inn-section__eyebrow d-block mb-1 text-center" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {eyebrow}
          </span>
        )}
        <SplitTitle className='lb-inn-proyecto__title' id="recorridos-360-title" as='h2' text={title || "Descubre el Proyecto"} />

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          {hasSubImages && (
            <div className="d-inline-flex gap-1 p-1 lb-inn-360__subtabs" role="tablist" aria-label="Subvistas de Recorrido">
              {subImages.map((item, idx) => (
                <button
                  key={item.src || idx}
                  type="button"
                  className={`btn btn-sm px-3 py-1 ${idx === activeSubIndex ? 'active' : ''}`}
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
              className="d-block w-100 h-100 position-relative lb-img-trigger"
              style={{ cursor: 'zoom-in' }}
              aria-label={`Ampliar ${currentTitle}`}
            >
              <img
                key={currentSrc}
                src={currentSrc}
                alt={currentTitle}
                className="w-100 h-100 object-fit-contain bg-white"
              />
              <span className="lb-img-zoom-badge" aria-label="Ampliar imagen" title="Ampliar imagen">
                <ZoomIn size={16} />
              </span>
            </a>
          ) : (
            <iframe
              key={currentSrc}
              src={currentSrc}
              title={currentTitle}
              allow={`${activeTour.allow || 'fullscreen; autoplay'}; fullscreen`}
              allowFullScreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </ScrollAnim>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
          {brochureUrl ? (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="small text-decoration-none d-inline-flex align-items-center gap-1 fw-semibold"
              style={{ color: 'var(--lb-project-accent, #d9bc70)' }}
            >
              <span>Descargar Folleto (PDF)</span>
            </a>
          ) : <span />}
          <a href={currentSrc} target="_blank" rel="noreferrer" className="small text-muted">
            Abrir {isImage(currentSrc) ? 'imagen' : 'recorrido 360'} en una nueva ventana ↗
          </a>
        </div>

        <ScrollAnim as='div' animation='fade-up' className="card lb-inn-hero-tabs__inner shadow-lg mt-3 mx-auto">
          <div className="card-body py-3 py-md-4 px-3 px-md-4">
            <ul className="nav nav-pills nav-justified flex-wrap gap-2 gap-md-4" role="tablist" aria-label="Recorridos del proyecto">
              {tours.map((tour, index) => (
                <li className="nav-item" key={tour.label || index} role="presentation">
                  <button
                    type="button"
                    className={`nav-link nav-link__border w-100 ${index === activeIndex ? 'active' : ''}`}
                    role="tab"
                    aria-selected={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  >
                    {tour.label.toUpperCase()}
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
