import { createSlice } from '@reduxjs/toolkit'

function normalizeList(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') {
    return val.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return [val]
}

const initialState = {
  comuna: [],
  proyecto: '',
  tipologia: [],
  orientacion: '',
  precio: '',
  categoria: 'todos',
  hasSubmitted: false,
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(state, action) {
      const p = action.payload || {}
      if (p.comuna !== undefined) {
        state.comuna = normalizeList(p.comuna)
      } else if (p.ubicacion !== undefined) {
        state.comuna = normalizeList(p.ubicacion)
      }
      if (p.proyecto !== undefined) state.proyecto = p.proyecto
      if (p.tipologia !== undefined) {
        state.tipologia = normalizeList(p.tipologia)
      } else if (p.tipo !== undefined) {
        state.tipologia = normalizeList(p.tipo)
      }
      if (p.orientacion !== undefined) state.orientacion = p.orientacion
      if (p.precio !== undefined) state.precio = p.precio
      if (p.categoria !== undefined) {
        state.categoria = p.categoria
      } else if (p.tab !== undefined) {
        state.categoria = p.tab
      }
      if (p.hasSubmitted !== undefined) state.hasSubmitted = p.hasSubmitted
    },
    setFilterField(state, action) {
      const { field, value } = action.payload
      if (field === 'comuna' || field === 'ubicacion') {
        state.comuna = normalizeList(value)
      } else if (field === 'tipologia' || field === 'tipo') {
        state.tipologia = normalizeList(value)
      } else {
        state[field] = value
      }
    },
    toggleFilterItem(state, action) {
      const { field, item } = action.payload
      const targetField = (field === 'ubicacion') ? 'comuna' : (field === 'tipo') ? 'tipologia' : field
      const current = Array.isArray(state[targetField]) ? state[targetField] : normalizeList(state[targetField])
      if (current.includes(item)) {
        state[targetField] = current.filter((x) => x !== item)
      } else {
        state[targetField] = [...current, item]
      }
    },
    clearFilterField(state, action) {
      const field = action.payload
      const targetField = (field === 'ubicacion') ? 'comuna' : (field === 'tipo') ? 'tipologia' : field
      if (targetField === 'comuna' || targetField === 'tipologia') {
        state[targetField] = []
      } else {
        state[targetField] = ''
      }
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setFilters, setFilterField, toggleFilterItem, clearFilterField, resetFilters } = filterSlice.actions
export default filterSlice.reducer
