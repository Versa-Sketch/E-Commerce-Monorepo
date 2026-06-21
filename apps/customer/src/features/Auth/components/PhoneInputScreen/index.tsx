import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import { PhoneInputScreen as SharedPhoneInputScreen, type AuthLabels } from '@monorepo/auth-ui';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../../../theme/ThemeContext';

interface PhoneInputScreenProps {
  onContinue: (phone: string, needsOtp: boolean) => void;
  onBack: () => void;
  onCreateAccount: () => void;
}

const customerLabels: AuthLabels = {
  title: 'Enter your mobile',
  subtitle: "We'll send a one-time code to verify your number.",
  placeholder: 'Enter 10-digit mobile number',
  buttonText: 'Continue',
  createAccountText: 'New here?',
  createAccountLink: 'Create account',
  securityNote: 'Your data is protected and encrypted',
};

export const PhoneInputScreen: React.FC<PhoneInputScreenProps> = observer(({
  onContinue,
  onBack,
  onCreateAccount,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();

  const handleContinue = async (phone: string) => {
    try {
      const result = await authStore.loginWithPhone(`+91${phone}`, 'customer');
      if (result === 'ok') {
        onContinue(phone, true);
      }
    } catch (err: any) {
      console.error('Phone login error:', err);
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
      <SharedPhoneInputScreen
        onContinue={handleContinue}
        onBack={onBack}
        onCreateAccount={onCreateAccount}
        theme={customerTheme}
        labels={customerLabels}
        role="customer"
        isLoading={authStore.isLoading}
        error={authStore.error}
      />
    </View>
  );
});
