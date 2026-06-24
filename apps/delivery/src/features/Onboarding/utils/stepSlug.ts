import { OnboardingStep } from '../types/domain';

// Maps our internal step keys to the lowercase/hyphenated slugs the
// GET /step/{step}/detail/ endpoint expects.
export const STEP_SLUG: Partial<Record<OnboardingStep, string>> = {
  IDENTITY: 'identity',
  ADDRESS: 'address',
  KYC: 'kyc',
  VEHICLE: 'vehicle',
  BANK: 'bank',
  SCHEDULE: 'schedule',
  WORK_PREFS: 'work-prefs',
  EMERGENCY: 'emergency',
  CONSENT: 'consent',
};
