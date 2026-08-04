import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'

/**
 * Splits text into words and animates them on scroll.
 */
export default function SplitTitle({
  as: Tag = 'h2',
  text,
  className = '',
  stagger = 0.06,
  y = 24,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  const words = (text ?? '').split(' ').filter(Boolean)

  useEffect(() => {
    if (!isLoaded || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.lb-split-word'), {
        opacity: 0,
        y,
        duration: 0.5,
        stagger,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx?.revert()
  }, [isLoaded, stagger, y])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {words.map((word, i) => (
        <span key={i} className="lb-split-word" style={{ display: 'inline-block', overflow: 'hidden' }}>
          <span style={{ display: 'inline-block', willChange: 'transform' }}>{word}</span>
        </span>
      ))}
      {children}
    </Tag>
  )
}
