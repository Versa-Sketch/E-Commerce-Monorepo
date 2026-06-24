import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { PhoneInputRoute } from '../features/Auth/Routes/PhoneInputRoute';
import { OtpVerifyRoute } from '../features/Auth/Routes/OtpVerifyRoute';
import { SignUpRoute } from '../features/Auth/Routes/SignUpRoute';
import { useAuthStore } from '../features/Auth/Store/useAuthStore';
import { AddressRoute } from '../features/Onboarding/Routes/AddressRoute';
import { BankRoute } from '../features/Onboarding/Routes/BankRoute';
import { ConsentRoute } from '../features/Onboarding/Routes/ConsentRoute';
import { EmergencyRoute } from '../features/Onboarding/Routes/EmergencyRoute';
import { IdentityRoute } from '../features/Onboarding/Routes/IdentityRoute';
import { KycRoute } from '../features/Onboarding/Routes/KycRoute';
import { ReviewStatusRoute } from '../features/Onboarding/Routes/ReviewStatusRoute';
import { ScheduleRoute } from '../features/Onboarding/Routes/ScheduleRoute';
import { VehicleRoute } from '../features/Onboarding/Routes/VehicleRoute';
import { WorkPrefsRoute } from '../features/Onboarding/Routes/WorkPrefsRoute';
import { useOnboardingStore } from '../features/Onboarding/Store/useOnboardingStore';
import { STEP_ROUTE_NAME } from '../features/Onboarding/utils/stepOrder';
import { MainTabs } from './MainTabs';

const Root = createNativeStackNavigator();
const fadeOptions = { headerShown: false, animation: 'fade' as const, animationDuration: 220, contentStyle: { backgroundColor: '#F7F7F7' } };

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => !!s.token);
  const onboardingStatus = useOnboardingStore((s) => s.onboardingStatus);
  const onboardingLoaded = useOnboardingStore((s) => s.loaded);
  const loadStatus = useOnboardingStore((s) => s.loadStatus);
  const prefillLoaded = useOnboardingStore((s) => s.prefillLoaded);
  const loadDetails = useOnboardingStore((s) => s.loadDetails);

  useEffect(() => {
    if (isAuthenticated && !onboardingLoaded) loadStatus();
  }, [isAuthenticated, onboardingLoaded, loadStatus]);

  // Fetches the full saved payload once per authenticated session, regardless
  // of which branch below ends up rendering — Home needs it for the status
  // banner + rejected-document list just as much as the onboarding wizard
  // needs it for resuming/prefilling a step.
  useEffect(() => {
    if (isAuthenticated && onboardingLoaded && !prefillLoaded) loadDetails();
  }, [isAuthenticated, onboardingLoaded, prefillLoaded, loadDetails]);

  if (!isAuthenticated) {
    return (
      <Root.Navigator screenOptions={fadeOptions}>
        <Root.Screen name="AuthStack" component={AuthStack} />
      </Root.Navigator>
    );
  }

  if (!onboardingLoaded) return null; // brief splash while we resolve resume-step

  // Only an untouched DRAFT application blocks the rest of the app — once
  // submitted (SUBMITTED/UNDER_REVIEW/REJECTED) or APPROVED/SUSPENDED, the
  // partner gets full access to Home, with their status shown as a banner
  // there (see components/OnboardingStatusBanner.tsx) instead of being stuck
  // on a standalone review screen.
  if (onboardingStatus === 'DRAFT') {
    return (
      <Root.Navigator screenOptions={fadeOptions}>
        <Root.Screen name="OnboardingStack" component={OnboardingStack} />
      </Root.Navigator>
    );
  }

  return (
    <Root.Navigator screenOptions={fadeOptions}>
      <Root.Screen name="MainApp" component={MainTabs} />
    </Root.Navigator>
  );
}

const stackOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  fullScreenGestureEnabled: true,
  animationDuration: 280,
  contentStyle: { backgroundColor: '#FFFFFF' },
};

const Auth = createNativeStackNavigator();

function AuthStack() {
  return (
    <Auth.Navigator screenOptions={stackOptions}>
      <Auth.Screen name="PhoneInput" component={PhoneInputRoute} />
      <Auth.Screen name="SignUp" component={SignUpRoute} />
      <Auth.Screen name="OtpVerify" component={OtpVerifyRoute} />
    </Auth.Navigator>
  );
}

const OB = createNativeStackNavigator();

function OnboardingStack() {
  const currentStep = useOnboardingStore((s) => s.currentStep);

  return (
    <OB.Navigator screenOptions={stackOptions} initialRouteName={STEP_ROUTE_NAME[currentStep]}>
      <OB.Screen name={STEP_ROUTE_NAME.IDENTITY} component={IdentityRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.ADDRESS} component={AddressRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.KYC} component={KycRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.VEHICLE} component={VehicleRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.BANK} component={BankRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.SCHEDULE} component={ScheduleRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.WORK_PREFS} component={WorkPrefsRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.EMERGENCY} component={EmergencyRoute} />
      <OB.Screen name={STEP_ROUTE_NAME.CONSENT} component={ConsentRoute} />
      {/* Reachable for a single transitional frame right after Consent calls
          submitForReview() — RootNavigator swaps to MainTabs on the very next
          render once onboardingStatus flips away from DRAFT. Kept registered
          so that goNext()'s navigate() call always has a valid target. */}
      <OB.Screen name={STEP_ROUTE_NAME.SUBMITTED} component={ReviewStatusRoute} />
    </OB.Navigator>
  );
}
