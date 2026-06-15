import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShiftHeaderCard } from '../components/ShiftHeaderCard';
import { GigSlotRow } from '../components/GigSlotRow';
import { useAppStore } from '../store/useAppStore';
import { mockGigs } from '../mock';
import { colors, typography } from '../theme';

type Filter = 'All' | 'Open' | 'Booked';

export function GigsScreen({ navigation }: any) {
  const [filter, setFilter] = useState<Filter>('Open');
  const { bookedGigIds, toggleGigBooking, bookGigs } = useAppStore();

  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const gigsToShow = mockGigs.filter((g) => {
    if (filter === 'Booked') return bookedGigIds.includes(g.id);
    if (filter === 'Open') return !bookedGigIds.includes(g.id);
    return true;
  });

  const groups = [...new Set(gigsToShow.map((g) => g.group))];

  function handleBook() {
    if (selected.size === 0) return;
    bookGigs(Array.from(selected));
    setSelected(new Set());
    Alert.alert('Booked!', 'Your selected gig slots have been booked.');
  }

  const anySelected = selected.size > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.black87} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="calendar" size={22} color={colors.orange} />
        )}
        <Text style={styles.title}>Gigs, 2 Jun</Text>
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {(['All', 'Open', 'Booked'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.pill, filter === f && styles.pillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="calendar-outline" size={48} color={colors.gray300} />
            <Text style={styles.emptyText}>
              {filter === 'Booked' ? 'No booked gigs yet' : 'No gigs available'}
            </Text>
          </View>
        ) : (
          groups.map((group) => {
            const groupGigs = gigsToShow.filter((g) => g.group === group);
            const g0 = groupGigs[0];
            return (
              <View key={group} style={styles.groupWrap}>
                <ShiftHeaderCard
                  title={g0.group}
                  timeRange={g0.groupTime}
                  gigCount={groupGigs.length}
                  icon={g0.groupIcon}
                />
                <View style={styles.slotsCard}>
                  {groupGigs.map((g) => (
                    <GigSlotRow
                      key={g.id}
                      start={g.start}
                      end={g.end}
                      payLow={g.payLow}
                      payHigh={g.payHigh}
                      oldPayLow={g.oldPayLow}
                      oldPayHigh={g.oldPayHigh}
                      label={g.label}
                      labelColor={g.labelColor}
                      recommended={g.recommended}
                      selected={selected.has(g.id) || bookedGigIds.includes(g.id)}
                      onToggle={() => {
                        if (!bookedGigIds.includes(g.id)) toggleSelect(g.id);
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.disclaimer}>
          Payouts are an estimation of what most partners will receive for this gig. Partners must not
          cancel orders and must move to high order areas as shown in the app to achieve these payouts.
          Payouts are different for each gig and estimates are calculated based on past data and expected demand.
        </Text>
      </ScrollView>

      {/* Sticky Book button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={[styles.bookBtn, !anySelected && styles.bookBtnDisabled]}
          onPress={handleBook}
          activeOpacity={anySelected ? 0.85 : 1}
        >
          <Text style={[styles.bookText, !anySelected && styles.bookTextDisabled]}>
            {anySelected ? `Book now (${selected.size})` : 'Book now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { ...typography.h2, color: colors.black87 },
  filterRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.white,
  },
  pill: {
    paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.gray100,
  },
  pillActive: { backgroundColor: colors.black87, borderColor: colors.black87 },
  pillText: { ...typography.body, color: colors.black87 },
  pillTextActive: { color: colors.white, fontWeight: '600' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  groupWrap: { marginBottom: 16 },
  slotsCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, overflow: 'hidden',
    marginTop: 2,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { ...typography.body, color: colors.gray300 },
  disclaimer: {
    ...typography.small, color: colors.gray300, lineHeight: 18,
    marginTop: 8, marginBottom: 24,
  },
  stickyBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white, padding: 16,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  bookBtn: {
    backgroundColor: colors.orange, borderRadius: 10,
    paddingVertical: 16, alignItems: 'center',
  },
  bookBtnDisabled: { backgroundColor: colors.gray100 },
  bookText: { ...typography.h3, color: colors.white },
  bookTextDisabled: { color: colors.gray300 },
});
