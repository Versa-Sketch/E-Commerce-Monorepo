import {
  Store,
  Product,
  StoreCategory,
  GlobalCategory,
  Shop,
  ShopCategory,
  ShopProduct,
  Paginated,
} from '../../../types/shared';
export interface StoreFilters {
  selectedCategory: StoreCategory | 'all';
  searchQuery: string;
}
export interface ShopFilters {
  category_id?: string;
  subcategory_id?: string;
  is_open?: boolean;
  page?: number;
  page_size?: number;
}
export interface ShopSearchFilters {
  q: string;
  category_id?: string;
  subcategory_id?: string;
  in_stock?: boolean;
  page?: number;
  page_size?: number;
}
export interface ShopProductFilters {
  category_id?: string;
  subcategory_id?: string;
  in_stock?: boolean;
  page?: number;
  page_size?: number;
}
export interface IStoreService {
  getStores(filters?: StoreFilters): Promise<Store[]>;
  getStoreById(storeId: string): Promise<Store>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProductById(productId: string): Promise<Product>;
  getGlobalCategories(): Promise<GlobalCategory[]>;
  getShops(filters?: ShopFilters): Promise<Paginated<Shop>>;
  getFeaturedShops(): Promise<Shop[]>;
  searchShops(filters: ShopSearchFilters): Promise<Paginated<Shop>>;
  getShopCategories(shopId: string, includeEmpty?: boolean): Promise<ShopCategory[]>;
  getShopProducts(shopId: string, filters?: ShopProductFilters): Promise<Paginated<ShopProduct>>;
}
