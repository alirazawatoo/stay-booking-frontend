import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateRegulationMutation } from '../services/api';
import Layout from '../components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import { toggleRefreshRegulations } from '@/store/slices/authSlice';

const NewRegulationSearch: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [createRegulation] = useCreateRegulationMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const search = inputValue.trim();
    if (!search) {
      setError('Search query is required.');
      return;
    }
    setError('');

    // The API saves the row first and answers only after the model call finishes:
    // return to the list, refresh it once the pending row exists, and again when done.
    navigate('/regulations');
    const showPendingRow = setTimeout(() => dispatch(toggleRefreshRegulations()), 1000);

    try {
      await createRegulation({ search }).unwrap();
      toast.success('Regulation created successfully!');
    } catch {
      toast.error('Failed to create regulation. Please try again.');
    } finally {
      clearTimeout(showPendingRow);
      dispatch(toggleRefreshRegulations());
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center md:items-start">
          <h1 className="text-xl font-bold">New Regulation Search</h1>
          <Breadcrumbs items={[{ label: 'Your Regulation Searches', to: '/regulations' }, { label: 'New Search' }]} />
        </div>

        <form onSubmit={handleSubmit} className="my-10 text-left" noValidate>
          <label htmlFor="regulation-search" className="mb-2 block text-sm font-medium text-gray-700 md:text-base">
            Enter a city, address or area
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <input
              id="regulation-search"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Message RegAdvisor AI"
              aria-describedby={error ? 'regulation-search-error' : undefined}
              className="w-full rounded border border-gray-300 p-2 sm:w-3/4 md:w-1/2"
            />
            <button type="submit" className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              Submit
            </button>
          </div>
          {error && (
            <p id="regulation-search-error" role="alert" className="mt-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default NewRegulationSearch;
