import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockDP } from '../mock';
import { colors, typography } from '../theme';

const menuItems = [
  { icon: 'time-outline', label: 'Trip History', screen: 'TripHistory' },
  { icon: 'help-circle-outline', label: 'Help Center', screen: 'HelpCenter' },
  { icon: 'person-outline', label: 'My Profile', screen: null },
  { icon: 'document-text-outline', label: 'Documents', screen: null },
  { icon: 'star-outline', label: 'Ratings & Reviews', screen: null },
  { icon: 'settings-outline', label: 'Settings', screen: null },
  { icon: 'information-circle-outline', label: 'About', screen: null },
];

export function MoreScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mockDP.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{mockDP.name}</Text>
          <Text style={styles.profilePhone}>{mockDP.phone}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color={colors.gray300} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => item.screen && navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={item.icon as any} size={20} color={colors.black87} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.onboardingBtn}
          onPress={() => navigation.navigate('Onboarding')}>
          <Ionicons name="play-circle-outline" size={18} color={colors.orange} />
          <Text style={styles.onboardingText}>View Onboarding Flow</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  profileHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 20,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
    gap: 14,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.white },
  profileInfo: { flex: 1 },
  profileName: { ...typography.h3, color: colors.black87 },
  profilePhone: { ...typography.small, color: colors.gray300, marginTop: 2 },
  scroll: { padding: 16, paddingBottom: 40 },
  menuCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.gray50,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { ...typography.body, color: colors.black87 },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: 16 },
  onboardingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.orangeLight, borderRadius: 10,
    paddingVertical: 14, justifyContent: 'center', marginTop: 16,
  },
  onboardingText: { ...typography.body, color: colors.orange, fontWeight: '600' },
});
