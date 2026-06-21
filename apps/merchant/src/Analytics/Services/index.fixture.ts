import type { ApiResult } from '../../Common/services/http';
import { fixtureDelay } from '../../Common/services/config';
import type { AnalyticsData } from '../types/domain';
import type { IAnalyticsService } from './index';

export const mockAnalyticsData: AnalyticsData = {
  revenue_trend: [
    { date: '2026-06-15', revenue: '14200.00' },
    { date: '2026-06-16', revenue: '12840.00' },
    { date: '2026-06-17', revenue: '15100.00' },
    { date: '2026-06-18', revenue: '16500.00' },
    { date: '2026-06-19', revenue: '18200.00' },
    { date: '2026-06-20', revenue: '22000.00' },
    { date: '2026-06-21', revenue: '24500.00' },
  ],
  peak_hours: [
    { hour: 8, order_count: 5 },
    { hour: 10, order_count: 12 },
    { hour: 12, order_count: 8 },
    { hour: 14, order_count: 6 },
    { hour: 16, order_count: 10 },
    { hour: 18, order_count: 22 },
    { hour: 20, order_count: 25 },
    { hour: 22, order_count: 9 },
  ],
  category_shares: [
    { category: 'Grocery', revenue: '45000.00' },
    { category: 'Pharmacy', revenue: '20000.00' },
    { category: 'Restaurants', revenue: '15000.00' },
    { category: 'Electronics', revenue: '10000.00' },
    { category: 'Fashion', revenue: '10000.00' },
  ],
  retention: {
    new_customers: 25,
    repeat_customers: 65,
  },
};

export const defaultTopProducts = [
  { id: 'TP-01', name: 'Organic Roma Tomatoes', unitsSold: 124, revenue: 7440, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=100' },
  { id: 'TP-02', name: 'Hass Avocados', unitsSold: 42, revenue: 12558, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100' },
  { id: 'TP-03', name: 'Gourmet Butter Chicken Rice Bowl', unitsSold: 38, revenue: 9462, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100' },
];

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, status: 200, data, message: null };
}

export class AnalyticsFixtureService implements IAnalyticsService {
  async fetchAnalytics(_shopId: string): Promise<ApiResult<AnalyticsData>> {
    return fixtureDelay(ok(mockAnalyticsData));
  }
}
