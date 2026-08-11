/**
 * Centralized API fetch with JSON validation + error handling.
 * Returns { data, error } — throws nothing, catches everything.
 *
 * @param {string} url — API endpoint path (e.g. '/api/v1/proyectos')
 * @param {object} options — fetch options (optional)
 * @returns {Promise<{ data: any|null, error: string|null }>}
 */
export async function apiFetch(url, options = {}) {
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

    if (!json?.data) {
      return { data: null, error: 'Respuesta sin data' }
    }

    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Error de conexión' }
  }
}
