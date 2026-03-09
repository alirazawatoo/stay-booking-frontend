import React, { useState } from 'react';
import LeaseRow from './LeaseRow';
import { Lease } from '../types/leaseTypes';
import UploadLeaseModal from './UploadLeaseModal';

interface LeaseTableProps {
  leases?: Lease[];
  onUpdate: (leaseData: Lease) => Promise<void>;
}

const HEADERS = ['#', 'Date', 'Address', 'City', 'State', 'Zip', '# of Docs', 'Status', 'Edit'];

const LeaseTable: React.FC<LeaseTableProps> = ({ leases = [], onUpdate }) => {
  const [editingLease, setEditingLease] = useState<Lease | null>(null);

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-700 md:px-6">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {leases.length > 0 ? (
            leases.map((lease, index) => <LeaseRow key={lease.id} lease={lease} index={index + 1} onEditClick={setEditingLease} />)
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="px-4 py-4 text-center text-gray-500">
                No leases yet. Upload a lease PDF to start a review.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <UploadLeaseModal
        isOpen={editingLease !== null}
        onClose={() => setEditingLease(null)}
        leaseData={editingLease}
        isEditMode
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default LeaseTable;
