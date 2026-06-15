import { CartItemApi } from '../../../types/shared';

export type BargainSessionStatus = 'ACTIVE' | 'ENDED' | 'EXPIRED';
export type BargainOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'CANCELLED' | 'EXPIRED';
export type BargainOfferedBy = 'CUSTOMER' | 'SHOP';
export type BargainMessageType = 'TEXT' | 'IMAGE' | 'SYSTEM' | 'OFFER' | 'COUNTER_OFFER';
export type BargainOfferAction = 'ACCEPT' | 'REJECT' | 'COUNTER';

export interface BargainOffer {
  offer_id: string;
  cart_item_id: string;
  parent_id: string | null;
  offered_by: BargainOfferedBy;
  offered_amount: string;
  original_price: string;
  accepted_amount: string | null;
  status: BargainOfferStatus;
  created_at: string;
}

export interface BargainMessage {
  message_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  message_type: BargainMessageType;
  bargain_offer_id: string | null;
  created_at: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export interface BargainSession {
  session_id: string;
  cart_id: string;
  status: BargainSessionStatus;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  cart: BargainCartUpdate;
  messages: BargainMessage[];
  offers: Record<string, BargainOffer>;
  seen_by: Record<string, string>;
  delivered_by: Record<string, string>;
}

/** The `cart_updated` broadcast shape — field names differ from CartResponse. */
export interface BargainCartUpdate {
  id: string;
  total_price: string;
  items: CartItemApi[];
}

/** Client -> server WebSocket message types (customer-relevant subset). */
export type BargainClientMessage =
  | { type: 'bargain_offer'; cart_item_id: string; offered_amount: string }
  | { type: 'bargain_response'; offer_id: string; action: BargainOfferAction; counter_amount?: string }
  | { type: 'chat_message'; message: string }
  | { type: 'end_session' }
  | { type: 'mark_seen' }
  | { type: 'typing'; is_typing: boolean };

/** Server -> client WebSocket broadcast/unicast event types. */
export type BargainServerEvent =
  | { type: 'session_started'; payload: BargainSession }
  | { type: 'new_offer'; payload: { offer: BargainOffer } }
  | { type: 'offer_accepted'; payload: { offer: BargainOffer; cart: BargainCartUpdate } }
  | { type: 'offer_rejected'; payload: { offer: BargainOffer } }
  | { type: 'counter_offer'; payload: { offer: BargainOffer } }
  | { type: 'chat_message'; payload: BargainMessage }
  | { type: 'messages_seen'; payload: { user_id: string; seen_at: string } }
  | { type: 'messages_delivered'; payload: { user_id: string; delivered_at: string } }
  | { type: 'typing'; payload: { user_id: string; is_typing: boolean } }
  | { type: 'cart_updated'; payload: BargainCartUpdate }
  | { type: 'session_ended'; payload: { session_id: string; status: BargainSessionStatus; ended_at: string } }
  | { type: 'session_expired'; payload: { session_id: string; status: BargainSessionStatus } }
  | { type: 'error'; payload: { status: number; message: string } };

/** §1.8/§1.9 history timeline — a chronological merge of session lifecycle, chat and offer events. */
export interface BargainSessionStartedEvent {
  type: 'session_started';
  session_id: string;
  created_at: string;
}

export interface BargainSessionClosedEvent {
  type: 'session_ended' | 'session_expired';
  session_id: string;
  status: 'ENDED' | 'EXPIRED';
  created_at: string;
}

export interface BargainChatMessageEvent extends BargainMessage {
  type: 'chat_message';
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface BargainOfferEvent {
  type: 'bargain_offer';
  offer_id: string;
  cart_item_id: string | null;
  parent_id: string | null;
  offered_by: BargainOfferedBy;
  offered_amount: string;
  original_price: string;
  accepted_amount: string | null;
  status: BargainOfferStatus;
  created_at: string;
}

export type BargainTimelineEvent =
  | BargainSessionStartedEvent
  | BargainSessionClosedEvent
  | BargainChatMessageEvent
  | BargainOfferEvent;

export interface BargainSessionHistory {
  session_id: string;
  status: BargainSessionStatus;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  timeline: BargainTimelineEvent[];
}

export interface BargainCartHistory {
  cart_id: string;
  sessions: BargainSessionHistory[];
}
