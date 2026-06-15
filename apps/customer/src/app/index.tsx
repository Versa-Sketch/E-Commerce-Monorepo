import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../features/Auth/Providers/useAuthStore';
import { useProfileStore } from '../features/Profile/Providers/useProfileStore';

export default observer(function RootIndex() {
  const router = useRouter();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const isAuthenticated = authStore.isAuthenticated;
  const currentUser = authStore.user;

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
    } else {
      router.replace('/landing');
    }
  }, [isAuthenticated, currentUser]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <ActivityIndicator size="large" color="#0F766E" />
    </View>
  );
});
