import React from 'react';
import { RentalProperty } from '../types/rentalTypes';
import { formatCount, formatCurrency } from '@/utils/format';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

const RentalDetailsModal: React.FC<{ rental: RentalProperty; onClose: () => void }> = ({ rental, onClose }) => {
  const details: { label: string; value: React.ReactNode }[] = [
    { label: 'Date', value: rental.created_at_formatted || 'N/A' },
    { label: 'Batch ID', value: rental.batch_id },
    { label: 'Location', value: rental.location || 'N/A' },
    { label: 'Rent', value: formatCurrency(rental.rent) },
    { label: 'Square Feet', value: formatCount(rental.square_feet) },
    { label: 'Bedrooms', value: formatCount(rental.no_of_bedrooms) },
    { label: 'Bathrooms', value: formatCount(rental.no_of_bathrooms) },
    {
      label: 'Link',
      value: (
        <a href={rental.property_zillow_link} className="text-pine-700 hover:underline" target="_blank" rel="noopener noreferrer">
          View Property
        </a>
      ),
    },
    { label: 'Average daily rate', value: formatCurrency(rental.adr) },
    { label: 'Utilities', value: formatCurrency(rental.utilities) },
    { label: 'Estimated monthly profit', value: formatCurrency(rental.monthly_estimated_profit) },
    { label: 'Projected yearly revenue', value: formatCurrency(rental.yearly_projected_revenue) },
    { label: 'Yearly rent and utilities', value: formatCurrency(rental.yearly_rent_cost_util) },
    { label: 'Occupancy Rate', value: rental.occupancy_rate == null ? 'N/A' : `${rental.occupancy_rate}%` },
    { label: 'Zillow Property Status', value: <StatusBadge status={rental.property_status} /> },
  ];

  return (
    <Modal isOpen onClose={onClose} title="Rental Property Details">
      <dl className="space-y-3">
        {details.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <dt className="font-medium text-stone-700">{item.label}</dt>
            <dd className="text-right text-stone-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
};

export default RentalDetailsModal;
