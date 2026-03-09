// Mock Service Worker handlers that mirror the property-stay-api contract.
// The "*/" prefix matches any VITE_API_URL origin.
import { http, HttpResponse } from 'msw';
import {
  demoAdmin,
  demoLeaseHistory,
  demoLeases,
  demoRegulationHistory,
  demoRegulations,
  demoRentals,
  demoUsers,
} from './fixtures';

const page = <T,>(results: T) => ({ count: Array.isArray(results) ? results.length : 0, next: null, previous: null, results });

const answer = (question: string) =>
  `Demo answer: this mock API does not call a language model, so "${question}" gets a canned reply.`;

export const handlers = [
  http.post('*/api/token/', () => HttpResponse.json({ access: 'demo-access-token', refresh: 'demo-refresh-token' })),
  http.get('*/account/profile/', () => HttpResponse.json(demoAdmin)),
  http.post('*/account/logout/', () => HttpResponse.json({ message: 'Logged out successfully' })),
  http.get('*/account/users/', () => HttpResponse.json({ ...page(demoUsers), count: demoUsers.length })),
  http.post('*/account/users/', async ({ request }) => HttpResponse.json({ id: 99, ...((await request.json()) as object) }, { status: 201 })),
  http.put('*/account/users/:id/', () => HttpResponse.json({ message: 'User updated successfully' })),
  http.delete('*/account/users/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('*/account/password/change/', () => HttpResponse.json({ success: 'Password changed successfully' })),
  http.post('*/account/users/update-password/:id/', () => HttpResponse.json({ message: 'Password updated successfully' })),

  http.get('*/api/leases/', () => HttpResponse.json(page(demoLeases))),
  http.get('*/api/leases/search/', ({ request }) => {
    const params = new URL(request.url).searchParams;
    const address = params.get('address')?.toLowerCase();
    const status = params.get('status');
    const matches = demoLeases.filter(
      (lease) =>
        (!address || `${lease.address1} ${lease.address2 ?? ''}`.toLowerCase().includes(address)) &&
        (!status || lease.status === status),
    );
    return HttpResponse.json(page(matches));
  }),
  http.get('*/api/leases/:id/', ({ params }) => {
    const lease = demoLeases.find((item) => item.id === Number(params.id));
    return lease ? HttpResponse.json(lease) : HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
  }),
  http.post('*/api/leases/upload/', () => HttpResponse.json({ ...demoLeases[0], id: 150, documents: [{ id: 151 }] }, { status: 201 })),
  http.put('*/api/leases/:id/update/', async ({ request }) => HttpResponse.json(await request.json())),
  http.post('*/api/leases/:id/revised/', () => HttpResponse.json({ status: 'revised documents uploaded', document_ids: [160] })),

  http.get('*/api/documents/lease/:leaseId/documents/', ({ params }) => {
    const lease = demoLeases.find((item) => item.id === Number(params.leaseId));
    return lease?.documents?.length
      ? HttpResponse.json(lease.documents.map((doc) => ({ ...doc, lease_id: lease.id })))
      : HttpResponse.json({ detail: 'No documents found for this lease.' }, { status: 404 });
  }),
  http.post('*/api/documents/review/', () => HttpResponse.json([{ detail: 'Document review has started.' }])),
  http.get('*/api/documents/preview/:id/', () => HttpResponse.json({ file_url: 'about:blank' })),
  http.get('*/api/documents/:id/get-chat-history/', () => HttpResponse.json(demoLeaseHistory)),
  http.post('*/api/documents/:id/chat/', async ({ request }) => {
    const { message } = (await request.json()) as { message: string };
    return HttpResponse.json({ response: answer(message), chat_history: demoLeaseHistory.chat_history });
  }),

  http.get('*/api/regulations/', () => HttpResponse.json(page(demoRegulations))),
  http.get('*/api/regulations/search/', ({ request }) => {
    const query = new URL(request.url).searchParams.get('query')?.toLowerCase();
    return HttpResponse.json(page(demoRegulations.filter((item) => !query || item.search.toLowerCase().includes(query))));
  }),
  http.post('*/api/regulations/', async ({ request }) => {
    const { search } = (await request.json()) as { search: string };
    return HttpResponse.json({ id: 250, date: '2026-11-09', search, status: 'pending', gpt_response: null, chat_history: [] }, { status: 201 });
  }),
  http.get('*/api/regulations/:id/', ({ params }) => {
    const regulation = demoRegulations.find((item) => item.id === Number(params.id));
    return regulation ? HttpResponse.json(regulation) : HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
  }),
  http.get('*/api/regulations/:id/get-chat-history/', () => HttpResponse.json(demoRegulationHistory)),
  http.post('*/api/regulations/:id/chat/', async ({ request }) => {
    const { message } = (await request.json()) as { message: string };
    return HttpResponse.json({ response: answer(message), chat_history: demoRegulationHistory.chat_history });
  }),

  http.post('*/api/rental_properties/filtered-list/', async ({ request }) => {
    const filters = (await request.json()) as Record<string, string | number | undefined>;
    const url = new URL(request.url);
    const pageSize = Number(url.searchParams.get('page_size') || 10);
    const pageNumber = Number(url.searchParams.get('page') || 1);
    const matches = demoRentals.filter(
      (item) =>
        (filters.batch_id === undefined || item.batch_id === Number(filters.batch_id)) &&
        (!filters.status || item.property_status === filters.status) &&
        (filters.min_profit === undefined || (item.monthly_estimated_profit ?? -Infinity) >= Number(filters.min_profit)) &&
        (filters.max_profit === undefined || (item.monthly_estimated_profit ?? Infinity) <= Number(filters.max_profit)),
    );
    const start = (pageNumber - 1) * pageSize;
    return HttpResponse.json({
      count: matches.length,
      next: start + pageSize < matches.length ? `${url.origin}${url.pathname}?page=${pageNumber + 1}` : null,
      previous: null,
      results: {
        all_batch_ids: [...new Set(matches.map((item) => item.batch_id))].sort(),
        properties: matches.slice(start, start + pageSize),
      },
    });
  }),
  http.get('*/api/rental_properties/download-csv/', () =>
    new HttpResponse('Date,Batch Id,Location\nNovember 2, 2026,7,"14 Harbour Row, Port Alder"\n', {
      headers: { 'Content-Type': 'text/csv' },
    }),
  ),
  http.post('*/api/rental_properties/upload-properties/', () =>
    HttpResponse.json({ success: true, message: 'Batch 9 processing started', task_id: 'demo-task' }, { status: 202 }),
  ),
  http.get('*/api/rental_properties/task-progress/', () => HttpResponse.json({ success: true, state: 'SUCCESS', progress: 100 })),
  http.get('*/api/rental_properties/task-result/', () => HttpResponse.json({ success: true, message: 'Task completed', result: {} })),
];
