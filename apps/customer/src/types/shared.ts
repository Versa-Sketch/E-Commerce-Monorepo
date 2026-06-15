export type UserRole = 'customer' | 'merchant' | 'delivery' | 'admin';
export type AddressType = 'HOME' | 'WORK' | 'SHOP' | 'OTHER';
export interface AddressApi {
  id: string;
  address_line1: string;
  address_line2?: string;
  latitude: string;
  longitude: string;
  state: string;
  pincode: string;
  address_type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
export interface AddressInput {
  address_line1: string;
  address_line2?: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  address_type?: AddressType;
  is_default?: boolean;
}
export interface Address {
  id: string;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  shopId: string | null;
  avatarUrl?: string;
  walletBalance: number;
  addresses: Address[];
  createdAt: string;
}
export type StoreCategory =
  | 'grocery'
  | 'pharmacy'
  | 'fashion'
  | 'restaurants'
  | 'electronics'
  | 'local_business'
  | 'others'
  | 'food'
  | 'daily_amenities'
  | 'general_store';
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  logoUrl?: string;
  coverUrl?: string;
  rating: number;
  reviewCount: number;
  distance: number;
  deliveryEta: number;
  deliveryFee: number;
  minOrderValue: number;
  isOpen: boolean;
  address: string;
  phone: string;
  about?: string;
  latitude?: number;
  longitude?: number;
}
export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  gstPercent: number;
  expiryDate?: string;
  validityDate?: string;
  refundPolicy?: string;
  inStock: boolean;
  stockCount: number;
  category: string;
  isBargainable: boolean;
  rating: number;
  reviews?: Review[];
  variantId?: string;
  variantName?: string;
  availableStock?: number;
}
export interface Paginated<T> {
  status: number;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: T[];
}
export interface GlobalSubcategory {
  id: string;
  name: string;
  image: string;
}
export interface GlobalCategory {
  id: string;
  name: string;
  image: string;
  subcategories: GlobalSubcategory[];
}
export interface ShopType {
  id: string;
  name: string;
  slug: string;
}
export interface Shop {
  id: string;
  name: string;
  description: string;
  phone_number: string;
  is_open: boolean;
  is_verified: boolean;
  average_rating: string;
  min_order: string;
  delivery_radius_km: string;
  surge_fee: string;
  cod_toggle: boolean;
  shop_types: ShopType[];
  logo_url?: string;
  cover_image_url?: string;
  review_count?: number;
  distance_km?: number;
  eta_min_minutes?: number;
  eta_max_minutes?: number;
  matched_categories?: { id: string; name: string; image: string }[];
  matched_subcategories?: { id: string; name: string; image: string }[];
}
export interface ShopSubcategory {
  id: string;
  name: string;
  image: string;
  product_count: number;
}
export interface ShopCategory {
  id: string;
  name: string;
  image: string;
  product_count: number;
  subcategories: ShopSubcategory[];
}
export interface ProductUnit {
  id: string;
  name: string;
  symbol: string;
  unit_type: string;
}
export interface ProductVariant {
  id: string;
  name: string;
  unit: ProductUnit;
  quantity_per_unit: string;
  sku: string;
  mrp: string;
  selling_price: string;
  image: string;
  position: number;
  available_stock: string;
  is_in_stock: boolean;
}
export interface ShopProductCategoryRef {
  id: string;
  name: string;
  image: string;
}
export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  is_perishable: boolean;
  category: ShopProductCategoryRef | null;
  subcategory: ShopProductCategoryRef | null;
  brand: { id: string; name: string } | null;
  variants: ProductVariant[];
}
export interface CartItemApi {
  cart_item_id: string;
  variant_id: string;
  variant_name: string;
  product_id: string;
  product_name: string;
  product_image: string;
  mrp: string;
  selling_price: string;
  original_price?: string;
  negotiated_price?: string | null;
  negotiated_quantity?: number | null;
  effective_price?: string;
  quantity: number;
  line_total: string;
  available_stock: string;
  is_in_stock: boolean;
  is_locked?: boolean;
  eligible?: boolean;
}
export interface CartSummary {
  cart_id: string;
  shop_id: string;
  shop_name: string;
  item_count: number;
  subtotal: string;
  is_below_min_order: boolean;
  min_order: string;
  active_bargain_session_id?: string | null;
}
export interface CartResponse extends CartSummary {
  items: CartItemApi[];
}
export interface CartProductsGroup {
  cart_id: string;
  shop_id: string;
  shop_name: string;
  item_count: number;
  items: CartItemApi[];
}
export interface BulkCartItemInput {
  variant_id: string;
  quantity: number;
}
export interface CheckoutAddress {
  id: string;
  address_line1: string;
  address_line2: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
}
export interface CheckoutCartPreview {
  cart_id: string;
  shop_id: string;
  shop_name: string;
  shop_is_open: boolean;
  cod_available: boolean;
  items: CartItemApi[];
  item_count: number;
  subtotal: string;
  delivery_charge: string;
  min_order: string;
  is_below_min_order: boolean;
  active_bargain_session_id?: string | null;
  stock_problems: string[];
  blockers: string[];
}
export interface CheckoutAllPreview {
  carts: CheckoutCartPreview[];
  grand_subtotal: string;
  grand_delivery_charge: string;
  grand_discount_amount: string;
  grand_total_amount: string;
  addresses: CheckoutAddress[];
  can_checkout: boolean;
  blockers: string[];
}
export interface CheckoutCartSinglePreview extends CheckoutCartPreview {
  discount_amount: string;
  total_amount: string;
  addresses: CheckoutAddress[];
  can_checkout: boolean;
}
export type PaymentMethod = 'COD' | 'RAZORPAY';
export interface CheckoutRequest {
  address_id: string;
  payment_method: PaymentMethod;
}
export interface OrderItemApi {
  variant_id: string;
  variant_name: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}
export interface OrderPaymentApi {
  payment_id: string;
  payment_method: PaymentMethod;
  amount: string;
  status: string;
  razorpay_order_id?: string;
}
export interface OrderApi {
  order_id: string;
  shop_id: string;
  shop_name: string;
  status: string;
  subtotal: string;
  delivery_charge: string;
  discount_amount: string;
  total_amount: string;
  created_at: string;
  items: OrderItemApi[];
  payment?: OrderPaymentApi;
}
export interface CheckoutResponse {
  order: OrderApi;
  razorpay_order_id?: string;
  amount?: string;
  currency?: string;
  key_id?: string;
}
export interface CheckoutAllResponse {
  orders: OrderApi[];
  razorpay_order_id?: string;
  amount?: string;
  currency?: string;
  key_id?: string;
}
export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface PaymentVerifyResponse {
  orders: OrderApi[];
}
