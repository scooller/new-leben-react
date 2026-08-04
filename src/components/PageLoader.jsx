/**
 * Minimal page-transition loader for Suspense fallback.
 * Reuses lb-loader-spinner CSS + lb-green color.
 */
export default function PageLoader() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="lb-loader-spinner" />
    </div>
  )
}
