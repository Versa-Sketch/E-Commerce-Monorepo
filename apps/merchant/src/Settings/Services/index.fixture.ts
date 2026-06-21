import type { ApiResult } from '../../Common/services/http';
import { fixtureDelay } from '../../Common/services/config';
import type { ShopProfile, ShopProfileUpdateRequest } from '../types/domain';
import type { ISettingsService } from './index';

export const mockShopProfile: ShopProfile = {
  shop_id: 'shop-fixture-001',
  name: 'FreshMart Hyperlocal',
  description: 'Providing organic farm-fresh fruits, vegetables, and daily essentials straight to your doorstep.',
  phone_number: '+919876543210',
  logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
  banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
  store_front_photo: null,
  store_interior_photo: null,
  delivery_radius_km: 5.5,
  operating_hours: [
    { day_of_week: 0, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 1, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 2, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 3, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 4, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 5, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
    { day_of_week: 6, opening_time: '07:00:00', closing_time: '22:00:00', is_closed: false },
  ],
};

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, status: 200, data, message: null };
}

export class SettingsFixtureService implements ISettingsService {
  async fetchProfile(): Promise<ApiResult<ShopProfile>> {
    return fixtureDelay(ok(mockShopProfile));
  }

  async updateProfile(profile: ShopProfileUpdateRequest): Promise<ApiResult<ShopProfile>> {
    Object.assign(mockShopProfile, profile);
    return fixtureDelay(ok(mockShopProfile));
  }
}
