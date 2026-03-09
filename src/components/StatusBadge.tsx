import React from 'react';

type Tone = 'positive' | 'caution' | 'negative' | 'neutral';

const TONE_BY_STATUS: Record<string, Tone> = {
  Approved: 'positive',
  'STR Allowed': 'positive',
  Draft: 'caution',
  Pending: 'caution',
  'STR Allowed with Restrictions': 'caution',
  'STR Pending Approval': 'caution',
  Rejected: 'negative',
  Error: 'negative',
  'STR Not Allowed': 'negative',
};

const TONE_CLASSES: Record<Tone, string> = {
  positive: 'bg-green-100 text-green-900',
  caution: 'bg-yellow-100 text-yellow-900',
  negative: 'bg-red-100 text-red-900',
  neutral: 'bg-stone-200 text-stone-800',
};

const StatusBadge: React.FC<{ status?: string | null; fallback?: string }> = ({ status, fallback = 'Unknown' }) => {
  const tone = (status && TONE_BY_STATUS[status]) || 'neutral';
  return (
    <span className={`inline-block whitespace-nowrap rounded px-2 py-1 text-sm ${TONE_CLASSES[tone]}`}>
      {status || fallback}
    </span>
  );
};

export default StatusBadge;
