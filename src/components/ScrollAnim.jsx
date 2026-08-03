import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reusable GSAP ScrollTrigger animation wrapper.
 *
 * Props:
 *   as         — element tag to render (default 'div')
 *   animation  — preset name: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade'
 *   duration   — seconds (default 0.8)
 *   delay      — seconds (default 0)
 *   stagger    — if > 0, animates direct children with this stagger (default 0 = animate self)
 *   start      — ScrollTrigger start position (default 'top 85%')
 *   end        — ScrollTrigger end position (default 'bottom 15%')
 *   once       — play once or replay on re-enter (default true)
 *   markers    — show ScrollTrigger debug markers (default false)
 *   className  — CSS class
 *   style      — inline styles
 *   children   — content
 *
 *   once defaults to true — elements animate IN and stay visible.
 *   Set once={false} only when you explicitly want replay-on-scroll-back.
 */
const PRESETS = {
  'fade-up':    { from: { opacity: 0, y: 50 },  to: { opacity: 1, y: 0 } },
  'fade-down':  { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0 } },
  'fade-left':  { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0 } },
  'fade-right': { from: { opacity: 0, x: 50 },  to: { opacity: 1, x: 0 } },
  'scale':      { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
  'fade':       { from: { opacity: 0 }, to: { opacity: 1 } },
}

export default function ScrollAnim({
  as: Tag = 'div',
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  end = 'bottom 15%',
  once = false,
  markers = false,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  useEffect(() => {
    if (!isLoaded) return

    const el = ref.current
    if (!el) return

    const preset = PRESETS[animation] || PRESETS['fade-up']
    const targets = stagger > 0 ? el.children : el

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { ...preset.from },
        {
          ...preset.to,
          duration,
          delay,
          ease: 'power3.out',
          stagger: stagger > 0 ? Math.min(stagger, 0.5) : 0,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            markers,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [animation, duration, delay, stagger, start, end, once, markers, isLoaded])

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}
