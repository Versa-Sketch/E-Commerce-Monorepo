import type { OnboardingStatus } from '../types/domain';

export const ONBOARDING_ENDPOINTS = {
  LIST:   '/shops/admin/onboarding/',
  DETAIL: (shopId: string) => `/shops/admin/onboarding/${shopId}/`,
  REVIEW: (shopId: string) => `/shops/onboarding/${shopId}/review/`,
} as const;

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  pending:      'Pending',
  under_review: 'Under Review',
  approved:     'Approved',
  rejected:     'Rejected',
};

export const ONBOARDING_STATUS_VARIANTS: Record<OnboardingStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  pending:      'neutral',
  under_review: 'warning',
  approved:     'success',
  rejected:     'danger',
};
