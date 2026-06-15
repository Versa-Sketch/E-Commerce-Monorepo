import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { ShopTypeCategoriesServiceInterface } from '../Services/ShopTypeCategoriesService';
import type { ShopTypeCategoryDomain } from '../types/domain';
import type { MapCategoriesRequestApi } from '../types/api';
import { transformCategory } from '../utils/transformCategory';

export class ShopTypeCategoriesStore {
  status: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  categories: ShopTypeCategoryDomain[] = [];
  shopTypeId = '';

  private readonly service: ShopTypeCategoriesServiceInterface;

  constructor(service: ShopTypeCategoriesServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
  }

  get totalCount(): number {
    return this.categories.length;
  }

  get primaryCategories(): ShopTypeCategoryDomain[] {
    return this.categories.filter(c => c.isPrimary);
  }

  async fetchCategories(shopTypeId: string): Promise<void> {
    this.status = API_STATUS.FETCHING;
    this.error = null;
    this.shopTypeId = shopTypeId;
    try {
      const data = await this.service.getCategories(shopTypeId);
      runInAction(() => {
        this.categories = data.map(transformCategory);
        this.status = API_STATUS.SUCCESS;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load categories.';
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async mapCategories(mappings: MapCategoriesRequestApi[]): Promise<void> {
    try {
      await this.service.mapCategories(this.shopTypeId, mappings);
      await this.fetchCategories(this.shopTypeId);
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to map categories.';
      });
      throw err;
    }
  }

  async updateMapping(mappingId: string, isPrimary: boolean): Promise<void> {
    const cat = this.categories.find(c => c.mappingId === mappingId);
    const previous = cat?.isPrimary;
    if (cat) cat.isPrimary = isPrimary;

    try {
      await this.service.updateMapping(this.shopTypeId, mappingId, isPrimary);
    } catch (err) {
      runInAction(() => {
        if (cat) cat.isPrimary = previous!;
        this.error = err instanceof Error ? err.message : 'Failed to update mapping.';
      });
    }
  }

  async deleteMapping(mappingId: string): Promise<void> {
    try {
      await this.service.deleteMapping(this.shopTypeId, mappingId);
      runInAction(() => {
        this.categories = this.categories.filter(c => c.mappingId !== mappingId);
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to remove category.';
      });
    }
  }
}
