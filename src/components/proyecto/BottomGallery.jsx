import { useEffect, useRef } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Bottom gallery: CSS scroll-snap carousel, 3 visible.
 * B&W images, color on hover/active/focus.
 * Click opens Fancybox lightbox.
 */
export default function BottomGallery({ images }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    Fancybox.bind(el, '[data-fancybox="bottom-gallery"]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })

    return () => Fancybox.unbind(el)
  }, [])

  const scroll = (dir) => {
    const el = sectionRef.current?.querySelector('.lb-proj-det-bottom-scroller')
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: 'smooth' })
  }

  return (
    <section className="lb-proj-det-bottom-gallery" id="bottom-gallery" ref={sectionRef}>
      <ScrollAnim as="div" className="lb-proj-det-bottom-scroller" animation="fade-up" stagger={0.1}>
        {images.map((src, i) => (
          <a
            key={i}
            href={src}
            data-fancybox="bottom-gallery"
            className="lb-proj-det-bottom-slide lb-img-trigger"
            tabIndex={0}
          >
            <img
              src={src}
              alt={`Galería ${i + 1}`}
              className="lb-proj-det-bottom-img lb-img-interactive lb-img-bw"
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </ScrollAnim>

      <button
        className="lb-proj-det-bottom-nav lb-proj-det-bottom-nav--prev"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="lb-proj-det-bottom-nav lb-proj-det-bottom-nav--next"
        onClick={() => scroll(1)}
        aria-label="Siguiente"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  )
}
