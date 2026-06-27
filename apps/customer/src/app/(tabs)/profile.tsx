import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useAuthStore } from '../../features/Auth/Providers/useAuthStore';
import { useProfileStore } from '../../features/Profile/Providers/useProfileStore';
import { useTheme } from '../../theme/ThemeContext';

export default observer(function ProfileScreen() {
  const { theme, isDark, setThemeType } = useTheme();
  const router = useRouter();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const currentUser = authStore.currentUser;

  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    setShowLogoutConfirm(false);
    try {
      await authStore.logout();
      profileStore.setLocationConfirmed(false);
      router.replace('/landing');
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setThemeType(isDark ? 'light' : 'dark');
  };

  // Remaining Menu Items
  const MENU_ITEMS = [
    {
      title: 'Your Orders',
      icon: 'receipt-outline',
      onPress: () => router.push('/(tabs)/orders' as any)
    },
    {
      title: 'Addresses',
      icon: 'location-outline',
      onPress: () => router.push('/customer/addresses' as any)
    },
    { 
      title: 'Bargain History', 
      icon: 'chatbubbles-outline', 
      onPress: () => router.push('/customer/bargain/history' as any) 
    },
    { 
      title: 'Invoices', 
      icon: 'document-text-outline', 
      onPress: () => alert('Invoices & billing screen') 
    },
    { 
      title: 'Support', 
      icon: 'headset-outline', 
      onPress: () => alert('Customer support & help desk') 
    },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Block (No settings gear icon on top right) */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.avatarContainer}>
            {currentUser?.avatarUrl ? (
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: theme.colors.surfaceSecondary }]}>
                <Text style={[styles.avatarFallbackText, { color: theme.colors.textPrimary }]}>
                  {currentUser?.name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.profileNameText, { fontFamily: theme.typography.fonts.bold }]}>
            Hi, {currentUser?.name || 'Customer'} 👋
          </Text>
          <Text style={styles.profilePhoneText}>
            {currentUser?.phone || '+91 98765 43210'}
          </Text>
        </View>

        {/* Settings Card */}
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={item.onPress}
              style={[
                styles.menuItemRow,
                { borderBottomColor: theme.colors.border },
                index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconWrapper, { backgroundColor: `${theme.colors.primary}12` }]}>
                  <Ionicons name={item.icon} size={18} color={theme.colors.primary} />
                </View>
                <Text style={[styles.menuItemTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Preferences / Theme Toggle Card */}
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface, marginTop: 16 }]}>
          <View style={styles.menuItemRowNoBorder}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)' }]}>
                <Ionicons 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={18} 
                  color={isDark ? '#F59E0B' : '#3B82F6'} 
                />
              </View>
              <Text style={[styles.menuItemTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Standalone Logout Row */}
        <Pressable 
          onPress={() => setShowLogoutConfirm(true)}
          style={[styles.logoutBtnCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={[styles.menuIconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
          </View>
          <Text style={[styles.logoutBtnText, { color: theme.colors.error, fontFamily: theme.typography.fonts.semiBold }]}>
            Log Out Account
          </Text>
        </Pressable>
      </ScrollView>

      {/* Custom Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.logoutModalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.warningIconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Ionicons name="alert-circle-outline" size={36} color={theme.colors.error} />
            </View>
            
            <Text style={[styles.logoutModalTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              Confirm Log Out
            </Text>
            
            <Text style={[styles.logoutModalDesc, { color: theme.colors.textSecondary }]}>
              Are you sure you want to log out of your account? Any active orders will remain saved.
            </Text>

            <View style={styles.modalActionsRow}>
              <Pressable 
                onPress={() => setShowLogoutConfirm(false)}
                style={[styles.modalBtn, styles.cancelBtn, { borderColor: theme.colors.border }]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable 
                onPress={handleLogout}
                style={[styles.modalBtn, { backgroundColor: theme.colors.error }]}
              >
                <Text style={[styles.confirmBtnText, { fontFamily: theme.typography.fonts.medium }]}>
                  Yes, Log Out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  
  profileHeader: {
    paddingTop: 64,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarFallbackText: { fontSize: 32, fontWeight: 'bold' },
  
  profileNameText: { fontSize: 20, color: '#FFFFFF', marginTop: 12 },
  profilePhoneText: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },

  settingsCard: {
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuItemRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: { fontSize: 14 },
  
  logoutBtnCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  logoutBtnText: { fontSize: 14, marginLeft: 12 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  warningIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: { fontSize: 18, marginBottom: 8 },
  logoutModalDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 8 },
  modalActionsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalBtn: { flex: 1, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { marginRight: 12, borderWidth: 1, backgroundColor: 'transparent' },
  cancelBtnText: { fontSize: 14 },
  confirmBtnText: { fontSize: 14, color: '#FFFFFF' },
});
