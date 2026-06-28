import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import { StatusBadge } from '../components/StatusBadge';
import { appStore } from '../store/useAppStore';
import { colors, typography } from '../theme';

export const ActiveOrderScreen = observer(function ActiveOrderScreen({ navigation }: any) {
  const { activeOrder, activeOrderDetail } = appStore;

  // Prefer real accepted-order data; fall back to simulated order; last resort: placeholder.
  const display = activeOrderDetail
    ? {
        orderId: `#${activeOrderDetail.order_id.slice(-6).toUpperCase()}`,
        shopName: activeOrderDetail.shop_name,
        dropAddress: activeOrderDetail.drop_address,
        shopLatitude: activeOrderDetail.shop_latitude,
        shopLongitude: activeOrderDetail.shop_longitude,
        earnings: 0,
        denialReason: null as string | null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    : {
        orderId: `#${(activeOrder as any)?.orderNumber ?? '8053274047'}`,
        shopName: (activeOrder as any)?.store ?? 'Hotel Babu Biryani Point',
        dropAddress: null as string | null,
        shopLatitude: null as string | null,
        shopLongitude: null as string | null,
        earnings: activeOrder?.earnings ?? 0,
        denialReason: activeOrder?.denialReason ?? 'Personal Emergency',
        time: (activeOrder as any)?.time ?? '10:15 pm',
      };

  function openMaps() {
    if (!display.shopLatitude || !display.shopLongitude) return;
    Linking.openURL(
      `https://maps.google.com/?q=${display.shopLatitude},${display.shopLongitude}`,
    );
  }

  function handleComplete() {
    appStore.setActiveOrder(null);
    appStore.setActiveOrderDetail(null);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black87} />
        </TouchableOpacity>
        <Text style={styles.title}>Active Order</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Earnings card */}
        <LinearGradient colors={['#1A1A1A', '#000000']} style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total earnings</Text>
          <Text style={styles.earningsAmt}>₹{display.earnings}</Text>
        </LinearGradient>

        {/* Order card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNum}>Order: {display.orderId}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.gray700} />
          </View>

          {display.denialReason && (
            <>
              <View style={styles.badgeRow}>
                <StatusBadge type="denial" />
              </View>
              <Text style={styles.denialReason}>{display.denialReason}</Text>
            </>
          )}

          {/* Pickup section */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>PICKUP</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.storeName}>{display.shopName}</Text>
          <Text style={styles.assignedTime}>Order assigned  {display.time}</Text>

          {display.shopLatitude && display.shopLongitude && (
            <TouchableOpacity style={styles.mapsBtn} onPress={openMaps} activeOpacity={0.85}>
              <Ionicons name="navigate" size={14} color={colors.white} />
              <Text style={styles.mapsBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          )}

          {/* Drop section */}
          {display.dropAddress && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>DROP</Text>
                <View style={styles.dividerLine} />
              </View>
              <Text style={[styles.storeName, styles.dropAddress]}>{display.dropAddress}</Text>
            </>
          )}
        </View>

        {/* Help row */}
        <TouchableOpacity
          style={styles.helpRow}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Text style={styles.helpText}>Need help on this trip?</Text>
          <View style={styles.helpRight}>
            <Text style={styles.helpLink}>Help center</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.orange} />
          </View>
        </TouchableOpacity>

        {/* Mark complete */}
        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { ...typography.h2, color: colors.black87 },
  scroll: { padding: 16, gap: 12 },
  earningsCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 4 },
  earningsLabel: { ...typography.body, color: 'rgba(255,255,255,0.8)' },
  earningsAmt: { fontSize: 36, fontWeight: '800', color: colors.white, marginTop: 4 },
  orderCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  orderNum: { ...typography.h3, color: colors.black87 },
  badgeRow: { paddingHorizontal: 16, paddingTop: 12 },
  denialReason: {
    ...typography.body, color: colors.orange, fontWeight: '600',
    paddingHorizontal: 16, paddingTop: 6,
  },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray100 },
  dividerLabel: {
    ...typography.small, color: colors.gray300,
    paddingHorizontal: 10, fontWeight: '600', letterSpacing: 1,
  },
  storeName: { ...typography.h3, color: colors.black87, paddingHorizontal: 16 },
  dropAddress: { paddingBottom: 16 },
  assignedTime: {
    ...typography.small, color: colors.gray300,
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12,
  },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.black87, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start',
  },
  mapsBtnText: { ...typography.small, color: colors.white, fontWeight: '600' },
  helpRow: {
    backgroundColor: colors.cardBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  helpText: { ...typography.body, color: colors.black87 },
  helpRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  helpLink: { ...typography.body, color: colors.orange, fontWeight: '600' },
  completeBtn: {
    backgroundColor: colors.green, borderRadius: 10,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  completeBtnText: { ...typography.h3, color: colors.white },
});
