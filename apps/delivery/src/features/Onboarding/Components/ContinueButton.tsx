import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { radius, typography } from '../../../theme';
import { obColors } from '../theme';

interface Props {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ContinueButton({ label = 'Next', onPress, disabled, loading }: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.btn, isDisabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isDisabled ? obColors.textMuted : obColors.onAccent} />
      ) : (
        <Text style={[styles.text, isDisabled && styles.textDisabled]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: obColors.accent, borderRadius: radius.full, paddingVertical: 17,
    alignItems: 'center', marginHorizontal: 20, marginBottom: 8,
    ...Platform.select({
      ios: { shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 8 },
    }),
  },
  btnDisabled: { backgroundColor: obColors.border, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  text: { ...typography.h3, color: obColors.onAccent },
  textDisabled: { color: obColors.textMuted },
});
