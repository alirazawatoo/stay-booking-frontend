// Fictional people and demo properties shared by the tests and the browser demo.
// None of these records, addresses or listing links refer to real people or homes.
import type { Lease, Document } from '@/types/leaseTypes';
import type { Regulation } from '@/types/regulationTypes';
import type { RentalProperty } from '@/types/rentalTypes';
import { RentalPropertyStatus } from '@/types/rentalTypes';
import type { User } from '@/types/userTypes';
import type { ChatHistoryResponse } from '@/types/chatTypes';

export const demoAdmin: User = {
  id: 1,
  email: 'mara.okafor@example.test',
  first_name: 'Mara',
  last_name: 'Okafor',
  user_type: 'admin',
  is_active: true,
  is_first_login: false,
};

export const demoAnalyst: User = {
  id: 2,
  email: 'theo.lindqvist@example.test',
  first_name: 'Theo',
  last_name: 'Lindqvist',
  user_type: 'research',
  is_active: true,
  is_first_login: false,
};

export const demoUsers: User[] = [
  demoAdmin,
  demoAnalyst,
  { id: 3, email: 'ines.marlowe@example.test', first_name: 'Ines', last_name: 'Marlowe', user_type: 'client', is_active: true },
  { id: 4, email: 'pavel.durand@example.test', first_name: 'Pavel', last_name: 'Durand', user_type: 'customer', is_active: false },
  { id: 5, email: 'ruth.achebe@example.test', first_name: 'Ruth', last_name: 'Achebe', user_type: 'research', is_active: true },
];

export const demoDocuments: Document[] = [
  { id: 11, name: 'harbour-row-lease_v1', uploaded_at: '2026-10-02T09:14:00Z', status: 'Rejected' },
  { id: 12, name: 'harbour-row-lease_v2', uploaded_at: '2026-10-09T15:40:00Z', status: 'Approved' },
];

export const demoLeases: Lease[] = [
  {
    id: 101,
    date: '2026-10-02',
    address1: '14 Harbour Row',
    address2: 'Unit 3B',
    city: 'Port Alder',
    state: 'ME',
    zip_code: '04101',
    status: 'Approved',
    num_of_docs: 2,
    documents: demoDocuments,
  },
  {
    id: 102,
    date: '2026-10-21',
    address1: '208 Juniper Lane',
    address2: null,
    city: 'Cedar Bluff',
    state: 'NC',
    zip_code: '28801',
    status: 'Draft',
    num_of_docs: 1,
    documents: [{ id: 13, name: 'juniper-lane-lease_v1', uploaded_at: '2026-10-21T11:05:00Z', status: 'Draft' }],
  },
  {
    id: 103,
    date: '2026-11-03',
    address1: '5 Quarry Steps',
    address2: null,
    city: 'Millbrook Falls',
    state: 'VT',
    zip_code: '05401',
    status: 'Rejected',
    num_of_docs: 1,
    documents: [{ id: 14, name: 'quarry-steps-lease_v1', uploaded_at: '2026-11-03T08:30:00Z', status: 'Rejected' }],
  },
];

export const demoRegulations: Regulation[] = [
  {
    id: 201,
    date: '2026-10-12',
    search: 'Port Alder, ME - harbour district',
    status: 'STR Allowed with Restrictions',
    gpt_response: null,
    chat_history: [],
  },
  { id: 202, date: '2026-10-18', search: 'Cedar Bluff, NC - old town', status: 'STR Allowed', gpt_response: null, chat_history: [] },
  { id: 203, date: '2026-11-01', search: 'Millbrook Falls, VT', status: 'STR Not Allowed', gpt_response: null, chat_history: [] },
];

export const demoRegulationHistory: ChatHistoryResponse = {
  gpt_response: {
    message:
      '**Demo note.** Short-term rentals in this fictional district need a host permit and a 30-night annual cap. ' +
      'Verify any real rule with the local authority.',
    status: 'STR Allowed with Restrictions',
    timestamp: '2026-10-12T10:02:00Z',
  },
  chat_history: [
    { role: 'user', content: 'Does the permit cover a second unit?', timestamp: '2026-10-12T10:05:00Z' },
    { role: 'assistant', content: 'In this demo district each unit needs its own permit.', timestamp: '2026-10-12T10:05:09Z' },
  ],
};

export const demoLeaseHistory: ChatHistoryResponse = {
  document_uploaded_at: '2026-10-09 15:40:00.000000+00:00',
  gpt_response: {
    message: '**Demo analysis.** The lease allows subletting with written consent and sets a 60-day notice period.',
    status: 'Approved',
    timestamp: '2026-10-09T15:42:00Z',
  },
  chat_history: [
    { role: 'user', content: 'Is short-term subletting allowed?', timestamp: '2026-10-09T15:50:00Z' },
    { role: 'assistant', content: 'Only with the landlord’s written consent (clause 12).', timestamp: '2026-10-09T15:50:06Z' },
  ],
};

const rental = (
  id: number,
  location: string,
  rent: number,
  bedrooms: number,
  profit: number | null,
  status: RentalPropertyStatus,
): RentalProperty => ({
  created_at: `2026-11-0${(id % 5) + 1}T12:00:00Z`,
  created_at_formatted: `November ${(id % 5) + 1}, 2026`,
  location,
  rent,
  no_of_bedrooms: bedrooms,
  no_of_bathrooms: Math.max(1, bedrooms - 1),
  square_feet: 450 + bedrooms * 320,
  utilities: 180,
  adr: profit === null ? null : 140 + bedrooms * 35,
  occupancy_rate: profit === null ? null : 62,
  property_zillow_link: `https://example.com/demo-listing/${id}`,
  property_status: status,
  yearly_rent_cost_util: (rent + 180) * 12,
  yearly_projected_revenue: profit === null ? null : (rent + 180 + profit) * 12,
  monthly_estimated_profit: profit,
  batch_id: id < 306 ? 7 : 8,
});

export const demoRentals: RentalProperty[] = [
  rental(301, '14 Harbour Row, Port Alder', 1850, 2, 640, RentalPropertyStatus.Approved),
  rental(302, '77 Kestrel Court, Port Alder', 1420, 1, 310, RentalPropertyStatus.Approved),
  rental(303, '3 Lantern Yard, Cedar Bluff', 2400, 3, -120, RentalPropertyStatus.Rejected),
  rental(304, '19 Fernhill Close, Cedar Bluff', 980, 0, 205, RentalPropertyStatus.Approved),
  rental(305, '60 Mill Race, Millbrook Falls', 2100, 3, null, RentalPropertyStatus.Error),
  rental(306, '8 Orchard Walk, Millbrook Falls', 1675, 2, 455, RentalPropertyStatus.Approved),
];
