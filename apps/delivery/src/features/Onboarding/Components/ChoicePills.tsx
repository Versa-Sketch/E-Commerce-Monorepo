import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { radius, spacing, typography } from '../../../theme';
import { obColors } from '../theme';

interface Props<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}

export function ChoicePills<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.85}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.label, color: obColors.textMuted, marginBottom: spacing.xs, textTransform: 'uppercase' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: {
    borderWidth: 1.5, borderColor: obColors.border, borderRadius: radius.full,
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: obColors.surface,
  },
  pillActive: { borderColor: obColors.accent, backgroundColor: obColors.accentMuted },
  pillText: { ...typography.small, color: obColors.textMuted, fontWeight: '600' },
  pillTextActive: { color: obColors.accent },
});
