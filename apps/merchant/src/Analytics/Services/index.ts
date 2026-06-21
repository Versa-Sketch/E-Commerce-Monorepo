import type { ApiResult } from '../../Common/services/http';
import type { AnalyticsData } from '../types/domain';

export interface IAnalyticsService {
  fetchAnalytics(shopId: string): Promise<ApiResult<AnalyticsData>>;
}
