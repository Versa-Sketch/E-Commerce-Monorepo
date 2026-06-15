import { BargainConnectionStatus, IBargainSocket, IBargainSocketFactory } from './index';
import {
  BargainCartUpdate,
  BargainClientMessage,
  BargainMessage,
  BargainMessageType,
  BargainOffer,
  BargainServerEvent,
  BargainSession,
} from '../types/domain';
import * as fixtureStore from './fixtureStore';

const CONNECT_DELAY_MS = 400;
const COUNTER_DELAY_MS = 2500;
const TYPING_DELAY_MS = 800;

/**
 * Simulates the bargain WebSocket against the shared in-memory fixtureStore.
 * Mirrors the broadcast/unicast shapes of the real spec so swapping in a
 * real socket later doesn't require store/UI changes.
 */
export class FixtureBargainSocket implements IBargainSocket {
  private sessionId: string | null = null;
  private onMessage: ((event: BargainServerEvent) => void) | null = null;
  private onStatusChange: ((status: BargainConnectionStatus) => void) | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private closed = false;

  connect(
    sessionId: string,
    onMessage: (event: BargainServerEvent) => void,
    onStatusChange?: (status: BargainConnectionStatus) => void
  ): void {
    this.sessionId = sessionId;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange ?? null;
    this.onStatusChange?.('connecting');
    this.schedule(() => {
      if (this.closed) return;
      try {
        const session = fixtureStore.getSession(sessionId);
        this.onStatusChange?.('open');
        this.emit({ type: 'session_started', payload: session });
      } catch (e) {
        this.onStatusChange?.('error');
        this.emitError(e);
      }
    }, CONNECT_DELAY_MS);
  }

  send(message: BargainClientMessage): void {
    if (!this.sessionId) return;
    let session;
    try {
      session = fixtureStore.getSession(this.sessionId);
    } catch (e) {
      this.emitError(e);
      return;
    }
    switch (message.type) {
      case 'bargain_offer':
        this.handleBargainOffer(session, message);
        return;
      case 'bargain_response':
        this.handleBargainResponse(session, message);
        return;
      case 'chat_message':
        this.handleChatMessage(session, message);
        return;
      case 'end_session':
        this.handleEndSession(session);
        return;
      case 'mark_seen':
        this.handleMarkSeen(session);
        return;
      case 'typing':
        this.handleTyping(message);
        return;
    }
  }

  disconnect(): void {
    this.closed = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.onStatusChange?.('closed');
  }

  private schedule(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private emit(event: BargainServerEvent): void {
    if (this.closed) return;
    this.onMessage?.(event);
  }

  private emitError(e: unknown): void {
    this.emit({
      type: 'error',
      payload: { status: 400, message: e instanceof Error ? e.message : 'Something went wrong' },
    });
  }

  private systemMessage(
    text: string,
    type: BargainMessageType,
    offerId: string | null,
    senderId = fixtureStore.FIXTURE_CUSTOMER_ID,
    senderName = 'You'
  ): BargainMessage {
    return {
      message_id: fixtureStore.nextMessageId(),
      sender_id: senderId,
      sender_name: senderName,
      message: text,
      message_type: type,
      bargain_offer_id: offerId,
      created_at: new Date().toISOString(),
    };
  }

  private buildCartUpdate(session: BargainSession): BargainCartUpdate {
    const total = session.cart.items.reduce((acc, item) => acc + parseFloat(item.line_total), 0);
    session.cart.total_price = total.toFixed(2);
    session.cart.items.forEach((item) => {
      item.is_locked = session.offers[item.cart_item_id]?.status === 'PENDING';
    });
    return session.cart;
  }

  private handleBargainOffer(
    session: BargainSession,
    message: { type: 'bargain_offer'; cart_item_id: string; offered_amount: string }
  ): void {
    if (session.status !== 'ACTIVE') {
      this.emitError(new Error('Session is not active.'));
      return;
    }
    const cartItem = fixtureStore.getCartItem(session, message.cart_item_id);
    if (!cartItem) {
      this.emitError(new Error('Cart item not found.'));
      return;
    }
    const offer: BargainOffer = {
      offer_id: fixtureStore.nextOfferId(),
      cart_item_id: message.cart_item_id,
      parent_id: null,
      offered_by: 'CUSTOMER',
      offered_amount: message.offered_amount,
      original_price: cartItem.selling_price,
      accepted_amount: null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    fixtureStore.setOffer(session, offer);
    this.emit({ type: 'new_offer', payload: { offer } });
    this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
    const offerMsg = this.systemMessage(
      `Offered ₹${message.offered_amount} for ${cartItem.product_name}.`,
      'OFFER',
      offer.offer_id
    );
    fixtureStore.addMessage(session, offerMsg);
    this.emit({ type: 'chat_message', payload: offerMsg });

    this.schedule(() => {
      this.emit({ type: 'typing', payload: { user_id: fixtureStore.FIXTURE_SHOP_USER_ID, is_typing: true } });
    }, TYPING_DELAY_MS);

    this.schedule(() => {
      if (this.closed) return;
      const current = session.offers[message.cart_item_id];
      if (!current || current.offer_id !== offer.offer_id || current.status !== 'PENDING') return;
      this.emit({ type: 'typing', payload: { user_id: fixtureStore.FIXTURE_SHOP_USER_ID, is_typing: false } });

      const offeredNum = parseFloat(message.offered_amount);
      const originalNum = parseFloat(cartItem.selling_price);
      const counterNum = Math.round(((offeredNum + originalNum) / 2) * 100) / 100;

      current.status = 'COUNTERED';
      session.offers[message.cart_item_id] = current;

      const counterOffer: BargainOffer = {
        offer_id: fixtureStore.nextOfferId(),
        cart_item_id: message.cart_item_id,
        parent_id: offer.offer_id,
        offered_by: 'SHOP',
        offered_amount: counterNum.toFixed(2),
        original_price: cartItem.selling_price,
        accepted_amount: null,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };
      fixtureStore.setOffer(session, counterOffer);
      this.emit({ type: 'counter_offer', payload: { offer: counterOffer } });
      const counterMsg = this.systemMessage(
        `Shop countered with ₹${counterOffer.offered_amount} for ${cartItem.product_name}.`,
        'COUNTER_OFFER',
        counterOffer.offer_id,
        fixtureStore.FIXTURE_SHOP_USER_ID,
        fixtureStore.FIXTURE_SHOP_USER_NAME
      );
      fixtureStore.addMessage(session, counterMsg);
      this.emit({ type: 'chat_message', payload: counterMsg });
    }, COUNTER_DELAY_MS);
  }

  private handleBargainResponse(
    session: BargainSession,
    message: { type: 'bargain_response'; offer_id: string; action: 'ACCEPT' | 'REJECT' | 'COUNTER'; counter_amount?: string }
  ): void {
    const found = fixtureStore.findOfferById(message.offer_id);
    if (!found) {
      this.emitError(new Error('Offer not found.'));
      return;
    }
    const { offer } = found;
    if (offer.status !== 'PENDING') {
      this.emitError(new Error('Offer is no longer pending.'));
      return;
    }
    const cartItem = fixtureStore.getCartItem(session, offer.cart_item_id);
    const itemName = cartItem?.product_name ?? 'item';

    if (message.action === 'ACCEPT') {
      offer.status = 'ACCEPTED';
      offer.accepted_amount = offer.offered_amount;
      session.offers[offer.cart_item_id] = offer;
      if (cartItem) {
        cartItem.selling_price = offer.accepted_amount;
        cartItem.line_total = (parseFloat(offer.accepted_amount) * cartItem.quantity).toFixed(2);
      }
      this.emit({ type: 'offer_accepted', payload: { offer, cart: this.buildCartUpdate(session) } });
      const msg = this.systemMessage(`Offer of ₹${offer.offered_amount} accepted for ${itemName}.`, 'SYSTEM', offer.offer_id);
      fixtureStore.addMessage(session, msg);
      this.emit({ type: 'chat_message', payload: msg });
      this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
      return;
    }

    if (message.action === 'REJECT') {
      offer.status = 'REJECTED';
      session.offers[offer.cart_item_id] = offer;
      this.emit({ type: 'offer_rejected', payload: { offer } });
      const msg = this.systemMessage(`Offer of ₹${offer.offered_amount} rejected for ${itemName}.`, 'SYSTEM', offer.offer_id);
      fixtureStore.addMessage(session, msg);
      this.emit({ type: 'chat_message', payload: msg });
      this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
      return;
    }

    // COUNTER
    if (!message.counter_amount) {
      this.emitError(new Error('counter_amount is required.'));
      return;
    }
    offer.status = 'COUNTERED';
    session.offers[offer.cart_item_id] = offer;
    const counterOffer: BargainOffer = {
      offer_id: fixtureStore.nextOfferId(),
      cart_item_id: offer.cart_item_id,
      parent_id: offer.offer_id,
      offered_by: 'CUSTOMER',
      offered_amount: message.counter_amount,
      original_price: offer.original_price,
      accepted_amount: null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    fixtureStore.setOffer(session, counterOffer);
    this.emit({ type: 'counter_offer', payload: { offer: counterOffer } });
    this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
    const msg = this.systemMessage(`Countered with ₹${message.counter_amount} for ${itemName}.`, 'COUNTER_OFFER', counterOffer.offer_id);
    fixtureStore.addMessage(session, msg);
    this.emit({ type: 'chat_message', payload: msg });

    // simulate the shop accepting the customer's counter after a delay
    this.schedule(() => {
      if (this.closed) return;
      const current = session.offers[offer.cart_item_id];
      if (!current || current.offer_id !== counterOffer.offer_id || current.status !== 'PENDING') return;
      current.status = 'ACCEPTED';
      current.accepted_amount = current.offered_amount;
      session.offers[offer.cart_item_id] = current;
      if (cartItem) {
        cartItem.selling_price = current.accepted_amount as string;
        cartItem.line_total = (parseFloat(current.accepted_amount as string) * cartItem.quantity).toFixed(2);
      }
      this.emit({ type: 'offer_accepted', payload: { offer: current, cart: this.buildCartUpdate(session) } });
      const acceptMsg = this.systemMessage(
        `Shop accepted your offer of ₹${current.offered_amount} for ${itemName}.`,
        'SYSTEM',
        current.offer_id,
        fixtureStore.FIXTURE_SHOP_USER_ID,
        fixtureStore.FIXTURE_SHOP_USER_NAME
      );
      fixtureStore.addMessage(session, acceptMsg);
      this.emit({ type: 'chat_message', payload: acceptMsg });
      this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
    }, COUNTER_DELAY_MS);
  }

  private handleChatMessage(session: BargainSession, message: { type: 'chat_message'; message: string }): void {
    if (session.status !== 'ACTIVE') {
      this.emitError(new Error('Session is not active.'));
      return;
    }
    const msg: BargainMessage = {
      message_id: fixtureStore.nextMessageId(),
      sender_id: fixtureStore.FIXTURE_CUSTOMER_ID,
      sender_name: 'You',
      message: message.message,
      message_type: 'TEXT',
      bargain_offer_id: null,
      created_at: new Date().toISOString(),
    };
    fixtureStore.addMessage(session, msg);
    this.emit({ type: 'chat_message', payload: msg });
  }

  private handleEndSession(session: BargainSession): void {
    session.status = 'ENDED';
    session.ended_at = new Date().toISOString();
    this.emit({ type: 'session_ended', payload: { session_id: session.session_id, status: 'ENDED', ended_at: session.ended_at } });
    this.emit({ type: 'cart_updated', payload: this.buildCartUpdate(session) });
  }

  private handleMarkSeen(session: BargainSession): void {
    const seenAt = new Date().toISOString();
    session.seen_by[fixtureStore.FIXTURE_CUSTOMER_ID] = seenAt;
    this.emit({ type: 'messages_seen', payload: { user_id: fixtureStore.FIXTURE_CUSTOMER_ID, seen_at: seenAt } });
  }

  private handleTyping(message: { type: 'typing'; is_typing: boolean }): void {
    this.emit({ type: 'typing', payload: { user_id: fixtureStore.FIXTURE_CUSTOMER_ID, is_typing: message.is_typing } });
  }
}

export const bargainSocketFactory: IBargainSocketFactory = {
  create: () => new FixtureBargainSocket(),
};
