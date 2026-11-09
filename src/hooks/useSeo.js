import { useEffect } from 'react'

const DEFAULT_TITLE = 'Inmobiliaria Leben | Departamentos y Proyectos en Venta en Chile'
const DEFAULT_DESC = 'Descubre departamentos en venta en el sur y centro de Chile con Inmobiliaria Leben. Proyectos exclusivos en Puerto Varas, Temuco y Santiago.'
const DEFAULT_IMAGE = 'https://ileben.cl/images/home/hero-institucional.jpg'
const BASE_URL = 'https://ileben.cl'

function updateMeta(attr, val, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${val}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, val)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function updateLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Lightweight, zero-dependency SEO hook (Ponytail principle)
 * Dynamically updates document.title, meta tags, canonical link, and JSON-LD schema
 */
export function useSeo({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  schema = null,
} = {}) {
  useEffect(() => {
    // 1. Title
    const pageTitle = title ? `${title} | Inmobiliaria Leben` : DEFAULT_TITLE
    document.title = pageTitle

    // 2. Canonical
    const fullCanonical = canonical
      ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
      : `${BASE_URL}${window.location.pathname}`
    updateLink('canonical', fullCanonical)

    // 3. Meta description & robots
    updateMeta('name', 'description', description)
    updateMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // 4. Open Graph
    updateMeta('property', 'og:title', pageTitle)
    updateMeta('property', 'og:description', description)
    updateMeta('property', 'og:url', fullCanonical)
    updateMeta('property', 'og:type', ogType)
    updateMeta('property', 'og:image', ogImage)

    // 5. Twitter
    updateMeta('name', 'twitter:card', 'summary_large_image')
    updateMeta('name', 'twitter:title', pageTitle)
    updateMeta('name', 'twitter:description', description)
    updateMeta('name', 'twitter:image', ogImage)

    // 6. JSON-LD Schema
    const SCHEMA_ID = 'lb-json-ld-schema'
    let script = document.getElementById(SCHEMA_ID)

    if (schema) {
      if (!script) {
        script = document.createElement('script')
        script.id = SCHEMA_ID
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(schema)
    } else if (script) {
      script.remove()
    }
  }, [title, description, canonical, ogImage, ogType, noindex, schema])
}

