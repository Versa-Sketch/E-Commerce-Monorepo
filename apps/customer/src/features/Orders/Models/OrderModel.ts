import { Order, OrderStatus } from '../types/domain';
import { formatCurrency, formatDate, formatStatus } from '../../../Common/utils/formatters';
export class OrderModel {
  constructor(private readonly raw: Order) {}
  get id(): string { return this.raw.id; }
  get storeName(): string { return this.raw.storeName; }
  get status(): OrderStatus { return this.raw.status; }
  get items() { return this.raw.items; }
  get totalAmount(): number { return this.raw.totalAmount; }
  get courierLocation() { return this.raw.courierLocation; }
  get couponCode() { return this.raw.couponCode; }
  get formattedTotal(): string { return formatCurrency(this.raw.totalAmount); }
  get formattedDate(): string { return formatDate(this.raw.createdAt); }
  get formattedStatus(): string { return formatStatus(this.raw.status); }
  get isOngoing(): boolean { return !['DELIVERED', 'CANCELLED'].includes(this.raw.status); }
  get isDelivered(): boolean { return this.raw.status === 'DELIVERED'; }
  get isCancelled(): boolean { return this.raw.status === 'CANCELLED'; }
  get itemCount(): number { return this.raw.items.reduce((acc, i) => acc + i.quantity, 0); }
  toRaw(): Order { return this.raw; }
}
