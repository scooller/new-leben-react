import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import AMENITY_ICONS from '../icons/amenities.jsx'

/**
 * Spaces gallery linked to amenities.
 * Amenity buttons animate on hover/focus/active and select a gallery image.
 * Click on image opens Fancybox lightbox.
 */
export default function SpacesGallery({ data }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const sectionRef = useRef(null)
  const iconRefs = useRef([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="spaces-gallery"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  // Init all icons to "normal" (drawn) on mount so they're always visible
  useEffect(() => {
    iconRefs.current.forEach((ref) => ref?.stopAnimation())
  }, [])

  useEffect(() => {
    iconRefs.current.forEach((ref, i) => {
      if (i === activeIdx) ref?.startAnimation()
      else ref?.stopAnimation()
    })
  }, [activeIdx])

  return (
    <section className="lb-proj-det-spaces container" id="espacios" ref={sectionRef}>
      <div className="row g-5 align-items-center">
        <ScrollAnim
          as="div"
          className="col-lg-6 order-md-0 order-1 lb-proj-det-spaces-gallery"
          animation="fade-right"
        >
          <div className={`lb-proj-det-spaces-scroller d-flex gap-2${activeIdx !== null ? ' is-focused' : ''}`}>
            {(data.images || []).map((src, i) => (
              <a
                key={i}
                href={src}
                data-fancybox="spaces-gallery"
                className={`lb-img-trigger lb-proj-det-space-slide${i === activeIdx ? ' active' : ''}`}
                tabIndex={0}
              >
                <img
                  src={src}
                  alt={`Espacio ${i + 1}`}
                  className="lb-proj-det-space-img lb-img-interactive"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </ScrollAnim>

        <ScrollAnim as="div" className="col-lg-6 order-md-1 order-0" animation="fade-left">
          <span className="lb-eyebrow text-uppercase d-block mb-2">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>

          <div className="lb-proj-det-designer d-flex align-items-center gap-3 mt-4">
            <img
              src={data.designer.avatar}
              alt={data.designer.name}
              className="lb-proj-det-designer-avatar rounded-circle"
              width="56"
              height="56"
              loading="lazy"
            />
            <div className="d-flex flex-column">
              <span className="fw-bold">{data.designer.name}</span>
              <span className="text-muted small">{data.designer.role}</span>
            </div>
          </div>
        </ScrollAnim>
      </div>

      {/* Amenity buttons — below gallery */}
      <ScrollAnim as="div" className="lb-proj-det-spaces-amenities d-flex flex-wrap justify-content-center gap-3 mt-5" animation="fade-up" stagger={0.08}>
        {(data.amenities || []).map((item, i) => {
          const Icon = AMENITY_ICONS[item.icon]
          return (
            <button
              key={item.label}
              type="button"
              className={`lb-proj-det-space-btn d-flex flex-column align-items-center gap-2${i === activeIdx ? ' active' : ''}`}
              aria-pressed={i === activeIdx}
              onMouseEnter={() => iconRefs.current[i]?.startAnimation()}
              onMouseLeave={() => { if (i !== activeIdx) iconRefs.current[i]?.stopAnimation() }}
              onFocus={() => iconRefs.current[i]?.startAnimation()}
              onBlur={() => { if (i !== activeIdx) iconRefs.current[i]?.stopAnimation() }}
              onClick={() => setActiveIdx(i === activeIdx ? null : i)}
            >
              <span className="lb-proj-det-space-btn-icon">
                {Icon && <Icon ref={(el) => (iconRefs.current[i] = el)} size={32} />}
              </span>
              <span className="lb-proj-det-space-btn-label">{item.label}</span>
            </button>
          )
        })}
      </ScrollAnim>
    </section>
  )
}
