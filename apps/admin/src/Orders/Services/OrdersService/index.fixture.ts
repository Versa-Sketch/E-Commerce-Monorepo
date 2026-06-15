import type { OrdersServiceInterface } from './index';
import type { OrderApi } from '../../types/api';
import { ordersFixture } from '../../Fixtures/ordersFixture';

export class OrdersFixtureService implements OrdersServiceInterface {
  private orders: OrderApi[] = ordersFixture.map(order => ({ ...order }));

  async getOrders(): Promise<OrderApi[]> {
    return this.orders.map(order => ({ ...order }));
  }

  async issueRefund(orderId: string): Promise<OrderApi> {
    const order = this.orders.find(o => o.order_id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    order.has_dispute = false;
    return { ...order };
  }
}
