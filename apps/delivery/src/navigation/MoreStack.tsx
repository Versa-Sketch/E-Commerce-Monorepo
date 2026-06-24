import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreScreen } from '../screens/MoreScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { ConfigRoute } from '../features/Config/Routes/ConfigRoute';
import { CodSettingsRoute } from '../features/Config/Routes/CodSettingsRoute';
import { ScheduleSettingsRoute } from '../features/Config/Routes/ScheduleSettingsRoute';
import { WorkPrefsSettingsRoute } from '../features/Config/Routes/WorkPrefsSettingsRoute';

const Stack = createNativeStackNavigator();

export function MoreStack() {
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
      <Stack.Screen name="MoreHome" component={MoreScreen} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="DeliverySetup" component={ConfigRoute} />
      <Stack.Screen name="CodSettings" component={CodSettingsRoute} />
      <Stack.Screen name="ScheduleSettings" component={ScheduleSettingsRoute} />
      <Stack.Screen name="WorkPrefsSettings" component={WorkPrefsSettingsRoute} />
    </Stack.Navigator>
  );
}
