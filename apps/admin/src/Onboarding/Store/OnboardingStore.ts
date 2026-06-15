import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { OnboardingServiceInterface } from '../Services/OnboardingService';
import type { OnboardingDomain, OnboardingDetailDomain } from '../types/domain';
import type { ReviewRequestApi } from '../types/api';
import { transformOnboarding } from '../utils/transformOnboarding';
import { transformOnboardingDetail } from '../utils/transformOnboardingDetail';

export class OnboardingStore {
  status: ApiStatus = API_STATUS.IDLE;
  detailStatus: ApiStatus = API_STATUS.IDLE;
  onboardings: OnboardingDomain[] = [];
  selectedOnboarding: OnboardingDetailDomain | null = null;
  statusFilter = 'all';

  private readonly service: OnboardingServiceInterface;

  constructor(service: OnboardingServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
  }

  get filteredOnboardings(): OnboardingDomain[] {
    if (this.statusFilter === 'all') return this.onboardings;
    return this.onboardings.filter(o => o.status === this.statusFilter);
  }

  get pendingCount(): number {
    return this.onboardings.filter(o => o.status === 'pending').length;
  }

  get underReviewCount(): number {
    return this.onboardings.filter(o => o.status === 'under_review').length;
  }

  async fetchOnboardings(): Promise<void> {
    this.status = API_STATUS.FETCHING;
    try {
      const filter = this.statusFilter !== 'all' ? this.statusFilter : undefined;
      const items = await this.service.getOnboardings(filter);
      runInAction(() => {
        this.onboardings = items.map(transformOnboarding);
        this.status = API_STATUS.SUCCESS;
      });
    } catch {
      runInAction(() => {
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async fetchOnboardingDetail(shopId: string): Promise<void> {
    this.detailStatus = API_STATUS.FETCHING;
    try {
      const item = await this.service.getOnboardingDetail(shopId);
      runInAction(() => {
        this.selectedOnboarding = transformOnboardingDetail(item);
        this.detailStatus = API_STATUS.SUCCESS;
      });
    } catch {
      runInAction(() => {
        this.detailStatus = API_STATUS.ERROR;
      });
    }
  }

  async reviewOnboarding(shopId: string, body: ReviewRequestApi): Promise<void> {
    await this.service.reviewOnboarding(shopId, body);
    await this.fetchOnboardings();
  }

  setStatusFilter(value: string): void {
    this.statusFilter = value;
    this.fetchOnboardings();
  }

  clearSelected(): void {
    this.selectedOnboarding = null;
    this.detailStatus = API_STATUS.IDLE;
  }
}
