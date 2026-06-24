import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../screens/FeedScreen';
import { ActiveOrderScreen } from '../screens/ActiveOrderScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { ReuploadDocumentsRoute } from '../features/Onboarding/Routes/ReuploadDocumentsRoute';

const Stack = createNativeStackNavigator();

export function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        animationDuration: 280,
        contentStyle: { backgroundColor: '#F7F7F7' },
      }}
    >
      <Stack.Screen name="FeedHome" component={FeedScreen} />
      <Stack.Screen name="ActiveOrder" component={ActiveOrderScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ReuploadDocuments" component={ReuploadDocumentsRoute} />
    </Stack.Navigator>
  );
}
