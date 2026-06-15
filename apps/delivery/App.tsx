import 'expo-dev-client';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';

// Make the NavigationContainer background match the app — eliminates the
// white flash that appears between screens during slide-back gestures.
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F7F7',
    card: '#FFFFFF',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <SafeAreaProvider>
        <StatusBar translucent={false} backgroundColor="#ffffff" barStyle="dark-content" />
        <NavigationContainer theme={AppTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
