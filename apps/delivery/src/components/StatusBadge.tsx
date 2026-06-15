import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

type BadgeType = 'incomplete' | 'denial' | 'completed' | 'ongoing';

interface Props {
  type: BadgeType;
}

const config: Record<BadgeType, { label: string; bg: string; text: string }> = {
  incomplete: { label: 'Incomplete', bg: colors.orangeLight, text: colors.orange },
  denial: { label: 'Denial', bg: colors.orangeLight, text: colors.orange },
  completed: { label: 'Completed', bg: colors.greenLight, text: colors.green },
  ongoing: { label: 'Ongoing', bg: colors.tealLight, text: colors.teal },
};

export function StatusBadge({ type }: Props) {
  const c = config[type] ?? config.ongoing;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
    fontWeight: '600',
  },
});
