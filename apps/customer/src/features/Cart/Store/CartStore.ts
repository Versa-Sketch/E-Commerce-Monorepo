import { makeAutoObservable, runInAction } from "mobx";
import {
  CartItemApi,
  CartProductsGroup,
  CartResponse,
  CheckoutAllPreview,
  CheckoutCartSinglePreview,
  CartSummary,
  CheckoutAllResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  Product,
} from "../../../types/shared";
import { CartItem, CartTotals, Coupon } from "../types/domain";
import { API_STATUS, ApiStatus, FEES } from "../../../Common/Constants";
import { normalizeError } from "../../../Common/utils/errorNormalizer";
import { ICartService } from "../Services";

const BULK_SYNC_DEBOUNCE_MS = 600;
const CART_POLL_INTERVAL_MS = 10000000000;

export class CartStore {
  items: CartItem[] = [];
  coupon: Coupon = { code: null, discount: 0 };
  walletCreditsUsed: number = 0;

  shopCarts: Map<string, CartResponse> = new Map();
  shopCartStatus: Map<string, ApiStatus> = new Map();
  syncStatus: Map<string, ApiStatus> = new Map();

  cartSummaries: CartSummary[] = [];
  cartSummariesStatus: ApiStatus = API_STATUS.IDLE;
  cartSummariesError: string | null = null;

  cartsWithProducts: CartProductsGroup[] = [];
  cartsWithProductsStatus: ApiStatus = API_STATUS.IDLE;
  cartsWithProductsError: string | null = null;

  checkoutPreview: CheckoutAllPreview | null = null;
  checkoutPreviewStatus: ApiStatus = API_STATUS.IDLE;
  checkoutPreviewError: string | null = null;

  cartCheckoutPreviews: Map<string, CheckoutCartSinglePreview> = new Map();
  cartCheckoutPreviewStatus: Map<string, ApiStatus> = new Map();
  cartCheckoutPreviewError: Map<string, string> = new Map();
  checkoutStatus: ApiStatus = API_STATUS.IDLE;
  checkoutError: string | null = null;

  private pendingByShop: Map<string, Map<string, number>> = new Map();
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> =
    new Map();
  private snapshotByShop: Map<string, Map<string, CartItem | undefined>> =
    new Map();
  private inFlightByShop: Map<string, Set<string>> = new Map();
  private mutationVersionByVariant: Map<string, number> = new Map();
  private inFlightVersionByShop: Map<string, Map<string, number>> = new Map();

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private service: ICartService,
    private onSyncError?: (message: string) => void,
  ) {
    makeAutoObservable(this, {
      pendingByShop: false,
      debounceTimers: false,
      snapshotByShop: false,
      inFlightByShop: false,
      mutationVersionByVariant: false,
      inFlightVersionByShop: false,
      pollTimer: false,
    } as never);
  }

  get totalItemCount(): number {
    return this.items.reduce((acc, i) => acc + i.quantity, 0);
  }

  get totals(): CartTotals {
    const subtotal = this.items.reduce(
      (acc, i) =>
        acc + (i.product.discountPrice ?? i.product.price) * i.quantity,
      0,
    );
    const gstTotal = this.items.reduce(
      (acc, i) =>
        acc +
        ((i.product.discountPrice ?? i.product.price) *
          i.quantity *
          i.product.gstPercent) /
        100,
      0,
    );
    const deliveryFee = this.items.length > 0 ? FEES.DEFAULT_DELIVERY_FEE : 0;
    const platformFee = this.items.length > 0 ? FEES.PLATFORM_FEE : 0;
    let couponDiscount = 0;
    if (this.coupon.code && this.coupon.discount > 0) {
      couponDiscount = (subtotal * this.coupon.discount) / 100;
    }
    let grandTotal =
      subtotal +
      gstTotal +
      deliveryFee +
      platformFee -
      couponDiscount -
      this.walletCreditsUsed;
    if (grandTotal < 0) grandTotal = 0;
    return {
      subtotal,
      gstTotal,
      deliveryFee,
      platformFee,
      couponDiscount,
      grandTotal,
    };
  }

  get groupedByStore(): {
    storeId: string;
    storeName: string;
    items: CartItem[];
  }[] {
    const map = new Map<
      string,
      { storeId: string; storeName: string; items: CartItem[] }
    >();
    this.items.forEach((item) => {
      const key = item.product.storeId;
      if (!map.has(key)) {
        map.set(key, {
          storeId: key,
          storeName: item.product.storeName || "Store",
          items: [],
        });
      }
      map.get(key)!.items.push(item);
    });
    return Array.from(map.values());
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  getQuantityForProduct(productId: string): number {
    return this.items.find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  getShopItems(shopId: string): CartItem[] {
    return this.items.filter((i) => i.product.storeId === shopId);
  }

  getShopItemCount(shopId: string): number {
    return this.getShopItems(shopId).reduce((acc, i) => acc + i.quantity, 0);
  }

  getShopTotals(shopId: string): CartTotals {
    const shopItems = this.getShopItems(shopId);
    const subtotal = shopItems.reduce(
      (acc, i) =>
        acc + (i.product.discountPrice ?? i.product.price) * i.quantity,
      0,
    );
    const gstTotal = shopItems.reduce(
      (acc, i) =>
        acc +
        ((i.product.discountPrice ?? i.product.price) *
          i.quantity *
          i.product.gstPercent) /
        100,
      0,
    );
    const deliveryFee = shopItems.length > 0 ? FEES.DEFAULT_DELIVERY_FEE : 0;
    const platformFee = shopItems.length > 0 ? FEES.PLATFORM_FEE : 0;
    const grandTotal = subtotal + gstTotal + deliveryFee + platformFee;
    return {
      subtotal,
      gstTotal,
      deliveryFee,
      platformFee,
      couponDiscount: 0,
      grandTotal,
    };
  }

  /** True while a quantity change for this variant is queued or in-flight to the server. */
  isSyncing(variantId?: string): boolean {
    if (!variantId) return false;
    for (const pending of this.pendingByShop.values()) {
      if (pending.has(variantId)) return true;
    }
    for (const inFlight of this.inFlightByShop.values()) {
      if (inFlight.has(variantId)) return true;
    }
    return false;
  }

  /**
   * Single entry point for ADD / increment / decrement. Updates local state
   * optimistically and (if the product carries a variantId) queues a
   * debounced bulk-update sync for that shop's cart.
   */
  setQuantity(product: Product, quantity: number): void {
    const existingIndex = this.items.findIndex(
      (i) => i.product.id === product.id,
    );
    const previousItem: CartItem | undefined =
      existingIndex !== -1 ? { ...this.items[existingIndex] } : undefined;
    if (quantity <= 0) {
      if (existingIndex !== -1) this.items.splice(existingIndex, 1);
    } else if (existingIndex !== -1) {
      this.items[existingIndex].quantity = quantity;
      this.items[existingIndex].product = product;
    } else {
      this.items.push({ product, quantity });
    }
    if (this.items.length === 0) {
      this.coupon = { code: null, discount: 0 };
      this.walletCreditsUsed = 0;
    }
    if (product.variantId) {
      this.bumpMutationVersion(product.variantId);
      this.queueBulkUpdate(
        product.storeId,
        product.variantId,
        Math.max(0, quantity),
        previousItem,
      );
    }
  }

  private bumpMutationVersion(variantId: string): number {
    const nextVersion = (this.mutationVersionByVariant.get(variantId) ?? 0) + 1;
    this.mutationVersionByVariant.set(variantId, nextVersion);
    return nextVersion;
  }

  private getCurrentMutationVersion(variantId: string): number {
    return this.mutationVersionByVariant.get(variantId) ?? 0;
  }

  private isVariantPendingOrInFlight(variantId: string): boolean {
    for (const pending of this.pendingByShop.values()) {
      if (pending.has(variantId)) return true;
    }
    for (const inFlight of this.inFlightByShop.values()) {
      if (inFlight.has(variantId)) return true;
    }
    return false;
  }

  private isShopPendingOrInFlight(shopId: string): boolean {
    return (
      (this.pendingByShop.get(shopId)?.size ?? 0) > 0 ||
      (this.inFlightByShop.get(shopId)?.size ?? 0) > 0
    );
  }

  private queueBulkUpdate(
    shopId: string,
    variantId: string,
    quantity: number,
    previousItem: CartItem | undefined,
  ): void {
    if (!this.pendingByShop.has(shopId))
      this.pendingByShop.set(shopId, new Map());
    const pending = this.pendingByShop.get(shopId)!;
    if (!pending.has(variantId)) {
      if (!this.snapshotByShop.has(shopId))
        this.snapshotByShop.set(shopId, new Map());
      this.snapshotByShop.get(shopId)!.set(variantId, previousItem);
    }
    pending.set(variantId, quantity);
    const existingTimer = this.debounceTimers.get(shopId);
    if (existingTimer) clearTimeout(existingTimer);
    this.debounceTimers.set(
      shopId,
      setTimeout(() => this.flushShopCart(shopId), BULK_SYNC_DEBOUNCE_MS),
    );
  }

  /**
   * Non-optimistic quantity/remove sync: unlike `setQuantity`, does not touch
   * `this.items` until the server confirms the change. Intended for screens
   * (e.g. checkout) that show a blocking loading state and only want the cart
   * to update once the result is known.
   */
  async syncItemQuantity(
    product: Product,
    quantity: number,
  ): Promise<{ ok: boolean; error?: string }> {
    if (!product.variantId)
      return { ok: false, error: "This item cannot be updated." };
    const shopId = product.storeId;
    const variantId = product.variantId;
    try {
      const cart =
        quantity > 0
          ? await this.service.bulkUpdate(shopId, [
            { variant_id: variantId, quantity },
          ])
          : await this.service.removeItem(shopId, variantId);
      runInAction(() => {
        this.shopCarts.set(shopId, cart);
        this.hydrateFromShopCart(cart);
        this.syncStatus.set(shopId, API_STATUS.SUCCESS);
      });
      return { ok: true };
    } catch (e) {
      const error = normalizeError(e);
      runInAction(() => {
        this.syncStatus.set(shopId, API_STATUS.ERROR);
      });
      return { ok: false, error };
    }
  }

  private async flushShopCart(shopId: string): Promise<void> {
    this.debounceTimers.delete(shopId);
    const pending = this.pendingByShop.get(shopId);
    if (!pending || pending.size === 0) return;
    this.pendingByShop.delete(shopId);
    const snapshot = this.snapshotByShop.get(shopId);
    this.snapshotByShop.delete(shopId);
    const toUpsert: { variant_id: string; quantity: number }[] = [];
    const toRemove: string[] = [];
    pending.forEach((qty, variant_id) => {
      if (qty > 0) toUpsert.push({ variant_id, quantity: qty });
      else toRemove.push(variant_id);
    });
    const allVariantIds = Array.from(pending.keys());
    const requestVersions = new Map(
      allVariantIds.map((variantId) => [
        variantId,
        this.getCurrentMutationVersion(variantId),
      ]),
    );
    this.inFlightByShop.set(shopId, new Set(allVariantIds));
    this.inFlightVersionByShop.set(shopId, requestVersions);
    runInAction(() => {
      this.syncStatus.set(shopId, API_STATUS.FETCHING);
    });
    try {
      let cart: CartResponse | undefined;
      if (toUpsert.length > 0) {
        cart = await this.service.bulkUpdate(shopId, toUpsert);
      }
      for (const variantId of toRemove) {
        cart = await this.service.removeItem(shopId, variantId);
      }
      runInAction(() => {
        if (cart) {
          this.shopCarts.set(shopId, cart);
          this.hydrateFromShopCart(cart, requestVersions);
        }
        this.syncStatus.set(shopId, API_STATUS.SUCCESS);
      });
    } catch (e) {
      runInAction(() => {
        this.syncStatus.set(shopId, API_STATUS.ERROR);
        this.rollback(allVariantIds, snapshot, requestVersions);
        this.onSyncError?.(normalizeError(e));
      });
    } finally {
      if (this.inFlightVersionByShop.get(shopId) === requestVersions) {
        this.inFlightByShop.delete(shopId);
        this.inFlightVersionByShop.delete(shopId);
      }
    }
  }

  /** Reverts items to their pre-edit state after a failed sync. */
  private rollback(
    variantIds: string[],
    snapshot?: Map<string, CartItem | undefined>,
    requestVersions?: Map<string, number>,
  ): void {
    if (!snapshot) return;
    variantIds.forEach((variantId) => {
      if (
        requestVersions?.has(variantId) &&
        requestVersions.get(variantId) !==
        this.getCurrentMutationVersion(variantId)
      ) {
        return;
      }
      const previousItem = snapshot.get(variantId);
      const index = this.items.findIndex(
        (i) => i.product.variantId === variantId,
      );
      if (!previousItem || previousItem.quantity <= 0) {
        if (index !== -1) this.items.splice(index, 1);
      } else if (index !== -1) {
        this.items[index] = previousItem;
      } else {
        this.items.push(previousItem);
      }
    });
  }

  /** Hydrates local cart items for a shop from the server (call on shop entry). */
  async getShopCart(shopId: string): Promise<void> {
    this.shopCartStatus.set(shopId, API_STATUS.FETCHING);
    try {
      const cart = await this.service.getShopCart(shopId);
      runInAction(() => {
        this.shopCarts.set(shopId, cart);
        this.shopCartStatus.set(shopId, API_STATUS.SUCCESS);
        this.hydrateFromShopCart(cart);
      });
    } catch (e) {
      runInAction(() => {
        this.shopCartStatus.set(shopId, API_STATUS.ERROR);
      });
    }
  }

  /** Builds a local `CartItem` (Product + quantity) from an API cart item. */
  private mapApiItemToCartItem(
    apiItem: CartItemApi,
    shopId: string,
    shopName: string,
  ): CartItem {
    const mrp = parseFloat(apiItem.mrp);
    const sellingPrice = parseFloat(apiItem.selling_price);
    const product: Product = {
      id: apiItem.product_id,
      storeId: shopId,
      storeName: shopName,
      name: apiItem.product_name,
      description: "",
      imageUrl: apiItem.product_image,
      price: mrp,
      discountPrice: sellingPrice < mrp ? sellingPrice : undefined,
      gstPercent: 0,
      inStock: apiItem.is_in_stock,
      stockCount: Math.floor(parseFloat(apiItem.available_stock)),
      category: "",
      isBargainable: false,
      rating: 0,
      variantId: apiItem.variant_id,
      variantName: apiItem.variant_name,
      availableStock: Math.floor(parseFloat(apiItem.available_stock)),
    };
    return { product, quantity: apiItem.quantity };
  }

  /** Fully reconciles local items for this shop against the server's cart (adds, updates, removes). */
  private hydrateFromShopCart(
    cart: CartResponse,
    acceptedVersions?: Map<string, number>,
  ): void {
    const apiVariantIds = new Set(cart.items.map((i) => i.variant_id));
    this.items = this.items.filter(
      (i) =>
        i.product.storeId !== cart.shop_id ||
        this.shouldPreserveLocalVariant(
          i.product.variantId,
          acceptedVersions,
        ) ||
        apiVariantIds.has(i.product.variantId ?? ""),
    );
    cart.items.forEach((apiItem) => {
      if (this.shouldPreserveLocalVariant(apiItem.variant_id, acceptedVersions))
        return;
      const existing = this.items.find(
        (i) => i.product.variantId === apiItem.variant_id,
      );
      if (existing) {
        existing.quantity = apiItem.quantity;
        return;
      }
      this.items.push(
        this.mapApiItemToCartItem(apiItem, cart.shop_id, cart.shop_name),
      );
    });
  }

  private shouldPreserveLocalVariant(
    variantId?: string,
    acceptedVersions?: Map<string, number>,
  ): boolean {
    if (!variantId || !this.isVariantPendingOrInFlight(variantId)) return false;
    if (!acceptedVersions?.has(variantId)) return true;
    return (
      acceptedVersions.get(variantId) !==
      this.getCurrentMutationVersion(variantId)
    );
  }

  /** Cross-shop cart summaries, e.g. for a global cart badge/list. */
  async fetchCartSummaries(page = 1, pageSize = 20): Promise<void> {
    this.cartSummariesStatus = API_STATUS.FETCHING;
    this.cartSummariesError = null;
    try {
      const result = await this.service.getCarts(page, pageSize);
      runInAction(() => {
        this.cartSummaries = result.data;
        this.cartSummariesStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.cartSummariesError = normalizeError(e);
        this.cartSummariesStatus = API_STATUS.ERROR;
      });
    }
  }

  /** All active, non-empty carts grouped by shop with full item/product details. */
  async fetchCartsWithProducts(): Promise<void> {
    this.cartsWithProductsStatus = API_STATUS.FETCHING;
    this.cartsWithProductsError = null;
    try {
      const groups = await this.service.getCartsWithProducts();
      runInAction(() => {
        this.cartsWithProducts = groups;
        this.cartsWithProductsStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.cartsWithProductsError = normalizeError(e);
        this.cartsWithProductsStatus = API_STATUS.ERROR;
      });
    }
  }

  /** Read-only checkout preview (totals, blockers, addresses) across all non-empty carts. */
  async fetchCheckoutPreview(): Promise<void> {
    this.checkoutPreviewStatus = API_STATUS.FETCHING;
    this.checkoutPreviewError = null;
    try {
      const preview = await this.service.getCheckoutAllPreview();
      runInAction(() => {
        this.checkoutPreview = preview;
        this.checkoutPreviewStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.checkoutPreviewError = normalizeError(e);
        this.checkoutPreviewStatus = API_STATUS.ERROR;
      });
    }
  }

  /** Read-only checkout preview (totals, blockers, addresses) for a single cart. */
  async fetchCartCheckoutPreview(cartId: string): Promise<void> {
    this.cartCheckoutPreviewStatus.set(cartId, API_STATUS.FETCHING);
    this.cartCheckoutPreviewError.delete(cartId);
    try {
      const preview = await this.service.getCheckoutCartPreview(cartId);
      runInAction(() => {
        this.cartCheckoutPreviews.set(cartId, preview);
        this.cartCheckoutPreviewStatus.set(cartId, API_STATUS.SUCCESS);
      });
    } catch (e) {
      runInAction(() => {
        this.cartCheckoutPreviewError.set(cartId, normalizeError(e));
        this.cartCheckoutPreviewStatus.set(cartId, API_STATUS.ERROR);
      });
    }
  }

  /**
   * Loads every shop cart the user has on the server and hydrates local
   * items from them. Call on app/home entry so the floating cart reflects
   * carts created in previous sessions without requiring a shop visit first.
   * Also starts a recurring refresh so the cart never goes stale.
   */
  async hydrateAllCarts(): Promise<void> {
    await this.refreshAllCarts();
    if (!this.pollTimer) {
      this.pollTimer = setInterval(() => {
        this.refreshAllCarts();
      }, CART_POLL_INTERVAL_MS);
    }
  }

  stopCartPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async refreshAllCarts(): Promise<void> {
    await Promise.all([
      this.fetchCartSummaries(),
      this.fetchCartsWithProducts(),
    ]);
    const validShopIds = new Set(
      this.cartSummaries.map((summary) => summary.shop_id),
    );
    runInAction(() => {
      this.items = this.items.filter(
        (i) =>
          validShopIds.has(i.product.storeId) ||
          this.isShopPendingOrInFlight(i.product.storeId),
      );
      this.cartsWithProducts.forEach((group) => {
        const summary = this.cartSummaries.find(
          (s) => s.shop_id === group.shop_id,
        );
        const cart: CartResponse = {
          cart_id: group.cart_id,
          shop_id: group.shop_id,
          shop_name: group.shop_name,
          item_count: group.item_count,
          subtotal: summary?.subtotal ?? "0.00",
          is_below_min_order: summary?.is_below_min_order ?? false,
          min_order: summary?.min_order ?? "0.00",
          active_bargain_session_id: summary?.active_bargain_session_id ?? null,
          items: group.items,
        };
        this.shopCarts.set(group.shop_id, cart);
        this.hydrateFromShopCart(cart);
      });
    });
  }

  async clearShopCart(shopId: string): Promise<void> {
    const removedItems = this.items.filter((i) => i.product.storeId === shopId);

    runInAction(() => {
      this.items = this.items.filter((i) => i.product.storeId !== shopId);
      this.pendingByShop.delete(shopId);
      const timer = this.debounceTimers.get(shopId);
      if (timer) clearTimeout(timer);
      this.debounceTimers.delete(shopId);
      if (this.items.length === 0) {
        this.coupon = { code: null, discount: 0 };
        this.walletCreditsUsed = 0;
      }
    });

    try {
      const cart = await this.service.clearCart(shopId);
      runInAction(() => {
        this.shopCarts.set(shopId, cart);
      });
    } catch (e) {
      runInAction(() => {
        this.items = [...this.items, ...removedItems];
        this.syncStatus.set(shopId, API_STATUS.ERROR);
      });
    }
  }

  async clearAllCarts(): Promise<void> {
    const shopIds = Array.from(
      new Set(this.items.map((i) => i.product.storeId)),
    );
    if (shopIds.length === 0) return;

    // Optimistic clear — update UI immediately before API responds
    runInAction(() => {
      this.items = [];
      shopIds.forEach((id) => this.shopCarts.delete(id));
      this.coupon = { code: null, discount: 0 };
      this.walletCreditsUsed = 0;
      shopIds.forEach((id) => {
        this.pendingByShop.delete(id);
        const timer = this.debounceTimers.get(id);
        if (timer) clearTimeout(timer);
        this.debounceTimers.delete(id);
      });
    });

    try {
      await this.service.clearCarts(shopIds);
    } catch (e) {
      this.onSyncError?.(normalizeError(e));
    }
  }

  clearCart(): void {
    this.items = [];
    this.coupon = { code: null, discount: 0 };
    this.walletCreditsUsed = 0;
  }

  /** Removes a shop's items from local state after its order has been placed. */
  private clearLocalShopCart(shopId: string): void {
    this.items = this.items.filter((i) => i.product.storeId !== shopId);
    this.shopCarts.delete(shopId);
    this.cartSummaries = this.cartSummaries.filter((s) => s.shop_id !== shopId);
    this.pendingByShop.delete(shopId);
    const timer = this.debounceTimers.get(shopId);
    if (timer) clearTimeout(timer);
    this.debounceTimers.delete(shopId);
    if (this.items.length === 0) {
      this.coupon = { code: null, discount: 0 };
      this.walletCreditsUsed = 0;
    }
  }

  /** Places an order for a single shop's cart. On COD success, clears that shop's cart locally. */
  async checkoutShop(
    shopId: string,
    body: CheckoutRequest,
  ): Promise<CheckoutResponse | null> {
    this.checkoutStatus = API_STATUS.FETCHING;
    this.checkoutError = null;
    try {
      const result = await this.service.checkoutShop(shopId, body);
      runInAction(() => {
        this.checkoutStatus = API_STATUS.SUCCESS;
        if (body.payment_method === "COD") {
          this.clearLocalShopCart(shopId);
        }
      });
      return result;
    } catch (e) {
      runInAction(() => {
        this.checkoutError = normalizeError(e);
        this.checkoutStatus = API_STATUS.ERROR;
      });
      return null;
    }
  }

  /** Places orders for every shop cart. On COD success, clears all carts locally. */
  async checkoutAll(
    body: CheckoutRequest,
  ): Promise<CheckoutAllResponse | null> {
    this.checkoutStatus = API_STATUS.FETCHING;
    this.checkoutError = null;
    const shopIds = Array.from(
      new Set(this.items.map((i) => i.product.storeId)),
    );
    try {
      const result = await this.service.checkoutAll(body);
      runInAction(() => {
        this.checkoutStatus = API_STATUS.SUCCESS;
        if (body.payment_method === "COD") {
          shopIds.forEach((shopId) => this.clearLocalShopCart(shopId));
        }
      });
      return result;
    } catch (e) {
      runInAction(() => {
        this.checkoutError = normalizeError(e);
        this.checkoutStatus = API_STATUS.ERROR;
      });
      return null;
    }
  }

  /** Verifies a Razorpay payment after the SDK callback. On success, clears carts for the placed orders. */
  async verifyPayment(
    payload: PaymentVerifyRequest,
  ): Promise<PaymentVerifyResponse | null> {
    this.checkoutStatus = API_STATUS.FETCHING;
    this.checkoutError = null;
    try {
      const result = await this.service.verifyPayment(payload);
      runInAction(() => {
        this.checkoutStatus = API_STATUS.SUCCESS;
        result.orders.forEach((order) =>
          this.clearLocalShopCart(order.shop_id),
        );
      });
      return result;
    } catch (e) {
      runInAction(() => {
        this.checkoutError = normalizeError(e);
        this.checkoutStatus = API_STATUS.ERROR;
      });
      return null;
    }
  }

  resetCheckoutStatus(): void {
    this.checkoutStatus = API_STATUS.IDLE;
    this.checkoutError = null;
  }

  applyCoupon(code: string, discount: number): void {
    this.coupon = { code, discount };
  }
  removeCoupon(): void {
    this.coupon = { code: null, discount: 0 };
  }
  setWalletCreditsUsed(amount: number): void {
    this.walletCreditsUsed = amount;
  }
}
