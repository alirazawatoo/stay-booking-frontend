import React from 'react';

interface PageMessageProps {
  kind: 'loading' | 'error' | 'empty';
  children: React.ReactNode;
}

// One place for the loading, error and empty states every workspace page needs.
const PageMessage: React.FC<PageMessageProps> = ({ kind, children }) => (
  <p
    role={kind === 'error' ? 'alert' : 'status'}
    className={`p-8 text-center text-lg ${kind === 'error' ? 'text-red-700' : 'text-gray-600'}`}
  >
    {children}
  </p>
);

export default PageMessage;
