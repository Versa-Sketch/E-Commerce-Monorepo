import type { AppClient } from '../../../stores/services/AppClient';
import type { OnboardingServiceInterface } from './index';
import type { OnboardingApi, OnboardingDetailApi, ReviewRequestApi } from '../../types/api';
import { ONBOARDING_ENDPOINTS } from '../../Constants/onboardingConstants';

export class OnboardingApiService implements OnboardingServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getOnboardings(status?: string): Promise<OnboardingApi[]> {
    const url = status
      ? `${ONBOARDING_ENDPOINTS.LIST}?status=${status}`
      : ONBOARDING_ENDPOINTS.LIST;
    return this.client
      .get<{ status: number; data: OnboardingApi[] }>(url)
      .then(res => res.data);
  }

  getOnboardingDetail(shopId: string): Promise<OnboardingDetailApi> {
    return this.client
      .get<{ status: number; data: OnboardingDetailApi }>(ONBOARDING_ENDPOINTS.DETAIL(shopId))
      .then(res => res.data);
  }

  async reviewOnboarding(shopId: string, body: ReviewRequestApi): Promise<void> {
    await this.client.patch(ONBOARDING_ENDPOINTS.REVIEW(shopId), body);
  }
}
