import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TripItem } from '../mock';
import { StatusBadge } from './StatusBadge';
import { colors, typography } from '../theme';

interface Props {
  trip: TripItem;
  onPress: () => void;
}

export function TripCard({ trip, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.badgeRow}>
        {trip.badges.map((b) => (
          <View key={b} style={styles.badgeGap}>
            <StatusBadge type={b as any} />
          </View>
        ))}
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.store}>{trip.store}</Text>
          <Text style={styles.time}>{trip.time}</Text>
          <Text style={styles.cash}>Cash Collected: ₹{trip.cashCollected}</Text>
        </View>
        <View style={styles.right}>
          {trip.earnings > 0 && (
            <Text style={styles.earnings}>₹{trip.earnings}</Text>
          )}
          <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  badgeGap: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flex: 1 },
  store: { ...typography.h3, color: colors.black87 },
  time: { ...typography.small, color: colors.gray300, marginTop: 2 },
  cash: { ...typography.small, color: colors.gray700, marginTop: 4 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  earnings: { ...typography.h3, color: colors.black87 },
});
