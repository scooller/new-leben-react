import { createSlice } from '@reduxjs/toolkit'
import { getProjectBySlug } from '../../data/projects.js'

const initialState = {
  slug: null,
  project: null,
  selectedFloorPlan: 0, // index into cotizador.floorPlan.thumbnails
  notFound: false,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    loadProject: (state, action) => {
      const slug = action.payload
      const project = getProjectBySlug(slug)
      if (project) {
        state.slug = slug
        state.project = project
        state.selectedFloorPlan = 0
        state.notFound = false
      } else {
        state.slug = slug
        state.project = null
        state.notFound = true
      }
    },
    selectFloorPlan: (state, action) => {
      state.selectedFloorPlan = action.payload
    },
  },
})

export const { loadProject, selectFloorPlan } = projectSlice.actions
export default projectSlice.reducer
