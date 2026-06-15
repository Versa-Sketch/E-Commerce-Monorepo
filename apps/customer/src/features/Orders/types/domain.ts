import { AddressApi } from '../../../types/shared';
export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PACKING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';
export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  quantity: number;
  price: number;
}
export interface CourierLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: AddressApi;
  deliveryFee: number;
  platformFee: number;
  gstAmount: number;
  couponCode?: string;
  discount?: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  courierLocation?: CourierLocation;
}
