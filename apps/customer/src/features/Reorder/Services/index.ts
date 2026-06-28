import { FrequentItem, ReorderResult } from '../types';

export interface IReorderService {
  getFrequentlyOrdered(params?: { shop_id?: string; limit?: number }): Promise<FrequentItem[]>;
  reorder(orderId: string): Promise<ReorderResult>;
}
