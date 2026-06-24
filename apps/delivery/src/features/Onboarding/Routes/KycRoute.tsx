import React, { useEffect, useState } from 'react';
import { ContinueButton } from '../Components/ContinueButton';
import { FilePickerField } from '../Components/FilePickerField';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { PickedDoc } from '../types/domain';
import { findDocUrl, toExistingDoc } from '../utils/documents';

interface KycDraft {
  aadhaar_number: string;
  pan_number: string;
  dl_number: string;
  aadhaar_front: PickedDoc | null;
  aadhaar_back: PickedDoc | null;
  pan: PickedDoc | null;
}

export function KycRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('KYC');
  const saveKyc = useOnboardingStore((s) => s.saveKyc);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<KycDraft>('KYC');

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [aadhaarFront, setAadhaarFront] = useState<PickedDoc | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<PickedDoc | null>(null);
  const [pan, setPan] = useState<PickedDoc | null>(null);

  useEffect(() => {
    if (draft) {
      setAadhaarNumber(draft.aadhaar_number);
      setPanNumber(draft.pan_number);
      setDlNumber(draft.dl_number);
      setAadhaarFront(draft.aadhaar_front);
      setAadhaarBack(draft.aadhaar_back);
      setPan(draft.pan);
      return;
    }
    const kyc = prefill?.kyc;
    if (!kyc) return;
    setAadhaarNumber(kyc.aadhaar_number ?? '');
    setPanNumber(kyc.pan_number ?? '');
    setDlNumber(kyc.dl_number ?? '');
    setAadhaarFront(toExistingDoc(findDocUrl(prefill?.documents, 'AADHAAR_FRONT')));
    setAadhaarBack(toExistingDoc(findDocUrl(prefill?.documents, 'AADHAAR_BACK')));
    setPan(toExistingDoc(findDocUrl(prefill?.documents, 'PAN')));
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ aadhaar_number: aadhaarNumber, pan_number: panNumber, dl_number: dlNumber, aadhaar_front: aadhaarFront, aadhaar_back: aadhaarBack, pan });
  }, [aadhaarNumber, panNumber, dlNumber, aadhaarFront, aadhaarBack, pan, saveDraft]);

  const canContinue = aadhaarNumber.length === 12 && panNumber.length === 10 && !!aadhaarFront && !!aadhaarBack && !!pan;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveKyc({
        aadhaar_number: aadhaarNumber,
        pan_number: panNumber,
        dl_number: dlNumber || undefined,
        aadhaar_front: aadhaarFront,
        aadhaar_back: aadhaarBack,
        pan,
      });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Identity verification"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <FormField
        label="Aadhaar Number"
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
        placeholder="12-digit Aadhaar"
        keyboardType="number-pad"
        maxLength={12}
        hint={`${aadhaarNumber.length}/12 digits`}
      />
      <FilePickerField label="Aadhaar Front (required)" value={aadhaarFront} onChange={setAadhaarFront} />
      <FilePickerField label="Aadhaar Back (required)" value={aadhaarBack} onChange={setAadhaarBack} />
      <FormField
        label="PAN Number"
        value={panNumber}
        onChangeText={(t) => setPanNumber(t.toUpperCase())}
        placeholder="10-character PAN"
        maxLength={10}
        hint={`${panNumber.length}/10 characters`}
      />
      <FilePickerField label="PAN Card (required)" value={pan} onChange={setPan} />
      <FormField label="Driving Licence Number (optional)" value={dlNumber} onChangeText={setDlNumber} placeholder="DL number" />
    </OnboardingStepScreen>
  );
}
