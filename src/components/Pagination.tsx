import React from 'react';

interface PaginationProps {
  page: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({ page, hasNext, onPageChange, disabled = false, children }) => (
  <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
    <button
      type="button"
      onClick={() => onPageChange(page - 1)}
      disabled={disabled || page <= 1}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
    >
      Previous
    </button>
    {children ?? <span>Page {page}</span>}
    <button
      type="button"
      onClick={() => onPageChange(page + 1)}
      disabled={disabled || !hasNext}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
    >
      Next
    </button>
  </nav>
);

export default Pagination;
