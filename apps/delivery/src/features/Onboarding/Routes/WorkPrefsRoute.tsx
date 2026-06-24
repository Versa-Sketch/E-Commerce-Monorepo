import React, { useEffect, useState } from 'react';
import { ChoicePills } from '../Components/ChoicePills';
import { ContinueButton } from '../Components/ContinueButton';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { ToggleRow } from '../Components/ToggleRow';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { MaxLoad } from '../types/domain';

interface WorkPrefsDraft {
  max_load: MaxLoad;
  willing_long_distance: boolean;
  long_distance_km: string;
  max_orders_per_shift: string;
  cod_enabled: boolean;
  cod_limit_per_order: string;
  cod_limit_per_day: string;
}

export function WorkPrefsRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('WORK_PREFS');
  const saveWorkPrefs = useOnboardingStore((s) => s.saveWorkPrefs);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<WorkPrefsDraft>('WORK_PREFS');

  const [maxLoad, setMaxLoad] = useState<MaxLoad>('MEDIUM');
  const [willingLongDistance, setWillingLongDistance] = useState(false);
  const [longDistanceKm, setLongDistanceKm] = useState('10');
  const [maxOrdersPerShift, setMaxOrdersPerShift] = useState('10');
  const [codEnabled, setCodEnabled] = useState(true);
  const [codLimitPerOrder, setCodLimitPerOrder] = useState('500');
  const [codLimitPerDay, setCodLimitPerDay] = useState('3000');

  useEffect(() => {
    if (draft) {
      setMaxLoad(draft.max_load);
      setWillingLongDistance(draft.willing_long_distance);
      setLongDistanceKm(draft.long_distance_km);
      setMaxOrdersPerShift(draft.max_orders_per_shift);
      setCodEnabled(draft.cod_enabled);
      setCodLimitPerOrder(draft.cod_limit_per_order);
      setCodLimitPerDay(draft.cod_limit_per_day);
      return;
    }
    const wp = prefill?.work_preference;
    if (wp) {
      setMaxLoad(wp.max_load ?? 'MEDIUM');
      setWillingLongDistance(wp.willing_long_distance ?? false);
      setLongDistanceKm(String(wp.long_distance_km ?? 10));
      setMaxOrdersPerShift(String(wp.max_orders_per_shift ?? 10));
    }
    const cod = prefill?.cod;
    if (cod) {
      setCodEnabled(cod.cod_enabled ?? true);
      if (cod.cod_limit_per_order) setCodLimitPerOrder(cod.cod_limit_per_order);
      if (cod.cod_limit_per_day) setCodLimitPerDay(cod.cod_limit_per_day);
    }
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({
      max_load: maxLoad,
      willing_long_distance: willingLongDistance,
      long_distance_km: longDistanceKm,
      max_orders_per_shift: maxOrdersPerShift,
      cod_enabled: codEnabled,
      cod_limit_per_order: codLimitPerOrder,
      cod_limit_per_day: codLimitPerDay,
    });
  }, [maxLoad, willingLongDistance, longDistanceKm, maxOrdersPerShift, codEnabled, codLimitPerOrder, codLimitPerDay, saveDraft]);

  const handleContinue = async () => {
    try {
      await saveWorkPrefs({
        max_load: maxLoad,
        willing_long_distance: willingLongDistance,
        long_distance_km: Number(longDistanceKm) || undefined,
        max_orders_per_shift: Number(maxOrdersPerShift) || undefined,
        cod_enabled: codEnabled,
        cod_limit_per_order: codEnabled ? Number(codLimitPerOrder) || undefined : undefined,
        cod_limit_per_day: codEnabled ? Number(codLimitPerDay) || undefined : undefined,
      });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Work preferences"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} loading={isSubmitting} />}
    >
      <ChoicePills
        label="Preferred Load"
        options={[{ value: 'LIGHT', label: 'Light' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HEAVY', label: 'Heavy' }]}
        value={maxLoad}
        onChange={setMaxLoad}
      />
      <ToggleRow label="Willing to travel long distance" value={willingLongDistance} onValueChange={setWillingLongDistance} />
      {willingLongDistance && (
        <FormField label="Max Distance (km)" value={longDistanceKm} onChangeText={setLongDistanceKm} keyboardType="number-pad" />
      )}
      <FormField label="Max Orders Per Shift" value={maxOrdersPerShift} onChangeText={setMaxOrdersPerShift} keyboardType="number-pad" />
      <ToggleRow label="Accept Cash on Delivery" value={codEnabled} onValueChange={setCodEnabled} />
      {codEnabled && (
        <>
          <FormField label="COD Limit Per Order (₹)" value={codLimitPerOrder} onChangeText={setCodLimitPerOrder} keyboardType="number-pad" />
          <FormField label="COD Limit Per Day (₹)" value={codLimitPerDay} onChangeText={setCodLimitPerDay} keyboardType="number-pad" />
        </>
      )}
    </OnboardingStepScreen>
  );
}
