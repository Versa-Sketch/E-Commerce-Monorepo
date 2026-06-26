import { AxiosInstance } from 'axios';
import AppClient from '../../../infrastructure/AppClient';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import { REORDER_ENDPOINTS } from '../Constants';
import { FrequentItem, ReorderResult } from '../types';

interface FrequentOrderedParams {
  shop_id?: string;
  limit?: number;
}

interface IReorderService {
  getFrequentlyOrdered(params?: FrequentOrderedParams): Promise<FrequentItem[]>;
  reorder(orderId: string): Promise<ReorderResult>;
}

class ReorderApiService implements IReorderService {
  constructor(private client: AxiosInstance) {}

  async getFrequentlyOrdered(params?: FrequentOrderedParams): Promise<FrequentItem[]> {
    try {
      const response = await this.client.get(REORDER_ENDPOINTS.FREQUENTLY_ORDERED, { params });
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async reorder(orderId: string): Promise<ReorderResult> {
    try {
      const url = REORDER_ENDPOINTS.REORDER.replace(':id', orderId);
      const response = await this.client.post(url);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}

export const reorderService: IReorderService = new ReorderApiService(AppClient);
