import { BargainOfferStatus } from '../types/domain';

export type DealHealth = 'Hot' | 'Warm' | 'Cool';

// How much discount is being asked for, relative to the current/list price.
export function discountPercent(currentPrice: number, offeredAmount: number): number {
  if (currentPrice <= 0) return 0;
  return Math.max(0, Math.round((1 - offeredAmount / currentPrice) * 100));
}

// ₹ distance between the current asking price and the offer on the table.
export function gap(currentPrice: number, offeredAmount: number): number {
  return Math.max(0, currentPrice - offeredAmount);
}

// Heuristic 0-100 likelihood this deal closes — driven by how aggressive the
// discount ask is, how many rounds of back-and-forth there have been, and
// (SHOP role only) whether the offer already clears cost.
export function dealProbability(params: {
  status: BargainOfferStatus;
  currentPrice: number;
  offeredAmount: number;
  roundsSoFar: number;
  merchantCost?: number;
}): number {
  const { status, currentPrice, offeredAmount, roundsSoFar, merchantCost } = params;
  if (status === 'ACCEPTED') return 100;
  if (status === 'REJECTED' || status === 'EXPIRED' || status === 'CANCELLED') return 0;

  let score = 100 - discountPercent(currentPrice, offeredAmount) * 1.8;
  score += roundsSoFar * 4;
  if (merchantCost && merchantCost > 0 && offeredAmount >= merchantCost) score += 8;

  return Math.max(4, Math.min(96, Math.round(score)));
}

export function dealHealth(probability: number): DealHealth {
  if (probability >= 70) return 'Hot';
  if (probability >= 40) return 'Warm';
  return 'Cool';
}

// Seconds remaining until a session/offer expires (negative once past).
export function secondsRemaining(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function isExpiringSoon(status: BargainOfferStatus, secondsLeft: number): boolean {
  return status === 'PENDING' && secondsLeft > 0 && secondsLeft <= 120;
}
