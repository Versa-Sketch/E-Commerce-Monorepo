import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TripCard } from '../components/TripCard';
import { mockTrips } from '../mock';
import { colors, typography } from '../theme';

type HistoryTab = 'Daily' | 'Weekly' | 'Monthly';

export function TripHistoryScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<HistoryTab>('Daily');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black87} />
        </TouchableOpacity>
        <Text style={styles.title}>Trip History</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['Daily', 'Weekly', 'Monthly'] as HistoryTab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>27 Apr</Text>
          <Ionicons name="chevron-down" size={14} color={colors.black87} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>ALL TRIPS</Text>
          <Ionicons name="chevron-down" size={14} color={colors.black87} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'Daily' ? (
          <>
            <Text style={styles.dateLabel}>27 Apr, 2026</Text>
            {mockTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => navigation.navigate('TripDetail', { trip })}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={48} color={colors.gray300} />
            <Text style={styles.emptyText}>No trips for this period</Text>
          </View>
        )}
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
  tabRow: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.green },
  tabText: { ...typography.body, color: colors.gray300, fontWeight: '500' },
  tabTextActive: { color: colors.green, fontWeight: '700' },
  filterRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: colors.gray100, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20,
  },
  filterText: { ...typography.small, color: colors.black87, fontWeight: '600' },
  scroll: { paddingTop: 16, paddingBottom: 40 },
  dateLabel: { ...typography.body, color: colors.gray300, paddingHorizontal: 16, marginBottom: 12 },
  emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { ...typography.body, color: colors.gray300 },
});
