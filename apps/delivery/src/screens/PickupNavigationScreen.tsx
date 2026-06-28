import React from 'react';
import {
  Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { appStore } from '../store/useAppStore';
import { colors, typography, spacing, radius } from '../theme';

export const PickupNavigationScreen = observer(function PickupNavigationScreen({
  navigation,
}: any) {
  const order = appStore.activeOrderDetail;

  function openGoogleMaps() {
    if (!order?.shop_latitude || !order?.shop_longitude) return;
    Linking.openURL(
      `https://maps.google.com/?q=${order.shop_latitude},${order.shop_longitude}`,
    );
  }

  function handleReachedPickup() {
    navigation.navigate('OTPVerification');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Order accepted</Text>
          </View>
          <Text style={styles.headerTitle}>Head to pickup</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Distance chips */}
        <View style={styles.distanceRow}>
          <View style={styles.distanceChip}>
            <Ionicons name="navigate-outline" size={18} color={colors.black87} />
            <View>
              <Text style={styles.distanceValue}>
                {appStore.activeOrder
                  ? (appStore.activeOrder as any).pickupDistance ?? '—'
                  : '—'} km
              </Text>
              <Text style={styles.distanceLabel}>to store</Text>
            </View>
          </View>
          <View style={styles.distanceDivider} />
          <View style={styles.distanceChip}>
            <Ionicons name="time-outline" size={18} color={colors.black87} />
            <View>
              <Text style={styles.distanceValue}>~6 min</Text>
              <Text style={styles.distanceLabel}>estimated</Text>
            </View>
          </View>
        </View>

        {/* Store card */}
        <View style={styles.card}>
          <View style={styles.cardSection}>
            <View style={styles.sectionLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.black87 }]} />
              <Text style={styles.sectionLabel}>PICKUP LOCATION</Text>
            </View>
            <Text style={styles.shopName}>{order?.shop_name ?? 'Store'}</Text>

            {order?.shop_latitude && order?.shop_longitude ? (
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
            ) : null}
          </View>

          <View style={styles.cardDivider} />

          {/* Order summary */}
          <View style={styles.cardSection}>
            <View style={styles.sectionLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.gray300 }]} />
              <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Order ID</Text>
              <Text style={styles.summaryVal}>
                #{order?.order_id?.slice(-8).toUpperCase() ?? '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.gray700} />
          <Text style={styles.infoText}>
            Collect all items, verify the order with the merchant, and get the customer OTP
            before leaving.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleReachedPickup}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
          <Text style={styles.primaryBtnText}>Reached pickup</Text>
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
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
    marginBottom: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' },
  statusBadgeText: { ...typography.small, color: colors.white },
  headerTitle: { ...typography.h2, color: colors.white },

  scroll: { padding: spacing.lg, gap: spacing.md },

  distanceRow: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  distanceChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  distanceDivider: { width: 1, height: 36, backgroundColor: colors.gray100 },
  distanceValue: { ...typography.h3, color: colors.black87 },
  distanceLabel: { ...typography.small, color: colors.gray300 },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardSection: { padding: spacing.lg, gap: spacing.sm },
  cardDivider: { height: 1, backgroundColor: colors.gray100 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sectionLabel: { ...typography.label, color: colors.gray300 },

  shopName: { ...typography.h2, color: colors.black87 },

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

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { ...typography.body, color: colors.gray700 },
  summaryVal: { ...typography.body, color: colors.black87, fontWeight: '600' },

  infoCard: {
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderColor: colors.gray100,
  },
  infoText: { ...typography.body, color: colors.gray700, flex: 1, lineHeight: 20 },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  primaryBtn: {
    backgroundColor: colors.black87,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  primaryBtnText: { ...typography.h3, color: colors.white },
});
