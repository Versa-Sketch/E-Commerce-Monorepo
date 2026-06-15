import { AxiosInstance } from 'axios';
import { CART_ENDPOINTS } from '../Constants/CART_ENDPOINTS';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import {
  BulkCartItemInput,
  CartProductsGroup,
  CheckoutAllPreview,
  CheckoutCartSinglePreview,
  CartResponse,
  CartSummary,
  CheckoutAllResponse,
  CheckoutRequest,
  CheckoutResponse,
  Paginated,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from '../../../types/shared';
import { ICartService } from './index';
export class CartApiService implements ICartService {
  constructor(private client: AxiosInstance) { }
  async getCarts(page = 1, page_size = 20): Promise<Paginated<CartSummary>> {
    try {
      const response = await this.client.get(CART_ENDPOINTS.LIST, { params: { page, page_size } });
      return response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getCartsWithProducts(): Promise<CartProductsGroup[]> {
    try {
      const response = await this.client.get(CART_ENDPOINTS.CARTS_PRODUCTS);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getShopCart(shopId: string): Promise<CartResponse> {
    try {
      const response = await this.client.get(CART_ENDPOINTS.SHOP_CART.replace(':shopId', shopId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async addItem(shopId: string, variantId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await this.client.post(
        CART_ENDPOINTS.ADD_ITEM.replace(':shopId', shopId),
        { variant_id: variantId, quantity }
      );
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async bulkUpdate(shopId: string, items: BulkCartItemInput[]): Promise<CartResponse> {
    try {
      const response = await this.client.patch(
        CART_ENDPOINTS.BULK_UPDATE.replace(':shopId', shopId),
        items
      );
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async removeItem(shopId: string, variantId: string): Promise<CartResponse> {
    try {
      const response = await this.client.delete(
        CART_ENDPOINTS.REMOVE_ITEM.replace(':shopId', shopId).replace(':variantId', variantId)
      );
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async clearCart(shopId: string): Promise<CartResponse> {
    try {
      const response = await this.client.delete(CART_ENDPOINTS.CLEAR.replace(':shopId', shopId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async clearCarts(shopIds: string[]): Promise<CartResponse[]> {
    try {
      const response = await this.client.delete(CART_ENDPOINTS.CLEAR_ALL, { data: { shop_ids: shopIds } });
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async checkoutShop(shopId: string, body: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      const response = await this.client.post(CART_ENDPOINTS.CHECKOUT_SHOP.replace(':shopId', shopId), body);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getCheckoutAllPreview(): Promise<CheckoutAllPreview> {
    try {
      const response = await this.client.get(CART_ENDPOINTS.CHECKOUT_ALL_PREVIEW);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async checkoutAll(body: CheckoutRequest): Promise<CheckoutAllResponse> {
    try {
      const response = await this.client.post(CART_ENDPOINTS.CHECKOUT_ALL, body);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async verifyPayment(payload: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    try {
      const response = await this.client.post(CART_ENDPOINTS.PAYMENT_VERIFY, payload);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getCheckoutCartPreview(cartId: string): Promise<CheckoutCartSinglePreview> {
    try {
      const response = await this.client.get(CART_ENDPOINTS.CHECKOUT_CART_PREVIEW.replace(':cartId', cartId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}
export const cartService: ICartService = new CartApiService(AppClient);
