import { makeAutoObservable, runInAction } from 'mobx';
import type { SessionStore } from '../../Auth/Store';
import { USE_FIXTURES } from '../../Common/services/config';
import { resolveShopId } from '../../Common/services/shopId';
import { ChartDataPoint, TopProduct } from '../Models/ChartDataPoint';
import type { IAnalyticsService } from '../Services';
import { AnalyticsApiService } from '../Services/index.api';
import { AnalyticsFixtureService, defaultTopProducts } from '../Services/index.fixture';

export type LoadState = 'idle' | 'loading' | 'error';

export class AnalyticsStore {
  salesToday: ChartDataPoint[] = [];
  weeklyRevenue: ChartDataPoint[] = [];
  monthlyRevenue: ChartDataPoint[] = [
    new ChartDataPoint({ label: 'Jan', value: 340000 }),
    new ChartDataPoint({ label: 'Feb', value: 380000 }),
    new ChartDataPoint({ label: 'Mar', value: 420000 }),
    new ChartDataPoint({ label: 'Apr', value: 410000 }),
    new ChartDataPoint({ label: 'May', value: 480000 }),
    new ChartDataPoint({ label: 'Jun', value: 12840 }),
  ];
  categoryPerformance: ChartDataPoint[] = [];
  peakSellingHours: ChartDataPoint[] = [];
  topProducts: TopProduct[] = [];
  repeatPurchaseRate: number = 72.4;
  customerRetentionRate: number = 84.2;

  state: LoadState = 'idle';
  error: string | null = null;
  shopId: string | null = null;

  private session: SessionStore;
  private service: IAnalyticsService;

  constructor(session: SessionStore, service?: IAnalyticsService) {
    this.session = session;
    this.service =
      service ??
      (USE_FIXTURES
        ? new AnalyticsFixtureService()
        : new AnalyticsApiService(session));

    // Fallbacks
    this.topProducts = defaultTopProducts.map((d) => new TopProduct(d));

    makeAutoObservable(this);
  }

  async ensureShopId(): Promise<string | null> {
    if (this.shopId) return this.shopId;
    if (USE_FIXTURES) {
      runInAction(() => {
        this.shopId = 'shop-fixture-001';
      });
      return this.shopId;
    }
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

  async loadAnalytics(): Promise<void> {
    runInAction(() => {
      this.state = 'loading';
      this.error = null;
    });
    const shopId = await this.ensureShopId();
    if (!shopId) {
      runInAction(() => {
        this.state = 'error';
        this.error = "Couldn't resolve shop ID.";
      });
      return;
    }

    const res = await this.service.fetchAnalytics(shopId);
    runInAction(() => {
      if (res.ok && res.data) {
        const data = res.data;
        
        // 1. Retention rate & repeat purchase rate calculation
        const repeat = data.retention.repeat_customers;
        const total = data.retention.new_customers + repeat;
        const rate = total > 0 ? Math.round((repeat / total) * 1000) / 10 : 0;
        this.repeatPurchaseRate = rate;
        this.customerRetentionRate = rate;

        // 2. Weekly revenue trend mapping
        this.weeklyRevenue = data.revenue_trend.map((pt) => {
          const date = new Date(pt.date);
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return new ChartDataPoint({
            label: days[date.getDay()],
            value: Math.round(Number(pt.revenue)),
          });
        });

        // 3. Hourly load mapping (salesToday)
        this.salesToday = data.peak_hours.map((pt) => {
          return new ChartDataPoint({
            label: `${pt.hour.toString().padStart(2, '0')}:00`,
            value: pt.order_count * 100, // Scale it to represent a simulated amount
          });
        });

        // 4. Category splits
        const totalRev = data.category_shares.reduce((acc, c) => acc + Number(c.revenue), 0);
        this.categoryPerformance = data.category_shares.map((pt) => {
          const revVal = Number(pt.revenue);
          const percent = totalRev > 0 ? Math.round((revVal / totalRev) * 100) : 0;
          return new ChartDataPoint({
            label: pt.category,
            value: percent,
          });
        });

        this.state = 'idle';
      } else {
        this.state = 'error';
        this.error = res.message;
      }
    });
  }
}

export type AnalyticsStoreType = AnalyticsStore;
