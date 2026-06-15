import type { AppClient } from '../../../stores/services/AppClient';
import type { ShopTypesServiceInterface } from './index';
import type { ShopTypeApi, CreateShopTypeRequestApi, UpdateShopTypeRequestApi } from '../../types/api';
import { SHOP_ENDPOINTS } from '../../Constants/shopConstants';

export class ShopTypesApiService implements ShopTypesServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getShopTypes(): Promise<ShopTypeApi[]> {
    return this.client
      .get<{ status: number; data: ShopTypeApi[] }>(SHOP_ENDPOINTS.SHOP_TYPES)
      .then(res => res.data);
  }

  async createShopTypes(items: CreateShopTypeRequestApi[]): Promise<void> {
    await this.client.post(SHOP_ENDPOINTS.SHOP_TYPES, items);
  }

  async updateShopType(id: string, patch: UpdateShopTypeRequestApi): Promise<void> {
    await this.client.patch(SHOP_ENDPOINTS.SHOP_TYPE(id), patch);
  }

  async deleteShopType(id: string): Promise<void> {
    await this.client.delete(SHOP_ENDPOINTS.SHOP_TYPE(id));
  }
}
