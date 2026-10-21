const inflight = new Map()
const PREFIX = 'lb_api:'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { val, exp } = JSON.parse(raw)
    if (Date.now() > exp) {
      sessionStorage.removeItem(PREFIX + key)
      return null
    }
    return val
  } catch {
    return null
  }
}

function writeCache(key, val, ttl) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({
      val,
      exp: Date.now() + ttl,
    }))
  } catch {
    // Quota exceeded / private mode — fail silent
  }
}

/**
 * Clear cached API responses from sessionStorage.
 * @param {string} [pattern] - optional substring filter (e.g. 'plantas')
 */
export function clearApiCache(pattern) {
  try {
    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith(PREFIX))
    for (const k of keys) {
      if (!pattern || k.includes(pattern)) {
        sessionStorage.removeItem(k)
      }
    }
  } catch {
    // fail silent
  }
}

/**
 * Centralized API fetch with JSON validation, error handling,
 * in-flight request deduplication, and sessionStorage caching.
 * Returns { data, error, meta } — throws nothing, catches everything.
 *
 * @param {string} url — API endpoint path (e.g. '/api/v1/proyectos')
 * @param {object} [options] — fetch options + cache config: { cache?: boolean, ttl?: number }
 * @returns {Promise<{ data: any|null, error: string|null, meta?: any }>}
 */
export async function apiFetch(url, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET'
  const useCache = isGet && options.cache !== false
  const ttl = options.ttl ?? DEFAULT_TTL

  if (useCache) {
    const cached = readCache(url)
    if (cached) return cached
    if (inflight.has(url)) return inflight.get(url)
  }

  const promise = (async () => {
    try {
      const r = await fetch(url, options)

      if (!r.ok) {
        return { data: null, error: `HTTP ${r.status}` }
      }

      const ct = r.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        return { data: null, error: 'Respuesta no es JSON' }
      }

      const json = await r.json()
      const meta = json.meta || (json.last_page ? { total: json.total, last_page: json.last_page } : null)
      const res = { data: json.data, error: null, meta }

      if (useCache && res.data !== null) {
        writeCache(url, res, ttl)
      }

      return res
    } catch {
      return { data: null, error: 'Error de conexión' }
    } finally {
      inflight.delete(url)
    }
  })()

  if (useCache) {
    inflight.set(url, promise)
  }

  return promise
}
