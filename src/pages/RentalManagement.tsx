import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import RentalTable from '../components/RentalTable';
import RentalSearchBar from '../components/RentalSearchBar';
import UploadRentalModal from '../components/UploadRentalModal';
import Layout from '../components/Layout';
import PageMessage from '../components/PageMessage';
import Pagination from '../components/Pagination';
import {
  RentalFilters,
  useFilteredListQuery,
  useUploadPropertiesMutation,
  useLazyDownloadCsvQuery,
  useGetTaskResultQuery,
  useTaskProgressQuery,
} from '../services/api';
import { setLoading, toggleRefreshRentals, setPolling, setTask } from '../store/slices/authSlice';
import type { RootState } from '@/store';
import type { FilteredRentalsResponse } from '@/types/rentalTypes';
import download from '@/assets/images/download.png';
import upload from '@/assets/images/upload.png';

interface TaskResultPayload {
  success: boolean;
  message: string;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const RentalManagement = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<RentalFilters>({});
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const dispatch = useDispatch();

  const refreshRentals = useSelector((state: RootState) => state.auth.refreshRentals);
  const pageLoading = useSelector((state: RootState) => state.auth.isLoading);
  const polling = useSelector((state: RootState) => state.auth.polling);
  const taskId = useSelector((state: RootState) => state.auth.taskId);

  const { data, refetch, isLoading, isError } = useFilteredListQuery({ ...filters, page, pageSize: rowsPerPage });
  const rentals = data as FilteredRentalsResponse | undefined;
  // An unfiltered request lists every batch, so the batch picker never narrows itself.
  const { data: allBatches, refetch: refetchBatchIds } = useFilteredListQuery({ pageSize: 1 });
  const batchIds = (allBatches as FilteredRentalsResponse | undefined)?.results?.all_batch_ids ?? [];

  const [uploadProperties] = useUploadPropertiesMutation();
  const [fetchCsv, { isFetching: isDownloading }] = useLazyDownloadCsvQuery();
  const { refetch: refetchTaskResult } = useGetTaskResultQuery(taskId ?? '', { skip: !taskId });
  const { data: taskProgress, isFetching: isFetchingProgress } = useTaskProgressQuery(taskId ?? '', {
    skip: !taskId,
    pollingInterval: 5000,
  });
  const progressPercentage: number = taskProgress?.progress || 0;

  useEffect(() => {
    refetch();
    refetchBatchIds();
  }, [refreshRentals, refetch, refetchBatchIds]);

  useEffect(() => {
    if (!polling || !taskId) return;

    const finishTask = (succeeded: boolean) => {
      dispatch(setPolling(false));
      dispatch(setTask(null));
      if (succeeded) toast.success('Task completed successfully!');
      else toast.error('Task processing failed.');
      dispatch(toggleRefreshRentals());
      dispatch(setLoading(false));
    };

    const interval = setInterval(async () => {
      const result = await refetchTaskResult();
      // A failed Celery task comes back as HTTP 500, so its body is on `error`, not `data`.
      const payload = (result.data ?? (result.error as FetchBaseQueryError | undefined)?.data) as
        | TaskResultPayload
        | undefined;
      if (payload?.message === 'Task completed') {
        clearInterval(interval);
        finishTask(true);
      } else if (payload?.message === 'Task failed') {
        clearInterval(interval);
        finishTask(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [polling, taskId, refetchTaskResult, dispatch]);

  const handleUploadRental = async (file: FormData) => {
    dispatch(setLoading(true));
    try {
      const response = await uploadProperties(file).unwrap();
      if (response.task_id) {
        dispatch(setTask(response.task_id));
        dispatch(setPolling(true));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleSearch = (nextFilters: RentalFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  // Fetched on click with the current filters, rather than on every filter change.
  const handleDownloadCsv = async () => {
    try {
      const csv = await fetchCsv(filters).unwrap();
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rental_properties_report.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV download successful!');
    } catch {
      toast.error('Error downloading CSV');
    }
  };

  const isBusy = isFetchingProgress || pageLoading;
  const total = rentals?.count ?? 0;
  const firstRow = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;

  return (
    <Layout>
      {polling && taskId && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-500 bg-opacity-50" role="status">
          <p className="text-lg font-bold text-white">Processing… {progressPercentage}%</p>
          <div
            className="h-4 w-1/3 rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Import progress"
          >
            <div className="h-4 rounded-full bg-red-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      )}

      <div className="relative mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <h1 className="text-xl font-bold">Your Rental Properties</h1>
          <div className="flex flex-row items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="flex items-center space-x-2 rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600 disabled:opacity-60"
              disabled={isBusy || isDownloading}
            >
              <img src={download} alt="" className="h-5 w-5" />
              <span>{isDownloading ? 'Preparing CSV…' : 'Download CSV'}</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center space-x-2 rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600 disabled:opacity-60"
              disabled={isBusy}
            >
              <img src={upload} alt="" className="h-5 w-5" />
              <span>Upload Properties</span>
            </button>
          </div>
        </div>
        <RentalSearchBar onSearch={handleSearch} batchIds={batchIds} />

        {isLoading ? (
          <PageMessage kind="loading">Loading rental properties…</PageMessage>
        ) : isError ? (
          <PageMessage kind="error">Error loading rental properties. Check the filters and that the API is running.</PageMessage>
        ) : (
          <RentalTable rentals={rentals?.results?.properties ?? []} />
        )}

        <Pagination page={page} hasNext={Boolean(rentals?.next)} onPageChange={setPage} disabled={isBusy}>
          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center">
              <span className="mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded border border-red-600 px-2 py-1 focus:border-red-600 focus:outline-none"
              >
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <span>
              {firstRow} - {Math.min(page * rowsPerPage, total)} of {total}
            </span>
          </div>
        </Pagination>

        <UploadRentalModal
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUploadRental}
          loading={pageLoading}
        />
      </div>
    </Layout>
  );
};

export default RentalManagement;
