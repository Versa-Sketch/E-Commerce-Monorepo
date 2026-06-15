import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface Props {
  start: string;
  end: string;
  payLow: number;
  payHigh: number;
  oldPayLow?: number;
  oldPayHigh?: number;
  label?: string;
  labelColor?: string;
  recommended?: boolean;
  selected: boolean;
  onToggle: () => void;
}

export function GigSlotRow({
  start, end, payLow, payHigh, oldPayLow, oldPayHigh,
  label, labelColor, recommended, selected, onToggle,
}: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.left}>
        <Text style={styles.time}>{start} – {end}</Text>
        <View style={styles.payRow}>
          {oldPayLow != null && (
            <Text style={styles.strikethrough}>₹{oldPayLow}–₹{oldPayHigh} </Text>
          )}
          <Text style={styles.pay}>₹{payLow} – ₹{payHigh} per hour</Text>
        </View>
        {label ? (
          <Text style={[styles.label, { color: labelColor === 'orange' ? colors.orange : colors.green }]}>
            {label}
          </Text>
        ) : null}
        {recommended && (
          <View style={styles.starRow}>
            <Ionicons name="star" size={14} color={colors.black87} />
          </View>
        )}
      </View>
      <TouchableOpacity onPress={onToggle} style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  left: { flex: 1 },
  time: { ...typography.h3, color: colors.black87 },
  payRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  strikethrough: {
    ...typography.body,
    color: colors.gray300,
    textDecorationLine: 'line-through',
  },
  pay: { ...typography.body, color: colors.black87 },
  label: { ...typography.small, marginTop: 4, fontWeight: '500' },
  starRow: { marginTop: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.black87,
    borderColor: colors.black87,
  },
});
