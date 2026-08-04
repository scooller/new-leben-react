import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Refresh ScrollTrigger after images load + cleanup on route change */
export function useGsapAnimations() {
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isLoaded) return

    const pending = Array.from(document.querySelectorAll('img')).filter((img) => !img.complete)
    let done = false

    const refresh = () => {
      if (done) return
      done = true
      ScrollTrigger.refresh()
    }

    if (pending.length === 0) {
      const t = setTimeout(refresh, 200)
      return () => clearTimeout(t)
    }

    let remaining = pending.length
    let t
    const onDone = () => {
      if (--remaining === 0) {
        // ponytail: timeout only, no ResizeObserver; add if lazy images cause layout shift recalcs
        t = setTimeout(refresh, 100)
      }
    }

    pending.forEach((img) => {
      img.addEventListener('load', onDone, { once: true })
      img.addEventListener('error', onDone, { once: true })
    })

    return () => {
      clearTimeout(t)
      pending.forEach((img) => {
        img.removeEventListener('load', onDone)
        img.removeEventListener('error', onDone)
      })
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isLoaded, pathname])
}
