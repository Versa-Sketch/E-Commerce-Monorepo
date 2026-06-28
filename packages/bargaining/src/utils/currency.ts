/**
 * Manual thousands-grouping so formatting doesn't depend on Hermes' Intl/locale
 * data being present on every device.
 */
export function formatCurrency(amount: number, currencySymbol = '₹'): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}` : lastThree;
  return `${sign}${currencySymbol}${grouped}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
