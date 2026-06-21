export type OrderStatus =
  | 'New Orders'
  | 'Accepted'
  | 'Packed'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Rejected';

export type PaymentMethod = 'COD' | 'Online';

export interface ApiAddress {
  id: string;
  address_line1: string;
  address_line2: string;
  state: string;
  pincode: string;
  address_type: string;
  latitude: number | null;
  longitude: number | null;
}

export interface ApiPayment {
  payment_id: string;
  payment_method: string;
  amount: string;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export interface ApiOrderItem {
  variant_id: string;
  variant_name: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface ApiOrder {
  order_id: string;
  shop_id: string;
  shop_name: string;
  status: 'PLACED' | 'ACCEPTED' | 'PACKING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: string;
  delivery_charge: string;
  discount_amount: string;
  total_amount: string;
  created_at: string;
  items?: ApiOrderItem[];
  payment?: ApiPayment | null;
  customer_name: string;
  customer_phone: string;
  address: ApiAddress | null;
}

export interface ApiDashboardSummary {
  orders_today_count: number;
  pending_orders_count: number;
  revenue_today: string;
  revenue_total: string;
}

export interface ActivityLogItem {
  id: string;
  event_type:
    | 'ORDER_ACCEPTED'
    | 'ORDER_STATUS_CHANGED'
    | 'ORDER_CANCELLED'
    | 'BATCH_ADDED'
    | 'BARGAIN_OFFER_ACCEPTED'
    | 'BARGAIN_OFFER_REJECTED';
  description: string;
  created_at: string;
}

