import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import { resolveUrl } from '../../lib/resolveUrl.js'

gsap.registerPlugin(ScrollTrigger)

// Fuerza del parallax de las tarjetas (se sobrescribe desde Inn.jsx)
const DESIGNER_PARALLAX = 25

export default function InteriorismoSection({
  eyebrow,
  title,
  description,
  backgroundImage = null,
  id = 'interiorismo',
  ariaLabel = 'Interiorismo',
  parallaxStrength = DESIGNER_PARALLAX,
  parallaxEase = 'power1.out',
  parallaxScrub = 1.5,
  namePosition = 'overlay',
  designers = [],
}) {
  const [activeDesigner, setActiveDesigner] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.to(section, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Parallax solo en desktop para evitar jank y solapamiento en móvil
      const mm = gsap.matchMedia()
      mm.add('(min-width: 992px)', () => {
        gsap.to(section.querySelectorAll('.designers > div'), {
          yPercent: parallaxStrength,
          ease: parallaxEase,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: parallaxScrub,
            invalidateOnRefresh: true,
          },
        })
      })

      Fancybox.bind(section, '[data-fancybox]', {
        Toolbar: { display: { left: [], right: ['close'] } },
      })
    }, section)

    return () => {
      Fancybox.unbind(section)
      ctx.revert()
    }
  }, [parallaxStrength, parallaxEase, parallaxScrub])

  const currentDesigner = designers[activeDesigner] || null

  return (
    <section ref={sectionRef} className="lb-inn-proyecto lb-inn-interiorismo pb-5 mb-5" id={id} aria-label={ariaLabel}>
      <div
        className="container lb-shadow-box px-3 px-md-5 py-3 py-md-4 pt-4 pt-lg-8"
        style={{ '--lb-inn-proyecto-bg': backgroundImage ? `url("${resolveUrl(backgroundImage)}")` : undefined }}
      >
        <div className="row align-items-stretch g-5">
          <div className={`${designers.length > 0 ? 'col-lg-6' : 'col-12'} align-self-stretch position-relative lb-inn-proyecto__text-column`}>
            <div className="h-100 pe-4" animation="fade-up">
              {eyebrow && (
                <ScrollAnim as="span" animation='flip-x' className="lb-inn-proyecto__eyebrow">
                  {eyebrow}
                </ScrollAnim>
              )}

              {title && (
                <SplitTitle as="h2" className="lb-inn-proyecto__title" text={title} stagger={0.06} />
              )}

              {description && (
                <ScrollAnim as="p" animation='fade-up' className="lb-inn-proyecto__text w-md-80" dangerouslySetInnerHTML={{ __html: description }} />
              )}

              {currentDesigner?.text && (
                <div className="lb-inn-interiorismo__designer-content mt-4">
                  <SplitTitle style={{ color: currentDesigner.color }} className="lb-inn-interiorismo__designer-name mb-3"
                    dangerouslySetInnerHTML={{ __html: currentDesigner.name }}
                  />
                  <ScrollAnim as="p" animation='fade-up' className="lh-lg lb-inn-interiorismo__designer-text">
                    {currentDesigner.text}
                  </ScrollAnim>
                </div>
              )}
            </div>
          </div>

          {designers.length > 0 && (
            <div className="col-lg-6 d-flex flex-column gap-4">
              <div className={`d-flex designers g-4 h-100 ${namePosition === 'above' ? 'designers--above' : ''}`}>
                {designers.map((designer, index) => {
                  const isAbove = namePosition === 'above'
                  return (
                    <div
                      key={designer.name || index}
                      className="d-flex col"
                    >
                      <button
                        type="button"
                        className={`btn btn-lg lb-inn-interiorismo__designer-btn ${
                          isAbove ? 'lb-inn-interiorismo__designer-btn--above' : ''
                        } ${index === activeDesigner ? 'active' : ''}`}
                        onClick={designer.text ? () => setActiveDesigner(index) : undefined}
                        disabled={!designer.text}
                        style={{
                          ...(!designer.text && { opacity: 1 }),
                        }}
                      >
                        {isAbove && (
                          <SplitTitle
                            className="lb-inn-interiorismo__designer-name lb-inn-interiorismo__designer-name--above mb-3 px-1"
                            dangerouslySetInnerHTML={{ __html: designer.name }}
                          />
                        )}
                        <div className={isAbove ? 'lb-inn-interiorismo__designer-img-card' : 'w-100 h-100 position-absolute top-0 start-0'}>
                          <ScrollAnim
                            as="div"
                            animation='fade-up'
                            className="lb-inn-interiorismo__designer-img"
                            aria-hidden="true"
                            delay={0.1 * index}
                            style={designer.image ? {
                              backgroundImage: `url("${resolveUrl(designer.image)}")`,
                            } : undefined}
                          />
                        </div>
                        {!isAbove && (
                          <SplitTitle
                            className="lb-inn-interiorismo__designer-name mt-3 mb-2 px-2"
                            dangerouslySetInnerHTML={{ __html: designer.name }}
                          />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}