export const RATE = 1420;
export const BUY_RATE = 1400;

export function money(n) {
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(n || 0);
}