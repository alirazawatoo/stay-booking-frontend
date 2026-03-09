import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from '../App'
import { makeStore } from '../store'
import authReducer from '../store/slices/authSlice'

// Renders the real route table against the MSW handlers, signed in unless told otherwise.
export function renderApp(path: string, { signedIn = true }: { signedIn?: boolean } = {}) {
  const auth = { ...authReducer(undefined, { type: 'init' }), token: signedIn ? 'test-token' : null }
  const store = makeStore({ auth })
  const view = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
        <ToastContainer />
      </MemoryRouter>
    </Provider>,
  )
  return { store, ...view }
}

export function rowOf(element: HTMLElement): HTMLElement {
  const row = element.closest('tr')
  if (!row) throw new Error('Element is not inside a table row')
  return row
}
