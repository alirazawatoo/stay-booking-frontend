import React from 'react';
import { useParams } from 'react-router-dom';
import { usePreviewDocumentQuery } from '../services/api';

// A page served over HTTPS cannot frame an http:// file, so upgrade the scheme
// there; local development keeps the URL the API returned.
function frameableUrl(fileUrl: string): string {
  return window.location.protocol === 'https:' ? fileUrl.replace(/^http:\/\//, 'https://') : fileUrl;
}

const DocumentPreview: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { data, isLoading, isError } = usePreviewDocumentQuery(
    { documentId: Number(documentId) },
    { skip: !documentId },
  );

  if (isLoading) {
    return <p role="status" className="p-8 text-stone-600">Loading document…</p>;
  }

  if (isError || !data?.file_url) {
    return <p role="alert" className="p-8 text-red-700">This document could not be loaded.</p>;
  }

  return (
    <div className="w-full px-4">
      <iframe
        src={frameableUrl(data.file_url)}
        className="h-[calc(100vh-100px)] w-full border-0"
        title="Document preview"
      />
    </div>
  );
};

export default DocumentPreview;
