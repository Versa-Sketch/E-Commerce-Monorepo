import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface Props {
  title: string;
}

export function SectionHeader({ title }: Props) {
  return <Text style={styles.text}>{title.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.label,
    color: colors.gray300,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
