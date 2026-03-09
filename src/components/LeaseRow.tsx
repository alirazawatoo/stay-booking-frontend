import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Lease } from '../types/leaseTypes';
import { formatAddress } from '@/utils/format';
import StatusBadge from './StatusBadge';

interface LeaseRowProps {
  lease: Lease;
  index: number;
  onEditClick: (lease: Lease) => void;
}

const CELL = 'whitespace-nowrap px-4 py-2 text-sm md:px-6 md:text-base';

const LeaseRow: React.FC<LeaseRowProps> = ({ lease, index, onEditClick }) => {
  const navigate = useNavigate();
  const address = formatAddress(lease.address1, lease.address2);

  return (
    <tr onClick={() => navigate(`/lease/${lease.id}`)} className="cursor-pointer hover:bg-gray-50">
      <td className={CELL}>{index}</td>
      <td className={CELL}>{lease.date}</td>
      <td className={CELL}>
        <Link to={`/lease/${lease.id}`} onClick={(event) => event.stopPropagation()} className="hover:underline">
          {address}
        </Link>
      </td>
      <td className={CELL}>{lease.city}</td>
      <td className={CELL}>{lease.state}</td>
      <td className={CELL}>{lease.zip_code}</td>
      <td className={CELL}>{lease.num_of_docs}</td>
      <td className={CELL}>
        <StatusBadge status={lease.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-2 md:px-6">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEditClick(lease);
          }}
          aria-label={`Edit lease at ${address}`}
          className="text-gray-700 hover:text-black"
        >
          <PencilIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};

export default LeaseRow;
