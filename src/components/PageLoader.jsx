import { images } from '../data/content.js'

/**
 * Minimal page-transition loader for Suspense fallback and page data loading.
 * Reuses lb-loader-spinner and lb-loader-logo CSS.
 */
export default function PageLoader({ message }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 w-100 bg-white">
      <img src={images.logoIcon} alt="iLeben" width="48" height="46" className="mb-3 lb-loader-logo" />
      <div className="lb-loader-spinner" />
      {message && <p className="text-muted mt-3 small text-uppercase tracking-wider">{message}</p>}
    </div>
  )
}
