import { IBargainingService } from './index';
import {
  BargainCartHistory,
  BargainMessage,
  BargainOffer,
  BargainOfferAction,
  BargainSession,
  BargainSessionHistory,
} from '../types/domain';
import * as fixtureStore from './fixtureStore';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class BargainingFixtureService implements IBargainingService {
  async startSession(cartId: string): Promise<BargainSession> {
    await delay(400);
    return fixtureStore.createSession(cartId);
  }

  async getSession(sessionId: string): Promise<BargainSession> {
    await delay(200);
    return fixtureStore.getSession(sessionId);
  }

  async endSession(sessionId: string): Promise<BargainSession> {
    await delay(300);
    return fixtureStore.endSession(sessionId);
  }

  async createOffer(sessionId: string, cartItemId: string, offeredAmount: string): Promise<BargainOffer> {
    await delay(300);
    const session = fixtureStore.getSession(sessionId);
    const cartItem = fixtureStore.getCartItem(session, cartItemId);
    const offer: BargainOffer = {
      offer_id: fixtureStore.nextOfferId(),
      cart_item_id: cartItemId,
      parent_id: null,
      offered_by: 'CUSTOMER',
      offered_amount: offeredAmount,
      original_price: cartItem?.selling_price ?? '0.00',
      accepted_amount: null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    fixtureStore.setOffer(session, offer);
    const message: BargainMessage = {
      message_id: fixtureStore.nextMessageId(),
      sender_id: fixtureStore.FIXTURE_CUSTOMER_ID,
      sender_name: 'You',
      message: `Offered ₹${offeredAmount} for ${cartItem?.product_name ?? 'item'}.`,
      message_type: 'OFFER',
      bargain_offer_id: offer.offer_id,
      created_at: offer.created_at,
    };
    fixtureStore.addMessage(session, message);
    return offer;
  }

  async respondToOffer(offerId: string, action: BargainOfferAction, counterAmount?: string): Promise<BargainOffer> {
    await delay(300);
    const found = fixtureStore.findOfferById(offerId);
    if (!found) throw new Error(`Bargain offer ${offerId} not found`);
    const { session, offer } = found;
    if (action === 'ACCEPT') {
      offer.status = 'ACCEPTED';
      offer.accepted_amount = offer.offered_amount;
      session.offers[offer.cart_item_id] = offer;
      return offer;
    }
    if (action === 'REJECT') {
      offer.status = 'REJECTED';
      session.offers[offer.cart_item_id] = offer;
      return offer;
    }
    // COUNTER
    offer.status = 'COUNTERED';
    session.offers[offer.cart_item_id] = offer;
    const counterOffer: BargainOffer = {
      offer_id: fixtureStore.nextOfferId(),
      cart_item_id: offer.cart_item_id,
      parent_id: offer.offer_id,
      offered_by: 'CUSTOMER',
      offered_amount: counterAmount ?? offer.offered_amount,
      original_price: offer.original_price,
      accepted_amount: null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    fixtureStore.setOffer(session, counterOffer);
    return counterOffer;
  }

  async getMessages(sessionId: string): Promise<BargainMessage[]> {
    await delay(200);
    const session = fixtureStore.getSession(sessionId);
    return [...session.messages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  async getCartItemThread(cartItemId: string): Promise<BargainOffer[]> {
    await delay(200);
    return fixtureStore.getThread(cartItemId).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  async getSessionHistory(sessionId: string): Promise<BargainSessionHistory> {
    await delay(200);
    return fixtureStore.buildSessionHistory(fixtureStore.getSession(sessionId));
  }

  async getCartHistory(cartId: string): Promise<BargainCartHistory> {
    await delay(200);
    return fixtureStore.buildCartHistory(cartId);
  }
}

export const bargainingService: IBargainingService = new BargainingFixtureService();
