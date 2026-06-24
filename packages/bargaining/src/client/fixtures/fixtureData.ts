import { BargainSession } from '../../types/domain';

// Mirrors a realistic session: one pending counter-offer, a short chat
// history, and one already-locked (accepted) item — enough to exercise
// every UI state (pending/accepted, chat, typing) without a real backend.
export function createFixtureSession(sessionId = 'fixture-session-1'): BargainSession {
  const now = Date.now();
  return {
    sessionId,
    cartId: 'fixture-cart-1',
    status: 'ACTIVE',
    startedAt: new Date(now - 5 * 60_000).toISOString(),
    expiresAt: new Date(now + 10 * 60_000).toISOString(),
    endedAt: null,
    counterpartyName: 'Priya Sharma',
    isTyping: false,
    cart: [
      {
        cartItemId: 'item-1',
        productId: 'prod-mango',
        productName: 'Alphonso Mangoes (1 Dozen)',
        productImage: '🥭',
        originalPrice: 480,
        negotiatedPrice: null,
        effectivePrice: 480,
        isLocked: false,
        quantity: 1,
        lineTotal: 480,
        merchantCost: 320,
      },
      {
        cartItemId: 'item-2',
        productId: 'prod-avocado',
        productName: 'Avocado (2 pcs)',
        productImage: '🥑',
        originalPrice: 280,
        negotiatedPrice: 240,
        effectivePrice: 240,
        isLocked: true,
        quantity: 1,
        lineTotal: 240,
        merchantCost: 180,
      },
    ],
    offers: {
      'item-1': {
        offerId: 'offer-1',
        cartItemId: 'item-1',
        parentId: null,
        offeredBy: 'CUSTOMER',
        offeredAmount: 380,
        originalPrice: 480,
        acceptedAmount: null,
        status: 'PENDING',
        createdAt: new Date(now - 3 * 60_000).toISOString(),
      },
      'item-2': {
        offerId: 'offer-2',
        cartItemId: 'item-2',
        parentId: null,
        offeredBy: 'CUSTOMER',
        offeredAmount: 240,
        originalPrice: 280,
        acceptedAmount: 240,
        status: 'ACCEPTED',
        createdAt: new Date(now - 4 * 60_000).toISOString(),
      },
    },
    messages: [
      {
        messageId: 'msg-1',
        senderId: 'customer-1',
        senderName: 'Priya Sharma',
        message: 'Can you do ₹380 for the mangoes?',
        messageType: 'OFFER',
        bargainOfferId: 'offer-1',
        createdAt: new Date(now - 3 * 60_000).toISOString(),
        status: 'READ',
      },
      {
        messageId: 'msg-2',
        senderId: 'customer-1',
        senderName: 'Priya Sharma',
        message: "They're really fresh today, hope that works!",
        messageType: 'TEXT',
        bargainOfferId: null,
        createdAt: new Date(now - 2 * 60_000).toISOString(),
        status: 'DELIVERED',
      },
    ],
    seenBy: ['customer-1'],
  };
}
