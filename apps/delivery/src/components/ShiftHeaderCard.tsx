import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface Props {
  title: string;
  timeRange: string;
  gigCount: number;
  icon: 'evening' | 'dinner';
}

export function ShiftHeaderCard({ title, timeRange, gigCount, icon }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>
          {timeRange} • {gigCount} Gigs
        </Text>
      </View>
      <View style={styles.iconCircle}>
        <Ionicons
          name={icon === 'evening' ? 'partly-sunny' : 'moon'}
          size={26}
          color={icon === 'evening' ? '#FFC107' : '#9575CD'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.shiftHeaderBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  left: { flex: 1 },
  title: { ...typography.h2, color: colors.white },
  sub: { ...typography.body, color: colors.gray300, marginTop: 4 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
