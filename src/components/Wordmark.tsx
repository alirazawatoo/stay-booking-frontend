import React from 'react';

const Wordmark: React.FC<{ tone?: 'light' | 'dark' }> = ({ tone = 'light' }) => (
  <span className={`flex items-center gap-2 ${tone === 'light' ? 'text-white' : 'text-pine-900'}`}>
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill={tone === 'light' ? '#0b1f18' : '#163f30'} />
      <path d="M7 16 16 8l9 8v9H7z" fill="none" stroke="#e3c27a" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M13 25v-6h6v6" fill="none" stroke="#f6ecd4" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
    <span className="flex flex-col font-display text-xl font-semibold leading-tight">
      Property Stay
      <span className={`mt-0.5 block text-[0.65rem] leading-none font-sans font-medium uppercase tracking-[0.2em] ${tone === 'light' ? 'text-brass-300' : 'text-brass-700'}`}>
        Research workspace
      </span>
    </span>
  </span>
);

export default Wordmark;
