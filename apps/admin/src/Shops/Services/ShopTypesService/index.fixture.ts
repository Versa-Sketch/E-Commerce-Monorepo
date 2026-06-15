import type { ShopTypesServiceInterface } from './index';
import type { ShopTypeApi, CreateShopTypeRequestApi, UpdateShopTypeRequestApi } from '../../types/api';


const seed: ShopTypeApi[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Grocery', slug: 'grocery', is_active: true },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Electronics', slug: 'electronics', is_active: true },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Fashion', slug: 'fashion', is_active: true },
  { id: 'd4e5f6a7-b8c9-0123-defa-234567890123', name: 'Pharmacy', slug: 'pharmacy', is_active: false },
];

export class ShopTypesFixtureService implements ShopTypesServiceInterface {
  private items: ShopTypeApi[] = seed.map(s => ({ ...s }));

  async getShopTypes(): Promise<ShopTypeApi[]> {
    return this.items.map(s => ({ ...s }));
  }

  async createShopTypes(items: CreateShopTypeRequestApi[]): Promise<void> {
    const created: ShopTypeApi[] = items.map(item => ({
      id: `fixture-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      is_active: true,
    }));
    this.items = [...this.items, ...created];
  }

  async updateShopType(id: string, patch: UpdateShopTypeRequestApi): Promise<void> {
    const item = this.items.find(s => s.id === id);
    if (item) {
      if (patch.name !== undefined) item.name = patch.name;
      if (patch.is_active !== undefined) item.is_active = patch.is_active;
    }
  }


  async deleteShopType(id: string): Promise<void> {
    const item = this.items.find(s => s.id === id);
    if (item) item.is_active = false;
  }
}
