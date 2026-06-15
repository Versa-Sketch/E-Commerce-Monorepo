import type { ORDER_STATUSES, PAYMENT_METHODS } from './api';

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface OrderDomain {
  id: string;
  customerName: string;
  storeName: string;
  status: OrderStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  items: number;
  createdAt: Date;
  hasDispute: boolean;
  city: string;
}
