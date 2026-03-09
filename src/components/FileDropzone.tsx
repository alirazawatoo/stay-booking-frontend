import React from 'react';
import type { DropzoneState } from 'react-dropzone';

interface FileDropzoneProps {
  dropzone: DropzoneState;
  inputId: string;
  fileCount: number;
  hint: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ dropzone, inputId, fileCount, hint }) => {
  const { getRootProps, getInputProps, isDragActive } = dropzone;
  return (
    <div
      {...getRootProps()}
      className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center ${
        isDragActive ? 'border-pine-600 bg-pine-50' : 'border-stone-300 hover:border-pine-600'
      }`}
    >
      <input {...getInputProps()} id={inputId} aria-label="Choose files" />
      <svg className="mx-auto mb-4 h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-stone-600">
        {isDragActive ? 'Drop files here' : fileCount > 0 ? `${fileCount} file(s) selected` : 'Drop or select files here'}
      </p>
      <p className="mt-2 text-xs text-stone-500">{hint}</p>
    </div>
  );
};

export default FileDropzone;
