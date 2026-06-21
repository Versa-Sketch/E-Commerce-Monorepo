import { apiRequest, type ApiResult } from '../../Common/services/http';
import type { ShopProfile, ShopProfileUpdateRequest } from '../types/domain';
import type { ISettingsService } from './index';

export interface TokenProvider {
  accessToken: string | null;
}

export class SettingsApiService implements ISettingsService {
  constructor(private session: TokenProvider) {}

  private get token() {
    return this.session.accessToken;
  }

  async fetchProfile(): Promise<ApiResult<ShopProfile>> {
    return apiRequest<ShopProfile>('/commerce/shop-owner/profile/', {
      token: this.token,
    });
  }

  async updateProfile(profile: ShopProfileUpdateRequest): Promise<ApiResult<ShopProfile>> {
    return apiRequest<ShopProfile>('/commerce/shop-owner/profile/', {
      method: 'PUT',
      token: this.token,
      body: profile,
    });
  }
}
