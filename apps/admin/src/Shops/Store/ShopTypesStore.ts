import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { ShopTypesServiceInterface } from '../Services/ShopTypesService';
import type { ShopTypeDomain } from '../types/domain';
import type { CreateShopTypeRequestApi, UpdateShopTypeRequestApi } from '../types/api';

export class ShopTypesStore {
  status: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  shopTypes: ShopTypeDomain[] = [];

  private readonly service: ShopTypesServiceInterface;

  constructor(service: ShopTypesServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
  }

  get totalCount(): number {
    return this.shopTypes.length;
  }

  get activeShopTypes(): ShopTypeDomain[] {
    return this.shopTypes.filter(s => s.isActive);
  }

  async fetchShopTypes(): Promise<void> {
    this.status = API_STATUS.FETCHING;
    this.error = null;
    try {
      const data = await this.service.getShopTypes();
      runInAction(() => {
        this.shopTypes = data.map(s => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          isActive: s.is_active,
        }));
        this.status = API_STATUS.SUCCESS;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load shop types.';
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async createShopTypes(items: CreateShopTypeRequestApi[]): Promise<void> {
    try {
      await this.service.createShopTypes(items);
      await this.fetchShopTypes();
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to create shop types.';
      });
      throw err;
    }
  }

  async updateShopType(id: string, patch: UpdateShopTypeRequestApi): Promise<void> {
    try {
      await this.service.updateShopType(id, patch);
      runInAction(() => {
        const item = this.shopTypes.find(s => s.id === id);
        if (item) {
          if (patch.name !== undefined) item.name = patch.name;
          if (patch.is_active !== undefined) item.isActive = patch.is_active;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to update shop type.';
      });
      throw err;
    }
  }

  async deleteShopType(id: string): Promise<void> {
    try {
      await this.service.deleteShopType(id);
      await this.fetchShopTypes();
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to delete shop type.';
      });
    }
  }
}
