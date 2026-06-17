import { ApiResult, PaginatedResult } from '../../Common/services/http';
import { ApiOrder, ApiDashboardSummary } from '../types/domain';

export interface IOrdersService {
  fetchOrders(shopId: string, status?: string, page?: number): Promise<ApiResult<PaginatedResult<ApiOrder>>>;
  fetchOrderDetail(shopId: string, orderId: string): Promise<ApiResult<ApiOrder>>;
  updateOrderStatus(shopId: string, orderId: string, status: string): Promise<ApiResult<ApiOrder>>;
  fetchDashboardSummary(shopId: string): Promise<ApiResult<ApiDashboardSummary>>;
}
