import { makeAutoObservable, runInAction } from 'mobx';
import {
  Store,
  Product,
  StoreCategory,
  GlobalCategory,
  Shop,
  ShopCategory,
  ShopProduct,
} from '../../../types/shared';
import {
  IStoreService,
  StoreFilters,
  ShopFilters,
  ShopSearchFilters,
  ShopProductFilters,
  ShopProductSearchFilters,
} from '../Services';
import { API_STATUS, ApiStatus } from '../../../Common/Constants';
import { normalizeError } from '../../../Common/utils/errorNormalizer';
export class StoresStore {
  stores: Store[] = [];
  selectedStore: Store | null = null;
  selectedProduct: Product | null = null;
  filters: StoreFilters = { selectedCategory: 'all', searchQuery: '' };
  fetchStatus: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;

  // Global categories (Discovery)
  globalCategories: GlobalCategory[] = [];
  globalCategoriesStatus: ApiStatus = API_STATUS.IDLE;
  globalCategoriesError: string | null = null;

  // Shops list (home / category-filtered)
  shops: Shop[] = [];
  shopsPage = 1;
  shopsTotalPages = 1;
  shopsStatus: ApiStatus = API_STATUS.IDLE;
  shopsError: string | null = null;

  // Featured shops
  featuredShops: Shop[] = [];
  featuredShopsStatus: ApiStatus = API_STATUS.IDLE;
  featuredShopsError: string | null = null;

  // UI State
  isTabBarVisible = true;

  // Product search results (shops matching a search query)
  searchResults: Shop[] = [];
  searchResultsStatus: ApiStatus = API_STATUS.IDLE;
  searchResultsError: string | null = null;

  // Selected shop's category tree
  shopCategories: ShopCategory[] = [];
  shopCategoriesStatus: ApiStatus = API_STATUS.IDLE;
  shopCategoriesError: string | null = null;

  // Selected shop's products
  shopProducts: ShopProduct[] = [];
  shopProductsPage = 1;
  shopProductsTotalPages = 1;
  shopProductsStatus: ApiStatus = API_STATUS.IDLE;
  shopProductsError: string | null = null;

  // Selected shop's product search results
  shopProductSearchResults: ShopProduct[] = [];
  shopProductSearchStatus: ApiStatus = API_STATUS.IDLE;
  shopProductSearchError: string | null = null;

  constructor(private service: IStoreService) {
    makeAutoObservable(this);
  }

  setTabBarVisible(visible: boolean) {
    this.isTabBarVisible = visible;
  }

  get hasMoreShops(): boolean {
    return this.shopsPage < this.shopsTotalPages;
  }

  get hasMoreShopProducts(): boolean {
    return this.shopProductsPage < this.shopProductsTotalPages;
  }

  async fetchGlobalCategories(): Promise<void> {
    this.globalCategoriesStatus = API_STATUS.FETCHING;
    this.globalCategoriesError = null;
    try {
      const categories = await this.service.getGlobalCategories();
      runInAction(() => {
        this.globalCategories = categories;
        this.globalCategoriesStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.globalCategoriesError = normalizeError(e);
        this.globalCategoriesStatus = API_STATUS.ERROR;
      });
    }
  }

  async fetchShops(filters?: ShopFilters, options?: { append?: boolean }): Promise<void> {
    const append = options?.append ?? false;
    const page = append ? this.shopsPage + 1 : 1;
    this.shopsStatus = API_STATUS.FETCHING;
    this.shopsError = null;
    try {
      const response = await this.service.getShops({ ...filters, page, page_size: filters?.page_size ?? 20 });
      runInAction(() => {
        this.shops = append ? [...this.shops, ...response.data] : response.data;
        this.shopsPage = response.page;
        this.shopsTotalPages = response.total_pages;
        this.shopsStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.shopsError = normalizeError(e);
        this.shopsStatus = API_STATUS.ERROR;
      });
    }
  }

  async fetchFeaturedShops(): Promise<void> {
    this.featuredShopsStatus = API_STATUS.FETCHING;
    this.featuredShopsError = null;
    try {
      const shops = await this.service.getFeaturedShops();
      runInAction(() => {
        this.featuredShops = shops;
        this.featuredShopsStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.featuredShopsError = normalizeError(e);
        this.featuredShopsStatus = API_STATUS.ERROR;
      });
    }
  }

  async searchShops(filters: ShopSearchFilters): Promise<void> {
    if (!filters.q.trim()) {
      this.searchResults = [];
      this.searchResultsStatus = API_STATUS.IDLE;
      this.searchResultsError = null;
      return;
    }
    this.searchResultsStatus = API_STATUS.FETCHING;
    this.searchResultsError = null;
    try {
      const response = await this.service.searchShops({ ...filters, page: 1, page_size: filters.page_size ?? 20 });
      runInAction(() => {
        this.searchResults = response.data;
        this.searchResultsStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.searchResultsError = normalizeError(e);
        this.searchResultsStatus = API_STATUS.ERROR;
      });
    }
  }

  async fetchShopCategories(shopId: string, includeEmpty?: boolean): Promise<void> {
    this.shopCategoriesStatus = API_STATUS.FETCHING;
    this.shopCategoriesError = null;
    try {
      const categories = await this.service.getShopCategories(shopId, includeEmpty);
      runInAction(() => {
        this.shopCategories = categories;
        this.shopCategoriesStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.shopCategoriesError = normalizeError(e);
        this.shopCategoriesStatus = API_STATUS.ERROR;
      });
    }
  }

  async fetchShopProducts(
    shopId: string,
    filters?: ShopProductFilters,
    options?: { append?: boolean }
  ): Promise<void> {
    const append = options?.append ?? false;
    const page = append ? this.shopProductsPage + 1 : 1;
    this.shopProductsStatus = API_STATUS.FETCHING;
    this.shopProductsError = null;
    try {
      const response = await this.service.getShopProducts(shopId, {
        ...filters,
        page,
        page_size: filters?.page_size ?? 5,
      });
      runInAction(() => {
        this.shopProducts = append ? [...this.shopProducts, ...response.data] : response.data;
        this.shopProductsPage = response.page;
        this.shopProductsTotalPages = response.total_pages;
        this.shopProductsStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.shopProductsError = normalizeError(e);
        this.shopProductsStatus = API_STATUS.ERROR;
      });
    }
  }

  async searchShopProducts(shopId: string, filters: ShopProductSearchFilters): Promise<void> {
    if (!filters.q.trim()) {
      this.shopProductSearchResults = [];
      this.shopProductSearchStatus = API_STATUS.IDLE;
      this.shopProductSearchError = null;
      return;
    }
    this.shopProductSearchStatus = API_STATUS.FETCHING;
    this.shopProductSearchError = null;
    try {
      const response = await this.service.searchShopProducts(shopId, {
        ...filters,
        page: 1,
        page_size: filters.page_size ?? 20,
      });
      runInAction(() => {
        this.shopProductSearchResults = response.data;
        this.shopProductSearchStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.shopProductSearchError = normalizeError(e);
        this.shopProductSearchStatus = API_STATUS.ERROR;
      });
    }
  }

  resetShopDetail(): void {
    this.shopCategories = [];
    this.shopCategoriesStatus = API_STATUS.IDLE;
    this.shopProducts = [];
    this.shopProductsPage = 1;
    this.shopProductsTotalPages = 1;
    this.shopProductsStatus = API_STATUS.IDLE;
    this.shopProductSearchResults = [];
    this.shopProductSearchStatus = API_STATUS.IDLE;
    this.shopProductSearchError = null;
  }
  get filteredStores(): Store[] {
    let result = this.stores;
    if (this.filters.selectedCategory !== 'all') {
      result = result.filter((s) => s.category === this.filters.selectedCategory);
    }
    if (this.filters.searchQuery) {
      const q = this.filters.searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }
  get isLoading(): boolean {
    return this.fetchStatus === API_STATUS.FETCHING;
  }
  async fetchStores(): Promise<void> {
    this.fetchStatus = API_STATUS.FETCHING;
    this.error = null;
    try {
      const stores = await this.service.getStores();
      runInAction(() => {
        this.stores = stores;
        this.fetchStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.error = normalizeError(e);
        this.fetchStatus = API_STATUS.ERROR;
      });
    }
  }
  setSelectedStore(store: Store | null): void {
    this.selectedStore = store;
  }
  setSelectedProduct(product: Product | null): void {
    this.selectedProduct = product;
  }
  setSelectedCategory(category: StoreCategory | 'all'): void {
    this.filters.selectedCategory = category;
  }
  setSearchQuery(query: string): void {
    this.filters.searchQuery = query;
  }
}
