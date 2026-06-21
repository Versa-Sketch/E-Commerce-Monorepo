import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { router } from 'expo-router';
import { OtpVerifyScreen, type AuthLabels } from '@monorepo/auth-ui';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { routeToOnboardingStep } from '../../Onboarding/utils/routing';

const merchantTheme = {
  colors: Colors,
  spacing,
  borderRadius,
};

const merchantLabels: AuthLabels = {
  enterOtpTitle: 'Verify your number',
  enterOtpSubtitle: 'Enter the OTP sent to your mobile',
  verifyButton: 'Verify & Continue',
  resendOtp: 'Resend OTP',
};

export default observer(function OTPRoute() {
  const { sessionStore, shopSetupStore } = useStores();

  const handleVerify = async (otp: string): Promise<boolean> => {
    const { success } = await sessionStore.verifyOTP(otp);

    if (success) {
      await sessionStore.fetchUser();
      await sessionStore.fetchOnboardingStatus();
      if (sessionStore.onboardingStatus === 'approved') {
        await shopSetupStore.fetchMyShopTypes();
        router.replace(shopSetupStore.hasChosenTypes ? '/(tabs)/home' : '/(auth)/shop-type-selection');
      } else {
        router.replace(routeToOnboardingStep(sessionStore.onboardingCurrentStep, sessionStore.onboardingStatus) as Parameters<typeof router.replace>[0]);
      }
    }

    return success;
  };

  const handleResend = async () => {
    sessionStore.resetOTPState();
    await sessionStore.sendOTP();
  };

  return (
    <View style={{ flex: 1 }}>
      <OtpVerifyScreen
        phoneNumber={sessionStore.phone}
        role="SHOP_OWNER"
        onBack={() => router.back()}
        onVerify={handleVerify}
        onResendOtp={handleResend}
        theme={merchantTheme}
        labels={merchantLabels}
        otpLength={4}
        isLoading={sessionStore.otpState === 'verifying'}
        error={sessionStore.otpState === 'error' ? sessionStore.otpError : undefined}
      />
    </View>
  );
});
