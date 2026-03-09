import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RegulationTable from '../components/RegulationTable';
import RegulationSearchBar, { RegulationSearchFilters } from '../components/RegulationSearchBar';
import Layout from '../components/Layout';
import PageMessage from '../components/PageMessage';
import Pagination from '../components/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useGetRegulationsQuery, useSearchRegulationsQuery } from '../services/api';
import type { RootState } from '@/store';
import type { Regulation } from '@/types/regulationTypes';

const NO_FILTERS: RegulationSearchFilters = { query: '', status: '' };

const RegulationManagement = () => {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<RegulationSearchFilters>(NO_FILTERS);
  const isFilterApplied = Boolean(searchFilters.query || searchFilters.status || searchFilters.startDate || searchFilters.endDate);

  const { data: regulations, refetch, isLoading, isError } = useGetRegulationsQuery(page, { skip: isFilterApplied });
  const { data: searchResults, isFetching: isSearching } = useSearchRegulationsQuery(
    { ...searchFilters, page },
    { skip: !isFilterApplied },
  );

  const refreshToggle = useSelector((state: RootState) => state.auth.refreshRegulations);
  useEffect(() => {
    if (!isFilterApplied) refetch();
  }, [refreshToggle, refetch, isFilterApplied]);

  const handleSearch = (filters: RegulationSearchFilters) => {
    setSearchFilters(filters);
    setPage(1);
  };

  const current = isFilterApplied ? searchResults : regulations;
  const displayed: Regulation[] | undefined = current?.results;

  return (
    <Layout>
      <div className="mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-semibold text-pine-900">Your Regulation Searches</h1>
            <Breadcrumbs items={[{ label: 'Your Regulation Searches' }]} />
          </div>
          <Link to="/regulation/new" className="flex items-center space-x-2 rounded bg-pine-700 px-4 py-2 text-white hover:bg-pine-800">
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
            <span>New Search</span>
          </Link>
        </div>
        <RegulationSearchBar onSearch={handleSearch} />

        {isLoading || isSearching ? (
          <PageMessage kind="loading">Loading regulation searches…</PageMessage>
        ) : isError ? (
          <PageMessage kind="error">Error loading regulations. Check that the API is running and try again.</PageMessage>
        ) : (
          <RegulationTable regulations={displayed} />
        )}

        <Pagination page={page} hasNext={Boolean(current?.next)} onPageChange={setPage} />
      </div>
    </Layout>
  );
};

export default RegulationManagement;
