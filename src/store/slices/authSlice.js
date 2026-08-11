import { createSlice } from '@reduxjs/toolkit'
import { mockUsers } from '../../data/users.js'

const SESSION_KEY = 'lb-auth-user'

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const { email } = JSON.parse(raw)
    return mockUsers.find((u) => u.email === email) || null
  } catch {
    return null
  }
}

const initialState = {
  user: loadFromSession(),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload
      const user = mockUsers.find((u) => u.email === email && u.password === password)
      if (user) {
        state.user = user
        state.error = null
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }))
      } else {
        state.error = 'Email o contraseña incorrectos'
      }
    },
    logout: (state) => {
      state.user = null
      state.error = null
      sessionStorage.removeItem(SESSION_KEY)
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
