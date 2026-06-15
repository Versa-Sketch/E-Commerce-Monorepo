import type { OrdersServiceInterface } from './index';
import type { OrderApi } from '../../types/api';
import type { AppClient } from '../../../stores/services/AppClient';
import { ORDER_ENDPOINTS } from '../../Constants/ordersConstants';

export class OrdersApiService implements OrdersServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getOrders(): Promise<OrderApi[]> {
    return this.client.get<OrderApi[]>(ORDER_ENDPOINTS.LIST);
  }

  issueRefund(orderId: string): Promise<OrderApi> {
    return this.client.post<OrderApi>(ORDER_ENDPOINTS.REFUND(orderId));
  }
}
