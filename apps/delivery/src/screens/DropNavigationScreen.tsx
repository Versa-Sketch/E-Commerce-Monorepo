import React, { useState } from 'react';
import {
  Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { appStore } from '../store/useAppStore';
import { DispatchService } from '../services/dispatch';
import { ApiError } from '../services/http';
import { colors, typography, spacing, radius } from '../theme';

export const DropNavigationScreen = observer(function DropNavigationScreen({
  navigation,
}: any) {
  const [loading, setLoading] = useState(false);
  const order = appStore.activeOrderDetail;

  function openGoogleMaps() {
    if (!order?.drop_address) return;
    Linking.openURL(
      `https://maps.google.com/?q=${encodeURIComponent(order.drop_address)}`,
    );
  }

  async function handleCompleteDelivery() {
    if (!order || loading) return;

    if (__DEV__) {
      appStore.setActiveOrderDetail(null);
      appStore.setActiveOrder(null);
      Alert.alert('Delivery complete!', 'Great job! You earned ₹68.00 for this delivery.', [
        { text: 'Done', onPress: () => navigation.navigate('FeedHome') },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await DispatchService.completeDelivery(order.order_id);
      appStore.setActiveOrderDetail(null);
      appStore.setActiveOrder(null);
      Alert.alert(
        'Delivery complete!',
        `Great job! You earned ₹${res.data.earnings.toFixed(2)} for this delivery.`,
        [{ text: 'Done', onPress: () => navigation.navigate('FeedHome') }],
      );
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not mark delivery complete. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.successTitle}>Pickup complete!</Text>
            <Text style={styles.successSub}>OTP verified · Photos submitted</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Head to drop-off</Text>
        <Text style={styles.headerSub}>Deliver the order to the customer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Drop address card */}
        <View style={styles.card}>
          <View style={styles.cardSection}>
            <View style={styles.sectionLabelRow}>
              <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.sectionLabel}>DROP ADDRESS</Text>
            </View>
            <Text style={styles.addressText}>{order?.drop_address ?? '—'}</Text>

            <TouchableOpacity
              style={styles.mapsBtn}
              onPress={openGoogleMaps}
              activeOpacity={0.85}
            >
              <View style={styles.googleG}>
                <Text style={styles.googleGText}>G</Text>
              </View>
              <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
              <Ionicons name="open-outline" size={14} color={colors.black87} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardSection}>
            <View style={styles.sectionLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.gray300 }]} />
              <Text style={styles.sectionLabel}>ORDER DETAIL</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Order ID</Text>
              <Text style={styles.detailVal}>
                #{order?.order_id?.slice(-8).toUpperCase() ?? '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Earnings preview card */}
        <View style={styles.earningsCard}>
          <View>
            <Text style={styles.earningsLabel}>Estimated earnings</Text>
            <Text style={styles.earningsAmount}>₹68.00</Text>
            <View style={styles.earningsBreakdown}>
              <Text style={styles.earningItem}>Base <Text style={styles.earningItemVal}>₹40</Text></Text>
              <Text style={styles.earningItem}>Distance <Text style={styles.earningItemVal}>₹28</Text></Text>
            </View>
          </View>
          <View style={styles.tripBadge}>
            <Text style={styles.tripBadgeVal}>6 km</Text>
            <Text style={styles.tripBadgeLbl}>total trip</Text>
          </View>
        </View>

        {/* Customer instructions note */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.gray700} />
          <Text style={styles.infoText}>
            Hand the order directly to the customer. Do not leave it unattended.
            If unreachable, contact support before returning.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => navigation.navigate('HelpCenter')}
          activeOpacity={0.7}
        >
          <Text style={styles.helpBtnText}>Need help?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.completeBtn, loading && styles.btnDisabled]}
          onPress={handleCompleteDelivery}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="flag" size={20} color={colors.white} />
              <Text style={styles.completeBtnText}>Complete delivery</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },

  header: {
    backgroundColor: colors.black87,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md, padding: spacing.sm,
    marginBottom: 4,
  },
  successIcon: {
    width: 32, height: 32, borderRadius: radius.sm,
    backgroundColor: '#4CAF50',
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { ...typography.body, color: colors.white, fontWeight: '700' },
  successSub: { ...typography.small, color: 'rgba(255,255,255,0.5)' },
  headerTitle: { ...typography.h2, color: colors.white },
  headerSub: { ...typography.small, color: 'rgba(255,255,255,0.6)' },

  scroll: { padding: spacing.lg, gap: spacing.md },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardSection: { padding: spacing.lg, gap: spacing.sm },
  cardDivider: { height: 1, backgroundColor: colors.gray100 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sectionLabel: { ...typography.label, color: colors.gray300 },
  addressText: { ...typography.h3, color: colors.black87, lineHeight: 22 },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.gray100,
    borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 14,
    alignSelf: 'flex-start', marginTop: 4,
  },
  googleG: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center',
  },
  googleGText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  mapsBtnText: { ...typography.body, color: colors.black87, fontWeight: '600' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { ...typography.body, color: colors.gray700 },
  detailVal: { ...typography.body, color: colors.black87, fontWeight: '600' },

  earningsCard: {
    backgroundColor: colors.black87,
    borderRadius: radius.lg, padding: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  earningsLabel: { ...typography.small, color: 'rgba(255,255,255,0.6)' },
  earningsAmount: { fontSize: 28, fontWeight: '800', color: colors.white, marginVertical: 4 },
  earningsBreakdown: { flexDirection: 'row', gap: 12 },
  earningItem: { ...typography.small, color: 'rgba(255,255,255,0.5)' },
  earningItemVal: { color: colors.white, fontWeight: '600' },
  tripBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md, padding: spacing.md, alignItems: 'center',
  },
  tripBadgeVal: { ...typography.h3, color: colors.white },
  tripBadgeLbl: { ...typography.small, color: 'rgba(255,255,255,0.5)' },

  infoCard: {
    backgroundColor: colors.gray50, borderRadius: radius.lg,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderColor: colors.gray100,
  },
  infoText: { ...typography.small, color: colors.gray700, flex: 1, lineHeight: 18 },

  footer: {
    padding: spacing.lg, gap: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  helpBtn: {
    borderRadius: radius.lg, paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.gray100,
  },
  helpBtnText: { ...typography.body, color: colors.gray700, fontWeight: '600' },
  completeBtn: {
    backgroundColor: colors.black87,
    borderRadius: radius.lg, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  completeBtnText: { ...typography.h3, color: colors.white },
  btnDisabled: { opacity: 0.4 },
});
