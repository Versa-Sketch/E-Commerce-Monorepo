export type ChartPeriod = 'today' | 'weekly' | 'monthly';

export interface RevenueTrendPoint {
  date: string;
  revenue: string;
}

export interface PeakHourPoint {
  hour: number;
  order_count: number;
}

export interface CategoryShare {
  category: string;
  revenue: string;
}

export interface RetentionMetrics {
  new_customers: number;
  repeat_customers: number;
}

export interface AnalyticsData {
  revenue_trend: RevenueTrendPoint[];
  peak_hours: PeakHourPoint[];
  category_shares: CategoryShare[];
  retention: RetentionMetrics;
}
