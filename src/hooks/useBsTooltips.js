import { useEffect } from 'react'
import Tooltip from 'bootstrap/js/dist/tooltip'

/**
 * Inits Bootstrap tooltips for all `[data-bs-toggle="tooltip"]` in the DOM.
 * Re-run safe (getOrCreateInstance). Pass deps to re-scan after data renders.
 */
export function useBsTooltips(deps = []) {
  useEffect(() => {
    document
      .querySelectorAll('[data-bs-toggle="tooltip"]:not([data-bs-tooltip-ready])')
      .forEach((el) => {
        Tooltip.getOrCreateInstance(el)
        el.dataset.bsTooltipReady = '1'
      })
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
