import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'

/**
 * Reusable GSAP ScrollTrigger animation wrapper.
 * Props: as, animation (preset), duration, delay, stagger, start, once, className, style, children
 */
const PRESETS = {
  'fade-up':    { from: { opacity: 0, y: 50 },  to: { opacity: 1, y: 0 } },
  'fade-left':  { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0 } },
  'fade-right': { from: { opacity: 0, x: 50 }, to: { opacity: 1, x: 0 } },
  'zoom-in':   { from: { opacity: 0, scale: 0.8, y: 50 }, to: { opacity: 1, scale: 1, y: 0 } },
  'scale':      { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
}

export default function ScrollAnim({
  as: Tag = 'div',
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  once = true,
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
    const targets = stagger > 0 ? Array.from(el.children) : el
    if (Array.isArray(targets) && targets.length === 0) return

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
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [animation, duration, delay, stagger, start, once, isLoaded])

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}
