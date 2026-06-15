import React, { useState } from 'react';
import { Button } from '@/Common/components/ui/Button';
import { useAuthStore } from '@/features/Auth/Providers/useAuthStore';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
export default observer(function DeliveryDashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const authStore = useAuthStore();
  const currentUser = authStore.user;
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authStore.logout();
      router.replace('/landing');
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[theme.textPresets.h2, { color: theme.colors.primary }]}>
          Delivery Partner Portal
        </Text>
        <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary, marginTop: 4 }]}>
          Welcome, {currentUser?.name || 'Delivery Partner'}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, marginBottom: 8 }]}>
          Courier dashboard is ready!
        </Text>
        <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>
          Accept job feeds, toggle duty status, and activate GPS route tracking.
        </Text>
      </View>
      <Button
        label="Log Out & Switch Portal"
        onPress={handleLogout}
        variant="outline"
        loading={loggingOut}
        style={styles.btn}
      />
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  card: { width: '100%', padding: 20, borderWidth: 1.5, borderRadius: 12, marginBottom: 40 },
  btn: { width: '100%', maxWidth: 240 },
});
