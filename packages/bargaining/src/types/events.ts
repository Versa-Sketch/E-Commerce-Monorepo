import { BargainRole } from './role';

// ── Server → client events ───────────────────────────────────────────────────
export type BargainServerEvent =
  | { type: 'session_started'; session: Record<string, unknown> }
  | { type: 'new_offer'; cart_item_id: string; offer: Record<string, unknown> }
  | { type: 'counter_offer'; cart_item_id: string; offer: Record<string, unknown> }
  | { type: 'offer_accepted'; cart_item_id: string; offer: Record<string, unknown> }
  | { type: 'offer_rejected'; cart_item_id: string; offer: Record<string, unknown> }
  | { type: 'chat_message'; message: Record<string, unknown> }
  | { type: 'cart_updated'; cart: Record<string, unknown> }
  | { type: 'session_ended' }
  | { type: 'session_expired' }
  | { type: 'typing'; user_id: string; is_typing: boolean }
  | { type: 'messages_seen'; user_id: string }
  | { type: 'messages_delivered'; user_id: string }
  | { type: 'error'; message: string };

// ── Client → server messages ─────────────────────────────────────────────────
export type BargainClientMessage =
  | { type: 'bargain_offer'; session_id: string; cart_item_id: string; offered_amount: number; offered_by: BargainRole }
  | { type: 'bargain_response'; session_id: string; offer_id: string; action: 'ACCEPT' | 'REJECT' | 'COUNTER'; counter_amount?: number }
  | { type: 'chat_message'; session_id: string; message: string }
  | { type: 'typing'; session_id: string; is_typing: boolean }
  | { type: 'mark_seen'; session_id: string }
  | { type: 'end_session'; session_id: string };
