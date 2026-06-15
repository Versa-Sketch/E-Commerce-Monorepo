import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBadge } from '../components/StatusBadge';
import { useAppStore } from '../store/useAppStore';
import { colors, typography } from '../theme';

export function ActiveOrderScreen({ navigation }: any) {
  const { activeOrder, setActiveOrder } = useAppStore();

  const order = activeOrder ?? {
    store: 'Hotel Babu Biryani Point',
    orderNumber: '8053274047',
    earnings: 0,
    denialReason: 'Personal Emergency',
    time: '10:15 pm',
  };

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
        {/* Total earnings card */}
        <LinearGradient
          colors={['#1A1A1A', '#000000']}
          style={styles.earningsCard}
        >
          <Text style={styles.earningsLabel}>Total earnings</Text>
          <Text style={styles.earningsAmt}>₹{order.earnings}</Text>
        </LinearGradient>

        {/* Order card */}
        <View style={styles.orderCard}>
          <TouchableOpacity style={styles.orderHeader} activeOpacity={0.8}>
            <Text style={styles.orderNum}>Order: {order.orderNumber ?? 'N/A'}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.gray700} />
          </TouchableOpacity>

          <View style={styles.badgeRow}>
            <StatusBadge type="denial" />
          </View>

          <Text style={styles.denialReason}>{order.denialReason}</Text>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>PICKUP</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.storeName}>{order.store}</Text>
          <Text style={styles.assignedTime}>Order assigned  {(order as any).time ?? '10:15 pm'}</Text>
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
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => {
            setActiveOrder(null);
            navigation.goBack();
          }}
        >
          <Text style={styles.completeBtnText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  denialReason: { ...typography.body, color: colors.orange, fontWeight: '600', paddingHorizontal: 16, paddingTop: 6 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray100 },
  dividerLabel: {
    ...typography.small, color: colors.gray300, paddingHorizontal: 10, fontWeight: '600', letterSpacing: 1,
  },
  storeName: { ...typography.h3, color: colors.black87, paddingHorizontal: 16 },
  assignedTime: { ...typography.small, color: colors.gray300, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
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
