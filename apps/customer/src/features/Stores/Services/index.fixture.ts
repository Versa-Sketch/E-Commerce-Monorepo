import {
  IStoreService,
  StoreFilters,
  ShopFilters,
  ShopSearchFilters,
  ShopProductFilters,
  ShopProductSearchFilters,
} from './index';
import { Store, Product, GlobalCategory, Shop, ShopCategory, ShopProduct, Paginated } from '../../../types/shared';
import { MOCK_STORES, MOCK_PRODUCTS } from '../../../constants';
import {
  MOCK_GLOBAL_CATEGORIES,
  MOCK_SHOPS,
  MOCK_SHOP_CATEGORIES,
  MOCK_SHOP_PRODUCTS,
} from './fixtureData';
export class StoreFixtureService implements IStoreService {
  async getStores(filters?: StoreFilters): Promise<Store[]> {
    await new Promise((res) => setTimeout(res, 400));
    let stores = MOCK_STORES;
    if (filters?.selectedCategory && filters.selectedCategory !== 'all') {
      stores = stores.filter((s) => s.category === filters.selectedCategory);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      stores = stores.filter(
        (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return stores;
  }
  async getStoreById(storeId: string): Promise<Store> {
    await new Promise((res) => setTimeout(res, 300));
    const store = MOCK_STORES.find((s) => s.id === storeId);
    if (!store) throw new Error(`Store ${storeId} not found`);
    return store;
  }
  async getProductsByStore(storeId: string): Promise<Product[]> {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_PRODUCTS.filter((p) => p.storeId === storeId);
  }
  async getProductById(productId: string): Promise<Product> {
    await new Promise((res) => setTimeout(res, 200));
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found`);
    return product;
  }
  async getGlobalCategories(): Promise<GlobalCategory[]> {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_GLOBAL_CATEGORIES;
  }
  async getShops(filters?: ShopFilters): Promise<Paginated<Shop>> {
    await new Promise((res) => setTimeout(res, 400));
    let shops = MOCK_SHOPS;
    if (filters?.category_id) {
      shops = shops.filter((s) => s.shopCategoryIds?.includes(filters.category_id!));
    }
    if (filters?.subcategory_id) {
      shops = shops.filter((s) => s.shopSubcategoryIds?.includes(filters.subcategory_id!));
    }
    if (filters?.is_open !== undefined) {
      shops = shops.filter((s) => s.is_open === filters.is_open);
    }
    const page = filters?.page ?? 1;
    const pageSize = filters?.page_size ?? 20;
    const start = (page - 1) * pageSize;
    const data = shops.slice(start, start + pageSize).map(({ shopCategoryIds, shopSubcategoryIds, ...shop }) => shop);
    return {
      status: 200,
      count: shops.length,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(shops.length / pageSize)),
      data,
    };
  }
  async getFeaturedShops(): Promise<Shop[]> {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_SHOPS.slice(0, 3).map(({ shopCategoryIds, shopSubcategoryIds, ...shop }) => shop);
  }
  async searchShops(filters: ShopSearchFilters): Promise<Paginated<Shop>> {
    await new Promise((res) => setTimeout(res, 400));
    const q = filters.q.toLowerCase();
    const matches: { shop: Shop; matchedCategories: Map<string, { id: string; name: string; image: string }>; matchedSubcategories: Map<string, { id: string; name: string; image: string }> }[] = [];
    for (const shop of MOCK_SHOPS) {
      const matchedCategories = new Map<string, { id: string; name: string; image: string }>();
      const matchedSubcategories = new Map<string, { id: string; name: string; image: string }>();
      const products = MOCK_SHOP_PRODUCTS[shop.id] ?? [];
      let hasMatch = shop.name.toLowerCase().includes(q);
      for (const product of products) {
        if (filters.category_id && product.category?.id !== filters.category_id) continue;
        if (filters.subcategory_id && product.subcategory?.id !== filters.subcategory_id) continue;
        if (filters.in_stock && !product.variants.some((v) => v.is_in_stock)) continue;
        const haystack = [
          product.name,
          product.description,
          product.category?.name,
          product.subcategory?.name,
          product.brand?.name,
          ...product.variants.map((v) => v.name),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (haystack.includes(q)) {
          hasMatch = true;
          if (product.category) matchedCategories.set(product.category.id, product.category);
          if (product.subcategory) matchedSubcategories.set(product.subcategory.id, product.subcategory);
        }
      }
      if (hasMatch) {
        const { shopCategoryIds, shopSubcategoryIds, ...shopData } = shop as Shop & { shopCategoryIds?: string[]; shopSubcategoryIds?: string[] };
        matches.push({ shop: shopData, matchedCategories, matchedSubcategories });
      }
    }
    const page = filters.page ?? 1;
    const pageSize = filters.page_size ?? 20;
    const start = (page - 1) * pageSize;
    const data = matches.slice(start, start + pageSize).map(({ shop, matchedCategories, matchedSubcategories }) => ({
      ...shop,
      matched_categories: Array.from(matchedCategories.values()),
      matched_subcategories: Array.from(matchedSubcategories.values()),
    }));
    return {
      status: 200,
      count: matches.length,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(matches.length / pageSize)),
      data,
    };
  }
  async getShopCategories(shopId: string, includeEmpty?: boolean): Promise<ShopCategory[]> {
    await new Promise((res) => setTimeout(res, 300));
    const categories = MOCK_SHOP_CATEGORIES[shopId] ?? [];
    if (includeEmpty) return categories;
    return categories
      .filter((c) => c.product_count > 0)
      .map((c) => ({ ...c, subcategories: c.subcategories.filter((sc) => sc.product_count > 0) }));
  }
  async getShopProducts(shopId: string, filters?: ShopProductFilters): Promise<Paginated<ShopProduct>> {
    await new Promise((res) => setTimeout(res, 400));
    let products = MOCK_SHOP_PRODUCTS[shopId] ?? [];
    if (filters?.category_id) {
      products = products.filter((p) => p.category?.id === filters.category_id);
    }
    if (filters?.subcategory_id) {
      products = products.filter((p) => p.subcategory?.id === filters.subcategory_id);
    }
    if (filters?.in_stock) {
      products = products.filter((p) => p.variants.some((v) => v.is_in_stock));
    }
    if (filters?.q) {
      const query = filters.q.toLowerCase();
      const matches = products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
      const nonMatches = products.filter((p) =>
        !p.name.toLowerCase().includes(query) &&
        (!p.description || !p.description.toLowerCase().includes(query))
      );
      products = [...matches, ...nonMatches];
    }
    const page = filters?.page ?? 1;
    const pageSize = filters?.page_size ?? 5;
    const start = (page - 1) * pageSize;
    return {
      status: 200,
      shop_id: shopId,
      shop_name: MOCK_SHOPS.find((s) => s.id === shopId)?.name ?? '',
      count: products.length,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(products.length / pageSize)),
      data: products.slice(start, start + pageSize),
    } as Paginated<ShopProduct> & { shop_id: string; shop_name: string };
  }
  async searchShopProducts(shopId: string, filters: ShopProductSearchFilters): Promise<Paginated<ShopProduct>> {
    await new Promise((res) => setTimeout(res, 400));
    const q = filters.q.toLowerCase();
    const products = (MOCK_SHOP_PRODUCTS[shopId] ?? []).filter((product) => {
      const haystack = [
        product.name,
        product.description,
        product.category?.name,
        product.subcategory?.name,
        product.brand?.name,
        ...product.variants.map((v) => v.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
    const page = filters.page ?? 1;
    const pageSize = filters.page_size ?? 20;
    const start = (page - 1) * pageSize;
    return {
      status: 200,
      shop_id: shopId,
      shop_name: MOCK_SHOPS.find((s) => s.id === shopId)?.name ?? '',
      count: products.length,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(products.length / pageSize)),
      data: products.slice(start, start + pageSize),
    } as Paginated<ShopProduct> & { shop_id: string; shop_name: string };
  }
}
export const storeService: IStoreService = new StoreFixtureService();
