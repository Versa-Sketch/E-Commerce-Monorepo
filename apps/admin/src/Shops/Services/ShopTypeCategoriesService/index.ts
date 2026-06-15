import type { ShopTypeCategoryApi, MapCategoriesRequestApi, MapCategoriesResponseApi } from '../../types/api';

export interface ShopTypeCategoriesServiceInterface {
  getCategories(shopTypeId: string): Promise<ShopTypeCategoryApi[]>;
  mapCategories(shopTypeId: string, mappings: MapCategoriesRequestApi[]): Promise<MapCategoriesResponseApi>;
  updateMapping(shopTypeId: string, mappingId: string, isPrimary: boolean): Promise<void>;
  deleteMapping(shopTypeId: string, mappingId: string): Promise<void>;
}
