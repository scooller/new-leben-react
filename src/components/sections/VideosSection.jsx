import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { videosContent, images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function VideosSection() {
  const { monthLabel, countLabel, project, gallery } = videosContent
  const sectionRef = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  useEffect(() => {
    if (!isLoaded) return
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      gsap.fromTo('.lb-thumb-main',
        { yPercent: -8 },
        { yPercent: 8, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.lb-thumb-side',
        { yPercent: -10 },
        { yPercent: 10, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.lb-parallax-text',
        { yPercent: 15 },
        { yPercent: -15, ease: 'none', scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [isLoaded])

  const meta = [
    { icon: 'user', label: 'Proyecto', value: project.name },
    { icon: 'calendar', label: 'Año', value: project.year },
    { icon: 'mapPin', label: 'Ubicación', value: project.location },
    { icon: 'building', label: 'Desde', value: project.price },
  ]

  return (
    <>
      <div className="lb-videos-spacer" />
      <div ref={sectionRef}>
      <ScrollAnim as="section" className="lb-videos container lb-radius-tl lb-radius-tr" id="proyectos" animation="fade-up" duration={1}>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center lb-section-header lb-parallax-text">
            <span className="lb-month-label text-uppercase">{monthLabel}</span>
            <span className="text-muted">{countLabel}</span>
          </div>

          <div className="d-flex gap-3 lb-video-row">
            <div className="lb-video-main d-flex flex-column gap-2 flex-shrink-0 lb-img-trigger" tabIndex={0}>
              <div className="d-flex gap-4 pb-2">
                {meta.map((m) => (
                  <div className="d-flex flex-column" key={m.label}>
                    <div className="d-flex align-items-center gap-1 lb-meta-label">
                      <img src={images[m.icon]} alt="" width="11" height="11" loading="lazy" decoding="async" />
                      <span>{m.label}</span>
                    </div>
                    <div className="lb-meta-value lb-parallax-text">{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="lb-thumb-main-wrap">
                <img
                  src={images[project.mainImage]}
                  alt={project.name}
                  className="lb-thumb-main lb-img-interactive"
                  data-fancybox="gallery"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="flex-fill rounded lb-video-side lb-img-trigger" tabIndex={0}>
              <img
                src={images[project.sideImage]}
                alt="Vista adicional"
                className="lb-thumb-side lb-img-interactive"
                data-fancybox="gallery"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="row justify-content-between align-items-center pt-4 lb-parallax-text">
            <div className="d-flex flex-column gap-1 col-md-6 col-12 mb-3 mb-md-0">
              <SplitTitle as="h3" className="lb-gallery-title mb-0" text={gallery.title} />
              <p className="lb-gallery-subtitle mb-0">{gallery.subtitle}</p>
            </div>
            <div className="d-flex align-items-center gap-3 col-md-6 col-12 justify-content-md-end justify-content-center">
              <Link to="/proyectos/inn" className="btn btn-outline-dark btn-pill text-decoration-none lb-btn-view-project">Ver proyecto</Link>
              <Link to="/proyectos" className="btn lb-btn-gallery text-decoration-none">{gallery.buttonText}</Link>
            </div>
          </div>
        </div>
      </ScrollAnim>
      </div>
    </>
  )
}
