import React from 'react';
import { RentalProperty } from '../types/rentalTypes';
import { formatCount, formatCurrency } from '@/utils/format';
import StatusBadge from './StatusBadge';

const CELL = 'whitespace-nowrap px-4 py-2 text-sm md:px-6 md:text-base';

const RentalRow: React.FC<{ rental: RentalProperty; onSelect: () => void }> = ({ rental, onSelect }) => (
  <tr onClick={onSelect} className="cursor-pointer hover:bg-gray-50">
    <td className={CELL}>{rental.created_at_formatted || 'N/A'}</td>
    <td className={CELL}>
      <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className="text-left hover:underline">
        {rental.location || 'N/A'}
      </button>
    </td>
    <td className={CELL}>{formatCurrency(rental.rent)}</td>
    <td className={CELL}>{formatCount(rental.no_of_bedrooms)}</td>
    <td className={CELL}>{formatCurrency(rental.monthly_estimated_profit)}</td>
    <td className={CELL}>
      <a
        href={rental.property_zillow_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="text-red-700 underline"
      >
        View Property
      </a>
    </td>
    <td className={CELL}>
      <StatusBadge status={rental.property_status} />
    </td>
  </tr>
);

export default RentalRow;
