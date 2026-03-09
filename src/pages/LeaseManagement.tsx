import { useEffect, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LeaseTable from '../components/LeaseTable';
import LeaseSearchBar, { LeaseSearchFilters } from '../components/LeaseSearchBar';
import UploadLeaseModal from '../components/UploadLeaseModal';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import PageMessage from '../components/PageMessage';
import Pagination from '../components/Pagination';
import {
  useGetAllLeasesQuery,
  useUploadLeaseMutation,
  useUpdateLeaseMutation,
  useSearchLeasesQuery,
  useReviewDocumentsMutation,
} from '../services/api';
import { toggleRefreshDocuments } from '../store/slices/authSlice';
import type { RootState } from '@/store';
import type { Document, Lease } from '@/types/leaseTypes';

const NO_FILTERS: LeaseSearchFilters = { address: '', status: '' };

const LeaseManagement = () => {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<LeaseSearchFilters>(NO_FILTERS);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const isFilterApplied = Boolean(searchFilters.address || searchFilters.status || searchFilters.startDate || searchFilters.endDate);

  const { data: leases, refetch, isLoading, isError } = useGetAllLeasesQuery(page, { skip: isFilterApplied });
  const { data: searchResults, isFetching: isSearching } = useSearchLeasesQuery(
    { ...searchFilters, page },
    { skip: !isFilterApplied },
  );
  const [uploadLease] = useUploadLeaseMutation();
  const [updateLease] = useUpdateLeaseMutation();
  const [reviewDocuments] = useReviewDocumentsMutation();
  const dispatch = useDispatch();

  const refreshToggle = useSelector((state: RootState) => state.auth.refreshDocuments);
  useEffect(() => {
    if (!isFilterApplied) refetch();
  }, [refreshToggle, refetch, isFilterApplied]);

  // Errors propagate to the modal, which shows the failure toast and stays open.
  const handleUploadLease = async (leaseData: FormData) => {
    const uploadedLease = await uploadLease(leaseData).unwrap();
    refetch();
    setUploadModalOpen(false);

    const documentIds = ((uploadedLease.documents ?? []) as Document[]).map((doc) => doc.id).filter(Boolean);
    if (documentIds.length > 0) {
      try {
        await reviewDocuments({ documentIds }).unwrap();
        dispatch(toggleRefreshDocuments());
      } catch {
        toast.error('The lease was saved, but its documents could not be sent for review.');
      }
    }
  };

  const handleUpdateLease = async (leaseData: Lease) => {
    await updateLease(leaseData).unwrap();
    refetch();
  };

  const handleSearch = (filters: LeaseSearchFilters) => {
    setSearchFilters(filters);
    setPage(1);
  };

  // The search endpoint answers {"detail": ...} rather than a page when nothing matches.
  const current = isFilterApplied ? searchResults : leases;
  const displayedLeases: Lease[] | undefined = current?.results;

  return (
    <Layout>
      <div className="mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-semibold text-pine-900">Your Leases</h1>
            <Breadcrumbs items={[{ label: 'Your Leases' }]} />
          </div>
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center space-x-2 rounded bg-pine-700 px-4 py-3 text-white hover:bg-pine-800"
          >
            <ArrowUpTrayIcon className="h-5 w-5" aria-hidden="true" />
            <span>Upload Lease</span>
          </button>
        </div>
        <LeaseSearchBar onSearch={handleSearch} />

        {isLoading || isSearching ? (
          <PageMessage kind="loading">Loading leases…</PageMessage>
        ) : isError ? (
          <PageMessage kind="error">Error loading leases. Check that the API is running and try again.</PageMessage>
        ) : (
          <LeaseTable leases={displayedLeases} onUpdate={handleUpdateLease} />
        )}

        <Pagination page={page} hasNext={Boolean(current?.next)} onPageChange={setPage} />

        <UploadLeaseModal
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUploadLease}
          onUpdate={handleUpdateLease}
        />
      </div>
    </Layout>
  );
};

export default LeaseManagement;
