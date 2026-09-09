import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'lb_cookie_consent_v1'

const loadInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      hasInteracted: false,
      preferences: { essential: true, analytics: false, marketing: false, mailing: false },
      consentDate: null,
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed?.hasInteracted === 'boolean' && parsed?.preferences) {
        return {
          hasInteracted: parsed.hasInteracted,
          preferences: {
            essential: true,
            analytics: Boolean(parsed.preferences.analytics),
            marketing: Boolean(parsed.preferences.marketing),
            mailing: Boolean(parsed.preferences.mailing),
          },
          consentDate: parsed.consentDate || null,
        }
      }
    }
  } catch {
    // ponytail: fallback gracefully on disabled storage
  }

  return {
    hasInteracted: false,
    preferences: { essential: true, analytics: false, marketing: false, mailing: false },
    consentDate: null,
  }
}

const persistConsent = (state) => {
  if (typeof window === 'undefined') return
  try {
    const payload = {
      hasInteracted: state.hasInteracted,
      preferences: state.preferences,
      consentDate: state.consentDate,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // silent storage fallback
  }
}

const initialSaved = loadInitialConsent()

const initialState = {
  hasInteracted: initialSaved.hasInteracted,
  preferences: initialSaved.preferences,
  consentDate: initialSaved.consentDate,
  isSettingsOpen: false,
}

const cookieSlice = createSlice({
  name: 'cookie',
  initialState,
  reducers: {
    acceptAll: (state) => {
      state.hasInteracted = true
      state.preferences = { essential: true, analytics: true, marketing: true, mailing: true }
      state.consentDate = new Date().toISOString()
      state.isSettingsOpen = false
      persistConsent(state)
    },
    acceptEssentialOnly: (state) => {
      state.hasInteracted = true
      state.preferences = { essential: true, analytics: false, marketing: false, mailing: false }
      state.consentDate = new Date().toISOString()
      state.isSettingsOpen = false
      persistConsent(state)
    },
    saveCustomPreferences: (state, action) => {
      const { analytics = false, marketing = false, mailing = false } = action.payload || {}
      state.hasInteracted = true
      state.preferences = {
        essential: true,
        analytics: Boolean(analytics),
        marketing: Boolean(marketing),
        mailing: Boolean(mailing),
      }
      state.consentDate = new Date().toISOString()
      state.isSettingsOpen = false
      persistConsent(state)
    },
    openCookieSettings: (state) => {
      state.isSettingsOpen = true
    },
    closeCookieSettings: (state) => {
      if (state.hasInteracted) {
        state.isSettingsOpen = false
      }
    },
    resetConsent: (state) => {
      state.hasInteracted = false
      state.preferences = { essential: true, analytics: false, marketing: false, mailing: false }
      state.consentDate = null
      state.isSettingsOpen = true
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
      }
    },
  },
})

export const {
  acceptAll,
  acceptEssentialOnly,
  saveCustomPreferences,
  openCookieSettings,
  closeCookieSettings,
  resetConsent,
} = cookieSlice.actions

export default cookieSlice.reducer
