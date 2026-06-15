import type { OrderApi } from '../types/api';
import type { OrderDomain } from '../types/domain';

export const transformOrder = (api: OrderApi): OrderDomain => ({
  id: api.order_id,
  customerName: api.customer_name,
  storeName: api.store_name,
  status: api.status,
  amount: api.amount,
  paymentMethod: api.payment_method,
  items: api.items,
  createdAt: new Date(api.created_at),
  hasDispute: api.has_dispute,
  city: api.city,
});
