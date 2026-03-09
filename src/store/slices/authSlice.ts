import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  user: User | null
  token: string | null
  refreshDocuments: boolean
  refreshRegulations: boolean
  refreshRentals: boolean
  isLoading: boolean
  polling: boolean
  taskId: string | null
}

export interface User {
  id: number
  email: string
  user_type: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  is_first_login: boolean
}

// Older builds stored the raw password for "remember me"; remove it on load.
localStorage.removeItem('password')

export function readPersistedUser(): User | null {
  try {
    const value = JSON.parse(localStorage.getItem('user') || 'null')
    return value && typeof value.id === 'number' && typeof value.email === 'string' && typeof value.user_type === 'string'
      ? value
      : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const initialState: AuthState = {
  user: readPersistedUser(),
  token: localStorage.getItem('token'),
  refreshDocuments: false,
  refreshRegulations: false,
  refreshRentals: false,
  isLoading: false,
  polling: false,
  taskId: null,
}

// Besides the session, this slice carries the cross-page refresh toggles and the
// rental import task, so a page can ask another to refetch without prop drilling.
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    toggleRefreshDocuments: (state) => {
      state.refreshDocuments = !state.refreshDocuments
    },
    toggleRefreshRegulations: (state) => {
      state.refreshRegulations = !state.refreshRegulations
    },
    toggleRefreshRentals: (state) => {
      state.refreshRentals = !state.refreshRentals
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTask: (state, action: PayloadAction<string | null>) => {
      state.taskId = action.payload
    },
    setPolling: (state, action: PayloadAction<boolean>) => {
      state.polling = action.payload
    },
  },
})

export const {
  setCredentials,
  setToken,
  logout,
  toggleRefreshDocuments,
  toggleRefreshRegulations,
  toggleRefreshRentals,
  setLoading,
  setTask,
  setPolling,
} = authSlice.actions
export default authSlice.reducer
