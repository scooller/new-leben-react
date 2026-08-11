import { useEffect, useRef } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Spaces gallery — 3-image grid layout:
 * 1 full-width image + 2 half-width below.
 * Click on image opens Fancybox lightbox.
 */
export default function SpacesGallery({ data }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="spaces-gallery"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  const images = data.images || []

  return (
    <section className="lb-proj-det-spaces container" id="espacios" ref={sectionRef}>
      <div className="row g-5 align-items-center">
        <ScrollAnim
          as="div"
          className="col-lg-6 order-md-0 order-1 lb-proj-det-spaces-gallery"
          animation="fade-right"
        >
          <div className="lb-proj-det-spaces-grid">
            {images[0] && (
              <a
                href={images[0]}
                data-fancybox="spaces-gallery"
                className="lb-img-trigger lb-proj-det-spaces-grid-main"
                tabIndex={0}
              >
                <img
                  src={images[0]}
                  alt={`Espacio 1`}
                  className="lb-img-interactive"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )}
            <div className="lb-proj-det-spaces-grid-row d-flex gap-2">
              {images[1] && (
                <a
                  href={images[1]}
                  data-fancybox="spaces-gallery"
                  className="lb-img-trigger lb-proj-det-spaces-grid-half"
                  tabIndex={0}
                >
                  <img
                    src={images[1]}
                    alt={`Espacio 2`}
                    className="lb-img-interactive"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              )}
              {images[2] && (
                <a
                  href={images[2]}
                  data-fancybox="spaces-gallery"
                  className="lb-img-trigger lb-proj-det-spaces-grid-half"
                  tabIndex={0}
                >
                  <img
                    src={images[2]}
                    alt={`Espacio 3`}
                    className="lb-img-interactive"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              )}
            </div>
          </div>
        </ScrollAnim>

        <ScrollAnim as="div" className="col-lg-6 order-md-1 order-0" animation="fade-left">
          <span className="lb-eyebrow d-block mb-2 text-danger">{data.eyebrow}</span>
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
    </section>
  )
}
