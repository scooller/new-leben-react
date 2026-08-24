import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoTextSection({
  eyebrow,
  title,
  text,
  videoSrc = 'video/inn-test.mp4',
  className = '',
}) {
  const base = import.meta.env.BASE_URL
  const sectionRef = useRef(null)
  const videoWrapRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const videoWrap = videoWrapRef.current

    if (!section || !videoWrap) return

    const ctx = gsap.context(() => {
      gsap.to(videoWrap, {
        yPercent: 30,
        scale: 1.35,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={`lb-inn-video-banner container-fluid ${className}`.trim()} aria-label={title || 'Sección con video y texto'}>
      <div ref={videoWrapRef} className="lb-inn-video-banner__video-wrap">
        <video src={`${base}${videoSrc}`} autoPlay muted loop playsInline />
        <div className="lb-inn-video-banner__overlay" />
      </div>

      <div className="container position-relative">
        <div className="lb-inn-video-banner__content w-75 mx-auto">
          {eyebrow && <span className="lb-inn-video-banner__eyebrow mx-auto mb-1">{eyebrow}</span>}
          {title && <h3 className="lb-inn-video-banner__title mx-auto mb-2">{title}</h3>}
          {text && <p className="lb-inn-video-banner__text mx-auto">{text}</p>}
        </div>
      </div>
    </section>
  )
}
