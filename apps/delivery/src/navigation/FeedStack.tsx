import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../screens/FeedScreen';
import { ActiveOrderScreen } from '../screens/ActiveOrderScreen';
import { PickupNavigationScreen } from '../screens/PickupNavigationScreen';
import { OTPVerificationScreen } from '../screens/OTPVerificationScreen';
import { PhotoUploadScreen } from '../screens/PhotoUploadScreen';
import { DropNavigationScreen } from '../screens/DropNavigationScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { ReuploadDocumentsRoute } from '../features/Onboarding/Routes/ReuploadDocumentsRoute';
import { TestTrackingScreen } from '../screens/TestTrackingScreen';

const Stack = createNativeStackNavigator();

const stackOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  fullScreenGestureEnabled: true,
  animationDuration: 280,
  contentStyle: { backgroundColor: '#F7F7F7' },
};

export function FeedStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="FeedHome" component={FeedScreen} />
      <Stack.Screen name="ActiveOrder" component={ActiveOrderScreen} />
      <Stack.Screen name="PickupNavigation" component={PickupNavigationScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
      <Stack.Screen name="DropNavigation" component={DropNavigationScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ReuploadDocuments" component={ReuploadDocumentsRoute} />
      <Stack.Screen name="TestTracking" component={TestTrackingScreen} />
    </Stack.Navigator>
  );
}
