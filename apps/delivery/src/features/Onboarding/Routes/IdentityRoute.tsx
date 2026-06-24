import React, { useEffect, useState } from 'react';
import { ChoicePills } from '../Components/ChoicePills';
import { ContinueButton } from '../Components/ContinueButton';
import { DateField } from '../Components/DateField';
import { FilePickerField } from '../Components/FilePickerField';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { Gender, PickedDoc } from '../types/domain';
import { toExistingDoc } from '../utils/documents';

interface IdentityDraft {
  full_name: string;
  date_of_birth: string;
  gender: Gender | undefined;
  profile_photo: PickedDoc | null;
  selfie: PickedDoc | null;
}

export function IdentityRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('IDENTITY');
  const saveIdentity = useOnboardingStore((s) => s.saveIdentity);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<IdentityDraft>('IDENTITY');

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [profilePhoto, setProfilePhoto] = useState<PickedDoc | null>(null);
  const [selfie, setSelfie] = useState<PickedDoc | null>(null);

  // A local draft (unsaved edits from before the user pressed Back) always
  // wins over the server snapshot — it's more recent.
  useEffect(() => {
    if (draft) {
      setFullName(draft.full_name);
      setDob(draft.date_of_birth);
      setGender(draft.gender);
      setProfilePhoto(draft.profile_photo);
      setSelfie(draft.selfie);
      return;
    }
    const identity = prefill?.identity;
    if (!identity) return;
    setFullName(identity.full_name ?? '');
    setDob(identity.date_of_birth ?? '');
    setGender(identity.gender ?? undefined);
    setProfilePhoto(toExistingDoc(identity.profile_photo));
    setSelfie(toExistingDoc(identity.selfie));
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ full_name: fullName, date_of_birth: dob, gender, profile_photo: profilePhoto, selfie });
  }, [fullName, dob, gender, profilePhoto, selfie, saveDraft]);

  const canContinue = fullName.trim().length > 0 && !!selfie;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveIdentity({ full_name: fullName, date_of_birth: dob || undefined, gender, profile_photo: profilePhoto, selfie });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Tell us about yourself"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <FormField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="As per ID proof" />
      <DateField label="Date of Birth" value={dob} onChange={setDob} maximumDate={new Date()} />
      <ChoicePills
        label="Gender"
        options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]}
        value={gender}
        onChange={setGender}
      />
      <FilePickerField label="Profile Photo" value={profilePhoto} onChange={setProfilePhoto} />
      <FilePickerField label="Selfie (required)" value={selfie} onChange={setSelfie} />
    </OnboardingStepScreen>
  );
}
