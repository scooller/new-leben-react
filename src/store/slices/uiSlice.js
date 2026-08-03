import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  activeFilter: 'all',
  isLoaded: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload
    },
    setLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { toggleMobileMenu, closeMobileMenu, setActiveFilter, setLoaded } = uiSlice.actions
export default uiSlice.reducer
