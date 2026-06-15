import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../features/Auth/Providers/useAuthStore';
import { useProfileStore } from '../features/Profile/Providers/useProfileStore';
import { useTheme } from '../theme/ThemeContext';
import { MobileLoginScreen } from '../features/Auth/components/MobileLoginScreen';
import { PhoneInputScreen } from '../features/Auth/components/PhoneInputScreen';
import { CreateAccountScreen } from '../features/Auth/components/CreateAccountScreen';
import { OtpVerifyScreen } from '../features/Auth/components/OtpVerifyScreen';

type AuthStep = 'landing' | 'phone' | 'create-account' | 'otp';

export default observer(function LandingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const isAuthenticated = authStore.isAuthenticated;
  const currentUser = authStore.user;

  const [step, setStep] = useState<AuthStep>('landing');
  const [phone, setPhone] = useState('');
  const [apiRole] = useState('CUSTOMER');

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      switch (currentUser.role) {
        case 'customer':
          router.replace('/(tabs)');
          break;
        case 'merchant':
          router.replace('/store');
          break;
        case 'delivery':
          router.replace('/delivery');
          break;
        case 'admin':
          router.replace('/admin');
          break;
        default:
          router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      setStep('landing');
      setPhone('');
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => setStep('phone');
  const handlePhoneContinue = (enteredPhone: string, needsOtp: boolean) => {
    setPhone(enteredPhone);
    if (needsOtp) setStep('otp');
  };
  const handleGoToCreateAccount = () => setStep('create-account');
  const handleCreateAccount = (enteredPhone: string) => {
    setPhone(enteredPhone);
    setStep('otp');
  };
  const handleOtpVerify = (_enteredOtp: string) => {
  };
  const handleBackToLanding = () => setStep('landing');
  const handleBackToPhone = () => setStep('phone');

  if (isAuthenticated && currentUser) {
    return <View style={[styles.root, { backgroundColor: '#FFFFFF' }]} />;
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: '#F9FAFB' }]}>
      {step === 'landing' && (
        <MobileLoginScreen onGetStarted={handleGetStarted} />
      )}
      {step === 'phone' && (
        <PhoneInputScreen
          onContinue={handlePhoneContinue}
          onBack={handleBackToLanding}
          onCreateAccount={handleGoToCreateAccount}
        />
      )}
      {step === 'create-account' && (
        <CreateAccountScreen
          onCreateAccount={handleCreateAccount}
          onBack={handleBackToPhone}
        />
      )}
      {step === 'otp' && (
        <OtpVerifyScreen
          phoneNumber={phone}
          apiRole={apiRole}
          onBack={handleBackToPhone}
          onVerify={handleOtpVerify}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
});
