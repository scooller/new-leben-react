import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { announcementConfig } from '../../data/announcementData.js'
import { images } from '../../data/content.js'

export default function AnnouncementModal() {
  const isLoaded = useSelector((state) => state.ui.isLoaded)
  const { hasInteracted, isSettingsOpen } = useSelector((state) => state.cookie)

  const [isVisible, setIsVisible] = useState(false)

  // Verify if already dismissed in this session
  useEffect(() => {
    if (!announcementConfig.enabled) return

    // Must be visible ONLY after:
    // 1. Initial web loading is complete (isLoaded === true)
    // 2. Cookie consent has been resolved (hasInteracted === true) and settings modal is closed
    if (isLoaded && hasInteracted && !isSettingsOpen) {
      try {
        const dismissed = window.sessionStorage.getItem(`lb_announcement_${announcementConfig.id}`)
        if (dismissed === 'dismissed') {
          setIsVisible(false)
          return
        }
      } catch {
        // storage fallback
      }

      // Short delay for smooth transition after cookie consent
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 400)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isLoaded, hasInteracted, isSettingsOpen])

  // Support closing with Escape key
  useEffect(() => {
    if (!isVisible) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    try {
      window.sessionStorage.setItem(`lb_announcement_${announcementConfig.id}`, 'dismissed')
    } catch {
      // storage fallback
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-announcement-title"
      style={{ zIndex: 1050 }}
      onClick={handleDismiss}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-0 pb-0 pt-4 px-4 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src={images.logoIcon} alt="" width="24" height="24" />
              <img src={images.logoText} alt="Leben" height="22" />
            </div>
            <button
              type="button"
              className="btn-close ms-auto"
              aria-label="Cerrar"
              onClick={handleDismiss}
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 pt-3 pb-2 text-start">
            <h2 id="lb-announcement-title" className="h5 fw-bold text-dark mb-2">
              {announcementConfig.title}
            </h2>
            <p className="text-secondary small lh-base mb-0">
              {announcementConfig.message}
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-2">
            <button
              type="button"
              className="btn btn-danger w-100 py-2 rounded-3 fw-semibold shadow-sm"
              onClick={handleDismiss}
            >
              {announcementConfig.buttonText || 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
