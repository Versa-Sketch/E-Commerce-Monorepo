export const ORDER_STATUSES = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'] as const;
export const PAYMENT_METHODS = ['UPI', 'Card', 'COD', 'Wallet', 'Net Banking'] as const;

export interface OrderApi {
  order_id: string;
  customer_name: string;
  store_name: string;
  status: (typeof ORDER_STATUSES)[number];
  amount: number;
  payment_method: (typeof PAYMENT_METHODS)[number];
  items: number;
  created_at: string;
  has_dispute: boolean;
  city: string;
}
