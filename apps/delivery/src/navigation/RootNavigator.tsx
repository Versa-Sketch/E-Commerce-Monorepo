import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';
import { MainTabs } from './MainTabs';
import { OtpScreen } from '../screens/onboarding/OtpScreen';
import { AadhaarScreen } from '../screens/onboarding/AadhaarScreen';
import { AadhaarOtpScreen } from '../screens/onboarding/AadhaarOtpScreen';
import { PanScreen } from '../screens/onboarding/PanScreen';
import { ShippingAddressScreen } from '../screens/onboarding/ShippingAddressScreen';
import { ApplicationSubmittedScreen } from '../screens/onboarding/ApplicationSubmittedScreen';

const Root = createNativeStackNavigator();

export function RootNavigator() {
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 220, contentStyle: { backgroundColor: '#F7F7F7' } }}>
      {isOnboarded ? (
        <>
          <Root.Screen name="MainApp" component={MainTabs} />
          <Root.Screen name="Onboarding" component={OnboardingFlow} />
        </>
      ) : (
        <>
          <Root.Screen name="Onboarding" component={OnboardingFlow} />
          <Root.Screen name="MainApp" component={MainTabs} />
        </>
      )}
    </Root.Navigator>
  );
}

const OB = createNativeStackNavigator();

function OnboardingFlow() {
  return (
    <OB.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        animationDuration: 280,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <OB.Screen name="Otp" component={OtpScreen} />
      <OB.Screen name="Aadhaar" component={AadhaarScreen} />
      <OB.Screen name="AadhaarOtp" component={AadhaarOtpScreen} />
      <OB.Screen name="Pan" component={PanScreen} />
      <OB.Screen name="ShippingAddress" component={ShippingAddressScreen} />
      <OB.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} />
    </OB.Navigator>
  );
}
