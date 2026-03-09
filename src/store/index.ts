import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { api } from '../services/api'
import authReducer from './slices/authSlice'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

// Tests build a fresh store per render; the app uses the single `store` below.
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  })
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
