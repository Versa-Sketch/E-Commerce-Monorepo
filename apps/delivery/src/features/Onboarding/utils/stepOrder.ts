import { OnboardingStep } from '../types/domain';

// Order matters — mirrors the backend's documented step sequence exactly.
export const STEP_ORDER: OnboardingStep[] = [
  'IDENTITY',
  'ADDRESS',
  'KYC',
  'VEHICLE',
  'BANK',
  'SCHEDULE',
  'WORK_PREFS',
  'EMERGENCY',
  'CONSENT',
];

export const STEP_ROUTE_NAME: Record<OnboardingStep, string> = {
  IDENTITY: 'Identity',
  ADDRESS: 'Address',
  KYC: 'Kyc',
  VEHICLE: 'Vehicle',
  BANK: 'Bank',
  SCHEDULE: 'Schedule',
  WORK_PREFS: 'WorkPrefs',
  EMERGENCY: 'Emergency',
  CONSENT: 'Consent',
  SUBMITTED: 'ReviewStatus',
};

export function stepIndex(step: OnboardingStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return idx === -1 ? STEP_ORDER.length : idx;
}

export function nextStep(step: OnboardingStep): OnboardingStep | null {
  const idx = stepIndex(step);
  return idx + 1 < STEP_ORDER.length ? STEP_ORDER[idx + 1] : null;
}

export function previousStep(step: OnboardingStep): OnboardingStep | null {
  const idx = stepIndex(step);
  return idx > 0 ? STEP_ORDER[idx - 1] : null;
}

export const TOTAL_STEPS = STEP_ORDER.length;
