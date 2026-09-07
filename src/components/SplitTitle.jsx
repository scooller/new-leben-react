import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'

/**
 * Splits text into words and animates them on scroll.
 */
function extractText(node) {
  if (!node) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node.type === 'br') return '\n'
  if (node.props?.children) return extractText(node.props.children)
  return ''
}

export default function SplitTitle({
  as: Tag = 'h2',
  text,
  className = '',
  stagger = 0.06,
  delay = 0,
  y = 24,
  children,
  dangerouslySetInnerHTML,
  ...rest
}) {
  const ref = useRef(null)
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  const htmlText = dangerouslySetInnerHTML?.__html
    ? String(dangerouslySetInnerHTML.__html).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    : null

  const raw = text ?? (htmlText || children)
  const content = typeof raw === 'string' ? raw : extractText(raw)
  const lines = typeof content === 'string'
    ? content.split('\n').map((l) => l.split(' ').filter(Boolean)).filter((l) => l.length > 0)
    : []
  const hasSplit = lines.length > 0

  useEffect(() => {
    if (!isLoaded || !ref.current || !hasSplit) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.lb-split-word'), {
        opacity: 0,
        y,
        duration: 0.5,
        delay,
        stagger,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx?.revert()
  }, [isLoaded, delay, stagger, y, hasSplit])

  if (hasSplit) {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {lines.map((words, lineIdx) => (
          <span key={lineIdx} style={{ display: lines.length > 1 ? 'block' : 'inline' }}>
            {words.map((word, i) => (
              <span key={i} className="lb-split-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>
                <span style={{ display: 'inline-block', willChange: 'transform' }}>{word}</span>
              </span>
            ))}
          </span>
        ))}
      </Tag>
    )
  }

  if (dangerouslySetInnerHTML) {
    return <Tag ref={ref} className={className} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...rest} />
  }

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
