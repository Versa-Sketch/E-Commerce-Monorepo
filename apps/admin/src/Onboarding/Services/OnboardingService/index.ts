import type { OnboardingApi, OnboardingDetailApi, ReviewRequestApi } from '../../types/api';

export interface OnboardingServiceInterface {
  getOnboardings(status?: string): Promise<OnboardingApi[]>;
  getOnboardingDetail(shopId: string): Promise<OnboardingDetailApi>;
  reviewOnboarding(shopId: string, body: ReviewRequestApi): Promise<void>;
}
