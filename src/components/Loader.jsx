import { useSelector } from 'react-redux'
import { images } from '../data/content.js'

/**
 * Full-screen loader overlay.
 * Fades out via CSS transition when isLoaded becomes true.
 */
export default function Loader() {
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  if (isLoaded) return null

  return (
    <div id="lb-loader" className="lb-loader position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 9999 }}>
      <img src={images.logoIcon} alt="iLeben" width="48" height="46" className="mb-3 lb-loader-logo" />
      <div className="lb-loader-spinner" />
    </div>
  )
}
