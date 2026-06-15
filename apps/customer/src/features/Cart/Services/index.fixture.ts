import { ICartService } from './index';
import {
  BulkCartItemInput,
  CartResponse,
  CartSummary,
  CheckoutAllResponse,
  CheckoutRequest,
  CheckoutResponse,
  OrderApi,
  Paginated,
  PaymentMethod,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  ProductVariant,
  CartProductsGroup,
  CheckoutAllPreview,
  CheckoutCartPreview,
  CheckoutCartSinglePreview,
  ShopProduct,
} from '../../../types/shared';
import { MOCK_SHOPS, MOCK_SHOP_PRODUCTS } from '../../Stores/Services/fixtureData';
const MOCK_DELIVERY_CHARGE = '15.00';
const MOCK_RAZORPAY_KEY_ID = 'rzp_test_mock_key';
import { FEES } from '../../../Common/Constants';

const findVariant = (shopId: string, variantId: string): { product: ShopProduct; variant: ProductVariant } | undefined => {
  const products = MOCK_SHOP_PRODUCTS[shopId] ?? [];
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
};

export class CartFixtureService implements ICartService {
  private carts = new Map<string, Map<string, number>>();
  private pendingOrders: OrderApi[] = [];

  private getShopItems(shopId: string): Map<string, number> {
    if (!this.carts.has(shopId)) this.carts.set(shopId, new Map());
    return this.carts.get(shopId)!;
  }

  private buildResponse(shopId: string): CartResponse {
    const shop = MOCK_SHOPS.find((s) => s.id === shopId);
    const itemsMap = this.getShopItems(shopId);
    const items = Array.from(itemsMap.entries())
      .map(([variantId, quantity]) => {
        const found = findVariant(shopId, variantId);
        if (!found) return null;
        const { product, variant } = found;
        const lineTotal = parseFloat(variant.selling_price) * quantity;
        return {
          cart_item_id: `${shopId}_${variantId}`,
          variant_id: variant.id,
          variant_name: variant.name,
          product_id: product.id,
          product_name: product.name,
          product_image: product.image || variant.image,
          mrp: variant.mrp,
          selling_price: variant.selling_price,
          quantity,
          line_total: lineTotal.toFixed(2),
          available_stock: variant.available_stock,
          is_in_stock: variant.is_in_stock,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.line_total), 0);
    const minOrder = parseFloat(shop?.min_order ?? '0');
    return {
      cart_id: `cart_${shopId}`,
      shop_id: shopId,
      shop_name: shop?.name ?? '',
      item_count: items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
      is_below_min_order: subtotal < minOrder,
      min_order: shop?.min_order ?? '0.00',
      items,
    };
  }

  async getCarts(page = 1, page_size = 20): Promise<Paginated<CartSummary>> {
    await new Promise((res) => setTimeout(res, 200));
    const summaries: CartSummary[] = [];
    for (const shopId of this.carts.keys()) {
      const { items, ...summary } = this.buildResponse(shopId);
      if (summary.item_count > 0) summaries.push(summary);
    }
    const start = (page - 1) * page_size;
    return {
      status: 200,
      count: summaries.length,
      page,
      page_size,
      total_pages: Math.max(1, Math.ceil(summaries.length / page_size)),
      data: summaries.slice(start, start + page_size),
    };
  }

  private buildCheckoutCartPreview(shopId: string): CheckoutCartPreview {
    const base = this.buildResponse(shopId);
    const deliveryCharge = parseFloat(base.subtotal) > 0 ? FEES.DEFAULT_DELIVERY_FEE : 0;
    return {
      cart_id: base.cart_id,
      shop_id: base.shop_id,
      shop_name: base.shop_name,
      shop_is_open: true,
      cod_available: true,
      items: base.items.map((item) => ({
        ...item,
        original_price: item.selling_price,
        negotiated_price: null,
        negotiated_quantity: null,
        effective_price: item.selling_price,
        is_locked: false,
      })),
      item_count: base.item_count,
      subtotal: base.subtotal,
      delivery_charge: deliveryCharge.toFixed(2),
      min_order: base.min_order,
      is_below_min_order: base.is_below_min_order,
      active_bargain_session_id: base.active_bargain_session_id ?? null,
      stock_problems: [],
      blockers: [],
    };
  }

  async getCheckoutAllPreview(): Promise<CheckoutAllPreview> {
    await new Promise((res) => setTimeout(res, 200));
    const carts: CheckoutCartPreview[] = [];
    for (const shopId of this.carts.keys()) {
      const preview = this.buildCheckoutCartPreview(shopId);
      if (preview.item_count > 0) carts.push(preview);
    }
    const grandSubtotal = carts.reduce((acc, c) => acc + parseFloat(c.subtotal), 0);
    const grandDelivery = carts.reduce((acc, c) => acc + parseFloat(c.delivery_charge), 0);
    const grandDiscount = 0;
    const grandTotal = grandSubtotal + grandDelivery - grandDiscount;
    const blockers = carts
      .filter((c) => c.is_below_min_order)
      .map((c) => `${c.shop_name} is below the minimum order of ₹${c.min_order}.`);
    return {
      carts,
      grand_subtotal: grandSubtotal.toFixed(2),
      grand_delivery_charge: grandDelivery.toFixed(2),
      grand_discount_amount: grandDiscount.toFixed(2),
      grand_total_amount: grandTotal.toFixed(2),
      addresses: [],
      can_checkout: carts.length > 0 && blockers.length === 0,
      blockers,
    };
  }

  async getCheckoutCartPreview(cartId: string): Promise<CheckoutCartSinglePreview> {
    await new Promise((res) => setTimeout(res, 200));
    const shopId = cartId.startsWith('cart_') ? cartId.slice('cart_'.length) : cartId;
    const preview = this.buildCheckoutCartPreview(shopId);
    const discountAmount = 0;
    const totalAmount = parseFloat(preview.subtotal) + parseFloat(preview.delivery_charge) - discountAmount;
    return {
      ...preview,
      discount_amount: discountAmount.toFixed(2),
      total_amount: totalAmount.toFixed(2),
      addresses: [],
      can_checkout: preview.item_count > 0 && !preview.is_below_min_order,
    };
  }

  async getCartsWithProducts(): Promise<CartProductsGroup[]> {
    await new Promise((res) => setTimeout(res, 200));
    const groups: CartProductsGroup[] = [];
    for (const shopId of this.carts.keys()) {
      const { subtotal, is_below_min_order, min_order, active_bargain_session_id, ...group } = this.buildResponse(shopId);
      if (group.item_count > 0) groups.push(group);
    }
    return groups;
  }

  async getShopCart(shopId: string): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    return this.buildResponse(shopId);
  }

  async addItem(shopId: string, variantId: string, quantity: number): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    const items = this.getShopItems(shopId);
    items.set(variantId, (items.get(variantId) ?? 0) + quantity);
    return this.buildResponse(shopId);
  }

  async bulkUpdate(shopId: string, updates: BulkCartItemInput[]): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    const items = this.getShopItems(shopId);
    updates.forEach(({ variant_id, quantity }) => {
      if (quantity <= 0) {
        items.delete(variant_id);
      } else {
        items.set(variant_id, quantity);
      }
    });
    return this.buildResponse(shopId);
  }

  async removeItem(shopId: string, variantId: string): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    this.getShopItems(shopId).delete(variantId);
    return this.buildResponse(shopId);
  }

  async clearCart(shopId: string): Promise<CartResponse> {
    await new Promise((res) => setTimeout(res, 200));
    this.carts.set(shopId, new Map());
    return this.buildResponse(shopId);
  }

  async clearCarts(shopIds: string[]): Promise<CartResponse[]> {
    await new Promise((res) => setTimeout(res, 200));
    shopIds.forEach((shopId) => this.carts.set(shopId, new Map()));
    return shopIds.map((shopId) => this.buildResponse(shopId));
  }

  private buildOrder(cart: CartResponse, paymentMethod: PaymentMethod): OrderApi {
    const subtotal = parseFloat(cart.subtotal);
    const totalAmount = (subtotal + parseFloat(MOCK_DELIVERY_CHARGE)).toFixed(2);
    const orderId = `order_${cart.shop_id}_${Date.now()}`;
    return {
      order_id: orderId,
      shop_id: cart.shop_id,
      shop_name: cart.shop_name,
      status: paymentMethod === 'COD' ? 'PLACED' : 'PENDING_PAYMENT',
      subtotal: cart.subtotal,
      delivery_charge: MOCK_DELIVERY_CHARGE,
      discount_amount: '0.00',
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
      items: cart.items.map((item) => ({
        variant_id: item.variant_id,
        variant_name: item.variant_name,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        unit_price: item.selling_price,
        total_price: item.line_total,
      })),
      payment: {
        payment_id: `pay_${orderId}`,
        payment_method: paymentMethod,
        amount: totalAmount,
        status: paymentMethod === 'COD' ? 'COD' : 'PENDING',
        ...(paymentMethod === 'RAZORPAY' ? { razorpay_order_id: `rzp_${orderId}` } : {}),
      },
    };
  }

  async checkoutShop(shopId: string, body: CheckoutRequest): Promise<CheckoutResponse> {
    await new Promise((res) => setTimeout(res, 400));
    const cart = this.buildResponse(shopId);
    if (cart.items.length === 0) throw new Error('Your cart is empty.');
    const order = this.buildOrder(cart, body.payment_method);
    this.carts.set(shopId, new Map());
    if (body.payment_method === 'RAZORPAY') {
      this.pendingOrders = [order];
      return {
        order,
        razorpay_order_id: order.payment!.razorpay_order_id,
        amount: order.total_amount,
        currency: 'INR',
        key_id: MOCK_RAZORPAY_KEY_ID,
      };
    }
    return { order };
  }

  async checkoutAll(body: CheckoutRequest): Promise<CheckoutAllResponse> {
    await new Promise((res) => setTimeout(res, 400));
    const shopIds = Array.from(this.carts.keys()).filter((id) => this.buildResponse(id).items.length > 0);
    if (shopIds.length === 0) throw new Error('Your cart is empty.');
    const orders = shopIds.map((shopId) => {
      const order = this.buildOrder(this.buildResponse(shopId), body.payment_method);
      this.carts.set(shopId, new Map());
      return order;
    });
    if (body.payment_method === 'RAZORPAY') {
      this.pendingOrders = orders;
      const totalAmount = orders.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);
      return {
        orders,
        razorpay_order_id: `rzp_order_all_${Date.now()}`,
        amount: totalAmount.toFixed(2),
        currency: 'INR',
        key_id: MOCK_RAZORPAY_KEY_ID,
      };
    }
    return { orders };
  }

  async verifyPayment(payload: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    await new Promise((res) => setTimeout(res, 400));
    const orders = this.pendingOrders.map((order) => ({
      ...order,
      status: 'PLACED',
      payment: order.payment ? { ...order.payment, status: 'SUCCESS' } : order.payment,
    }));
    this.pendingOrders = [];
    return { orders };
  }
}

export const cartService: ICartService = new CartFixtureService();
