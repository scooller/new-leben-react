import { useEffect, useRef, useState } from 'react'
import Carousel from 'bootstrap/js/dist/carousel'
import { Fancybox } from '@fancyapps/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollAnim from '../ScrollAnim.jsx'

// Fuerza del parallax del carrusel (se sobrescribe desde Inn.jsx)
const PARALLAX_STRENGTH = 14

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
  parallaxStrength = PARALLAX_STRENGTH,
  showIndicators = true,
  // { buttonLabel, items: [{ label, icon, img, alt }] }
  spacesModal,
}) {
  const [showSpacesModal, setShowSpacesModal] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const spacesModalRef = useRef(null)
  const base = import.meta.env.BASE_URL
  const sectionRef = useRef(null)
  const carouselEl = useRef(null)
  const carouselInstance = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const carousel = carouselEl.current
    if (!carousel || !slides.length) return
    const c = new Carousel(carousel, { interval: 5000, ride: 'carousel' })
    carouselInstance.current = c

    const ctx = gsap.context(() => {
      // Parallax sobre el carrusel completo (.carousel.slide), no por item
      gsap.to(carousel, {
        yPercent: parallaxStrength,
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
  }, [slides.length, onSlideChange, parallaxStrength])

  useEffect(() => {
    if (!carouselInstance.current || !slides.length || typeof activeSlide !== 'number') return
    carouselInstance.current.to(Math.max(0, Math.min(activeSlide, slides.length - 1)))
  }, [activeSlide, slides.length])

  // Fancybox para la galería del modal de espacios (bind cuando el modal está abierto)
  useEffect(() => {
    if (!showSpacesModal) return
    const el = spacesModalRef.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox]', {
      Toolbar: { display: { left: [], right: ['close'] } },
    })
    return () => Fancybox.unbind(el)
  }, [showSpacesModal])

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
                  className={highlightLogos.length > 0 ? 'row row-cols-2 row-cols-md-4 g-2 align-items-stretch lb-inn-proyecto__highlight mt-5' : 'lb-inn-proyecto__highlight'}
                >
                  {highlight}
                  {highlightLogos.map((logo, index) => (
                    <div className={`col d-flex align-items-center justify-content-center ${index > 0 ? 'border-start border-dark-subtle' : ''}`.trim()} key={logo.src || index}>
                      <img src={`${base}${logo.src}`} alt={logo.alt || ''} className={`img-fluid ${logo.className || ''}`.trim()} />
                    </div>
                  ))}
                </ScrollAnim>
              )}

              {spacesModal?.galleries?.length > 0 && (
                <ScrollAnim as="div" className="lb-inn-proyecto__spaces-btn-wrap mt-3 position-absolute">
                  <button
                    type="button"
                    className="btn btn-lg lb-inn-proyecto__spaces-btn"
                    onClick={() => {
                      setActiveGalleryIndex(0)
                      setActiveImageIndex(0)
                      setShowSpacesModal(true)
                    }}
                  >
                    {spacesModal.buttonLabel || 'Conoce los espacios'}
                  </button>
                </ScrollAnim>
              )}

              {(highlightOffer) && (
                <ScrollAnim
                  as="h3"
                  className='lb-inn-proyecto__highligthtitle mt-5'
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
                      key={index}
                    >
                      <div className="lb-inn-proyecto__parallax">
                        <a
                          href={`${base}${slide.img || slide.src}`}
                          data-fancybox={slide.fancyboxGroup || 'project-gallery'}
                          data-caption={slide.alt || ''}
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
      {spacesModal?.galleries?.length > 0 && (
        <div
          ref={spacesModalRef}
          className={`modal fade lb-inn-spaces-modal ${showSpacesModal ? 'show d-block' : ''}`}
          tabIndex={-1}
          aria-label="Espacios del proyecto"
          style={{ backgroundColor: 'var(--lb-inn-spaces-overlay)', zIndex: 1000 }}
          onClick={() => setShowSpacesModal(false)}
        >
          <div
            className="modal-dialog modal-fullscreen"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <button 
              type="button" 
              className="btn position-fixed top-0 end-0 m-4 p-2 z-3 text-white rounded-circle d-flex align-items-center justify-content-center lb-inn-spaces-modal__close" 
              aria-label="Cerrar" 
              onClick={() => setShowSpacesModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="modal-content bg-transparent border-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '1200px' }}>
              
              <div className="modal-body p-0 w-100 d-flex flex-column align-items-center justify-content-center position-relative">
                {/* Main image container */}
                <div className="position-relative w-100 d-flex justify-content-center align-items-center" style={{ aspectRatio: '16/9', maxHeight: '70vh', border: '1px solid var(--lb-inn-spaces-frame-border)', borderRadius: 'var(--bs-border-radius-lg)', overflow: 'hidden' }}>
                    <button 
                        className="btn rounded-circle position-absolute start-0 top-50 translate-middle-y ms-3 d-flex align-items-center justify-content-center"
                        style={{ width: '48px', height: '48px', backgroundColor: 'var(--lb-inn-spaces-arrow-bg)', border: 'none', color: 'var(--lb-inn-spaces-arrow-color)', zIndex: 2 }}
                        onClick={() => {
                          if (activeImageIndex > 0) {
                            setActiveImageIndex(activeImageIndex - 1);
                          } else if (activeGalleryIndex > 0) {
                            setActiveGalleryIndex(activeGalleryIndex - 1);
                            setActiveImageIndex(spacesModal.galleries[activeGalleryIndex - 1].images.length - 1);
                          } else {
                            const lastGalleryIndex = spacesModal.galleries.length - 1;
                            setActiveGalleryIndex(lastGalleryIndex);
                            setActiveImageIndex(spacesModal.galleries[lastGalleryIndex].images.length - 1);
                          }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    
                    {(() => {
                      const activeImageObj = spacesModal.galleries[activeGalleryIndex]?.images[activeImageIndex];
                      if (!activeImageObj) return null;
                      return (
                        <a
                          href={`${base}${activeImageObj.img}`}
                          data-fancybox="inn-espacios"
                          data-caption={activeImageObj.alt || ''}
                          aria-label={`Ampliar imagen`}
                          className="w-100 h-100 position-relative"
                        >
                          <img
                              src={`${base}${activeImageObj.img}`}
                              alt={activeImageObj.alt || ''}
                              className="w-100 h-100 object-fit-contain rounded-3"
                          />
                          {activeImageObj.alt && (
                            <span className="lb-inn-spaces-modal__caption w-md-50 mx-auto position-absolute start-0 end-0 bottom-0">{activeImageObj.alt}</span>
                          )}
                        </a>
                      );
                    })()}

                    <button 
                        className="btn rounded-circle position-absolute end-0 top-50 translate-middle-y me-3 d-flex align-items-center justify-content-center"
                        style={{ width: '48px', height: '48px', backgroundColor: 'var(--lb-inn-spaces-arrow-bg)', border: 'none', color: 'var(--lb-inn-spaces-arrow-color)', zIndex: 2 }}
                        onClick={() => {
                          const currentGallery = spacesModal.galleries[activeGalleryIndex];
                          if (activeImageIndex < currentGallery.images.length - 1) {
                            setActiveImageIndex(activeImageIndex + 1);
                          } else if (activeGalleryIndex < spacesModal.galleries.length - 1) {
                            setActiveGalleryIndex(activeGalleryIndex + 1);
                            setActiveImageIndex(0);
                          } else {
                            setActiveGalleryIndex(0);
                            setActiveImageIndex(0);
                          }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>

                {/* Tabs / Categories below image */}
                <div className="d-flex justify-content-center gap-4 mt-4 text-uppercase fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                    {spacesModal.galleries.map((gallery, index) => {
                        const isActive = index === activeGalleryIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => { setActiveGalleryIndex(index); setActiveImageIndex(0); }}
                                className="btn btn-link text-decoration-none p-0"
                                style={{ color: isActive ? 'var(--lb-inn-spaces-accent)' : 'var(--lb-inn-spaces-tab-inactive)', transition: 'color 0.2s' }}
                            >
                                {isActive 
                                    ? `${gallery.label} [${activeImageIndex + 1}/${gallery.images.length}]`
                                    : gallery.label}
                            </button>
                        );
                    })}
                </div>

                {/* Thumbnails of current category */}
                <div className="d-flex justify-content-center gap-2 mt-4">
                    {spacesModal.galleries[activeGalleryIndex]?.images.map((imgObj, idx) => {
                        const isActiveThumb = idx === activeImageIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className="p-0 bg-transparent"
                                style={{ 
                                  width: '80px', 
                                  height: '60px', 
                                  overflow: 'hidden', 
                                  border: isActiveThumb ? '2px solid var(--lb-inn-spaces-accent)' : '2px solid transparent',
                                  borderRadius: 'var(--bs-border-radius)',
                                  transition: 'border-color 0.2s, opacity 0.2s',
                                  opacity: isActiveThumb ? 1 : 0.6 
                                }}
                            >
                                <img
                                    src={`${base}${imgObj.thumb || imgObj.img}`}
                                    alt={`Thumb ${idx}`}
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </button>
                        );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
