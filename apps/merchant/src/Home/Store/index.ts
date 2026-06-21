import { makeAutoObservable, runInAction } from 'mobx';
import { AIInsight } from '../Models/AIInsight';
import { insightFixtures } from '../Services/index.fixture';
import type { SessionStore } from '../../Auth/Store';
import { USE_FIXTURES } from '../../Common/services/config';
import { resolveShopId } from '../../Common/services/shopId';
import { OrdersApiService } from '../../Orders/Services/index.api';
import { OrdersFixtureService } from '../../Orders/Services/index.fixture';
import type { ActivityLogItem } from '../../Orders/types/domain';

export class DashboardStore {
  todayOrders: number = 0;
  todayRevenue: number = 0;
  pendingOrders: number = 0;
  deliveredOrders: number = 0;
  activeDeliveryPartners: number = 5;
  averageRating: number = 4.8;
  insights: AIInsight[] = [];
  activityLog: ActivityLogItem[] = [];
  shopId: string | null = null;
  metricsState: 'idle' | 'loading' | 'error' = 'idle';
  metricsError: string | null = null;

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
    runInAction(() => {
      this.metricsState = 'loading';
      this.metricsError = null;
    });
    const shopId = await this.ensureShopId();
    if (!shopId) {
      runInAction(() => {
        this.metricsState = 'error';
        this.metricsError = 'No shop ID found';
      });
      return;
    }

    const [summaryRes, activityRes] = await Promise.all([
      this.service.fetchDashboardSummary(shopId),
      this.service.fetchActivityLog(shopId),
    ]);

    runInAction(() => {
      if (summaryRes.ok && summaryRes.data) {
        this.todayOrders = summaryRes.data.orders_today_count;
        this.pendingOrders = summaryRes.data.pending_orders_count;
        this.todayRevenue = Math.round(Number(summaryRes.data.revenue_today));
      }
      if (activityRes.ok && activityRes.data) {
        this.activityLog = activityRes.data;
      }
      if (summaryRes.ok && activityRes.ok) {
        this.metricsState = 'idle';
      } else {
        this.metricsState = 'error';
        this.metricsError = summaryRes.message ?? activityRes.message ?? 'Failed to load dashboard';
      }
    });
  }

  removeInsight(id: string) {
    const idx = this.insights.findIndex((i) => i.id === id);
    if (idx !== -1) this.insights.splice(idx, 1);
  }
}


export type DashboardStoreType = DashboardStore;
