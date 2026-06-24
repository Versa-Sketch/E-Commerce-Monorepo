import React, { useEffect, useState } from 'react';
import { ContinueButton } from '../Components/ContinueButton';
import { DaySchedulePicker, defaultScheduleDays } from '../Components/DaySchedulePicker';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { ScheduleDay } from '../types/domain';

// Backend returns 'HH:mm:ss', forms display/submit 'HH:mm'.
const toHHmm = (t: string | null | undefined): string | undefined => t?.slice(0, 5) ?? undefined;

export function ScheduleRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('SCHEDULE');
  const saveSchedule = useOnboardingStore((s) => s.saveSchedule);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<ScheduleDay[]>('SCHEDULE');

  const [days, setDays] = useState(defaultScheduleDays());

  useEffect(() => {
    if (draft?.length) {
      setDays(draft);
      return;
    }
    if (!prefill?.schedule?.length) return;
    setDays(
      prefill.schedule.map((d) => ({
        day: d.day,
        is_available: d.is_available,
        start_time: toHHmm(d.start_time),
        end_time: toHHmm(d.end_time),
      }))
    );
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft(days);
  }, [days, saveDraft]);

  const handleContinue = async () => {
    try {
      await saveSchedule(days);
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Your weekly availability"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} loading={isSubmitting} />}
    >
      <DaySchedulePicker days={days} onChange={setDays} />
    </OnboardingStepScreen>
  );
}
