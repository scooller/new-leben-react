import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeFilter: 'all',
  isLoaded: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload
    },
    setLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { setActiveFilter, setLoaded } = uiSlice.actions
export default uiSlice.reducer
