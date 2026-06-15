import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PocketRow } from '../components/PocketRow';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { mockWallet, mockDP } from '../mock';
import { colors, typography } from '../theme';

export function PocketScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Earnings card */}
        <TouchableOpacity
          style={styles.earningsCard}
          onPress={() => navigation.navigate('Earnings')}
          activeOpacity={0.85}
        >
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Earnings: {mockWallet.weekLabel}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray700} />
          </View>
          <Text style={styles.earningsAmount}>₹{mockWallet.weeklyEarnings}</Text>
        </TouchableOpacity>

        {/* Pocket section */}
        <SectionHeader title="Pocket" />
        <View style={styles.section}>
          <PocketRow label="Pocket balance" value={`₹${mockWallet.pocketBalance}`} onPress={() => {}} />
          <View style={styles.divider} />
          <PocketRow
            label="Available cash limit"
            value={`₹${mockWallet.availableCashLimit}`}
            onPress={() => {}}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.depositBtn}>
            <Text style={styles.depositText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Pending joining fees */}
        <TouchableOpacity style={styles.joiningCard} activeOpacity={0.8}>
          <StatusBadge type="ongoing" />
          <View style={styles.joiningContent}>
            <View style={styles.joiningIconWrap}>
              <Ionicons name="hand-left-outline" size={28} color={colors.orange} />
            </View>
            <View style={styles.joiningText}>
              <Text style={styles.joiningTitle}>Pending joining fees</Text>
              <View style={styles.joiningAmtRow}>
                <Text style={styles.joiningAmt}>₹{mockDP.joiningFee.toLocaleString('en-IN')}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.gray300} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.section}>
          <PocketRow
            label="Customer tips balance"
            value={`₹${mockWallet.tipsBalance}`}
            onPress={() => {}}
          />
        </View>

        {/* More services */}
        <SectionHeader title="More Services" />
        <View style={styles.moreServicesPlaceholder}>
          <Ionicons name="grid-outline" size={32} color={colors.gray300} />
          <Text style={styles.moreServicesText}>More services coming soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { paddingBottom: 40 },
  earningsCard: {
    backgroundColor: colors.cardBg, margin: 16, borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  earningsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  earningsLabel: { ...typography.body, color: colors.gray700 },
  earningsAmount: { ...typography.h1, color: colors.black87, marginTop: 6 },
  section: {
    backgroundColor: colors.cardBg, marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: 16 },
  actionRow: {
    flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16,
  },
  depositBtn: {
    flex: 1, borderWidth: 1.5, borderColor: colors.black87, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  depositText: { ...typography.body, color: colors.black87, fontWeight: '600' },
  withdrawBtn: {
    flex: 1, backgroundColor: colors.gray100, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  withdrawText: { ...typography.body, color: colors.gray300, fontWeight: '600' },
  joiningCard: {
    backgroundColor: colors.cardBg, marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  joiningContent: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12 },
  joiningIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.orangeLight, alignItems: 'center', justifyContent: 'center',
  },
  joiningText: { flex: 1 },
  joiningTitle: { ...typography.body, color: colors.black87 },
  joiningAmtRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  joiningAmt: { ...typography.h3, color: colors.black87 },
  moreServicesPlaceholder: {
    alignItems: 'center' as const, paddingVertical: 32, gap: 10,
  },
  moreServicesText: { ...typography.body, color: colors.gray300 },
});
