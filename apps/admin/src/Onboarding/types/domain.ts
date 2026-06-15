import type { ONBOARDING_STATUSES } from './api';

export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export interface OnboardingDomain {
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  businessType: string;
  status: OnboardingStatus;
  currentStep: string;
  submittedAt: Date;
  onboardingId: string;
}

export interface OnboardingDetailDomain {
  onboardingId: string;
  status: OnboardingStatus;
  businessType: string;
  currentStep: string;
  completedSteps: string[];
  rejectionReason: string;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  shop: { id: string; name: string; phone: string; description: string; isVerified: boolean };
  owner: { id: string; fullName: string; phone: string };
  address: { line1: string; line2: string; state: string; pincode: string };
  bank: { accountName: string; accountNumber: string; ifsc: string; bankName: string; branch: string; chequeUrl: string };
  addressProof: { type: string; documentUrl: string };
  storePhotos: { frontUrl: string; interiorUrl: string; signatureUrl: string };
  kyc: { panCard: string; aadhaarCard: string; gst: string; msme: string; tradeLicense: string };
}
