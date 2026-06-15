export const ORDER_ENDPOINTS = {
  LIST: '/commerce/orders/',
  DETAIL: '/commerce/orders/:id/',
  TRACK: '/orders/:id/track',
  CANCEL: '/orders/:id/cancel',
  PLACE: '/orders',
} as const;
