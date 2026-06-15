import {
  BulkCartItemInput,
  CartProductsGroup,
  CartResponse,
  CartSummary,
  CheckoutAllPreview,
  CheckoutCartSinglePreview,
  Paginated,
  CheckoutAllResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from '../../../types/shared';
export interface ICartService {
  getCarts(page?: number, pageSize?: number): Promise<Paginated<CartSummary>>;
  getCartsWithProducts(): Promise<CartProductsGroup[]>;
  getShopCart(shopId: string): Promise<CartResponse>;
  addItem(shopId: string, variantId: string, quantity: number): Promise<CartResponse>;
  bulkUpdate(shopId: string, items: BulkCartItemInput[]): Promise<CartResponse>;
  removeItem(shopId: string, variantId: string): Promise<CartResponse>;
  clearCart(shopId: string): Promise<CartResponse>;
  clearCarts(shopIds: string[]): Promise<CartResponse[]>;
  getCheckoutAllPreview(): Promise<CheckoutAllPreview>;
  getCheckoutCartPreview(cartId: string): Promise<CheckoutCartSinglePreview>;
  checkoutShop(shopId: string, body: CheckoutRequest): Promise<CheckoutResponse>;
  checkoutAll(body: CheckoutRequest): Promise<CheckoutAllResponse>;
  verifyPayment(payload: PaymentVerifyRequest): Promise<PaymentVerifyResponse>;
}
