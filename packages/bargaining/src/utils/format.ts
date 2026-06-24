import { BargainMessage, BargainMessageStatus } from '../types/domain';

export function formatAmount(amount: number, currency = '₹'): string {
  return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// A message's tick status is just its own `status` field, but the moment a
// peer's "seen" event lands, every earlier message from the current user
// should retroactively show as READ — this resolves that for one message.
export function resolveTickStatus(message: BargainMessage, peerHasSeen: boolean): BargainMessageStatus {
  if (peerHasSeen && message.status !== 'READ') return 'READ';
  return message.status;
}
