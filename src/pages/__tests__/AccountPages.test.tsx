import { fireEvent, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderApp } from '../../test/renderApp'
import { demoAnalyst } from '../../mocks/fixtures'

describe('dashboard and account pages', () => {
  it('shows the user table to admins', async () => {
    renderApp('/dashboard')
    expect(await screen.findByText('theo.lindqvist@example.test')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create New User' })).toBeInTheDocument()
  })

  it('shows a profile to non-admin users', async () => {
    server.use(http.get('*/account/profile/', () => HttpResponse.json(demoAnalyst)))
    renderApp('/dashboard')
    expect(await screen.findByRole('heading', { name: 'User Information' })).toBeInTheDocument()
    expect(screen.getByText('theo.lindqvist@example.test')).toBeInTheDocument()
  })

  it('sends first-login users to the password update page', async () => {
    server.use(http.get('*/account/profile/', () => HttpResponse.json({ ...demoAnalyst, is_first_login: true })))
    renderApp('/dashboard')
    expect(await screen.findByRole('heading', { name: 'Update your password' })).toBeInTheDocument()
  })

  it('checks that the new passwords match before calling the API', async () => {
    renderApp('/update-password/2')
    fireEvent.change(await screen.findByLabelText('New password'), { target: { value: 'first-value' } })
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'second-value' } })
    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('do not match')
  })

  it('signs out locally even when the logout request fails', async () => {
    server.use(http.post('*/account/logout/', () => HttpResponse.json({ detail: 'expired' }, { status: 401 })))
    localStorage.setItem('token', 'test-token')
    const { store } = renderApp('/dashboard')
    fireEvent.click(await screen.findByRole('button', { name: 'Account menu' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }))
    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument()
    await waitFor(() => expect(store.getState().auth.token).toBeNull())
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('redirects to the login page without a token', async () => {
    renderApp('/leases', { signedIn: false })
    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })
})
