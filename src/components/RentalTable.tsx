import React, { useState } from 'react';
import RentalRow from './RentalRow';
import RentalDetailsModal from './RentalDetailsModal';
import { RentalProperty } from '../types/rentalTypes';

type SortKey = keyof RentalProperty;
type SortOrder = 'asc' | 'desc';

const HEADERS: { label: string; key: SortKey }[] = [
  { label: 'Date', key: 'created_at' },
  { label: 'Location', key: 'location' },
  { label: 'Rent', key: 'rent' },
  { label: 'Bedrooms', key: 'no_of_bedrooms' },
  { label: 'Estimated Profit', key: 'monthly_estimated_profit' },
  { label: 'Link', key: 'property_zillow_link' },
  { label: 'Zillow Property Status', key: 'property_status' },
];

// Sorting applies to the rows on the current page only; the API orders pages by date.
function sortRentals(rentals: RentalProperty[], key: SortKey | null, order: SortOrder | null): RentalProperty[] {
  if (!key || !order) return rentals;
  const direction = order === 'asc' ? 1 : -1;
  return [...rentals].sort((a, b) => {
    const left = a[key];
    const right = b[key];
    if (left == null || right == null) return 0;
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * direction;
    return String(left).localeCompare(String(right)) * direction;
  });
}

const RentalTable: React.FC<{ rentals: RentalProperty[] }> = ({ rentals }) => {
  const [selectedRental, setSelectedRental] = useState<RentalProperty | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  // Clicking a column cycles ascending, descending, then back to the API order.
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder('asc');
    } else {
      setSortOrder((previous) => (previous === 'asc' ? 'desc' : previous === 'desc' ? null : 'asc'));
    }
  };

  const sortedRentals = sortRentals(rentals, sortKey, sortOrder);

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            {HEADERS.map((header) => {
              const active = sortKey === header.key && sortOrder;
              return (
                <th
                  key={header.key}
                  scope="col"
                  aria-sort={active ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                  className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-700 md:px-6"
                >
                  <button type="button" onClick={() => handleSort(header.key)} className="uppercase">
                    {header.label}
                    {active && <span aria-hidden="true" className="ml-2">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedRentals.length > 0 ? (
            sortedRentals.map((rental, index) => (
              <RentalRow key={`${rental.batch_id}-${rental.property_zillow_link}-${index}`} rental={rental} onSelect={() => setSelectedRental(rental)} />
            ))
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="px-4 py-4 text-center text-gray-500">
                No rental properties match. Upload a spreadsheet or clear the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedRental && <RentalDetailsModal rental={selectedRental} onClose={() => setSelectedRental(null)} />}
    </div>
  );
};

export default RentalTable;
