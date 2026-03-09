import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'

describe('App routing', () => {
  it('renders the login page on initial route', () => {
    render(
      <Provider store={store}><MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter></Provider>
    )

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })
})

