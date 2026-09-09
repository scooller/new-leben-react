import { useSelector, useDispatch } from 'react-redux'
import { Cookie } from 'lucide-react'
import { openCookieSettings } from '../../store/slices/cookieSlice.js'

export default function CookieSettingsTrigger() {
  const dispatch = useDispatch()
  const { hasInteracted, isSettingsOpen } = useSelector((state) => state.cookie)

  // Only render when the user has already answered the initial prompt and modal is closed
  if (!hasInteracted || isSettingsOpen) return null

  return (
    <button
      type="button"
      id="lb-cookie-trigger"
      className="lb-cookie-trigger"
      onClick={() => dispatch(openCookieSettings())}
      aria-label="Ajustar preferencias de cookies y privacidad"
      title="Ajustar preferencias de cookies"
    >
      <Cookie size={20} />
    </button>
  )
}
