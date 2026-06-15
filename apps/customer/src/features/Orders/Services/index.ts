import { OrderApi } from '../../../types/shared';
export interface IOrderService {
  getOrders(): Promise<OrderApi[]>;
  getOrderById(orderId: string): Promise<OrderApi>;
  cancelOrder(orderId: string): Promise<void>;
}
