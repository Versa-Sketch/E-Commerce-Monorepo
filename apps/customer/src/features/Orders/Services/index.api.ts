import { AxiosInstance } from 'axios';
import { ORDER_ENDPOINTS } from '../Constants/ORDER_ENDPOINTS';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import { OrderApi } from '../../../types/shared';
import { IOrderService } from './index';
export class OrderApiService implements IOrderService {
  constructor(private client: AxiosInstance) {}
  async getOrders(): Promise<OrderApi[]> {
    try {
      const response = await this.client.get(ORDER_ENDPOINTS.LIST);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getOrderById(orderId: string): Promise<OrderApi> {
    try {
      const response = await this.client.get(ORDER_ENDPOINTS.DETAIL.replace(':id', orderId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.client.post(ORDER_ENDPOINTS.CANCEL.replace(':id', orderId));
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}
export const orderService: IOrderService = new OrderApiService(AppClient);
