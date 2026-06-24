import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuthStore } from '../../Auth/Store/useAuthStore';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { OnboardingStep } from '../types/domain';
import { nextStep, previousStep, stepIndex, STEP_ROUTE_NAME } from '../utils/stepOrder';

// Centralizes the "submit -> advance to next step" navigation pattern shared
// by all 9 onboarding screens, so each Route only needs its own form state.
export function useOnboardingStep(currentStepKey: OnboardingStep) {
  const navigation = useNavigation<any>();
  const stepState = useOnboardingStore((s) => s.stepState);
  const stepError = useOnboardingStore((s) => s.stepError);

  const goNext = () => {
    const next = nextStep(currentStepKey);
    navigation.navigate(next ? STEP_ROUTE_NAME[next] : STEP_ROUTE_NAME.SUBMITTED);
  };

  // navigation.canGoBack() is false whenever the current screen happens to be
  // the stack's initialRouteName — which is wherever the user resumed this
  // session (not necessarily the first step). In that case there's no native
  // history to pop, so step backward manually using our own step order; only
  // when there's truly no earlier step do we offer to exit onboarding.
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const prev = previousStep(currentStepKey);
    if (prev) {
      // replace (not navigate/push) — there's no real history to return to
      // here, so we swap screens in place rather than growing the stack in
      // the wrong direction (which would make a later forward "back" press
      // pop to the wrong step).
      navigation.replace(STEP_ROUTE_NAME[prev]);
      return;
    }
    Alert.alert('Exit sign-up?', "You'll need to verify your phone number again to continue.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => useAuthStore.getState().logout() },
    ]);
  };

  return {
    stepState,
    stepError,
    isSubmitting: stepState === 'submitting',
    stepNumber: stepIndex(currentStepKey) + 1,
    goNext,
    goBack,
  };
}
