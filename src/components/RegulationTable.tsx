import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Regulation } from '../types/regulationTypes';
import StatusBadge from './StatusBadge';

const HEADERS = ['#', 'Date', 'Search', 'Status'];
const CELL = 'whitespace-nowrap px-4 py-2 text-sm md:px-6 md:text-base';

const RegulationTable: React.FC<{ regulations?: Regulation[] }> = ({ regulations = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full table-auto divide-y divide-stone-200">
        <thead className="bg-stone-200">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 text-center text-xs font-bold uppercase text-stone-700 md:px-6">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 bg-white">
          {regulations.length > 0 ? (
            regulations.map((regulation, index) => {
              const chatPath = `/regulation/${regulation.id}/chat`;
              return (
                <tr key={regulation.id} onClick={() => navigate(chatPath)} className="cursor-pointer hover:bg-stone-50">
                  <td className={CELL}>{index + 1}</td>
                  <td className={CELL}>{regulation.date}</td>
                  <td className={CELL}>
                    <Link to={chatPath} onClick={(event) => event.stopPropagation()} className="hover:underline">
                      {regulation.search}
                    </Link>
                  </td>
                  <td className={CELL}>
                    <StatusBadge status={regulation.status} />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="px-4 py-4 text-center text-stone-500">
                No regulation searches yet. Start one with New Search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegulationTable;
