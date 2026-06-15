import type { ShopTypeApi, CreateShopTypeRequestApi, UpdateShopTypeRequestApi } from '../../types/api';

export interface ShopTypesServiceInterface {
  getShopTypes(): Promise<ShopTypeApi[]>;
  createShopTypes(items: CreateShopTypeRequestApi[]): Promise<void>;
  updateShopType(id: string, patch: UpdateShopTypeRequestApi): Promise<void>;
  deleteShopType(id: string): Promise<void>;
}
