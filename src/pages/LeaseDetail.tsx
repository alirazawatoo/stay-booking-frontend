import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLeaseByIdQuery, useGetDocumentNamesByLeaseIdQuery, useReviseLeaseMutation, useReviewDocumentsMutation } from '../services/api';
import UploadRevisionLeaseModal from '../components/UploadRevisionLeaseModal';
import Layout from '../components/Layout';
import { Document } from '@/types/leaseTypes';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { toggleRefreshDocuments } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import LeaseBreadcrumb from '@/components/LeaseBreadcrumb';
import UploadIcon from '@/assets/images/UploadIcon.png';

const formatDate = (dateString: string) => {
  // If the dateString is null or undefined, return "Invalid Date"
  if (!dateString) return "Invalid Date";

  // Try to create a date object
  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid date gracefully
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const LeaseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: lease, isLoading, isError, refetch } = useGetLeaseByIdQuery(id);
  const { data: documents, refetch: refetchDocuments,isFetching: isDocumentsFetching,} = useGetDocumentNamesByLeaseIdQuery(id, { skip: !id });
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [reviseLease] = useReviseLeaseMutation();
  // Initialize the reviewDocuments mutation
  const [reviewDocuments] = useReviewDocumentsMutation();
  const toggle = useSelector((state: RootState) => state.auth.refreshDocuments);
  const dispatch = useDispatch()
  // Fetch documents only when necessary
  useEffect(() => {
    if (id) refetchDocuments();
  }, [id, refetchDocuments, toggle]);

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
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-lg text-gray-700">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  if (isError || !lease) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-lg text-red-500">Error loading lease details</div>
        </div>
      </Layout>
    );
  }

  // Concatenate address1 and address2, handling null or empty case for address2
  const fullAddress = lease.address1 + (lease.address2 ? `, ${lease.address2}` : '');

  return (
    <Layout>
      <div className="p-4 flex-1 bg-white w-full mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4 space-y-2 md:space-y-0 mt-7">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-bold">Lease Detail</h2>
            {/* Added spacing between the heading and breadcrumb */}
            <div>
              <LeaseBreadcrumb />
            </div>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 flex items-center space-x-2"
          >
            <img src={UploadIcon} alt="Upload Revision Icon" className='w-5 h-5'/>
            <span>Upload Revision</span>
          </button>
        </div>
        
        {/* Displaying full address below the lease detail */}
        <div className="mt-5">
          <p className="text-black text-left font-medium text-lg">{fullAddress}</p>
        </div>
      {isDocumentsFetching ? (
          <div>Loading documents...</div>
        ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full table-auto divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-200 text-sm md:text-base">
              <tr>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">#</th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">Date</th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">Document Name</th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">Status</th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">View Document</th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base font-bold uppercase text-gray-700">View Notes</th>
              </tr>
            </thead>
            <tbody>
              {documents?.map((doc : Document, index : number) => (
                  <tr key={`${doc.id}-${index}`} className="hover:bg-gray-50 cursor-pointer border-b border-gray-200">
                    <td className="px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap">{formatDate(doc.uploaded_at)}</td>
                    <td className="px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap truncate" title={doc.name}>{doc.name}</td>
                    <td className="px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap">
                      <span
                        title={doc.status}
                        className={`px-2 py-1 rounded ${
                          doc.status === "Draft" ? "bg-yellow-300 text-yellow-800" 
                          : doc.status === "Rejected" ? "bg-red-300 text-red-800" 
                          : doc.status === "Approved" ? "bg-green-300 text-green-800" 
                          : "bg-gray-300 text-gray-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap">
                      <button onClick={() => {
                          // console.log("Button clicked, navigating to preview");
                          navigate(`/preview/${doc.id}`);
                          }} className="text-red-500 hover:underline">
                          View Document
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-2 text-sm md:text-base whitespace-nowrap">
                      <button onClick={() => navigate(`/lease/${lease.id}/documents/${doc.id}/notes`)} className="text-red-500 hover:underline">
                        View Notes
                      </button>
                    </td>
                  </tr>
                ))}
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
