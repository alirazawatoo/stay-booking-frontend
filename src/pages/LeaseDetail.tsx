import { useEffect, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetLeaseByIdQuery,
  useGetDocumentNamesByLeaseIdQuery,
  useReviseLeaseMutation,
  useReviewDocumentsMutation,
} from '../services/api';
import UploadRevisionLeaseModal from '../components/UploadRevisionLeaseModal';
import Layout from '../components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageMessage from '@/components/PageMessage';
import StatusBadge from '@/components/StatusBadge';
import { toggleRefreshDocuments } from '../store/slices/authSlice';
import { formatLocalDate, parseServerTimestamp } from '@/utils/dates';
import { formatAddress } from '@/utils/format';
import type { RootState } from '@/store';
import type { Document, Lease } from '@/types/leaseTypes';

const HEADERS = ['#', 'Date', 'Document Name', 'Status', 'View Document', 'View Notes'];
const CELL = 'whitespace-nowrap px-4 py-3 text-sm md:px-6 md:text-base';

function formatUploadDate(value: string): string {
  const time = parseServerTimestamp(value);
  return time === null ? 'Unknown date' : formatLocalDate(new Date(time));
}

const LeaseDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetLeaseByIdQuery(id);
  const lease = data as Lease | undefined;
  const {
    data: documents,
    refetch: refetchDocuments,
    isFetching: isDocumentsFetching,
  } = useGetDocumentNamesByLeaseIdQuery(id, { skip: !id });
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [reviseLease] = useReviseLeaseMutation();
  const [reviewDocuments] = useReviewDocumentsMutation();
  const refreshToggle = useSelector((state: RootState) => state.auth.refreshDocuments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) refetchDocuments();
  }, [id, refetchDocuments, refreshToggle]);

  const handleUploadRevision = async (leaseId: number, formData: FormData) => {
    const { document_ids: documentIds } = await reviseLease({ id: leaseId, revisedData: formData }).unwrap();
    setUploadModalOpen(false);
    refetch();
    refetchDocuments();

    if (documentIds?.length > 0) {
      try {
        await reviewDocuments({ documentIds }).unwrap();
        dispatch(toggleRefreshDocuments());
      } catch {
        toast.error('The revision was saved, but it could not be sent for review.');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PageMessage kind="loading">Loading lease…</PageMessage>
      </Layout>
    );
  }

  if (isError || !lease) {
    return (
      <Layout>
        <PageMessage kind="error">Error loading lease details.</PageMessage>
      </Layout>
    );
  }

  // The endpoint answers {"detail": ...} instead of a list when a lease has no documents.
  const documentList: Document[] = Array.isArray(documents) ? documents : [];

  return (
    <Layout>
      <div className="mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-semibold text-pine-900">Lease Detail</h1>
            <Breadcrumbs items={[{ label: 'Your Leases', to: '/leases' }, { label: 'Lease Detail' }]} />
          </div>
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center space-x-2 rounded bg-pine-700 px-4 py-3 text-white hover:bg-pine-800"
          >
            <ArrowUpTrayIcon className="h-5 w-5" aria-hidden="true" />
            <span>Upload Revision</span>
          </button>
        </div>

        <p className="mt-5 text-left text-lg font-medium text-black">{formatAddress(lease.address1, lease.address2)}</p>

        {isDocumentsFetching ? (
          <PageMessage kind="loading">Loading documents…</PageMessage>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="mt-4 w-full table-auto divide-y divide-stone-200">
              <thead className="bg-stone-200">
                <tr>
                  {HEADERS.map((header) => (
                    <th key={header} scope="col" className="px-4 py-3 text-center text-sm font-bold uppercase text-stone-700 md:px-6">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documentList.length === 0 ? (
                  <tr>
                    <td colSpan={HEADERS.length} className="px-4 py-4 text-center text-stone-500">
                      No documents uploaded for this lease yet.
                    </td>
                  </tr>
                ) : (
                  documentList.map((doc, index) => (
                    <tr key={doc.id} className="border-b border-stone-200 hover:bg-stone-50">
                      <td className={CELL}>{index + 1}</td>
                      <td className={CELL}>{formatUploadDate(doc.uploaded_at)}</td>
                      <td className={`${CELL} truncate`} title={doc.name}>
                        {doc.name}
                      </td>
                      <td className={CELL}>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className={CELL}>
                        <Link to={`/preview/${doc.id}`} className="text-pine-700 hover:underline">
                          View Document
                        </Link>
                      </td>
                      <td className={CELL}>
                        <Link to={`/lease/${lease.id}/documents/${doc.id}/notes`} className="text-pine-700 hover:underline">
                          View Notes
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <UploadRevisionLeaseModal
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          leaseData={lease}
          onUpdateRevision={handleUploadRevision}
        />
      </div>
    </Layout>
  );
};

export default LeaseDetail;
