import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface Props {
  label: string;
  value: string;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export function PocketRow({ label, value, onPress, icon }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.7}>
      <View style={styles.left}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.value}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.gray700} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.cardBg,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: 10 },
  label: { ...typography.body, color: colors.black87 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { ...typography.body, fontWeight: '600', color: colors.black87 },
});
