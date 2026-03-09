import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { Lease } from '../types/leaseTypes';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import FileDropzone from './FileDropzone';

interface UploadLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (leaseData: FormData) => Promise<void>;
  onUpdate: (leaseData: Lease) => Promise<void>;
  leaseData?: Lease | null;
  isEditMode?: boolean;
}

const ADDRESS_FIELDS = [
  { key: 'address1', label: 'Address 1' },
  { key: 'address2', label: 'Address 2 (optional)' },
  { key: 'state', label: 'State' },
  { key: 'city', label: 'City' },
  { key: 'zip_code', label: 'Zip code' },
] as const;

type AddressKey = (typeof ADDRESS_FIELDS)[number]['key'];
type Address = Record<AddressKey, string>;

const EMPTY_ADDRESS: Address = { address1: '', address2: '', state: '', city: '', zip_code: '' };

const UploadLeaseModal: React.FC<UploadLeaseModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onUpdate,
  leaseData,
  isEditMode = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFiles([]);
    setAddress(
      leaseData
        ? {
            address1: leaseData.address1,
            address2: leaseData.address2 || '',
            state: leaseData.state,
            city: leaseData.city,
            zip_code: leaseData.zip_code,
          }
        : EMPTY_ADDRESS,
    );
  }, [leaseData]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((previous) => [...previous, ...acceptedFiles]);
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 20,
    disabled: isEditMode,
  });

  const handleSubmit = async () => {
    if (!address.address1 || !address.city || !address.state || !address.zip_code) {
      toast.warn('Please fill out all mandatory fields (Address 1, City, State, Zip Code).');
      return;
    }
    if (!isEditMode && files.length === 0) {
      toast.warn('Please select at least one file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      if (isEditMode && leaseData) {
        await onUpdate({ ...leaseData, ...address });
        toast.success('Lease updated successfully!');
      } else if (onUpload) {
        const formData = new FormData();
        files.forEach((file) => formData.append('documents', file));
        Object.entries(address).forEach(([key, value]) => formData.append(key, value));
        await onUpload(formData);
        toast.success('Lease uploaded successfully!');
      }
      onClose();
    } catch {
      toast.error(isEditMode ? 'Failed to update the lease.' : 'Failed to upload the lease.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Lease Record' : 'Create New Lease Record'}>
      <div className="flex flex-col space-y-3">
        {ADDRESS_FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col text-sm font-medium text-stone-700">
            {label}
            <input
              type="text"
              value={address[key]}
              onChange={(event) => setAddress((previous) => ({ ...previous, [key]: event.target.value }))}
              className="mt-1 rounded-lg border border-stone-300 p-2 font-normal focus:outline-none focus:ring-2 focus:ring-pine-300"
            />
          </label>
        ))}
      </div>

      {!isEditMode && <FileDropzone dropzone={dropzone} inputId="lease-upload" fileCount={files.length} hint="PDF files only" />}

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-pine-700 px-4 py-3 text-white hover:bg-pine-800 disabled:opacity-60"
          disabled={isUploading}
        >
          {isUploading ? 'Saving…' : isEditMode ? 'Save Changes' : 'Analyze Lease'}
        </button>
        <button type="button" onClick={onClose} className="rounded-lg bg-stone-500 px-4 py-2 text-white hover:bg-stone-600">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default UploadLeaseModal;
