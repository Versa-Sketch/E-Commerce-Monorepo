import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import { OtpVerifyScreen as SharedOtpVerifyScreen, type AuthLabels } from '@monorepo/auth-ui';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../../../theme/ThemeContext';

interface OtpVerifyScreenProps {
  phoneNumber: string;
  apiRole?: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
}

const customerLabels: AuthLabels = {
  enterOtpTitle: 'Verify your number',
  enterOtpSubtitle: 'Enter the one-time code we sent to your mobile',
  verifyButton: 'Verify & Continue',
  resendOtp: 'Resend OTP',
};

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = observer(({
  phoneNumber,
  apiRole = 'customer',
  onBack,
  onVerify,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();

  const handleVerify = async (otp: string): Promise<boolean> => {
    try {
      await authStore.verifyOtp(phoneNumber, otp, 'CUSTOMER');
      onVerify(otp);
      return true;
    } catch (err: any) {
      console.error('OTP verification error:', err);
      return false;
    }
  };

  const handleResendOtp = async () => {
    // Resend OTP logic - can be added if needed
    try {
      await authStore.loginWithPhone(`+91${phoneNumber}`, 'customer');
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  const customerTheme = {
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      surface: theme.colors.surface || theme.colors.background,
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      border: theme.colors.border,
      error: theme.colors.error,
    },
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };

  return (
    <View style={{ flex: 1 }}>
      <SharedOtpVerifyScreen
        phoneNumber={phoneNumber}
        role={apiRole as 'customer' | 'SHOP_OWNER'}
        onBack={onBack}
        onVerify={handleVerify}
        onResendOtp={handleResendOtp}
        theme={customerTheme}
        labels={customerLabels}
        otpLength={4}
        isLoading={authStore.isLoading}
        error={authStore.error}
      />
    </View>
  );
});
