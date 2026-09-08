import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'

/**
 * Reusable GSAP ScrollTrigger animation wrapper.
 * Props: as, animation (preset), duration, delay, stagger, start, once, className, style, children
 */
const PRESETS = {
  'fade': { from: { opacity: 0 }, to: { opacity: 1 } },
  'fade-up': { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } },
  'fade-down': { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0 } },
  'fade-left': { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0 } },
  'fade-right': { from: { opacity: 0, x: 50 }, to: { opacity: 1, x: 0 } },
  'zoom-in': { from: { opacity: 0, scale: 0.8, y: 50, transformOrigin: 'center center' }, to: { opacity: 1, scale: 1, y: 0 } },
  'scale': { from: { opacity: 0, scale: 0.9, transformOrigin: 'center center' }, to: { opacity: 1, scale: 1 } },
  'flip-x': { from: { opacity: 0, rotateX: 90, transformOrigin: 'center center' }, to: { opacity: 1, rotateX: 0 } },
  'flip-y': { from: { opacity: 0, rotateY: 90, transformOrigin: 'center center' }, to: { opacity: 1, rotateY: 0 } },
  'rotate': { from: { opacity: 0, rotate: 180, transformOrigin: 'center center' }, to: { opacity: 1, rotate: 0 } },
  'bounce': { from: { opacity: 0, y: 100, transformOrigin: 'center center' }, to: { opacity: 1, y: 0, ease: 'back.out(1.7)', yoyo: true } },
}

export default function ScrollAnim({
  as: Tag = 'div',
  animation = 'fade',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  once = true,
  className = '',
  style,
  children,
  dangerouslySetInnerHTML,
  ...rest
}) {
  const ref = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  const htmlContent = dangerouslySetInnerHTML?.__html

  useEffect(() => {
    if (!isLoaded) return

    const el = ref.current
    if (!el) return

    const preset = PRESETS[animation] || PRESETS['fade-up']
    const hasChildElements = el.children && el.children.length > 0
    const targets = (stagger > 0 && !dangerouslySetInnerHTML && hasChildElements)
      ? Array.from(el.children)
      : el

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { ...preset.from },
        {
          ...preset.to,
          duration,
          delay,
          ease: 'power3.out',
          stagger: targets !== el && stagger > 0 ? Math.min(stagger, 0.5) : 0,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, duration, delay, stagger, start, once, isLoaded, htmlContent])

  if (dangerouslySetInnerHTML) {
    return (
      <Tag
        ref={ref}
        className={className}
        style={style}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        {...rest}
      />
    )
  }

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}
