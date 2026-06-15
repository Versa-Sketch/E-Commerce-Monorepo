import type { OrderStatus } from '../types/domain';

export const ORDER_ENDPOINTS = {
  LIST: '/orders',
  REFUND: (orderId: string) => `/orders/${orderId}/refund`,
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_VARIANTS: Record<OrderStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  placed: 'neutral',
  confirmed: 'info',
  packed: 'warning',
  out_for_delivery: 'info',
  delivered: 'success',
  cancelled: 'danger',
};
