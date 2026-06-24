import React, { useEffect, useState } from 'react';
import { ContinueButton } from '../Components/ContinueButton';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { ToggleRow } from '../Components/ToggleRow';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';

const TERMS_VERSION = 'v1.0';

interface ConsentDraft {
  terms_accepted: boolean;
  privacy_accepted: boolean;
  location_accepted: boolean;
  background_check: boolean;
}

export function ConsentRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('CONSENT');
  const saveConsent = useOnboardingStore((s) => s.saveConsent);
  const submitForReview = useOnboardingStore((s) => s.submitForReview);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<ConsentDraft>('CONSENT');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [locationAccepted, setLocationAccepted] = useState(false);
  const [backgroundCheck, setBackgroundCheck] = useState(false);

  useEffect(() => {
    if (draft) {
      setTermsAccepted(draft.terms_accepted);
      setPrivacyAccepted(draft.privacy_accepted);
      setLocationAccepted(draft.location_accepted);
      setBackgroundCheck(draft.background_check);
      return;
    }
    const consent = prefill?.consent;
    if (!consent) return;
    setTermsAccepted(consent.terms_accepted ?? false);
    setPrivacyAccepted(consent.privacy_accepted ?? false);
    setLocationAccepted(consent.location_accepted ?? false);
    setBackgroundCheck(consent.background_check ?? false);
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ terms_accepted: termsAccepted, privacy_accepted: privacyAccepted, location_accepted: locationAccepted, background_check: backgroundCheck });
  }, [termsAccepted, privacyAccepted, locationAccepted, backgroundCheck, saveDraft]);

  const canContinue = termsAccepted && privacyAccepted && locationAccepted && backgroundCheck;

  const handleSubmit = async () => {
    if (!canContinue) return;
    try {
      await saveConsent({
        terms_accepted: termsAccepted,
        privacy_accepted: privacyAccepted,
        location_accepted: locationAccepted,
        background_check: backgroundCheck,
        terms_version: TERMS_VERSION,
      });
      await submitForReview();
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Final consent"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton label="Submit for Review" onPress={handleSubmit} disabled={!canContinue} loading={isSubmitting} />}
    >
      <ToggleRow label="I accept the Terms of Service" value={termsAccepted} onValueChange={setTermsAccepted} />
      <ToggleRow label="I accept the Privacy Policy" value={privacyAccepted} onValueChange={setPrivacyAccepted} />
      <ToggleRow label="I consent to location tracking while online" value={locationAccepted} onValueChange={setLocationAccepted} />
      <ToggleRow label="I consent to a background verification check" value={backgroundCheck} onValueChange={setBackgroundCheck} />
    </OnboardingStepScreen>
  );
}
