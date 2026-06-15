import type { OrderApi } from '../types/api';

export const ordersFixture: OrderApi[] = [
  { order_id: 'ORD-7821', customer_name: 'Rohit Kumar',  store_name: 'FreshMart',    status: 'delivered',        amount: 842,  payment_method: 'UPI',         items: 6, created_at: '2026-06-07', has_dispute: false, city: 'Mumbai' },
  { order_id: 'ORD-7820', customer_name: 'Sanya Kapoor', store_name: 'Spice Garden', status: 'out_for_delivery', amount: 380,  payment_method: 'Card',        items: 2, created_at: '2026-06-07', has_dispute: false, city: 'Chennai' },
  { order_id: 'ORD-7819', customer_name: 'Dev Malhotra', store_name: 'MedPlus',      status: 'packed',           amount: 1240, payment_method: 'Wallet',      items: 4, created_at: '2026-06-07', has_dispute: false, city: 'Delhi' },
  { order_id: 'ORD-7818', customer_name: 'Pooja Nair',   store_name: 'TrendSetters', status: 'confirmed',        amount: 2100, payment_method: 'Card',        items: 3, created_at: '2026-06-06', has_dispute: false, city: 'Ahmedabad' },
  { order_id: 'ORD-7817', customer_name: 'Ajay Singh',   store_name: 'FreshMart',    status: 'cancelled',        amount: 560,  payment_method: 'COD',         items: 5, created_at: '2026-06-06', has_dispute: false, city: 'Mumbai' },
  { order_id: 'ORD-7816', customer_name: 'Nisha Verma',  store_name: 'GreenLeaf',    status: 'delivered',        amount: 1890, payment_method: 'UPI',         items: 8, created_at: '2026-06-05', has_dispute: true,  city: 'Hyderabad' },
  { order_id: 'ORD-7815', customer_name: 'Ramesh Patil', store_name: 'TechZone',     status: 'delivered',        amount: 4200, payment_method: 'Net Banking', items: 1, created_at: '2026-06-05', has_dispute: true,  city: 'Pune' },
  { order_id: 'ORD-7814', customer_name: 'Kavita Reddy', store_name: 'Spice Garden', status: 'delivered',        amount: 680,  payment_method: 'UPI',         items: 3, created_at: '2026-06-04', has_dispute: false, city: 'Chennai' },
];
