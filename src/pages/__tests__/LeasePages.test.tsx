import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderApp, rowOf } from '../../test/renderApp'

describe('lease pages', () => {
  it('lists leases with their status and a readable address', async () => {
    renderApp('/leases')
    const row = rowOf(await screen.findByRole('link', { name: '14 Harbour Row, Unit 3B' }))
    expect(within(row).getByText('Approved')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '208 Juniper Lane' })).toBeInTheDocument()
    expect(screen.queryByText(/undefined|null/)).not.toBeInTheDocument()
  })

  it('searches by address through the search endpoint', async () => {
    renderApp('/leases')
    await screen.findByRole('link', { name: '208 Juniper Lane' })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'quarry' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByRole('link', { name: '5 Quarry Steps' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('link', { name: '208 Juniper Lane' })).not.toBeInTheDocument())
  })

  it('shows an empty state and an error state', async () => {
    server.use(http.get('*/api/leases/', () => HttpResponse.json({ results: [], next: null })))
    const { unmount } = renderApp('/leases')
    expect(await screen.findByText(/No leases yet/)).toBeInTheDocument()
    unmount()

    server.use(http.get('*/api/leases/', () => HttpResponse.json({ detail: 'boom' }, { status: 500 })))
    renderApp('/leases')
    expect(await screen.findByRole('alert')).toHaveTextContent('Error loading leases')
  })

  it('shows a lease’s documents with links to preview and notes', async () => {
    renderApp('/lease/101')
    const row = rowOf(await screen.findByText('harbour-row-lease_v2'))
    expect(within(row).getByRole('link', { name: 'View Notes' })).toHaveAttribute('href', '/lease/101/documents/12/notes')
    expect(within(row).getByText('Approved')).toBeInTheDocument()
  })

  it('treats the API’s "no documents" reply as an empty list', async () => {
    server.use(http.get('*/api/documents/lease/:id/documents/', () => HttpResponse.json({ detail: 'No documents found for this lease.' })))
    renderApp('/lease/101')
    expect(await screen.findByText('No documents uploaded for this lease yet.')).toBeInTheDocument()
  })

  it('shows the initial analysis and earlier questions on the notes page', async () => {
    renderApp('/lease/101/documents/12/notes')
    expect(await screen.findByText(/allows subletting with written consent/)).toBeInTheDocument()
    expect(screen.getByText('Is short-term subletting allowed?')).toBeInTheDocument()
    expect(screen.getByText(/Current Document: harbour-row-lease_v2/)).toBeInTheDocument()
  })

  it('keeps the question when the assistant fails to answer', async () => {
    server.use(http.post('*/api/documents/:id/chat/', () => HttpResponse.json({ error: 'down' }, { status: 502 })))
    renderApp('/lease/101/documents/12/notes')
    const input = await screen.findByLabelText('Question for LeaseGuard AI')
    fireEvent.change(input, { target: { value: 'What is the deposit?' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText(/could not answer/)).toBeInTheDocument()
    expect(input).toHaveValue('What is the deposit?')
  })
})
