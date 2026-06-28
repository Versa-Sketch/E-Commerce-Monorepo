import 'expo-dev-client';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { hydrateStorage } from './src/services/storage';
import { useAuthStore } from './src/features/Auth/Store/useAuthStore';
import { DeliveryOfferSheet } from './src/components/DeliveryOfferSheet';
import { navigationRef } from './src/services/navigationRef';

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      // useAuthStore's initial state reads the auth token synchronously at
      // module-load time, before MMKV's AsyncStorage-backed fallback cache
      // (used whenever MMKV itself fails to initialize, e.g. in Expo Go) has
      // had a chance to load anything from disk. Without this, that first
      // read always comes back empty, so every reload looks logged-out even
      // though the token is sitting safely in AsyncStorage the whole time.
      await hydrateStorage();
      useAuthStore.getState().restoreSession();
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#F7F7F7' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar translucent={false} backgroundColor="#ffffff" barStyle="dark-content" />
          <NavigationContainer ref={navigationRef} theme={AppTheme}>
            <RootNavigator />
          </NavigationContainer>
          <DeliveryOfferSheet />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
