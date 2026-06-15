export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'merchant' | 'delivery' | 'admin';
  avatarUrl?: string;
  walletBalance: number;
  addresses: Address[];
  createdAt: string;
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
}
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface CartStoreGroup {
  storeId: string;
  storeName: string;
  deliveryFee: number;
  items: CartItem[];
  subtotal: number;
  gstTotal: number;
}
export interface CartState {
  items: CartItem[];
  walletCreditsUsed: number;
  couponCode?: string;
  couponDiscount: number;
  platformFee: number;
}
export type BargainStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export interface BargainTimelineEvent {
  id: string;
  actor: 'customer' | 'merchant' | 'system';
  price: number;
  note?: string;
  timestamp: string;
}
export interface BargainOffer {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  storeId: string;
  storeName: string;
  originalPrice: number;
  offeredPrice: number;
  status: BargainStatus;
  timeline: BargainTimelineEvent[];
  createdAt: string;
  expiresAt: string;
}
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: 'wallet' | 'card' | 'upi' | 'cod';
  createdAt: string;
  trackingTimeline: {
    status: OrderStatus;
    timestamp: string;
    isCompleted: boolean;
  }[];
  deliveryPartner?: {
    name: string;
    phone: string;
    avatarUrl?: string;
    latitude: number;
    longitude: number;
  };
}
