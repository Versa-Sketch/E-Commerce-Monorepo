import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FeedStack } from './FeedStack';
import { MoreStack } from './MoreStack';
import { EarningsScreen } from '../screens/EarningsScreen';
import { PocketScreen } from '../screens/PocketScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcon = (name: string, focused: boolean, size: number) => {
  const icons: Record<string, [string, string]> = {
    Feed: ['home', 'home-outline'],
    Earnings: ['bar-chart', 'bar-chart-outline'],
    Pocket: ['wallet', 'wallet-outline'],
    More: ['menu', 'menu-outline'],
  };
  const pair = icons[name] ?? ['ellipse', 'ellipse-outline'];
  return (
    <Ionicons
      name={(focused ? pair[0] : pair[1]) as any}
      size={size}
      color={focused ? colors.black : colors.gray300}
    />
  );
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => tabIcon(route.name, focused, size),
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.gray300,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray100,
          backgroundColor: colors.white,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { ...typography.small, fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Pocket" component={PocketScreen} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
