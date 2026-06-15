import type { OnboardingApi } from '../types/api';
import type { OnboardingDomain } from '../types/domain';

export const transformOnboarding = (api: OnboardingApi): OnboardingDomain => ({
  shopId: api.shop_id,
  shopName: api.shop_name,
  ownerName: api.owner_name,
  ownerPhone: api.owner_phone,
  businessType: api.business_type,
  status: api.status,
  currentStep: api.current_step,
  submittedAt: new Date(api.submitted_at),
  onboardingId: api.onboarding_id,
});
