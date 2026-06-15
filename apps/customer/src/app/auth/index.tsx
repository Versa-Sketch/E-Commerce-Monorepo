import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LoginForm } from '../../features/Auth/components/LoginForm';
import { useAuthStore } from '../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../theme/ThemeContext';
import { UserRole } from '../../types/shared';
export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const authStore = useAuthStore();
  const handleManualLogin = (phone: string) => {
    authStore.setCredentials(
      {
        id: 'user_cust_9',
        name: 'Regular Customer',
        email: 'customer@localio.com',
        phone,
        role: 'customer',
        shopId: null,
        walletBalance: 250,
        addresses: [],
        createdAt: new Date().toISOString(),
      },
      'mock_jwt_customer_token_999',
      'mock_refresh_token_customer_999'
    );
    router.replace('/');
  };
  const simulateRoleLogin = (role: UserRole) => {
    const profiles: Record<UserRole, { name: string; email: string; token: string; walletBalance: number }> = {
      customer: { name: 'Local Customer', email: 'customer@localio.com', token: 'mock_jwt_customer_token', walletBalance: 500 },
      merchant: { name: 'Rakesh (Greenfield Groceries)', email: 'merchant@greenfield.com', token: 'mock_jwt_merchant_token', walletBalance: 0 },
      delivery: { name: 'Courier Agent (Ramesh)', email: 'delivery@courier.com', token: 'mock_jwt_courier_token', walletBalance: 0 },
      admin: { name: 'System Administrator', email: 'admin@localio.com', token: 'mock_jwt_admin_token', walletBalance: 0 },
    };
    const profile = profiles[role];
    authStore.setCredentials(
      {
        id: `user_${role}_12`,
        name: profile.name,
        email: profile.email,
        phone: '+91 9988776655',
        role,
        shopId: null,
        walletBalance: profile.walletBalance,
        addresses: [],
        createdAt: new Date().toISOString(),
      },
      profile.token,
      `mock_refresh_token_${role}`
    );
    router.replace('/');
  };
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Pressable onPress={() => router.replace('/')} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <View style={styles.header}>
        <Text style={[theme.textPresets.h2, { color: theme.colors.primary }]}>Welcome Back</Text>
        <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary, marginTop: 4 }]}>
          Log in to connect with your local shops
        </Text>
      </View>
      <LoginForm onLogin={handleManualLogin} />
      {/* <QuickAccessProfiles onSelectRole={simulateRoleLogin} /> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 64 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 24, padding: 4 },
  header: { marginBottom: 32 }
});
