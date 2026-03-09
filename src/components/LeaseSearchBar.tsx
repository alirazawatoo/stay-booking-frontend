import React, { useState } from 'react';
import DateRangeInput from './DateRangeInput';
import { formatLocalDate } from '@/utils/dates';

export interface LeaseSearchFilters {
  address: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

const LeaseSearchBar: React.FC<{ onSearch: (filters: LeaseSearchFilters) => void }> = ({ onSearch }) => {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({
      address,
      status,
      startDate: startDate ? formatLocalDate(startDate) : undefined,
      endDate: endDate ? formatLocalDate(endDate) : undefined,
    });
  };

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className="flex flex-col items-center justify-between gap-2 rounded-lg bg-stone-100 p-4 md:flex-row md:gap-4"
    >
      <div className="flex w-full flex-col items-center gap-2 sm:flex-row md:w-auto">
        <label className="w-full sm:w-auto">
          <span className="sr-only">Address</span>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Address"
            className="w-full rounded-lg border bg-stone-50 p-2 sm:w-auto"
          />
        </label>
        <DateRangeInput
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <label className="w-full sm:w-auto">
          <span className="sr-only">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border bg-stone-50 p-2 sm:w-auto">
            <option value="">Any status</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
            <option value="Approved">Approved</option>
          </select>
        </label>
      </div>
      <button type="submit" className="w-full rounded-lg bg-stone-600 px-4 py-2 text-white transition-colors hover:bg-stone-700 sm:w-auto">
        Search
      </button>
    </form>
  );
};

export default LeaseSearchBar;
