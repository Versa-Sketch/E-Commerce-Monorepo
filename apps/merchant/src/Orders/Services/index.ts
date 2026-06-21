import { ApiResult, PaginatedResult } from '../../Common/services/http';
import { ApiOrder, ApiDashboardSummary, ActivityLogItem } from '../types/domain';

export interface IOrdersService {
  fetchOrders(shopId: string, status?: string, page?: number, search?: string): Promise<ApiResult<PaginatedResult<ApiOrder>>>;
  fetchOrderDetail(shopId: string, orderId: string): Promise<ApiResult<ApiOrder>>;
  updateOrderStatus(shopId: string, orderId: string, status: string): Promise<ApiResult<ApiOrder>>;
  fetchDashboardSummary(shopId: string): Promise<ApiResult<ApiDashboardSummary>>;
  fetchActivityLog(shopId: string): Promise<ApiResult<ActivityLogItem[]>>;
}

