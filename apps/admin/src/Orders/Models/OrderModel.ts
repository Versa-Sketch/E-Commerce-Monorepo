import type { OrderDomain, OrderStatus, PaymentMethod } from '../types/domain';
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from '../Constants/ordersConstants';

export class OrderModel {
  private readonly order: OrderDomain;

  constructor(order: OrderDomain) {
    this.order = order;
  }

  getId(): string {
    return this.order.id;
  }

  getCustomerName(): string {
    return this.order.customerName;
  }

  getStoreName(): string {
    return this.order.storeName;
  }

  getStatus(): OrderStatus {
    return this.order.status;
  }

  getStatusLabel(): string {
    return ORDER_STATUS_LABELS[this.order.status];
  }

  getStatusVariant(): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    return ORDER_STATUS_VARIANTS[this.order.status];
  }

  getAmount(): number {
    return this.order.amount;
  }

  getFormattedAmount(): string {
    return `₹${this.order.amount.toLocaleString()}`;
  }

  getPaymentMethod(): PaymentMethod {
    return this.order.paymentMethod;
  }

  getItems(): number {
    return this.order.items;
  }

  getCity(): string {
    return this.order.city;
  }

  getCreatedAt(): Date {
    return this.order.createdAt;
  }

  getFormattedDate(): string {
    return this.order.createdAt.toISOString().slice(0, 10);
  }

  hasDispute(): boolean {
    return this.order.hasDispute;
  }

  toDomain(): OrderDomain {
    return this.order;
  }
}
