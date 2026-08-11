import { useEffect, useRef } from 'react'
import { Fancybox } from '@fancyapps/ui'
import { Check } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Location section: text + checklist + map image.
 */
export default function LocationSection({ data }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="location-map"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  return (
    <section className="lb-proj-det-location container" id="ubicacion" ref={ref}>
      <div className="row g-5 align-items-center">
        <ScrollAnim as="div" className="col-lg-5" animation="fade-right">
          <span className="lb-eyebrow d-block mb-2 text-danger">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>

          <ul className="lb-proj-det-location-checklist list-unstyled mt-4">
            {data.checklist.map((item) => (
              <li key={item} className="d-flex align-items-center gap-2">
                <span className="lb-proj-det-check-icon">
                  <Check size={20} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ScrollAnim>

        <ScrollAnim
          as="div"
          className="col-lg-7"
          animation="fade-left"
        >
          <a
            href={data.mapImage}
            data-fancybox="location-map"
            className="lb-img-trigger d-block"
            tabIndex={0}
          >
            <img
              src={data.mapImage}
              alt="Mapa de ubicación"
              className="lb-proj-det-map-img lb-img-interactive w-100"
              loading="lazy"
              decoding="async"
            />
          </a>
        </ScrollAnim>
      </div>
    </section>
  )
}
