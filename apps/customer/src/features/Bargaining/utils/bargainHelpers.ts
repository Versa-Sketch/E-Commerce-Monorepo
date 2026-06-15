import { CartItemApi } from '../../../types/shared';
import { BargainMessage, BargainOffer, BargainSession } from '../types/domain';

export const getCartItem = (session: BargainSession | null, cartItemId: string): CartItemApi | undefined => {
  return session?.cart.items.find((item) => item.cart_item_id === cartItemId);
};

/**
 * Returns the offer if it is still the latest one tracked for its cart item — i.e. it can be
 * acted upon or its status reflects the current negotiation state. Older, superseded offers
 * (replaced by a newer counter) return undefined.
 */
export const findLiveOfferForMessage = (
  session: BargainSession | null,
  bargainOfferId: string | null
): BargainOffer | undefined => {
  if (!session || !bargainOfferId) return undefined;
  return Object.values(session.offers).find((offer) => offer.offer_id === bargainOfferId);
};

export const formatAmount = (amount: string | number): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return `₹${amount}`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}`;
};

/**
 * Tick status for an own outgoing message, derived from the other party's
 * latest `seen_by`/`delivered_by` timestamps (2-participant chat, so any
 * timestamp at/after the message's created_at means they've seen/received it).
 */
export const getMessageTickStatus = (
  session: BargainSession | null,
  message: BargainMessage
): 'SENT' | 'DELIVERED' | 'READ' => {
  if (!session) return message.status ?? 'SENT';
  const createdAt = new Date(message.created_at).getTime();
  const seenAt = Object.values(session.seen_by ?? {}).map((t) => new Date(t).getTime());
  const deliveredAt = Object.values(session.delivered_by ?? {}).map((t) => new Date(t).getTime());
  if (seenAt.some((t) => t >= createdAt)) return 'READ';
  if (deliveredAt.some((t) => t >= createdAt)) return 'DELIVERED';
  return message.status ?? 'SENT';
};

export const discountPercent = (offeredAmount: string, originalPrice: string): number => {
  const offered = parseFloat(offeredAmount);
  const original = parseFloat(originalPrice);
  if (!original || Number.isNaN(offered) || Number.isNaN(original)) return 0;
  return Math.round((1 - offered / original) * 100);
};
