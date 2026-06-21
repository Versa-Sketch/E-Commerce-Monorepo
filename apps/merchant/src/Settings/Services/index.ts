import type { ApiResult } from '../../Common/services/http';
import type { ShopProfile, ShopProfileUpdateRequest } from '../types/domain';

export interface ISettingsService {
  fetchProfile(): Promise<ApiResult<ShopProfile>>;
  updateProfile(profile: ShopProfileUpdateRequest): Promise<ApiResult<ShopProfile>>;
}
