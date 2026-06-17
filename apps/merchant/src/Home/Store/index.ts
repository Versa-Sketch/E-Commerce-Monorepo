import { makeAutoObservable, runInAction } from 'mobx';
import { AIInsight } from '../Models/AIInsight';
import { insightFixtures } from '../Services/index.fixture';
import type { SessionStore } from '../../Auth/Store';
import { USE_FIXTURES } from '../../Common/services/config';
import { resolveShopId } from '../../Common/services/shopId';
import { OrdersApiService } from '../../Orders/Services/index.api';
import { OrdersFixtureService } from '../../Orders/Services/index.fixture';

export class DashboardStore {
  todayOrders: number = 42;
  todayRevenue: number = 12840;
  pendingOrders: number = 8;
  deliveredOrders: number = 32;
  activeDeliveryPartners: number = 5;
  averageRating: number = 4.8;
  insights: AIInsight[] = [];
  shopId: string | null = null;

  private session: SessionStore;
  private service: any;

  constructor(session: SessionStore) {
    this.session = session;
    this.service = USE_FIXTURES ? new OrdersFixtureService() : new OrdersApiService(session);
    this.insights = insightFixtures.map((data) => new AIInsight(data));
    makeAutoObservable(this);
  }

  async ensureShopId(): Promise<string | null> {
    if (this.shopId) return this.shopId;
    if (this.session.user?.shop_id) {
      runInAction(() => {
        this.shopId = this.session.user!.shop_id;
      });
      return this.shopId;
    }
    const id = await resolveShopId(this.session.accessToken);
    runInAction(() => {
      this.shopId = id;
    });
    return id;
  }

  async refreshMetrics() {
    const shopId = await this.ensureShopId();
    if (!shopId) return;

    const res = await this.service.fetchDashboardSummary(shopId);
    if (res.ok && res.data) {
      runInAction(() => {
        this.todayOrders = res.data.orders_today_count;
        this.pendingOrders = res.data.pending_orders_count;
        this.todayRevenue = Math.round(Number(res.data.revenue_today));
      });
    }
  }

  removeInsight(id: string) {
    const idx = this.insights.findIndex((i) => i.id === id);
    if (idx !== -1) this.insights.splice(idx, 1);
  }
}

export type DashboardStoreType = DashboardStore;
