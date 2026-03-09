import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderApp, rowOf } from '../../test/renderApp'
import { setPolling, setTask } from '../../store/slices/authSlice'

describe('rental analyzer', () => {
  it('formats money and keeps studio and missing values distinct', async () => {
    renderApp('/rental-analyzer')
    const studio = rowOf(await screen.findByRole('button', { name: '19 Fernhill Close, Cedar Bluff' }))
    expect(within(studio).getByText('$980')).toBeInTheDocument()
    expect(within(studio).getByText('0')).toBeInTheDocument()

    const unknownProfit = rowOf(screen.getByRole('button', { name: '60 Mill Race, Millbrook Falls' }))
    expect(within(unknownProfit).getByText('N/A')).toBeInTheDocument()
    expect(screen.queryByText('$N/A')).not.toBeInTheDocument()
    expect(screen.getByText('1 - 6 of 6')).toBeInTheDocument()
  })

  it('offers every batch and filters by the chosen one', async () => {
    renderApp('/rental-analyzer')
    await screen.findByRole('option', { name: 'Batch 8' })
    fireEvent.change(screen.getByLabelText('Batch'), { target: { value: '8' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByText('1 - 1 of 1')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Batch 7' })).toBeInTheDocument()
  })

  it('rejects a minimum profit above the maximum', async () => {
    renderApp('/rental-analyzer')
    fireEvent.change(await screen.findByLabelText('Minimum monthly profit'), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText('Maximum monthly profit'), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Minimum profit must not be greater')
  })

  it('stops polling and reports failure when the import task fails', async () => {
    server.use(
      http.get('*/api/rental_properties/task-result/', () =>
        HttpResponse.json({ success: false, message: 'Task failed', error: 'bad sheet' }, { status: 500 }),
      ),
      http.get('*/api/rental_properties/task-progress/', () => HttpResponse.json({ success: true, state: 'PROGRESS', progress: 40 })),
    )
    const { store } = renderApp('/rental-analyzer')
    store.dispatch(setTask('demo-task'))
    store.dispatch(setPolling(true))
    expect(await screen.findByText('Processing… 40%')).toBeInTheDocument()

    expect(await screen.findByText('Task processing failed.', {}, { timeout: 8000 })).toBeInTheDocument()
    expect(store.getState().auth.polling).toBe(false)
    expect(store.getState().auth.taskId).toBeNull()
  }, 15000)
})

describe('regulation pages', () => {
  it('lists saved searches with their status', async () => {
    renderApp('/regulations')
    const row = rowOf(await screen.findByRole('link', { name: 'Cedar Bluff, NC - old town' }))
    expect(within(row).getByText('STR Allowed')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New Search' })).toHaveAttribute('href', '/regulation/new')
  })

  it('requires a search term before creating a regulation search', async () => {
    renderApp('/regulation/new')
    fireEvent.click(await screen.findByRole('button', { name: 'Submit' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Search query is required.')
  })

  it('creates a search and returns to the list', async () => {
    let created: unknown
    server.use(
      http.post('*/api/regulations/', async ({ request }) => {
        created = await request.json()
        return HttpResponse.json({ id: 250 }, { status: 201 })
      }),
    )
    renderApp('/regulation/new')
    fireEvent.change(await screen.findByLabelText('Enter a city, address or area'), { target: { value: 'Port Alder' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByRole('heading', { name: 'Your Regulation Searches' })).toBeInTheDocument()
    await waitFor(() => expect(created).toEqual({ search: 'Port Alder' }))
    expect(await screen.findByText('Regulation created successfully!')).toBeInTheDocument()
  })

  it('shows the analysis and conversation for a regulation', async () => {
    renderApp('/regulation/201/chat')
    expect(await screen.findByText(/need a host permit/)).toBeInTheDocument()
    expect(screen.getByText('Does the permit cover a second unit?')).toBeInTheDocument()
  })
})
