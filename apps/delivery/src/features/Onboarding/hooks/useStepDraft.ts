import { useCallback, useRef, useState } from 'react';
import { StorageService } from '../../../services/storage';
import { OnboardingStep } from '../types/domain';
import { STEP_ORDER } from '../utils/stepOrder';

const DRAFT_PREFIX = 'onboarding_draft_';
const SAVE_DEBOUNCE_MS = 400;

// Called on logout — a draft typed by one partner must never leak into the
// next login on the same device.
export function clearAllStepDrafts(): void {
  for (const step of STEP_ORDER) {
    StorageService.delete(`${DRAFT_PREFIX}${step}`);
  }
}

// Persists in-progress (not-yet-saved-to-backend) form state for a single
// onboarding step, so typing something and pressing Back doesn't lose it.
// Once a step is actually saved to the backend, the screen should call
// clearDraft() — the server-confirmed `prefill` snapshot becomes the source
// of truth from that point on.
export function useStepDraft<T>(step: OnboardingStep) {
  const key = `${DRAFT_PREFIX}${step}`;
  const [draft] = useState<T | null>(() => StorageService.getObject<T>(key));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDraft = useCallback(
    (data: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        StorageService.setObject(key, data);
      }, SAVE_DEBOUNCE_MS);
    },
    [key]
  );

  const clearDraft = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    StorageService.delete(key);
  }, [key]);

  return { draft, saveDraft, clearDraft };
}
