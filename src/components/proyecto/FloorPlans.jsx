import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import { FlameIcon } from '../icons/flame.jsx'
import { CookingPotIcon } from '../icons/cooking-pot.jsx'
import { WashingMachineIcon } from '../icons/washing-machine.jsx'
import { FanIcon } from '../icons/fan.jsx'
import { SoupIcon } from '../icons/soup.jsx'
import { DropletIcon } from '../icons/droplet.jsx'
import { ShowerHeadIcon } from '../icons/shower-head.jsx'
import { FrameIcon } from '../icons/frame.jsx'

const ITEM_ICONS = {
  flame: FlameIcon,
  'cooking-pot': CookingPotIcon,
  'washing-machine': WashingMachineIcon,
  fan: FanIcon,
  soup: SoupIcon,
  droplet: DropletIcon,
  'shower-head': ShowerHeadIcon,
  frame: FrameIcon,
}

/**
 * Terminaciones section — gallery scroller + item labels.
 * Same layout pattern as SpacesGallery.
 * Click on image opens Fancybox lightbox.
 */
export default function FloorPlans({ data }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const [scrollIdx, setScrollIdx] = useState(0)
  const sectionRef = useRef(null)
  const scrollerRef = useRef(null)
  const iconRefs = useRef([])

  const PAGE = 1
  const maxIdx = Math.max(0, (data.images?.length ?? 0) - PAGE)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="terminaciones-gallery"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  const scrollByPage = (dir) => {
    const next = Math.min(maxIdx, Math.max(0, scrollIdx + dir * PAGE))
    setScrollIdx(next)
    const scroller = scrollerRef.current
    if (!scroller) return
    const slide = scroller.querySelector('.lb-proj-det-space-slide')
    const slideW = slide ? slide.offsetWidth + 8 : 0 // 8 = gap-2
    scroller.scrollTo({ left: next * slideW, behavior: 'smooth' })
  }

  return (
    <section className="lb-proj-det-spaces container pt-1" id="terminaciones" ref={sectionRef}>
      {/* Item labels — below gallery */}
      <ScrollAnim as="div" className="lb-proj-det-spaces-amenities d-flex flex-wrap justify-content-center gap-3 mb-4 mt-5" animation="fade-up" stagger={0.08}>
        {(data.items || []).map((item, i) => {
          const Icon = ITEM_ICONS[item.icon] || FrameIcon
          const handleEnter = () => iconRefs.current[i]?.startAnimation()
          const handleLeave = () => iconRefs.current[i]?.stopAnimation()
          return (
            <button
              key={item.label}
              type="button"
              className={`lb-proj-det-space-btn d-flex flex-column align-items-center gap-2${i === activeIdx ? ' active' : ''}`}
              aria-pressed={i === activeIdx}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onClick={() => setActiveIdx(i === activeIdx ? null : i)}
            >
              <span className="lb-proj-det-space-btn-icon">
                <Icon size={28} ref={(el) => { iconRefs.current[i] = el }} />
              </span>
              <span className="lb-proj-det-space-btn-label">{item.label}</span>
            </button>
          )
        })}
      </ScrollAnim>

      <div className="row g-5 align-items-center">
        <ScrollAnim as="div" className="col-lg-6 order-md-0 order-1" animation="fade-left">
          <span className="lb-eyebrow d-block mb-2 text-danger">{data.eyebrow}</span>
          <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.06} />
          <p className="lb-proj-det-overview-text mt-3">{data.description}</p>
        </ScrollAnim>

        <ScrollAnim
          as="div"
          className="col-lg-6 order-md-1 order-0 lb-proj-det-spaces-gallery position-relative"
          animation="fade-right"
        >
          <div
            ref={scrollerRef}
            className={`lb-proj-det-spaces-scroller d-flex gap-2${activeIdx !== null ? ' is-focused' : ''}`}
          >
            {(data.images || []).map((src, i) => (
              <a
                key={i}
                href={src}
                data-fancybox="terminaciones-gallery"
                className={`lb-img-trigger lb-proj-det-space-slide${i === activeIdx ? ' active' : ''}`}
                tabIndex={0}
              >
                <img
                  src={src}
                  alt={data.items?.[i]?.label || `Terminación ${i + 1}`}
                  className="lb-proj-det-space-img lb-img-interactive"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>

          <button
            className="lb-proj-det-gallery-arrow lb-proj-det-gallery-arrow--prev"
            onClick={() => scrollByPage(-1)}
            disabled={scrollIdx === 0}
            aria-label="Anteriores"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="lb-proj-det-gallery-arrow lb-proj-det-gallery-arrow--next"
            onClick={() => scrollByPage(1)}
            disabled={scrollIdx >= maxIdx}
            aria-label="Siguientes"
          >
            <ChevronRight size={20} />
          </button>
        </ScrollAnim>

        
      </div>

      
    </section>
  )
}
