import { makeAutoObservable, runInAction } from 'mobx';
import { IOrderService } from '../Services';
import { Order } from '../types/domain';
import { OrderModel } from '../Models/OrderModel';
import { mapOrderApiToOrder } from '../Models/mapOrderApiToOrder';
import { OrderApi } from '../../../types/shared';
import { API_STATUS, ApiStatus } from '../../../Common/Constants';
import { normalizeError } from '../../../Common/utils/errorNormalizer';
export class OrderStore {
  private rawOrders: Order[] = [];
  activeTrackingOrder: Order | null = null;
  fetchStatus: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  orderDetail: OrderApi | null = null;
  orderDetailStatus: ApiStatus = API_STATUS.IDLE;
  orderDetailError: string | null = null;
  constructor(private service: IOrderService) {
    makeAutoObservable(this);
  }
  get orders(): OrderModel[] {
    return this.rawOrders.map((o) => new OrderModel(o));
  }
  get ongoingOrders(): OrderModel[] {
    return this.orders.filter((o) => o.isOngoing);
  }
  get completedOrders(): OrderModel[] {
    return this.orders.filter((o) => o.isDelivered);
  }
  get cancelledOrders(): OrderModel[] {
    return this.orders.filter((o) => o.isCancelled);
  }
  get isLoading(): boolean {
    return this.fetchStatus === API_STATUS.FETCHING;
  }
  async fetchOrders(): Promise<void> {
    this.fetchStatus = API_STATUS.FETCHING;
    this.error = null;
    try {
      const orders = await this.service.getOrders();
      runInAction(() => {
        this.rawOrders = orders.map((o) => mapOrderApiToOrder(o));
        this.fetchStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.error = normalizeError(e);
        this.fetchStatus = API_STATUS.ERROR;
      });
    }
  }
  async fetchOrderById(orderId: string): Promise<void> {
    this.orderDetailStatus = API_STATUS.FETCHING;
    this.orderDetailError = null;
    try {
      const order = await this.service.getOrderById(orderId);
      runInAction(() => {
        this.orderDetail = order;
        this.orderDetailStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.orderDetailError = normalizeError(e);
        this.orderDetailStatus = API_STATUS.ERROR;
      });
    }
  }
  setActiveTrackingOrder(order: Order | null): void {
    this.activeTrackingOrder = order;
  }
  addOrder(order: Order): void {
    this.rawOrders.unshift(order);
  }
  updateCourierLocation(orderId: string, latitude: number, longitude: number): void {
    const order = this.rawOrders.find((o) => o.id === orderId);
    if (order) {
      order.courierLocation = { latitude, longitude };
    }
  }
  updateOrderStatus(orderId: string, newStatus: import('../types/domain').OrderStatus): void {
    const order = this.rawOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
    }
  }
}
