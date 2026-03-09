// Django's str(datetime) uses a space separator and microseconds, which not every
// browser parses; normalise it to an ISO string first.
export function parseServerTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const iso = value.trim().replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? null : time;
}
