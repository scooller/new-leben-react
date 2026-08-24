import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Refresh ScrollTrigger after images load + cleanup on route change */
export function useGsapAnimations(deps = []) {
  const isLoaded = useSelector((s) => s.ui.isLoaded)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isLoaded) return

    let t
    // ponytail: debounced refresh per-image instead of blocking on ALL images.
    // loading="lazy" images don't fire load until scrolled into view, so waiting
    // for every image blocks refresh indefinitely on long pages like ProyectoDetalle.
    const refresh = () => {
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 100)
    }

    refresh()

    const imgs = document.querySelectorAll('img')
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true })
    })

    return () => {
      clearTimeout(t)
      imgs.forEach((img) => img.removeEventListener('load', refresh))
    }
  }, [isLoaded, pathname, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}
