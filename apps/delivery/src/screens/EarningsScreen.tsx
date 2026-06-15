import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EarningsBarChart } from '../components/EarningsBarChart';
import { mockEarnings } from '../mock';
import { colors, typography } from '../theme';

type Tab = 'Day' | 'Week' | 'Month';

export function EarningsScreen({ navigation }: any) {
  const [tab, setTab] = useState<Tab>('Day');
  const [orderExpanded, setOrderExpanded] = useState(false);

  const data = mockEarnings;

  function renderBarChart() {
    if (tab === 'Week') {
      return <EarningsBarChart data={data.week.days} maxHeight={100} />;
    }
    if (tab === 'Month') {
      return <EarningsBarChart data={data.month.weeks} maxHeight={100} />;
    }
    return null;
  }

  function renderAmount() {
    if (tab === 'Day') return `₹${data.today.amount}`;
    if (tab === 'Week') return `₹${data.week.amount}`;
    return `₹${data.month.amount}`;
  }

  function renderDateLabel() {
    if (tab === 'Day') return 'Today: 2 June';
    if (tab === 'Week') return data.week.label;
    return data.month.label;
  }

  function renderStats() {
    if (tab === 'Day') {
      return { orders: data.today.orders, time: data.today.timeOnOrder };
    }
    if (tab === 'Week') {
      return { orders: 0, time: '00:00' };
    }
    return { orders: data.month.orders, time: data.month.timeOnOrder };
  }

  const stats = renderStats();

  const orderEarning = tab === 'Month' ? data.month.amount : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.darkHeader}>
        <View style={styles.topRow}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 22 }} />
          )}
          <Text style={styles.headerTitle}>Earnings</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={18} color={colors.white} />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Tab toggle */}
        <View style={styles.tabRow}>
          {(['Day', 'Week', 'Month'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date selector card */}
        <View style={styles.dateCard}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={20} color={colors.gray300} />
          </TouchableOpacity>
          <View style={styles.dateCenter}>
            <TouchableOpacity style={styles.datePill}>
              <Text style={styles.datePillText}>{renderDateLabel()}</Text>
              {tab === 'Month' && (
                <Ionicons name="chevron-down" size={14} color={colors.black87} />
              )}
            </TouchableOpacity>
            <Text style={styles.amountBig}>{renderAmount()}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color={colors.gray300} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Bar chart section */}
        {tab !== 'Day' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartLabel}>
              {tab === 'Week' ? `${data.week.label} 2026` : `${data.month.label} 2026`}
            </Text>
            {renderBarChart()}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats.orders}</Text>
            <Text style={styles.statLbl}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats.time} hrs</Text>
            <Text style={styles.statLbl}>Time on order</Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <TouchableOpacity
            style={styles.breakdownRow}
            onPress={() => tab === 'Month' && setOrderExpanded(!orderExpanded)}
          >
            <Text style={styles.breakdownLabel}>Order earning</Text>
            <View style={styles.breakdownRight}>
              <Text style={styles.breakdownVal}>₹{orderEarning}</Text>
              {tab === 'Month' && (
                <Ionicons
                  name={orderExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.gray700}
                />
              )}
            </View>
          </TouchableOpacity>
          {orderExpanded && (
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Order #8053274047</Text>
              <Text style={styles.expandedVal}>₹100</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Incentive</Text>
            <Text style={styles.breakdownVal}>₹0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Other earnings</Text>
            <Text style={styles.breakdownVal}>₹0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  darkHeader: { backgroundColor: colors.black87, paddingBottom: 0 },
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
  },
  headerTitle: { ...typography.h2, color: colors.white },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shareText: { ...typography.body, color: colors.white },
  tabRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: 16, marginBottom: 16,
  },
  tabBtn: {
    paddingHorizontal: 28, paddingVertical: 8, borderRadius: 24,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  tabBtnActive: { backgroundColor: colors.white, borderColor: colors.white },
  tabText: { ...typography.body, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tabTextActive: { color: colors.black87 },
  dateCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, padding: 20,
  },
  dateCenter: { alignItems: 'center', flex: 1 },
  datePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.gray50, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    marginBottom: 10,
  },
  datePillText: { ...typography.body, color: colors.black87, fontWeight: '500' },
  amountBig: { fontSize: 32, fontWeight: '800', color: colors.black87 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  chartCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  chartLabel: { ...typography.body, color: colors.black87, fontWeight: '600', marginBottom: 8 },
  statsCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, flexDirection: 'row',
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { ...typography.h2, color: colors.black87 },
  statLbl: { ...typography.small, color: colors.gray300, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.gray100 },
  breakdownCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  breakdownRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  breakdownLabel: { ...typography.body, color: colors.black87 },
  breakdownVal: { ...typography.body, color: colors.black87, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: 16 },
  expandedRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 12, backgroundColor: colors.gray50,
  },
  expandedLabel: { ...typography.small, color: colors.gray700 },
  expandedVal: { ...typography.small, color: colors.black87, fontWeight: '600' },
});
