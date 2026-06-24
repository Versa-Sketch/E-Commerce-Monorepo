import React, { useEffect, useState } from 'react';
import { ContinueButton } from '../Components/ContinueButton';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';

// Backend stores phone with a country code (e.g. "+919876500000"); the form
// only collects/displays the bare 10-digit local number.
const toLocalPhone = (phone: string | null | undefined): string => (phone ? phone.slice(-10) : '');

interface EmergencyDraft {
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
}

export function EmergencyRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('EMERGENCY');
  const saveEmergency = useOnboardingStore((s) => s.saveEmergency);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<EmergencyDraft>('EMERGENCY');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    if (draft) {
      setName(draft.emergency_name);
      setPhone(draft.emergency_phone);
      setRelation(draft.emergency_relation);
      return;
    }
    const emergency = prefill?.emergency;
    if (!emergency) return;
    setName(emergency.emergency_name ?? '');
    setPhone(toLocalPhone(emergency.emergency_phone));
    setRelation(emergency.emergency_relation ?? '');
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ emergency_name: name, emergency_phone: phone, emergency_relation: relation });
  }, [name, phone, relation, saveDraft]);

  const canContinue = name.trim().length > 0 && phone.length === 10;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveEmergency({ emergency_name: name, emergency_phone: phone, emergency_relation: relation || undefined });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Emergency contact"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <FormField label="Contact Name" value={name} onChangeText={setName} placeholder="Full name" />
      <FormField label="Contact Phone" value={phone} onChangeText={setPhone} placeholder="10-digit mobile number" keyboardType="number-pad" maxLength={10} />
      <FormField label="Relation (optional)" value={relation} onChangeText={setRelation} placeholder="e.g. Spouse, Parent" />
    </OnboardingStepScreen>
  );
}
