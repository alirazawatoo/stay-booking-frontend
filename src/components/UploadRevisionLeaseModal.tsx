import React, { useState, useCallback } from 'react';
import { Lease } from '../types/leaseTypes';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import Modal from './Modal';
import FileDropzone from './FileDropzone';

interface UploadRevisionLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseData: Lease | null;
  onUpdateRevision: (leaseId: number, revisedData: FormData) => Promise<void>;
}

const UploadRevisionLeaseModal: React.FC<UploadRevisionLeaseModalProps> = ({ isOpen, onClose, leaseData, onUpdateRevision }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((previous) => [...previous, ...acceptedFiles]);
  }, []);

  const dropzone = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 20 });

  const handleUpload = async () => {
    if (!leaseData) return;
    if (files.length === 0) {
      toast.warn('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('documents', file));
      await onUpdateRevision(leaseData.id, formData);
      toast.success('Lease revision uploaded successfully!');
      setFiles([]);
      onClose();
    } catch {
      toast.error('Failed to upload revision.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen && Boolean(leaseData)} onClose={onClose} title="Upload Lease Revision">
      <p className="mb-4">
        Uploading lease revision for: {leaseData?.address1}, {leaseData?.city}
      </p>
      <FileDropzone dropzone={dropzone} inputId="revision-upload" fileCount={files.length} hint="PDF files only" />

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={handleUpload}
          className="rounded-lg bg-pine-700 px-4 py-3 text-white hover:bg-pine-800 disabled:opacity-60"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading…' : 'Upload Revision'}
        </button>
        <button type="button" onClick={onClose} className="rounded-lg bg-stone-500 px-4 py-2 text-white hover:bg-stone-600">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default UploadRevisionLeaseModal;
