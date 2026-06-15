import { Product } from '../../../types/shared';
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface Coupon {
  code: string | null;
  discount: number;
}
export interface CartTotals {
  subtotal: number;
  gstTotal: number;
  deliveryFee: number;
  platformFee: number;
  couponDiscount: number;
  grandTotal: number;
}
