import { useEffect, useRef, useState } from 'react'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollAnim from '../ScrollAnim.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectFeatureSection({
  eyebrow,
  title,
  description,
  highlight,
  highlightLogos = [],
  highlightOffer,
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
  // { buttonLabel, items: [{ label, icon, img, alt }] }
  spacesModal,
}) {
  const [showSpacesModal, setShowSpacesModal] = useState(false)
  const [activeSpace, setActiveSpace] = useState(0)
  const spacesModalRef = useRef(null)
  const base = import.meta.env.BASE_URL
  const sectionRef = useRef(null)
  const carouselEl = useRef(null)
  const carouselInstance = useRef(null)
  const carouselItemsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const carousel = carouselEl.current
    if (!carousel || !slides.length) return
    const carouselItems = carouselItemsRef.current.filter(Boolean)
    const c = new Carousel(carousel, { interval: 5000, ride: 'carousel' })
    carouselInstance.current = c

    const ctx = gsap.context(() => {
      gsap.to(carouselItems, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      Fancybox.bind(carousel, '[data-fancybox]', {
        Toolbar: { display: { left: [], right: ['close'] } },
      })
    }, section)

    const onSlid = (event) => {
      if (onSlideChange) onSlideChange(event.to)
    }

    carousel.addEventListener('slid.bs.carousel', onSlid)

    return () => {
      carousel.removeEventListener('slid.bs.carousel', onSlid)
      Fancybox.unbind(carousel)
      ctx.revert()
      c.dispose()
      carouselInstance.current = null
    }
  }, [slides.length, onSlideChange])

  useEffect(() => {
    if (!carouselInstance.current || !slides.length || typeof activeSlide !== 'number') return
    carouselInstance.current.to(Math.max(0, Math.min(activeSlide, slides.length - 1)))
  }, [activeSlide, slides.length])

  // Fancybox para la galería del modal de espacios
  useEffect(() => {
    const el = spacesModalRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(el)
  }, [spacesModal])

  const resolvedActiveSlide = typeof activeSlide === 'number' ? activeSlide : 0

  return (
    <section ref={sectionRef} className={`lb-inn-proyecto ${className}`.trim()} id={id} aria-label={ariaLabel}>
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

              {spacesModal?.items?.length > 0 && (
                <ScrollAnim as="div" className="lb-inn-proyecto__spaces-btn-wrap mt-3 position-absolute">
                  <button
                    type="button"
                    className="btn btn-lg lb-inn-proyecto__spaces-btn"
                    onClick={() => setShowSpacesModal(true)}
                  >
                    {spacesModal.buttonLabel || 'Conoce los espacios'}
                  </button>
                </ScrollAnim>
              )}

              {(highlightOffer) && (
                <ScrollAnim
                  as="h3"
                  className='lb-inn-proyecto__highligthtitle mt-3'
                  // highlightOffer llega como string con HTML (<b>), se renderiza tal cual
                  dangerouslySetInnerHTML={{ __html: highlightOffer }}
                />
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
                      <div ref={(element) => { carouselItemsRef.current[index] = element }} className="lb-inn-proyecto__parallax">
                        <a
                          href={`${base}${slide.img || slide.src}`}
                          data-fancybox={slide.fancyboxGroup || 'project-gallery'}
                          tabIndex={0}
                        >
                          <img src={`${base}${slide.img || slide.src}`} className="d-block w-100 h-100 object-fit-cover" alt={slide.alt || `Slide ${index + 1}`} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnim>
          ) : null}
        </div>
      </div>
      {/* MODAL ESPACIOS */}
      {spacesModal?.items?.length > 0 && (
        <div
          ref={spacesModalRef}
          className={`modal fade ${showSpacesModal ? 'show d-block' : ''}`}
          tabIndex={-1}
          aria-label="Espacios del proyecto"
          style={{ backgroundColor: 'rgba(0,0,0,.9)', zIndex: 1000 }}
          onClick={() => setShowSpacesModal(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden lb-inn-spaces-modal__content">
              <div className="modal-header border-0">
                <h2 className="modal-title lb-inn-proyecto__title mb-0">
                  {spacesModal.items[activeSpace]?.label?.toUpperCase()}
                </h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowSpacesModal(false)} />
              </div>
              <div className="modal-body p-0">
                <div className="row g-0">
                  <div className="col-12 col-md-4 lb-inn-spaces-modal__tabs">
                    <ul className="nav nav-pills flex-column gap-2 p-3">
                      {spacesModal.items.map((item, index) => (
                        <li className="nav-item" key={item.label || index}>
                          <button
                            type="button"
                            className={`nav-link nav-link__border w-100 d-flex align-items-center gap-2 ${index === activeSpace ? 'active' : ''}`}
                            onClick={() => setActiveSpace(index)}
                          >
                            {item.icon && <img src={`${base}${item.icon}`} alt="" aria-hidden="true" />}
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-12 col-md-8 lb-inn-spaces-modal__gallery">
                    <a
                      href={`${base}${spacesModal.items[activeSpace]?.img}`}
                      data-fancybox="inn-espacios"
                      data-caption={spacesModal.items[activeSpace]?.label}
                      aria-label={`Ampliar imagen de ${spacesModal.items[activeSpace]?.label}`}
                    >
                      <img
                        src={`${base}${spacesModal.items[activeSpace]?.img}`}
                        alt={spacesModal.items[activeSpace]?.alt || spacesModal.items[activeSpace]?.label || ''}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
