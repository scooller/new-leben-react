import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoaded: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { setLoaded } = uiSlice.actions
export default uiSlice.reducer
