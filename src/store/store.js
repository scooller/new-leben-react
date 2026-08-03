import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice.js'
import projectReducer from './slices/projectSlice.js'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    project: projectReducer,
  },
})
