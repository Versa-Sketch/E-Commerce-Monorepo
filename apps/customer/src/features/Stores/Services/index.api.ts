import { AxiosInstance } from 'axios';
import { STORE_ENDPOINTS } from '../Constants/STORE_ENDPOINTS';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import {
  Store,
  Product,
  GlobalCategory,
  Shop,
  ShopCategory,
  ShopProduct,
  Paginated,
} from '../../../types/shared';
import {
  IStoreService,
  StoreFilters,
  ShopFilters,
  ShopSearchFilters,
  ShopProductFilters,
  ShopProductSearchFilters,
  ShopSortFilter,
} from './index';
export class StoreApiService implements IStoreService {
  constructor(private client: AxiosInstance) {}
  async getStores(filters?: StoreFilters): Promise<Store[]> {
    try {
      const params: Record<string, string> = {};
      if (filters?.selectedCategory && filters.selectedCategory !== 'all') {
        params.category = filters.selectedCategory;
      }
      if (filters?.searchQuery) {
        params.search = filters.searchQuery;
      }
      const response = await this.client.get(STORE_ENDPOINTS.LIST, { params });
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getStoreById(storeId: string): Promise<Store> {
    try {
      const response = await this.client.get(STORE_ENDPOINTS.DETAIL.replace(':id', storeId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getProductsByStore(storeId: string): Promise<Product[]> {
    try {
      const response = await this.client.get(STORE_ENDPOINTS.PRODUCTS.replace(':id', storeId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await this.client.get(
        STORE_ENDPOINTS.PRODUCT_DETAIL.replace(':id', productId)
      );
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getGlobalCategories(): Promise<GlobalCategory[]> {
    try {
      const response = await this.client.get(STORE_ENDPOINTS.GLOBAL_CATEGORIES);
      return response.data?.data ?? [];
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getShops(filters?: ShopFilters): Promise<Paginated<Shop>> {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (filters?.category_id) params.category_id = filters.category_id;
      if (filters?.subcategory_id) params.subcategory_id = filters.subcategory_id;
      if (filters?.is_open !== undefined) params.is_open = filters.is_open;
      if (filters?.lat !== undefined) params.lat = filters.lat;
      if (filters?.lng !== undefined) params.lng = filters.lng;
      if (filters?.page) params.page = filters.page;
      if (filters?.page_size) params.page_size = filters.page_size;
      const response = await this.client.get(STORE_ENDPOINTS.SHOPS, { params });
      return response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getFeaturedShops(): Promise<Shop[]> {
    try {
      const response = await this.client.get(STORE_ENDPOINTS.FEATURED_SHOPS);
      return response.data?.data ?? response.data ?? [];
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async searchShops(filters: ShopSearchFilters): Promise<Paginated<Shop>> {
    try {
      const params: Record<string, string | number | boolean> = { q: filters.q };
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.subcategory_id) params.subcategory_id = filters.subcategory_id;
      if (filters.in_stock !== undefined) params.in_stock = filters.in_stock;
      if (filters.page) params.page = filters.page;
      if (filters.page_size) params.page_size = filters.page_size;
      const response = await this.client.get(STORE_ENDPOINTS.SEARCH_SHOPS, { params });
      return response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getShopCategories(shopId: string, includeEmpty?: boolean): Promise<ShopCategory[]> {
    try {
      const params: Record<string, boolean> = {};
      if (includeEmpty !== undefined) params.include_empty = includeEmpty;
      const response = await this.client.get(
        STORE_ENDPOINTS.SHOP_CATEGORIES.replace(':id', shopId),
        { params }
      );
      return response.data?.data ?? [];
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getShopProducts(shopId: string, filters?: ShopProductFilters): Promise<Paginated<ShopProduct>> {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (filters?.category_id) params.category_id = filters.category_id;
      if (filters?.subcategory_id) params.subcategory_id = filters.subcategory_id;
      if (filters?.in_stock !== undefined) params.in_stock = filters.in_stock;
      if (filters?.q) params.q = filters.q;
      if (filters?.filter) params.filter = filters.filter;
      if (filters?.page) params.page = filters.page;
      if (filters?.page_size) params.page_size = filters.page_size;
      const response = await this.client.get(
        STORE_ENDPOINTS.SHOP_PRODUCTS.replace(':id', shopId),
        { params }
      );
      return response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async searchShopProducts(shopId: string, filters: ShopProductSearchFilters): Promise<Paginated<ShopProduct>> {
    try {
      const params: Record<string, string | number> = { q: filters.q };
      if (filters.page) params.page = filters.page;
      if (filters.page_size) params.page_size = filters.page_size;
      const response = await this.client.get(
        STORE_ENDPOINTS.SEARCH_SHOP_PRODUCTS.replace(':id', shopId),
        { params }
      );
      return response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getShopFilters(shopId: string): Promise<ShopSortFilter[]> {
    try {
      const response = await this.client.get(
        STORE_ENDPOINTS.SHOP_FILTERS.replace(':id', shopId)
      );
      return response.data?.data ?? [];
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}
export const storeService: IStoreService = new StoreApiService(AppClient);
