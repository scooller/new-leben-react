import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Refresh ScrollTrigger AFTER images are loaded.
 * Multiple fallbacks: image load events, window load, ResizeObserver, timeout.
 */
export function useGsapAnimations() {
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isLoaded) return

    let refreshed = false
    const timeouts = []
    const cleanups = []

    const refresh = () => {
      if (refreshed) return
      refreshed = true
      ScrollTrigger.refresh()
    }

    const scheduleRefresh = (ms) => {
      timeouts.push(setTimeout(refresh, ms))
    }

    // Strategy 1: immediate + short delays (catches fast loads)
    scheduleRefresh(100)
    scheduleRefresh(500)

    // Strategy 2: wait for all images to finish loading
    const imgs = Array.from(document.querySelectorAll('img'))
    const pending = imgs.filter((img) => !img.complete)

    if (pending.length === 0) {
      scheduleRefresh(200)
    } else {
      let remaining = pending.length
      const onDone = () => {
        if (--remaining === 0) {
          scheduleRefresh(100)
        }
      }
      pending.forEach((img) => {
        img.addEventListener('load', onDone, { once: true })
        img.addEventListener('error', onDone, { once: true })
      })
      cleanups.push(() => {
        pending.forEach((img) => {
          img.removeEventListener('load', onDone)
          img.removeEventListener('error', onDone)
        })
      })
    }

    // Strategy 3: ResizeObserver — catches layout shifts from lazy images
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh()
    })
    ro.observe(document.body)
    cleanups.push(() => ro.disconnect())

    // Strategy 4: hard timeout fallback (3s) — last resort
    scheduleRefresh(3000)

    return () => {
      timeouts.forEach(clearTimeout)
      cleanups.forEach((fn) => fn())
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isLoaded, pathname])
}
