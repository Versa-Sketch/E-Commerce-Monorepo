import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { spacing, typography } from '../../../theme';
import { obColors } from '../theme';

interface Props {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ label, description, value, onValueChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: obColors.accent, false: obColors.border }}
        thumbColor={obColors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: obColors.border,
  },
  textCol: { flex: 1, marginRight: spacing.md },
  label: { ...typography.body, color: obColors.text, fontWeight: '600' },
  desc: { ...typography.small, color: obColors.textMuted, marginTop: 2 },
});
