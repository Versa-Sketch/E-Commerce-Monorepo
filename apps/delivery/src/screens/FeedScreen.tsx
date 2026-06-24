import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnlineToggle } from '../components/OnlineToggle';
import { OnboardingStatusBanner } from '../components/OnboardingStatusBanner';
import { BottomSheet } from '../components/BottomSheet';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../features/Auth/Store/useAuthStore';
import { useOnboardingStore } from '../features/Onboarding/Store/useOnboardingStore';
import { mockDP, mockWallet, mockTrips } from '../mock';
import { colors, typography } from '../theme';

function initialsOf(name: string | undefined): string {
  if (!name) return '?';
  return name.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export function FeedScreen({ navigation }: any) {
  const { isOnline, toggleOnline, setActiveOrder } = useAppStore();
  const [geoSheet, setGeoSheet] = useState(!mockDP.isNearStore);
  const user = useAuthStore((s) => s.user);
  const onboardingStatus = useOnboardingStore((s) => s.onboardingStatus);
  const isApproved = onboardingStatus === 'APPROVED';

  function simulateOrder() {
    setActiveOrder(mockTrips[1]);
    navigation.navigate('ActiveOrder');
  }

  function handleToggleOnline() {
    if (!isApproved) return;
    toggleOnline();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user?.fullName ?? mockDP.name)}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.fullName ?? mockDP.name}</Text>
            <View style={styles.profileStatusRow}>
              <View style={[styles.dot, { backgroundColor: isOnline ? colors.black : colors.gray300 }]} />
              <Text style={styles.profileStatusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.topRight}>
          <Pressable style={styles.sosBtn}>
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
          <Pressable>
            <Ionicons name="notifications-outline" size={22} color={colors.black87} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <OnboardingStatusBanner navigation={navigation} />

        {/* Status indicator */}
        <View style={[styles.statusBanner, { backgroundColor: isOnline ? colors.greenLight : colors.gray50 }]}>
          <Ionicons
            name={isOnline ? 'radio-button-on' : 'radio-button-off'}
            size={14}
            color={isOnline ? colors.black87 : colors.gray300}
          />
          <Text style={[styles.statusText, { color: isOnline ? colors.black87 : colors.gray300 }]}>
            {isOnline ? 'You are Online — Ready to receive orders' : 'You are Offline'}
          </Text>
        </View>

        {/* Bonus banner */}
        <View style={styles.bonusBanner}>
          <Text style={styles.bonusText}>
            ₹20 extra per order! Kondapur Gachibowli | Instamart orders
          </Text>
        </View>

        {/* Shift card */}
        <View style={styles.card}>
          <View style={styles.liveRow}>
            <Text style={styles.cardTitle}>Our shift has started!</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.cardSub}>12:00 pm – 4:00 pm</Text>
          <TouchableOpacity
            style={[styles.goOnlineBtn, isOnline && styles.goOnlineBtnActive, !isApproved && styles.goOnlineBtnLocked]}
            onPress={handleToggleOnline}
            activeOpacity={isApproved ? 0.85 : 1}
          >
            {!isApproved ? <Ionicons name="lock-closed" size={14} color={colors.gray300} style={styles.lockIcon} /> : null}
            <Text style={[styles.goOnlineText, !isApproved && styles.goOnlineTextLocked]}>
              {isApproved ? (isOnline ? 'You are Live!' : "Let's go online") : 'Unlocks once approved'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bank details nudge */}
        <View style={styles.card}>
          <View style={styles.bankRow}>
            <View style={styles.bankLeft}>
              <Ionicons name="wallet-outline" size={22} color={colors.black87} />
              <Text style={styles.bankText}>Add Bank Details to receive payouts</Text>
            </View>
            <TouchableOpacity style={styles.addNowBtn} activeOpacity={0.8}>
              <Text style={styles.addNowText}>Add now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earnings summary */}
        <TouchableOpacity
          style={styles.earningsCard}
          onPress={() => navigation.navigate('Earnings')}
          activeOpacity={0.85}
        >
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>
              Earnings: {mockWallet.weekLabel}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray700} />
          </View>
          <Text style={styles.earningsAmount}>₹{mockWallet.weeklyEarnings}</Text>
        </TouchableOpacity>

        {/* Simulate order */}
        <TouchableOpacity style={styles.demoBtn} onPress={simulateOrder} activeOpacity={0.85}>
          <Ionicons name="flash" size={16} color={colors.white} />
          <Text style={styles.demoBtnText}>Simulate Incoming Order</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Geo-fence bottom sheet */}
      <BottomSheet visible={geoSheet} onClose={() => setGeoSheet(false)} height={380}>
        <View style={styles.geoContent}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={48} color={colors.gray300} />
          </View>
          <Text style={styles.geoTitle}>Go near store to go online</Text>
          <Text style={styles.geoAddress}>{mockDP.storeAddress}</Text>
          <TouchableOpacity
            style={styles.geoBtn}
            onPress={() => setGeoSheet(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.geoBtnText}>Go now to go online</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
          <Pressable style={styles.geoClose} onPress={() => setGeoSheet(false)}>
            <Ionicons name="close" size={22} color={colors.gray700} />
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.black87,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: colors.white },
  profileName: { ...typography.small, fontWeight: '700', color: colors.black87 },
  profileStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  profileStatusText: { fontSize: 11, color: colors.gray300 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sosBtn: {
    backgroundColor: colors.red, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  sosText: { ...typography.small, color: colors.white, fontWeight: '700' },
  scroll: { paddingBottom: 32 },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  statusText: { ...typography.small, fontWeight: '500' },
  bonusBanner: {
    backgroundColor: colors.shiftHeaderBg, marginHorizontal: 16, marginTop: 12,
    borderRadius: 10, padding: 14,
  },
  bonusText: { ...typography.body, color: colors.white },
  card: {
    backgroundColor: colors.cardBg, marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { ...typography.h3, color: colors.black87 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.redLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  liveText: { ...typography.small, color: colors.red, fontWeight: '700' },
  cardSub: { ...typography.body, color: colors.gray700, marginBottom: 14 },
  goOnlineBtn: {
    backgroundColor: colors.black87, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  goOnlineBtnActive: { backgroundColor: colors.gray300 },
  goOnlineBtnLocked: { backgroundColor: colors.gray100 },
  goOnlineText: { ...typography.body, color: colors.white, fontWeight: '600' },
  goOnlineTextLocked: { color: colors.gray300 },
  lockIcon: {},
  bankRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bankLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bankText: { ...typography.body, color: colors.black87, flex: 1 },
  addNowBtn: {
    borderWidth: 1.5, borderColor: colors.black87,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
  },
  addNowText: { ...typography.small, color: colors.black87, fontWeight: '600' },
  earningsCard: {
    backgroundColor: colors.cardBg, marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  earningsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  earningsLabel: { ...typography.body, color: colors.gray700 },
  earningsAmount: { ...typography.h1, color: colors.black87, marginTop: 6 },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.black87, marginHorizontal: 16, marginTop: 20,
    borderRadius: 10, paddingVertical: 14, justifyContent: 'center',
  },
  demoBtnText: { ...typography.body, color: colors.white, fontWeight: '600' },
  geoContent: { alignItems: 'center' },
  mapPlaceholder: {
    width: '100%', height: 120, backgroundColor: colors.gray50,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  geoTitle: { ...typography.h2, color: colors.black87, marginBottom: 8, textAlign: 'center' },
  geoAddress: { ...typography.small, color: colors.gray700, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  geoBtn: {
    backgroundColor: colors.black87, borderRadius: 10, paddingVertical: 14,
    paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  geoBtnText: { ...typography.body, color: colors.white, fontWeight: '600' },
  geoClose: { position: 'absolute', top: -8, right: 0 },
});
