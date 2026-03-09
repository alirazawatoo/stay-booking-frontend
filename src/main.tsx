import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App'
import { store } from './store'
import './index.css'

// Demo mode (`npm run demo`) answers every API call in the browser with the
// fictional records in src/mocks, so the UI can be explored without the backend.
async function startDemoApi() {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}

startDemoApi().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </Provider>
    </React.StrictMode>,
  )
})
