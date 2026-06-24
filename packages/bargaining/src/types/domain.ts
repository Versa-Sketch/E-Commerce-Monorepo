import { BargainRole } from './role';

export type BargainOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'CANCELLED' | 'EXPIRED';
export type BargainSessionStatus = 'ACTIVE' | 'ENDED' | 'EXPIRED';
export type BargainMessageType = 'TEXT' | 'IMAGE' | 'SYSTEM' | 'OFFER' | 'COUNTER_OFFER';
export type BargainMessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface BargainOffer {
  offerId: string;
  cartItemId: string;
  parentId: string | null;
  offeredBy: BargainRole;
  offeredAmount: number;
  originalPrice: number;
  acceptedAmount: number | null;
  status: BargainOfferStatus;
  createdAt: string;
}

export interface BargainMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: BargainMessageType;
  bargainOfferId: string | null;
  createdAt: string;
  status: BargainMessageStatus;
}

export interface BargainCartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  negotiatedPrice: number | null;
  effectivePrice: number;
  isLocked: boolean;
  quantity: number;
  lineTotal: number;
  // Only ever populated/used on the SHOP side — customers never receive
  // this field from the backend. Optional so the same type works for both.
  merchantCost?: number;
}

export interface BargainSession {
  sessionId: string;
  cartId: string;
  status: BargainSessionStatus;
  startedAt: string;
  expiresAt: string | null;
  endedAt: string | null;
  cart: BargainCartItem[];
  messages: BargainMessage[];
  offers: Record<string, BargainOffer>; // keyed by cartItemId
  seenBy: string[];
  // The other party's display name — customer's name when viewing as SHOP,
  // shop's name when viewing as CUSTOMER. Resolved server-side or derived
  // from message history.
  counterpartyName?: string;
  isTyping: boolean;
}
