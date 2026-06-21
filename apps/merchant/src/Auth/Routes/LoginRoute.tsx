import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { router } from 'expo-router';
import { PhoneInputScreen, type AuthLabels } from '@monorepo/auth-ui';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

const merchantTheme = {
  colors: Colors,
  spacing,
  borderRadius,
};

const merchantLabels: AuthLabels = {
  title: 'Sign in',
  subtitle: 'Enter your registered mobile number to continue.',
  placeholder: '9876543210',
  buttonText: 'Continue',
  createAccountText: "Don't have an account?",
  createAccountLink: 'Create Account',
  securityNote: 'Your data is protected and encrypted',
};

export default observer(function LoginRoute() {
  const { sessionStore } = useStores();

  const handleContinue = async (phone: string) => {
    sessionStore.setPhone(phone);
    sessionStore.resetLoginState();
    const ok = await sessionStore.login();
    if (!ok) return;
    router.push('/(auth)/otp');
  };

  return (
    <View style={{ flex: 1 }}>
      <PhoneInputScreen
        onContinue={handleContinue}
        onBack={() => router.back()}
        onCreateAccount={() => router.push('/(auth)/create-account')}
        theme={merchantTheme}
        labels={merchantLabels}
        role="SHOP_OWNER"
        isLoading={sessionStore.loginState === 'loading'}
        error={sessionStore.loginState === 'error' ? sessionStore.loginError : undefined}
      />
    </View>
  );
});
