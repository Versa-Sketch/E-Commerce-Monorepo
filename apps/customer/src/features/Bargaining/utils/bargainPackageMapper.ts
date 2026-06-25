import { estimateLinearProbability } from '@monorepo/bargaining';
import type { BargainChatPinnedConfig, BargainMessage as PkgMessage, BargainProduct } from '@monorepo/bargaining';
import type { BargainOffer, BargainSession } from '../types/domain';
import { findLiveOfferForMessage, getCartItem } from './bargainHelpers';

function toProduct(session: BargainSession, offer: BargainOffer): BargainProduct {
  const item = getCartItem(session, offer.cart_item_id);
  return {
    id: offer.cart_item_id,
    name: item?.product_name ?? 'Item',
    listedPrice: Number(offer.original_price),
    imageUrl: item?.product_image,
  };
}

function offerOutcome(offer: BargainOffer): 'accepted' | 'declined' | 'expired' | undefined {
  if (offer.status === 'ACCEPTED') return 'accepted';
  if (offer.status === 'REJECTED') return 'declined';
  if (offer.status === 'EXPIRED') return 'expired';
  return undefined;
}

/**
 * Mirrors BargainChatBubble's exact real-time rules (see findLiveOfferForMessage):
 * an OFFER/COUNTER_OFFER/SYSTEM message whose offer has been superseded falls back
 * to a plain centered line, same as the bubble it replaces.
 */
export function mapSessionToPackageMessages(session: BargainSession, currentUserId: string | undefined): PkgMessage[] {
  return session.messages.map((message): PkgMessage => {
    const isOwn = message.sender_id === currentUserId;
    const timestamp = new Date(message.created_at).getTime();

    if (message.message_type === 'OFFER' || message.message_type === 'COUNTER_OFFER') {
      const liveOffer = findLiveOfferForMessage(session, message.bargain_offer_id);
      if (!liveOffer) {
        return { id: message.message_id, type: 'date', label: message.message, timestamp };
      }
      const product = toProduct(session, liveOffer);
      const price = Number(liveOffer.offered_amount);
      const floor = product.listedPrice * 0.5;
      return {
        id: liveOffer.offer_id,
        type: 'offer',
        sender: isOwn ? 'buyer' : 'seller',
        variant: message.message_type === 'COUNTER_OFFER' ? 'counter' : 'offer',
        product,
        price,
        probability: estimateLinearProbability(price, floor, product.listedPrice),
        resolved: offerOutcome(liveOffer),
        timestamp,
      };
    }

    if (message.message_type === 'SYSTEM') {
      const liveOffer = findLiveOfferForMessage(session, message.bargain_offer_id);
      const outcome = liveOffer ? offerOutcome(liveOffer) : undefined;
      if (outcome) {
        return { id: message.message_id, type: 'resolved', outcome, text: message.message, timestamp };
      }
      return { id: message.message_id, type: 'date', label: message.message, timestamp };
    }

    return {
      id: message.message_id,
      type: 'text',
      sender: isOwn ? 'buyer' : 'seller',
      text: message.message,
      timestamp,
    };
  });
}

/** Surfaces whichever pending offer is most relevant — the focused item if one was deep-linked, else any pending offer. */
export function mapPinnedBargain(session: BargainSession, focusCartItemId?: string): BargainChatPinnedConfig | null {
  const pending = Object.values(session.offers).filter((offer) => offer.status === 'PENDING');
  if (pending.length === 0) return null;

  const offer = (focusCartItemId && pending.find((o) => o.cart_item_id === focusCartItemId)) ?? pending[0];
  const product = toProduct(session, offer);
  const who = offer.offered_by === 'CUSTOMER' ? 'your offer' : "shop's offer";

  return {
    product,
    summary: `${product.name} · ${who} ${formatRupee(Number(offer.offered_amount))}`,
    expiresAt: new Date(session.expires_at).getTime(),
  };
}

function formatRupee(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
