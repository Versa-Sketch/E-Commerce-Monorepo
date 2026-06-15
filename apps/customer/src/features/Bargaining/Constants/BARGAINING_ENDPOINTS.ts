export const BARGAINING_ENDPOINTS = {
  CREATE_SESSION:  '/logistics/bargain/sessions/',
  GET_SESSION:     '/logistics/bargain/sessions/:sessionId/',
  END_SESSION:     '/logistics/bargain/sessions/:sessionId/end/',
  CREATE_OFFER:    '/logistics/bargain/sessions/:sessionId/offers/',
  RESPOND_OFFER:   '/logistics/bargain/offers/:offerId/respond/',
  GET_MESSAGES:    '/logistics/bargain/sessions/:sessionId/messages/',
  GET_ITEM_THREAD: '/logistics/bargain/cart-items/:cartItemId/thread/',
  GET_SESSION_HISTORY: '/logistics/bargain/sessions/:sessionId/history/',
  GET_CART_HISTORY:    '/logistics/bargain/carts/:cartId/history/',
} as const;
