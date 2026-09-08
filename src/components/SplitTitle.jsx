import { useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'

/**
 * Parses HTML string into React elements wrapping each word in .lb-split-word,
 * preserving HTML tags and attributes (like class/className and style).
 */
// ponytail: native DOMParser to preserve HTML tags/styles while splitting words
function parseHtmlToWords(html) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined' || !html) return null
  const clean = String(html).replace(/\bclassName=/gi, 'class=')
  const doc = new DOMParser().parseFromString(clean, 'text/html')
  let wordCount = 0

  function traverse(node, key) {
    if (node.nodeType === 3) { // Node.TEXT_NODE
      const text = node.textContent || ''
      const words = text.split(/\s+/).filter(Boolean)
      if (!words.length) return null
      return words.map((word, i) => {
        wordCount++
        return (
          <span key={`${key}-${i}`} className="lb-split-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>
            <span style={{ display: 'inline-block', willChange: 'transform' }}>{word}</span>
          </span>
        )
      })
    }
    if (node.nodeType === 1) { // Node.ELEMENT_NODE
      const tagName = node.tagName.toLowerCase()
      if (tagName === 'br') return <br key={key} />

      const children = Array.from(node.childNodes)
        .map((child, i) => traverse(child, `${key}-${i}`))
        .filter(Boolean)

      const props = {}
      if (node.className) props.className = node.className
      if (node.getAttribute('style')) {
        const styleObj = {}
        node.style.cssText.split(';').forEach((rule) => {
          const [prop, val] = rule.split(':')
          if (prop && val) {
            const camelProp = prop.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase())
            styleObj[camelProp] = val.trim()
          }
        })
        if (Object.keys(styleObj).length) props.style = styleObj
      }

      const Tag = tagName
      return <Tag key={key} {...props}>{children}</Tag>
    }
    return null
  }

  const nodes = Array.from(doc.body.childNodes)
    .map((child, i) => traverse(child, `w-${i}`))
    .filter(Boolean)

  return wordCount > 0 ? { nodes, wordCount } : null
}

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

  const htmlContent = dangerouslySetInnerHTML?.__html ?? (typeof text === 'string' && /<[a-z][\s\S]*>/i.test(text) ? text : null)

  const parsedHtml = useMemo(() => {
    return htmlContent ? parseHtmlToWords(htmlContent) : null
  }, [htmlContent])

  const lines = useMemo(() => {
    if (parsedHtml) return []
    const raw = text ?? children
    const content = typeof raw === 'string' ? raw : extractText(raw)
    return typeof content === 'string'
      ? content.split('\n').map((l) => l.split(' ').filter(Boolean)).filter((l) => l.length > 0)
      : []
  }, [parsedHtml, text, children])

  const hasSplit = Boolean(parsedHtml?.wordCount || lines.length > 0)

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

  if (parsedHtml) {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {parsedHtml.nodes}
      </Tag>
    )
  }

  if (lines.length > 0) {
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
