import React, { useEffect, useState } from 'react';
import { ContinueButton } from '../Components/ContinueButton';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';

interface AddressDraft {
  home_address: string;
  home_pincode: string;
}

export function AddressRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('ADDRESS');
  const saveAddress = useOnboardingStore((s) => s.saveAddress);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<AddressDraft>('ADDRESS');

  const [homeAddress, setHomeAddress] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (draft) {
      setHomeAddress(draft.home_address);
      setPincode(draft.home_pincode);
      return;
    }
    const address = prefill?.address;
    if (!address) return;
    setHomeAddress(address.home_address ?? '');
    setPincode(address.home_pincode ?? '');
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ home_address: homeAddress, home_pincode: pincode });
  }, [homeAddress, pincode, saveDraft]);

  const canContinue = homeAddress.trim().length > 0 && pincode.length === 6;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveAddress({ home_address: homeAddress, home_pincode: pincode });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Where do you live?"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <FormField label="Home Address" value={homeAddress} onChangeText={setHomeAddress} placeholder="House, street, area" />
      <FormField label="Pincode" value={pincode} onChangeText={setPincode} placeholder="6-digit pincode" keyboardType="number-pad" maxLength={6} />
    </OnboardingStepScreen>
  );
}
