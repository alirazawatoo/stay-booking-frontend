import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetLeaseByIdQuery, useReviseLeaseMutation, useReviewDocumentsMutation } from '../services/api';
import UploadRevisionLeaseModal from '../components/UploadRevisionLeaseModal';
import Layout from '../components/Layout';
import ChatBox from '../components/ChatBox';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageMessage from '@/components/PageMessage';
import StatusBadge from '@/components/StatusBadge';
import { toggleRefreshDocuments } from '../store/slices/authSlice';
import { formatAddress } from '@/utils/format';
import type { RootState } from '@/store';
import type { Lease } from '@/types/leaseTypes';
import UploadIcon from '@/assets/images/UploadIcon.png';

const ViewNotes = () => {
  const { id, documentId } = useParams<{ id: string; documentId: string }>();
  const dispatch = useDispatch();
  const refreshToggle = useSelector((state: RootState) => state.auth.refreshDocuments);

  const { data, isLoading, isError, refetch: refetchLease } = useGetLeaseByIdQuery(id);
  const lease = data as Lease | undefined;
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [reviseLease] = useReviseLeaseMutation();
  const [reviewDocuments] = useReviewDocumentsMutation();

  // The lease carries each document's review status, which changes when analysis finishes.
  useEffect(() => {
    if (refreshToggle) refetchLease();
  }, [refreshToggle, refetchLease]);

  const handleUploadRevision = async (leaseId: number, formData: FormData) => {
    const { document_ids: documentIds } = await reviseLease({ id: leaseId, revisedData: formData }).unwrap();
    setUploadModalOpen(false);
    refetchLease();

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
        <PageMessage kind="loading">Loading document…</PageMessage>
      </Layout>
    );
  }

  if (isError || !lease) {
    return (
      <Layout>
        <PageMessage kind="error">Error loading document details.</PageMessage>
      </Layout>
    );
  }

  const fullAddress = formatAddress(lease.address1, lease.address2);
  const currentDocument = lease.documents?.find((doc) => doc.id === Number(documentId));

  return (
    <Layout>
      <div className="mx-auto w-full flex-1 bg-white p-4">
        <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center md:items-start lg:pl-7">
            <h1 className="text-xl font-bold">Document Detail</h1>
            <Breadcrumbs
              items={[
                { label: 'Your Leases', to: '/leases' },
                { label: fullAddress, to: `/lease/${lease.id}` },
                { label: 'Document Notes' },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center space-x-2 rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600 lg:mr-7"
          >
            <img src={UploadIcon} alt="" className="h-5 w-5" />
            <span>Upload Revision</span>
          </button>
        </div>

        <div className="mt-4 space-y-2 pl-7 text-left text-lg font-medium text-black">
          <p>{fullAddress}</p>
          <p>Current Document: {currentDocument?.name ?? 'Unknown document'}</p>
          <p>
            Status: <StatusBadge status={currentDocument?.status} fallback="No status available" />
          </p>
        </div>

        <UploadRevisionLeaseModal
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          leaseData={lease}
          onUpdateRevision={handleUploadRevision}
        />
      </div>

      <div className="mt-6 w-full">
        <ChatBox documentId={documentId} />
      </div>
    </Layout>
  );
};

export default ViewNotes;
