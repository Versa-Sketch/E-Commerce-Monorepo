export function formatCurrency(amount: number, decimals = 0): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
/**
 * Format an ISO date string to a human-readable short date.
 * Example: '2026-06-01T12:00:00Z' → '01 Jun 2026'
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
/**
 * Convert an OrderStatus SCREAMING_SNAKE_CASE string to Title Case label.
 * Example: 'OUT_FOR_DELIVERY' → 'Out For Delivery'
 */
export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
