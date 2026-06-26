import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, ApiStatus } from '../../../Common/Constants';
import { normalizeError } from '../../../Common/utils/errorNormalizer';
import { reorderService } from '../Services/index.api';
import { FrequentItem, ReorderResult } from '../types';

export class ReorderStore {
  frequentItems: FrequentItem[] = [];
  fetchStatus: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;

  reorderStatus: Map<string, ApiStatus> = new Map();
  reorderResult: Map<string, ReorderResult> = new Map();
  reorderError: Map<string, string> = new Map();

  private dismissTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  async fetchFrequentItems(): Promise<void> {
    if (this.fetchStatus === API_STATUS.FETCHING) return;
    this.fetchStatus = API_STATUS.FETCHING;
    this.error = null;
    try {
      const items = await reorderService.getFrequentlyOrdered({ limit: 20 });
      runInAction(() => {
        this.frequentItems = items;
        this.fetchStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.error = normalizeError(e);
        this.fetchStatus = API_STATUS.ERROR;
      });
    }
  }

  async reorder(orderId: string): Promise<void> {
    this.reorderStatus.set(orderId, API_STATUS.FETCHING);
    this.reorderError.delete(orderId);
    try {
      const result = await reorderService.reorder(orderId);
      runInAction(() => {
        this.reorderResult.set(orderId, result);
        this.reorderStatus.set(orderId, API_STATUS.SUCCESS);
      });
      // Auto-dismiss feedback after 8 seconds
      const existing = this.dismissTimers.get(orderId);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => this.clearReorderResult(orderId), 8000);
      this.dismissTimers.set(orderId, timer);
    } catch (e) {
      runInAction(() => {
        this.reorderError.set(orderId, normalizeError(e));
        this.reorderStatus.set(orderId, API_STATUS.ERROR);
      });
    }
  }

  clearReorderResult(orderId: string): void {
    this.reorderResult.delete(orderId);
    this.reorderStatus.delete(orderId);
    this.reorderError.delete(orderId);
    const timer = this.dismissTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      this.dismissTimers.delete(orderId);
    }
  }

  clearAllResults(): void {
    this.reorderResult.clear();
    this.reorderStatus.clear();
    this.reorderError.clear();
    this.dismissTimers.forEach((t) => clearTimeout(t));
    this.dismissTimers.clear();
  }
}
