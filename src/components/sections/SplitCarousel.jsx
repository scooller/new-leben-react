import { useRef, useEffect, useId } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

/**
 * Split Carousel — port of WP block bs-split-carousel (+ item).
 * Text card (left) overlapping image (right), dot indicators, autoplay.
 * Left/right columns animate independently with GSAP presets per slide change.
 *
 * Props: slides, interval, leftTransition, rightTransition, transitionDuration, staggerDelay
 * Slide shape: { id, title, text, ctaLabel, ctaHref, imageUrl, imageAlt }
 */
const EFFECTS = {
  fade:       { from: { opacity: 0 }, to: { opacity: 1 } },
  fadeUp:     { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
  fadeDown:   { from: { opacity: 0, y: -40 }, to: { opacity: 1, y: 0 } },
  fadeLeft:   { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  fadeRight:  { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  scaleIn:    { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
  slideUp:    { from: { y: 60 }, to: { y: 0 } },
  slideLeft:  { from: { x: 80 }, to: { x: 0 } },
  slideRight: { from: { x: -80 }, to: { x: 0 } },
  flipY:      { from: { opacity: 0, rotationY: 90 }, to: { opacity: 1, rotationY: 0 } },
  flipX:      { from: { opacity: 0, rotationX: 90 }, to: { opacity: 1, rotationX: 0 } },
  backOut:    { from: { opacity: 0, scale: 0.7 }, to: { opacity: 1, scale: 1, ease: 'back.out(1.7)' } },
  blurFocus:  { from: { opacity: 0, filter: 'blur(15px)' }, to: { opacity: 1, filter: 'blur(0px)' } },
  clipReveal: { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0% 0 0)' } },
  rotateIn:   { from: { opacity: 0, rotation: -15, scale: 0.8 }, to: { opacity: 1, rotation: 0, scale: 1 } },
}

function animateColumn(el, effect, duration, delay) {
  const fx = EFFECTS[effect] || EFFECTS.fade
  gsap.killTweensOf(el)
  gsap.fromTo(el, fx.from, { duration, ease: 'power2.out', delay, ...fx.to })
}

export default function SplitCarousel({
  slides = [],
  interval = 5000,
  leftTransition = 'fade',
  rightTransition = 'fade',
  transitionDuration = 0.6,
  staggerDelay = 0.15,
  className = '',
}) {
  const ref = useRef(null)
  const id = useId()
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  useEffect(() => {
    const el = ref.current
    if (!el || !isLoaded || slides.length < 2) return

    const carousel = window.bootstrap.Carousel.getOrCreateInstance(el, { interval })
    const animateItem = (item) => {
      if (!item) return
      const leftCol = item.querySelector('.split-text-col')
      const rightCol = item.querySelector('.split-image-col')
      if (leftCol) animateColumn(leftCol, leftTransition, transitionDuration, 0)
      if (rightCol) animateColumn(rightCol, rightTransition, transitionDuration, staggerDelay)
    }
    const onSlide = (e) => requestAnimationFrame(() => animateItem(e.relatedTarget))

    el.addEventListener('slide.bs.carousel', onSlide)
    animateItem(el.querySelector('.carousel-item.active'))

    return () => {
      el.removeEventListener('slide.bs.carousel', onSlide)
      carousel.dispose()
    }
  }, [isLoaded, slides.length, interval, leftTransition, rightTransition, transitionDuration, staggerDelay])

  return (
    <section ref={ref} id={id} className={`bs-split-carousel carousel slide ${className}`} data-bs-ride="carousel">
      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={slide.id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
            <div className="container">
              <div className="row lb-split-row">
                <div className="col-lg-7 split-text-col">
                  <div className="split-text-card">
                    <div className="split-text-content d-flex flex-column align-items-start gap-3">
                      <h3 className="mb-0">{slide.title}</h3>
                      <p className="mb-0">{slide.text}</p>
                      {slide.ctaLabel && (
                        <Link to={slide.ctaHref} className="btn btn-dark text-decoration-none">{slide.ctaLabel}</Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 split-image-col">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    className="w-100 h-100 object-fit-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="split-carousel-indicators d-flex">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            data-bs-target={`#${id}`}
            data-bs-slide-to={i}
            className={i === 0 ? 'active' : ''}
          />
        ))}
      </div>
    </section>
  )
}
