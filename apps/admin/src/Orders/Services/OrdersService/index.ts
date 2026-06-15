import type { OrderApi } from '../../types/api';

export interface OrdersServiceInterface {
  getOrders(): Promise<OrderApi[]>;
  issueRefund(orderId: string): Promise<OrderApi>;
}
