import type {
  BargainMessage as PkgBargainMessage,
  BargainProduct,
  BargainOfferActions,
  BargainChatPinnedConfig,
  BargainOutcome,
  OfferMessage,
} from '@monorepo/bargaining';
import type { BargainMessage } from '../Models/Bargain';
import type { BargainSession, BargainOffer } from '../Models/BargainSession';
import type { Bargain } from '../Models/Bargain';

function parseDateLabel(isoString: string): string {
  const date = new Date(isoString.replace(/\.(\d{3})\d+/, '.$1'));
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

function resolveOutcome(status: string | undefined, messageText: string): BargainOutcome {
  if (status === 'ACCEPTED' || /accept/i.test(messageText)) return 'accepted';
  if (status === 'REJECTED' || /reject|decline/i.test(messageText)) return 'declined';
  return 'expired';
}

export function mapSessionToPackageMessages(
  timeline: BargainMessage[],
  session: BargainSession,
  bargain: Bargain,
  isTyping: boolean,
): PkgBargainMessage[] {
  const result: PkgBargainMessage[] = [];
  let lastDayLabel = '';

  const offersByOfferId: Record<string, BargainOffer> = {};
  Object.values(session.offers).forEach((o) => {
    offersByOfferId[o.offerId] = o;
  });

  for (const msg of timeline) {
    const ts = new Date(msg.createdAt.replace(/\.(\d{3})\d+/, '.$1')).getTime();
    const dayLabel = parseDateLabel(msg.createdAt);

    if (dayLabel !== lastDayLabel) {
      lastDayLabel = dayLabel;
      result.push({ type: 'date', id: `date-${msg.id}`, timestamp: ts, label: dayLabel });
    }

    const sender = msg.sender === 'merchant' ? 'seller' : 'buyer';

    if (msg.messageType === 'TEXT' || msg.messageType === 'IMAGE') {
      result.push({ type: 'text', id: msg.id, timestamp: ts, sender, text: msg.message });
      continue;
    }

    if (msg.messageType === 'SYSTEM') {
      result.push({
        type: 'resolved',
        id: msg.id,
        timestamp: ts,
        outcome: resolveOutcome(undefined, msg.message),
        text: msg.message,
      });
      continue;
    }

    if (msg.messageType === 'OFFER' || msg.messageType === 'COUNTER_OFFER') {
      const liveOffer = msg.bargainOfferId ? offersByOfferId[msg.bargainOfferId] : undefined;
      const cartItem = liveOffer
        ? session.cart.find((i) => i.cartItemId === liveOffer.cartItemId)
        : session.cart.find((i) => i.cartItemId === bargain.cartItemId);

      const price = liveOffer?.offeredAmount ?? bargain.customerOffer;
      const listedPrice = liveOffer?.originalPrice ?? bargain.originalPrice;

      const product: BargainProduct = {
        id: cartItem?.cartItemId ?? bargain.cartItemId,
        name: cartItem?.productName ?? bargain.productName,
        listedPrice,
        imageUrl: cartItem?.productImage || bargain.productImage || undefined,
      };

      let resolved: BargainOutcome | undefined;
      if (liveOffer && liveOffer.status !== 'PENDING' && liveOffer.status !== 'COUNTERED') {
        resolved = liveOffer.status === 'ACCEPTED' ? 'accepted' : liveOffer.status === 'REJECTED' ? 'declined' : 'expired';
      }

      const offerMsg: OfferMessage = {
        type: 'offer',
        id: msg.id,
        timestamp: ts,
        sender: msg.messageType === 'OFFER' ? 'buyer' : sender,
        variant: msg.messageType === 'OFFER' ? 'offer' : 'counter',
        product,
        price,
        probability: bargain.dealProbability,
        resolved,
      };
      result.push(offerMsg);
      continue;
    }
  }

  if (isTyping) {
    result.push({
      type: 'typing',
      id: 'typing-indicator',
      timestamp: Date.now(),
      name: bargain.customerName,
    });
  }

  return result;
}

export function mapPinnedConfig(session: BargainSession, bargain: Bargain): BargainChatPinnedConfig | null {
  if (session.status === 'ENDED' || session.status === 'EXPIRED') return null;

  const cartItem = session.cart.find((i) => i.cartItemId === bargain.cartItemId);
  const product: BargainProduct = {
    id: cartItem?.cartItemId ?? bargain.cartItemId,
    name: cartItem?.productName ?? bargain.productName,
    listedPrice: cartItem?.originalPrice ?? bargain.originalPrice,
    imageUrl: cartItem?.productImage || bargain.productImage || undefined,
  };

  return {
    product,
    summary: `₹${bargain.originalPrice} listed · offer ₹${bargain.customerOffer}`,
    expiresAt: session.expiresAt ? new Date(session.expiresAt).getTime() : undefined,
  };
}

export function getActionsForOffer(
  message: OfferMessage,
  session: BargainSession,
  sessionActive: boolean,
  onAccept: (offerId: string) => void,
  onCounter: (offerId: string, currentPrice: number, customerOffer: number) => void,
  onDecline: (offerId: string) => void,
): BargainOfferActions | undefined {
  if (!sessionActive) return undefined;
  if (message.sender !== 'buyer') return undefined;

  const liveOffer = Object.values(session.offers).find((o) => o.offerId === message.id);
  if (!liveOffer) return undefined;
  if (liveOffer.status !== 'PENDING' && liveOffer.status !== 'COUNTERED') return undefined;
  if (liveOffer.offeredBy !== 'CUSTOMER') return undefined;

  return {
    onAccept: () => onAccept(liveOffer.offerId),
    onCounter: () => onCounter(liveOffer.offerId, liveOffer.originalPrice, liveOffer.offeredAmount),
    onDecline: () => onDecline(liveOffer.offerId),
  };
}
