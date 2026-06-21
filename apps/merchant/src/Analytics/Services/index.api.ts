import { apiRequest, type ApiResult } from '../../Common/services/http';
import type { AnalyticsData } from '../types/domain';
import type { IAnalyticsService } from './index';

export interface TokenProvider {
  accessToken: string | null;
}

export class AnalyticsApiService implements IAnalyticsService {
  constructor(private session: TokenProvider) {}

  private get token() {
    return this.session.accessToken;
  }

  async fetchAnalytics(shopId: string): Promise<ApiResult<AnalyticsData>> {
    return apiRequest<AnalyticsData>(`/commerce/shop-owner/${shopId}/analytics/`, {
      token: this.token,
    });
  }
}
