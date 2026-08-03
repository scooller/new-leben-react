import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Refresh ScrollTrigger AFTER images are loaded.
 * Reads isLoaded from Redux so triggers recalculate with correct layout.
 */
export function useGsapAnimations() {
  const isLoaded = useSelector((s) => s.ui.isLoaded)

  useEffect(() => {
    if (!isLoaded) return

    // Images are loaded, layout is stable — recalc all ScrollTriggers
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(timeout)
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isLoaded])
}
