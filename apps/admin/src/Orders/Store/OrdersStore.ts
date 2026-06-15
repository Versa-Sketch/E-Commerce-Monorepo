import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { OrdersServiceInterface } from '../Services/OrdersService';
import type { OrderDomain } from '../types/domain';
import { transformOrder } from '../utils/transformOrder';

export class OrdersStore {
  status: ApiStatus = API_STATUS.IDLE;
  orders: OrderDomain[] = [];
  searchTerm = '';
  statusFilter = 'all';

  private readonly service: OrdersServiceInterface;

  constructor(service: OrdersServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
  }

  get filteredOrders(): OrderDomain[] {
    const term = this.searchTerm.toLowerCase();
    return this.orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.storeName.toLowerCase().includes(term);
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get totalCount(): number {
    return this.orders.length;
  }

  get deliveredCount(): number {
    return this.orders.filter(order => order.status === 'delivered').length;
  }

  get activeCount(): number {
    return this.orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length;
  }

  get openDisputeCount(): number {
    return this.orders.filter(order => order.hasDispute).length;
  }

  async fetchOrders(): Promise<void> {
    this.status = API_STATUS.FETCHING;
    try {
      const orders = await this.service.getOrders();
      runInAction(() => {
        this.orders = orders.map(transformOrder);
        this.status = API_STATUS.SUCCESS;
      });
    } catch {
      runInAction(() => {
        this.status = API_STATUS.ERROR;
      });
    }
  }

  setSearchTerm(value: string): void {
    this.searchTerm = value;
  }

  setStatusFilter(value: string): void {
    this.statusFilter = value;
  }

  async issueRefund(orderId: string): Promise<void> {
    const updated = await this.service.issueRefund(orderId);
    runInAction(() => {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.hasDispute = updated.has_dispute;
      }
    });
  }
}
