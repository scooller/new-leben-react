/**
 * Resolves asset and media URLs safely across the frontend.
 * - Cleans up erroneous leading slashes before full protocol URLs (e.g. '/https://...').
 * - Respects absolute URLs (http://, https://, data:, blob:, or protocol-relative //).
 * - Correctly prepends BASE_URL for relative paths (e.g. 'images/...' or '/images/...').
 *
 * @param {string|null|undefined} path - Asset path or URL
 * @param {string} [fallback] - Fallback path or URL if path is falsy
 * @returns {string} Fully resolved and normalized URL
 */
export function resolveUrl(path, fallback = '') {
  const raw = (path && typeof path === 'string' && path.trim())
    ? path.trim()
    : (fallback && typeof fallback === 'string' ? fallback.trim() : '')

  if (!raw) return ''

  // Normalize accidental leading slashes before http/https: "/https://...", "///https://..."
  const normalized = raw.replace(/^\/+(https?:\/\/)/i, '$1')

  // Absolute URLs (http, https, data, blob, or protocol-relative //)
  if (/^(?:https?:)?\/\//i.test(normalized) || /^(?:data|blob):/i.test(normalized)) {
    return normalized
  }

  const base = import.meta.env.BASE_URL || '/'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = normalized.replace(/^\/+/, '')
  return `${cleanBase}${cleanPath}`
}

export default resolveUrl

