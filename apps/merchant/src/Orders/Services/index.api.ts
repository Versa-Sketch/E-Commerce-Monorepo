import type { IOrdersService } from './index';
import { ApiResult, PaginatedResult, apiRequest, apiRequestPaginated, buildQuery } from '../../Common/services/http';
import { ApiOrder, ApiDashboardSummary, ActivityLogItem } from '../types/domain';
import { API_BASE } from '../../Auth/Constants/api';

export interface TokenProvider {
  accessToken: string | null;
}

export class OrdersApiService implements IOrdersService {
  constructor(private session: TokenProvider) {}

  private get token() {
    return this.session.accessToken;
  }

  async fetchOrders(shopId: string, status?: string, page = 1, search?: string): Promise<ApiResult<PaginatedResult<ApiOrder>>> {
    const query = buildQuery({ status, page: page.toString(), search });
    const url = `${API_BASE}/commerce/shop-owner/${shopId}/orders/${query}`;
    return apiRequestPaginated<ApiOrder>(url, {
      token: this.token,
    });
  }

  async fetchOrderDetail(shopId: string, orderId: string): Promise<ApiResult<ApiOrder>> {
    const url = `${API_BASE}/commerce/shop-owner/${shopId}/orders/${orderId}/`;
    return apiRequest<ApiOrder>(url, {
      token: this.token,
    });
  }

  async updateOrderStatus(shopId: string, orderId: string, status: string): Promise<ApiResult<ApiOrder>> {
    const url = `${API_BASE}/commerce/shop-owner/${shopId}/orders/${orderId}/status/`;
    return apiRequest<ApiOrder>(url, {
      method: 'PATCH',
      token: this.token,
      body: { status },
    });
  }

  async fetchDashboardSummary(shopId: string): Promise<ApiResult<ApiDashboardSummary>> {
    const url = `${API_BASE}/commerce/shop-owner/${shopId}/dashboard/`;
    return apiRequest<ApiDashboardSummary>(url, {
      token: this.token,
    });
  }

  async fetchActivityLog(shopId: string): Promise<ApiResult<ActivityLogItem[]>> {
    const url = `${API_BASE}/commerce/shop-owner/${shopId}/activity-log/`;
    return apiRequest<ActivityLogItem[]>(url, {
      token: this.token,
    });
  }
}

