import { http, HttpResponse, type JsonBodyType } from 'msw'
import { server } from '../mocks/server'
import { makeStore } from '../store'
import authReducer from '../store/slices/authSlice'
import { api, withQuery } from './api'

function storeWithToken(token: string | null = 'test-token') {
  return makeStore({ auth: { ...authReducer(undefined, { type: 'init' }), token } })
}

function captureRequests(method: 'get' | 'post', path: string, body: JsonBodyType = {}) {
  const seen: Request[] = []
  server.use(
    http[method](path, ({ request }) => {
      seen.push(request.clone())
      return HttpResponse.json(body)
    }),
  )
  return seen
}

describe('withQuery', () => {
  it('drops empty values and encodes the rest', () => {
    expect(withQuery('api/leases/search/', { page: 2, address: '14 Harbour Row', status: '', start_date: undefined })).toBe(
      'api/leases/search/?page=2&address=14+Harbour+Row',
    )
    expect(withQuery('api/leases/', {})).toBe('api/leases/')
  })
})

describe('api endpoints', () => {
  it('sends the bearer token from the store', async () => {
    const seen = captureRequests('get', '*/account/profile/', { id: 1 })
    await storeWithToken('abc123').dispatch(api.endpoints.getUserProfile.initiate(undefined))
    expect(seen[0].headers.get('authorization')).toBe('Bearer abc123')
  })

  it('maps lease search filters to the API query parameter names', async () => {
    const seen = captureRequests('get', '*/api/leases/search/', { results: [], next: null })
    await storeWithToken().dispatch(
      api.endpoints.searchLeases.initiate({ page: 1, address: 'Juniper', status: 'Draft', startDate: '2026-10-01', endDate: '2026-10-31' }),
    )
    const params = new URL(seen[0].url).searchParams
    expect(Object.fromEntries(params)).toEqual({
      page: '1',
      address: 'Juniper',
      status: 'Draft',
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    })
  })

  it('posts rental filters in the body and keeps paging in the query string', async () => {
    const seen = captureRequests('post', '*/api/rental_properties/filtered-list/', { results: { properties: [], all_batch_ids: [] } })
    await storeWithToken().dispatch(api.endpoints.filteredList.initiate({ page: 3, pageSize: 20, batch_id: 7, min_profit: undefined }))
    const url = new URL(seen[0].url)
    expect(url.searchParams.get('page')).toBe('3')
    expect(url.searchParams.get('page_size')).toBe('20')
    expect(await seen[0].json()).toEqual({ batch_id: 7 })
  })

  it('returns the CSV export as text', async () => {
    const result = await storeWithToken().dispatch(api.endpoints.downloadCsv.initiate({ batch_id: 7 }))
    expect(result.data).toContain('Batch Id')
  })

  it('posts the first-login password pair to the user-specific endpoint', async () => {
    const seen = captureRequests('post', '*/account/users/update-password/:id/', { message: 'ok' })
    await storeWithToken().dispatch(
      api.endpoints.updatePassword.initiate({ id: '5', passwordData: { new_password: 'pw-1', confirm_password: 'pw-1' } }),
    )
    expect(new URL(seen[0].url).pathname).toBe('/account/users/update-password/5/')
    expect(await seen[0].json()).toEqual({ new_password: 'pw-1', confirm_password: 'pw-1' })
  })
})
