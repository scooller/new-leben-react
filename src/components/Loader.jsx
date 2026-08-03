import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { images } from '../data/content.js'

/**
 * Full-screen loader overlay.
 * Fades out via GSAP when isLoaded becomes true.
 * BS utility classes + minimal custom CSS for spinner animation.
 */
export default function Loader() {
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoaded || done) return
    const el = document.getElementById('lb-loader')
    if (!el) { setDone(true); return }
    gsap.to(el, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => setDone(true),
    })
  }, [isLoaded, done])

  if (done) return null

  return (
    <div id="lb-loader" className="lb-loader position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 9999 }}>
      <img src={images.logoIcon} alt="iLeben" width="48" height="46" className="mb-3 lb-loader-logo" />
      <div className="lb-loader-spinner" />
    </div>
  )
}
