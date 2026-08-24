import { useEffect, useRef } from 'react'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import ScrollAnim from '../ScrollAnim.jsx'

export default function ProjectFeatureSection({
  eyebrow,
  title,
  description,
  highlight,
  highlightLogos = [],
  slides = [],
  mediaVideoSrc,
  backgroundImage = 'images/inn/bg-montain.svg',
  carouselId = 'project-carousel',
  className = 'pb-5 mb-5',
  id = 'proyecto',
  ariaLabel = 'Proyecto',
  activeSlide,
  onSlideChange,
  showIndicators = true,
}) {
  const base = import.meta.env.BASE_URL
  const carouselEl = useRef(null)
  const carouselInstance = useRef(null)

  useEffect(() => {
    const el = carouselEl.current
    if (!el || !slides.length) return

    const c = new Carousel(el, { interval: 5000, ride: 'carousel' })
    carouselInstance.current = c
    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })

    const onSlid = (event) => {
      if (onSlideChange) onSlideChange(event.to)
    }

    el.addEventListener('slid.bs.carousel', onSlid)

    return () => {
      el.removeEventListener('slid.bs.carousel', onSlid)
      Fancybox.unbind(el)
      c.dispose()
      carouselInstance.current = null
    }
  }, [slides.length, onSlideChange])

  useEffect(() => {
    if (!carouselInstance.current || !slides.length || typeof activeSlide !== 'number') return
    carouselInstance.current.to(Math.max(0, Math.min(activeSlide, slides.length - 1)))
  }, [activeSlide, slides.length])

  const resolvedActiveSlide = typeof activeSlide === 'number' ? activeSlide : 0

  return (
    <section className={`lb-inn-proyecto ${className}`.trim()} id={id} aria-label={ariaLabel}>
      <div
        className="container lb-shadow-box px-5 py-4 pt-8"
        style={{ '--lb-inn-proyecto-bg': `url("${base}${backgroundImage}")` }}
      >
        <div className="row align-items-stretch g-5">
          <div className="col-lg-5 align-self-stretch position-relative lb-inn-proyecto__text-column">
            <div className="h-100 pe-4" animation="fade-up">
              {eyebrow && (
                <ScrollAnim as="span" className="lb-inn-proyecto__eyebrow">
                  {eyebrow}
                </ScrollAnim>
              )}

              {title && (
                <ScrollAnim as="h2" className="lb-inn-proyecto__title">
                  {title}
                </ScrollAnim>
              )}

              {description && (
                <ScrollAnim as="p" className="lb-inn-proyecto__text">
                  {description}
                </ScrollAnim>
              )}

              {(highlight || highlightLogos.length > 0) && (
                <ScrollAnim
                  as="div"
                  className={highlightLogos.length > 0 ? 'row row-cols-2 row-cols-md-4 g-2 align-items-stretch lb-inn-proyecto__highlight mt-2' : 'lb-inn-proyecto__highlight'}
                >
                  {highlight}
                  {highlightLogos.map((logo, index) => (
                    <div className={`col d-flex align-items-center justify-content-center ${index > 0 ? 'border-start border-dark-subtle' : ''}`.trim()} key={logo.src || index}>
                      <img src={`${base}${logo.src}`} alt={logo.alt || ''} className={`img-fluid ${logo.className || ''}`.trim()} />
                    </div>
                  ))}
                </ScrollAnim>
              )}

              {showIndicators && slides.length > 0 && (
                <div className="carousel-indicators position-absolute bottom-0 left-0 lb-inn-proyecto__indicators">
                  {slides.map((slide, index) => (
                    <button
                      type="button"
                      data-bs-target={`#${carouselId}`}
                      data-bs-slide-to={index}
                      className={index === resolvedActiveSlide ? 'active' : ''}
                      aria-label={`Imagen ${index + 1}`}
                      key={slide.img || slide.src || index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {mediaVideoSrc ? (
            <ScrollAnim className="col-lg-7 d-flex">
              <div className="lb-inn-proyecto__frame w-100">
                <video
                  src={`${base}${mediaVideoSrc}`}
                  className="d-block w-100 h-100 object-fit-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </ScrollAnim>
          ) : slides.length > 0 ? (
            <ScrollAnim className="col-lg-7 d-flex">
              <div ref={carouselEl} id={carouselId} className="carousel slide carousel-fade w-100">
                <div className="carousel-inner lb-inn-proyecto__frame">
                  {slides.map((slide, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                      data-bs-interval="5000"
                      key={slide.img || slide.src || index}
                    >
                      <a
                        href={`${base}${slide.img || slide.src}`}
                        data-fancybox={slide.fancyboxGroup || 'project-gallery'}
                        tabIndex={0}
                      >
                        <img src={`${base}${slide.img || slide.src}`} className="d-block w-100" alt={slide.alt || `Slide ${index + 1}`} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnim>
          ) : null}
        </div>
      </div>
    </section>
  )
}
