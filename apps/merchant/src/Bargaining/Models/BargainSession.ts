import { makeAutoObservable } from 'mobx';

export type BargainOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'CANCELLED' | 'EXPIRED';
export type BargainOfferedBy = 'CUSTOMER' | 'SHOP';
export type BargainChatMessageType = 'TEXT' | 'IMAGE' | 'SYSTEM' | 'OFFER' | 'COUNTER_OFFER';
export type BargainChatMessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export class BargainOffer {
  offerId: string;
  cartItemId: string;
  parentId: string | null;
  offeredBy: BargainOfferedBy;
  offeredAmount: number;
  originalPrice: number;
  acceptedAmount: number | null;
  status: BargainOfferStatus;
  createdAt: string;

  constructor(data: Record<string, any>) {
    this.offerId = data.offer_id;
    this.cartItemId = data.cart_item_id;
    this.parentId = data.parent_id ?? null;
    this.offeredBy = data.offered_by;
    this.offeredAmount = Number(data.offered_amount);
    this.originalPrice = Number(data.original_price);
    this.acceptedAmount = data.accepted_amount != null ? Number(data.accepted_amount) : null;
    this.status = data.status;
    this.createdAt = data.created_at;
    makeAutoObservable(this);
  }

  update(data: Record<string, any>) {
    this.offerId = data.offer_id ?? this.offerId;
    this.parentId = data.parent_id ?? this.parentId;
    this.offeredBy = data.offered_by ?? this.offeredBy;
    this.offeredAmount = data.offered_amount != null ? Number(data.offered_amount) : this.offeredAmount;
    this.acceptedAmount = data.accepted_amount != null ? Number(data.accepted_amount) : this.acceptedAmount;
    this.status = data.status ?? this.status;
    this.createdAt = data.created_at ?? this.createdAt;
  }
}

export class BargainChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: BargainChatMessageType;
  bargainOfferId: string | null;
  createdAt: string;
  status: BargainChatMessageStatus;

  constructor(data: Record<string, any>) {
    this.messageId = data.message_id;
    this.senderId = data.sender_id;
    this.senderName = data.sender_name;
    this.message = data.message;
    this.messageType = data.message_type ?? 'TEXT';
    this.bargainOfferId = data.bargain_offer_id ?? null;
    this.createdAt = data.created_at;
    this.status = data.status ?? 'SENT';
    makeAutoObservable(this);
  }
}

export class BargainCartItem {
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

  constructor(data: Record<string, any>) {
    this.cartItemId = data.cart_item_id ?? data.id;
    this.productId = data.product_id ?? data.product?.id ?? '';
    this.productName = data.product_name ?? data.product?.name ?? 'Product';
    this.productImage = data.product_image ?? data.product?.image ?? '';
    this.originalPrice = Number(data.original_price);
    this.negotiatedPrice = data.negotiated_price != null ? Number(data.negotiated_price) : null;
    this.effectivePrice = Number(data.effective_price ?? data.negotiated_price ?? data.original_price);
    this.isLocked = !!data.is_locked;
    this.quantity = data.quantity ?? 1;
    this.lineTotal = data.line_total != null ? Number(data.line_total) : this.effectivePrice * this.quantity;
    makeAutoObservable(this);
  }

  update(data: Record<string, any>) {
    this.negotiatedPrice = data.negotiated_price != null ? Number(data.negotiated_price) : this.negotiatedPrice;
    this.effectivePrice = data.effective_price != null ? Number(data.effective_price) : this.effectivePrice;
    this.isLocked = data.is_locked ?? this.isLocked;
    this.quantity = data.quantity ?? this.quantity;
    this.lineTotal = data.line_total != null ? Number(data.line_total) : this.lineTotal;
  }
}

export class BargainSession {
  sessionId: string;
  cartId: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  endedAt: string | null;
  cart: BargainCartItem[];
  messages: BargainChatMessage[];
  offers: Record<string, BargainOffer>;
  seenBy: string[];
  deliveryReceipts: Record<string, unknown>;
  isTyping = false;

  constructor(data: Record<string, any>) {
    this.sessionId = data.session_id;
    this.cartId = data.cart_id;
    this.status = data.status;
    this.startedAt = data.started_at;
    this.expiresAt = data.expires_at ?? null;
    this.endedAt = data.ended_at ?? null;
    this.cart = (data.cart?.items ?? data.cart ?? []).map((item: Record<string, any>) => new BargainCartItem(item));
    this.messages = (data.messages ?? []).map((msg: Record<string, any>) => new BargainChatMessage(msg));
    this.offers = {};
    Object.entries(data.offers ?? {}).forEach(([cartItemId, offer]) => {
      this.offers[cartItemId] = new BargainOffer(offer as Record<string, any>);
    });

    if (Object.keys(this.offers).length === 0) {
      this.cart.forEach((item) => {
        const offerMsg = [...this.messages].reverse().find((m) => m.messageType === 'OFFER');
        let offeredAmount = item.effectivePrice;
        if (offerMsg) {
          const match = offerMsg.message.match(/₹\s*([0-9]+(?:\.[0-9]+)?)/);
          if (match) offeredAmount = parseFloat(match[1]);
        }
        this.offers[item.cartItemId] = new BargainOffer({
          offer_id: offerMsg?.bargainOfferId || `fallback-${item.cartItemId}`,
          cart_item_id: item.cartItemId,
          parent_id: null,
          offered_by: 'CUSTOMER',
          offered_amount: offeredAmount,
          original_price: item.originalPrice,
          accepted_amount: item.isLocked ? item.effectivePrice : null,
          status: item.isLocked ? 'ACCEPTED' : (this.status === 'ENDED' ? 'REJECTED' : 'PENDING'),
          created_at: offerMsg?.createdAt || this.startedAt,
        });
      });
    }
    this.seenBy = Array.isArray(data.seen_by) ? data.seen_by : [];
    this.deliveryReceipts = data.delivery_receipts ?? {};
    makeAutoObservable(this);
  }

  /** Applies a new/updated offer for a cart item (from `new_offer`/`counter_offer`/`offer_accepted`/`offer_rejected`). */
  applyOffer(cartItemId: string, offerData: Record<string, any>) {
    const existing = this.offers[cartItemId];
    if (existing && existing.offerId === offerData.offer_id) {
      existing.update(offerData);
    } else {
      this.offers[cartItemId] = new BargainOffer(offerData);
    }
  }

  /** Appends an incoming chat message (from `chat_message`). Ignores duplicates that can arrive
   * after a reconnect replays recent events. */
  appendMessage(messageData: Record<string, any>) {
    const messageId = messageData.message_id;
    if (messageId && this.messages.some((m) => m.messageId === messageId)) return;
    this.messages.push(new BargainChatMessage(messageData));
  }

  /** Merges cart-item price/lock/quantity changes (from `cart_updated`). */
  applyCartUpdate(cartData: Record<string, any>) {
    const items: Record<string, any>[] = cartData?.items ?? cartData ?? [];
    items.forEach((itemData) => {
      const cartItemId = itemData.cart_item_id ?? itemData.id;
      const existing = this.cart.find((item) => item.cartItemId === cartItemId);
      if (existing) existing.update(itemData);
      else this.cart.push(new BargainCartItem(itemData));
    });
  }

  /** Marks all messages as seen by the given user (from `messages_seen`). */
  markSeenBy(userId: string) {
    if (!Array.isArray(this.seenBy)) {
      this.seenBy = [];
    }
    if (!this.seenBy.includes(userId)) this.seenBy.push(userId);
  }
}
