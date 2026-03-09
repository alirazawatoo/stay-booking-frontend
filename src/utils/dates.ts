// Django's str(datetime) uses a space separator and microseconds, which not every
// browser parses; normalise it to an ISO string first.
export function parseServerTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const iso = value.trim().replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? null : time;
}

// The search endpoints filter on calendar dates (YYYY-MM-DD). toISOString() would
// convert to UTC first and shift the day for anyone not on UTC.
export function formatLocalDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
