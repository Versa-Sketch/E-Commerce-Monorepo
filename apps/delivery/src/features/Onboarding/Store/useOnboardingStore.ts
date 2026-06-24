import { create } from 'zustand';
import { OnboardingService } from '../Services';
import {
  AddressForm,
  BankForm,
  ConsentForm,
  EmergencyForm,
  IdentityForm,
  KycForm,
  OnboardingDetails,
  OnboardingStatus,
  OnboardingStep,
  PickedDoc,
  ScheduleDay,
  StepResponseData,
  VehicleForm,
  WorkPrefsForm,
} from '../types/domain';

type StepState = 'idle' | 'submitting' | 'error';

interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onboardingStatus: OnboardingStatus;
  stepState: StepState;
  stepError: string | null;
  loaded: boolean;
  prefill: OnboardingDetails | null;
  prefillLoaded: boolean;

  loadStatus: () => Promise<void>;
  loadDetails: () => Promise<void>;
  saveIdentity: (form: IdentityForm) => Promise<void>;
  saveAddress: (form: AddressForm) => Promise<void>;
  saveKyc: (form: KycForm) => Promise<void>;
  saveVehicle: (form: VehicleForm) => Promise<void>;
  saveBank: (form: BankForm) => Promise<void>;
  saveSchedule: (days: ScheduleDay[]) => Promise<void>;
  saveWorkPrefs: (form: WorkPrefsForm) => Promise<void>;
  saveEmergency: (form: EmergencyForm) => Promise<void>;
  saveConsent: (form: ConsentForm) => Promise<void>;
  submitForReview: () => Promise<void>;
  patchIdentityFiles: (files: { profile_photo?: PickedDoc | null; selfie?: PickedDoc | null }) => Promise<void>;
  patchKycFiles: (files: { aadhaar_front?: PickedDoc | null; aadhaar_back?: PickedDoc | null; pan?: PickedDoc | null }) => Promise<void>;
  patchVehicleFiles: (files: {
    dl_front?: PickedDoc | null;
    dl_back?: PickedDoc | null;
    rc?: PickedDoc | null;
    insurance?: PickedDoc | null;
    puc?: PickedDoc | null;
    vehicle_photo?: PickedDoc | null;
  }) => Promise<void>;
  reset: () => void;
}

const INITIAL_STATE = {
  currentStep: 'IDENTITY' as OnboardingStep,
  completedSteps: [] as OnboardingStep[],
  onboardingStatus: 'DRAFT' as OnboardingStatus,
  stepState: 'idle' as StepState,
  stepError: null,
  loaded: false,
  prefill: null,
  prefillLoaded: false,
};

function applyResponse(set: (partial: Partial<OnboardingState>) => void, data: StepResponseData) {
  set({
    currentStep: data.current_step,
    completedSteps: data.completed_steps,
    onboardingStatus: data.onboarding_status,
    stepState: 'idle',
    stepError: null,
  });
}

async function runStep(
  set: (partial: Partial<OnboardingState>) => void,
  call: () => Promise<StepResponseData>
): Promise<void> {
  set({ stepState: 'submitting', stepError: null });
  try {
    const data = await call();
    applyResponse(set, data);
    // No need to re-fetch /details/ here — the local draft for this step
    // (apps/delivery/src/features/Onboarding/hooks/useStepDraft.ts) already
    // holds exactly what was just saved, and is kept around (not cleared)
    // specifically so it can serve as the up-to-date cache for the rest of
    // this session without an extra round-trip.
  } catch (e) {
    set({ stepState: 'error', stepError: e instanceof Error ? e.message : 'Could not save this step' });
    throw e;
  }
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL_STATE,

  loadStatus: async () => {
    try {
      const data = await OnboardingService.getStatus();
      applyResponse(set, data);
    } catch {
      // No onboarding record yet — defaults (IDENTITY/DRAFT) stand.
    } finally {
      set({ loaded: true });
    }
  },

  // Fetches the full saved onboarding payload, so every step screen —
  // including ones being visited via "back" or revisited after a save —
  // can prefill from the latest real saved data instead of a stale snapshot.
  loadDetails: async () => {
    try {
      const details = await OnboardingService.getDetails();
      set({
        prefill: details,
        currentStep: details.current_step,
        completedSteps: details.completed_steps,
        onboardingStatus: details.onboarding_status,
      });
    } catch {
      // No onboarding record yet — screens just render with empty fields.
    } finally {
      set({ prefillLoaded: true });
    }
  },

  saveIdentity: (form) => runStep(set, () => OnboardingService.saveIdentity(form)),
  saveAddress: (form) => runStep(set, () => OnboardingService.saveAddress(form)),
  saveKyc: (form) => runStep(set, () => OnboardingService.saveKyc(form)),
  saveVehicle: (form) => runStep(set, () => OnboardingService.saveVehicle(form)),
  saveBank: (form) => runStep(set, () => OnboardingService.saveBank(form)),
  saveSchedule: (days) => runStep(set, () => OnboardingService.saveSchedule(days)),
  saveWorkPrefs: (form) => runStep(set, () => OnboardingService.saveWorkPrefs(form)),
  saveEmergency: (form) => runStep(set, () => OnboardingService.saveEmergency(form)),
  saveConsent: (form) => runStep(set, () => OnboardingService.saveConsent(form)),

  patchIdentityFiles: (files) => runStep(set, () => OnboardingService.patchIdentityFiles(files)),
  patchKycFiles: (files) => runStep(set, () => OnboardingService.patchKycFiles(files)),
  patchVehicleFiles: (files) => runStep(set, () => OnboardingService.patchVehicleFiles(files)),

  submitForReview: async () => {
    set({ stepState: 'submitting', stepError: null });
    try {
      await OnboardingService.submit();
      set({ onboardingStatus: 'SUBMITTED', currentStep: 'SUBMITTED', stepState: 'idle' });
    } catch (e) {
      set({ stepState: 'error', stepError: e instanceof Error ? e.message : 'Could not submit for review' });
      throw e;
    }
  },

  // Called on logout so the next login on this device (possibly a different
  // partner) doesn't inherit the previous session's step/status/prefill.
  reset: () => set({ ...INITIAL_STATE }),
}));
