import { BargainCartHistory, BargainCartUpdate, BargainMessage, BargainOffer, BargainSession, BargainSessionHistory, BargainTimelineEvent } from '../types/domain';

/**
 * Shared in-memory session store used by both the REST fixture service and the
 * fixture WebSocket, so REST mutations and simulated socket broadcasts stay in sync.
 */

const sessions = new Map<string, BargainSession>();
const threads = new Map<string, BargainOffer[]>(); // cart_item_id -> full offer history

let sessionCounter = 0;
let offerCounter = 0;
let messageCounter = 0;

const FIXTURE_SHOP_NAME = 'Greenfield Groceries';

/** Matches the Auth fixture's user id (src/features/Auth/Services/index.fixture.ts) */
export const FIXTURE_CUSTOMER_ID = 'fixture-user-id';
export const FIXTURE_SHOP_USER_ID = 'shop_owner_fixture';
export const FIXTURE_SHOP_USER_NAME = FIXTURE_SHOP_NAME;

const BARGAIN_SESSION_DURATION_MINUTES = 20;

function buildFixtureCart(cartId: string): BargainCartUpdate {
  return {
    id: cartId,
    total_price: '610.00',
    items: [
      {
        cart_item_id: 'ci_avocado',
        variant_id: 'var_avocado',
        variant_name: 'Pack of 2',
        product_id: 'prod_avocado',
        product_name: 'Organic Avocados',
        product_image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200',
        mrp: '180.00',
        selling_price: '180.00',
        quantity: 1,
        line_total: '180.00',
        available_stock: '20',
        is_in_stock: true,
      },
      {
        cart_item_id: 'ci_pizza',
        variant_id: 'var_pizza',
        variant_name: 'Medium',
        product_id: 'prod_pizza',
        product_name: 'Truffle Mushroom Pizza',
        product_image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
        mrp: '430.00',
        selling_price: '430.00',
        quantity: 1,
        line_total: '430.00',
        available_stock: '8',
        is_in_stock: true,
      },
    ],
  };
}

export function createSession(cartId: string): BargainSession {
  sessionCounter += 1;
  const now = new Date();
  const expires = new Date(now.getTime() + BARGAIN_SESSION_DURATION_MINUTES * 60 * 1000);
  const session: BargainSession = {
    session_id: `sess_${sessionCounter}_${Date.now()}`,
    cart_id: cartId,
    status: 'ACTIVE',
    started_at: now.toISOString(),
    expires_at: expires.toISOString(),
    ended_at: null,
    cart: buildFixtureCart(cartId),
    messages: [],
    offers: {},
    seen_by: {},
    delivered_by: {},
  };
  sessions.set(session.session_id, session);
  return session;
}

export function getSession(sessionId: string): BargainSession {
  const session = sessions.get(sessionId);
  if (!session) throw new Error(`Bargain session ${sessionId} not found`);
  return session;
}

export function endSession(sessionId: string): BargainSession {
  const session = getSession(sessionId);
  session.status = 'ENDED';
  session.ended_at = new Date().toISOString();
  return session;
}

export function nextOfferId(): string {
  offerCounter += 1;
  return `offer_${offerCounter}_${Date.now()}`;
}

export function nextMessageId(): string {
  messageCounter += 1;
  return `msg_${messageCounter}_${Date.now()}`;
}

export function addMessage(session: BargainSession, message: BargainMessage): void {
  session.messages.push(message);
}

export function setOffer(session: BargainSession, offer: BargainOffer): void {
  session.offers[offer.cart_item_id] = offer;
  const thread = threads.get(offer.cart_item_id) ?? [];
  thread.push(offer);
  threads.set(offer.cart_item_id, thread);
}

export function getThread(cartItemId: string): BargainOffer[] {
  return [...(threads.get(cartItemId) ?? [])];
}

export function findOfferById(offerId: string): { session: BargainSession; offer: BargainOffer } | null {
  for (const session of sessions.values()) {
    for (const offer of Object.values(session.offers)) {
      if (offer.offer_id === offerId) return { session, offer };
    }
  }
  return null;
}

export function getCartItem(session: BargainSession, cartItemId: string) {
  return session.cart.items.find((i) => i.cart_item_id === cartItemId);
}

export function buildSessionHistory(session: BargainSession): BargainSessionHistory {
  const timeline: BargainTimelineEvent[] = [
    { type: 'session_started', session_id: session.session_id, created_at: session.started_at },
    ...session.messages.map((message): BargainTimelineEvent => ({
      ...message,
      type: 'chat_message',
      status: message.status ?? 'SENT',
    })),
    ...Object.values(session.offers).map((offer): BargainTimelineEvent => ({ ...offer, type: 'bargain_offer' })),
  ];
  if (session.status !== 'ACTIVE' && session.ended_at) {
    timeline.push({
      type: session.status === 'EXPIRED' ? 'session_expired' : 'session_ended',
      session_id: session.session_id,
      status: session.status,
      created_at: session.ended_at,
    });
  }
  timeline.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return {
    session_id: session.session_id,
    status: session.status,
    started_at: session.started_at,
    expires_at: session.expires_at,
    ended_at: session.ended_at,
    timeline,
  };
}

export function buildCartHistory(cartId: string): BargainCartHistory {
  const cartSessions = [...sessions.values()]
    .filter((session) => session.cart_id === cartId)
    .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
  return {
    cart_id: cartId,
    sessions: cartSessions.map(buildSessionHistory),
  };
}
