import type { ShopTypeCategoriesServiceInterface } from './index';
import type { ShopTypeCategoryApi, MapCategoriesRequestApi, MapCategoriesResponseApi } from '../../types/api';

const seed: ShopTypeCategoryApi[] = [
  { mapping_id: 'map-1', id: 'cat-1', name: 'Daily Groceries', image: '', is_active: true, is_primary: true },
  { mapping_id: 'map-2', id: 'cat-2', name: 'Fresh Vegetables', image: '', is_active: true, is_primary: false },
];

export class ShopTypeCategoriesFixtureService implements ShopTypeCategoriesServiceInterface {
  private store: Map<string, ShopTypeCategoryApi[]> = new Map();

  async getCategories(shopTypeId: string): Promise<ShopTypeCategoryApi[]> {
    if (!this.store.has(shopTypeId)) {
      this.store.set(shopTypeId, seed.map(c => ({ ...c })));
    }
    return this.store.get(shopTypeId)!.map(c => ({ ...c }));
  }

  async mapCategories(shopTypeId: string, mappings: MapCategoriesRequestApi[]): Promise<MapCategoriesResponseApi> {
    const existing = await this.getCategories(shopTypeId);
    const newEntries: ShopTypeCategoryApi[] = mappings.map((m, i) => ({
      mapping_id: `map-${Date.now()}-${i}`,
      id: m.category_id,
      name: `Category ${m.category_id.slice(0, 6)}`,
      image: '',
      is_active: true,
      is_primary: m.is_primary,
    }));
    this.store.set(shopTypeId, [...existing, ...newEntries]);
    return { status: 200, message: 'Category mappings added.' };
  }

  async updateMapping(shopTypeId: string, mappingId: string, isPrimary: boolean): Promise<void> {
    const list = await this.getCategories(shopTypeId);
    const item = list.find(c => c.mapping_id === mappingId);
    if (item) item.is_primary = isPrimary;
    this.store.set(shopTypeId, list);
  }

  async deleteMapping(shopTypeId: string, mappingId: string): Promise<void> {
    const list = await this.getCategories(shopTypeId);
    this.store.set(shopTypeId, list.filter(c => c.mapping_id !== mappingId));
  }
}
