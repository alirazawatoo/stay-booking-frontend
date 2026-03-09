import React, { useState } from 'react';
import DateRangeInput from './DateRangeInput';
import { RentalPropertyStatus } from '../types/rentalTypes';
import type { RentalFilters } from '../services/api';

interface RentalSearchBarProps {
  onSearch: (filters: RentalFilters) => void;
  batchIds: number[];
}

// The rental filter endpoint expects "Month day, year" dates (e.g. "December 3, 2024").
const formatFilterDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const toNumber = (value: string): number | undefined => (value === '' ? undefined : Number(value));

const FIELD = 'w-full rounded-lg border bg-stone-50 p-2';

const RentalSearchBar: React.FC<RentalSearchBarProps> = ({ onSearch, batchIds }) => {
  const [minProfit, setMinProfit] = useState('');
  const [maxProfit, setMaxProfit] = useState('');
  const [batchId, setBatchId] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const min = toNumber(minProfit);
    const max = toNumber(maxProfit);
    if (min !== undefined && max !== undefined && min > max) {
      setError('Minimum profit must not be greater than maximum profit.');
      return;
    }
    setError('');
    onSearch({
      min_profit: min,
      max_profit: max,
      batch_id: toNumber(batchId),
      status: status || undefined,
      start_date: startDate ? formatFilterDate(startDate) : undefined,
      end_date: endDate ? formatFilterDate(endDate) : undefined,
    });
  };

  return (
    <form role="search" onSubmit={handleSearch} className="rounded-lg bg-stone-100 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <label>
          <span className="sr-only">Minimum monthly profit</span>
          <input type="number" value={minProfit} onChange={(event) => setMinProfit(event.target.value)} placeholder="Min Profit" className={FIELD} />
        </label>
        <label>
          <span className="sr-only">Maximum monthly profit</span>
          <input type="number" value={maxProfit} onChange={(event) => setMaxProfit(event.target.value)} placeholder="Max Profit" className={FIELD} />
        </label>
        <label>
          <span className="sr-only">Batch</span>
          <select value={batchId} onChange={(event) => setBatchId(event.target.value)} className={FIELD}>
            <option value="">All batches</option>
            {batchIds.map((id) => (
              <option key={id} value={id}>
                Batch {id}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Zillow status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={FIELD}>
            <option value="">Any status</option>
            <option value={RentalPropertyStatus.Approved}>Approved</option>
            <option value={RentalPropertyStatus.Rejected}>Rejected</option>
            <option value={RentalPropertyStatus.Error}>Error</option>
          </select>
        </label>
        <DateRangeInput
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <button type="submit" className="rounded-lg bg-stone-600 px-4 py-2 text-white transition-colors hover:bg-stone-700">
          Search
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
};

export default RentalSearchBar;
