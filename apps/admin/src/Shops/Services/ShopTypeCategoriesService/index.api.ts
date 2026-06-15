import type { AppClient } from '../../../stores/services/AppClient';
import type { ShopTypeCategoriesServiceInterface } from './index';
import type {
  ShopTypeCategoryApi, MapCategoriesRequestApi, MapCategoriesResponseApi,
} from '../../types/api';
import { SHOP_ENDPOINTS } from '../../Constants/shopConstants';

export class ShopTypeCategoriesApiService implements ShopTypeCategoriesServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getCategories(shopTypeId: string): Promise<ShopTypeCategoryApi[]> {
    return this.client.get<{ status: number; data: ShopTypeCategoryApi[] }>(
      SHOP_ENDPOINTS.CATEGORIES(shopTypeId),
    ).then(res => res.data);
  }

  mapCategories(shopTypeId: string, mappings: MapCategoriesRequestApi[]): Promise<MapCategoriesResponseApi> {
    return this.client.post<MapCategoriesResponseApi>(
      SHOP_ENDPOINTS.CATEGORIES(shopTypeId),
      mappings,
    );
  }

  async updateMapping(shopTypeId: string, mappingId: string, isPrimary: boolean): Promise<void> {
    await this.client.patch(SHOP_ENDPOINTS.CATEGORY_MAPPING(shopTypeId, mappingId), { is_primary: isPrimary });
  }

  async deleteMapping(shopTypeId: string, mappingId: string): Promise<void> {
    await this.client.delete(SHOP_ENDPOINTS.CATEGORY_MAPPING(shopTypeId, mappingId));
  }
}
