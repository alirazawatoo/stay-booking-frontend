export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return `$${value.toLocaleString('en-US')}`;
}

export function formatCount(value: number | null | undefined): string {
  return value === null || value === undefined ? 'N/A' : String(value);
}

export function formatAddress(address1: string, address2?: string | null): string {
  return address2 ? `${address1}, ${address2}` : address1;
}
