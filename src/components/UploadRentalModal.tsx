import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { REQUIRED_COLUMNS, VALID_FILE_EXTENSIONS } from '../types/rentalTypes';
import FileDropzone from './FileDropzone';

interface UploadRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
  loading: boolean;
}

const UploadRentalModal: React.FC<UploadRentalModalProps> = ({ isOpen, onClose, onUpload, loading }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    }
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warn('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      await onUpload(formData);
      toast.success('Rental data file uploaded. Processing started.');
      setFiles([]);
      onClose();
    } catch {
      toast.error('Failed to upload rental data file.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Deals">
      <FileDropzone
        dropzone={dropzone}
        inputId="rental-upload"
        fileCount={files.length}
        hint={`Accepted file types: ${VALID_FILE_EXTENSIONS.join(', ')}. Required columns: ${REQUIRED_COLUMNS.join(', ')}.`}
      />

      {loading && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-label="Uploading">
          <div className="h-full w-full animate-pulse bg-pine-700" />
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={handleUpload}
          className="rounded-lg bg-pine-700 px-4 py-3 text-white hover:bg-pine-800 disabled:opacity-60"
          disabled={loading}
        >
          Upload
        </button>
        <button type="button" onClick={onClose} className="rounded-lg bg-stone-500 px-4 py-2 text-white hover:bg-stone-600">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default UploadRentalModal;
