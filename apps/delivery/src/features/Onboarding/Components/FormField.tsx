import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { spacing, typography } from '../../../theme';
import { obColors } from '../theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  hint?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export function FormField({
  label, value, onChangeText, error, hint, keyboardType, maxLength, secureTextEntry, editable = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        editable={editable}
        error={!!error}
        style={styles.input}
        contentStyle={styles.content}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  input: { backgroundColor: obColors.inputFill },
  content: { ...typography.body },
  error: { ...typography.small, color: obColors.error, marginTop: spacing.xs },
  hint: { ...typography.small, color: obColors.textMuted, marginTop: spacing.xs },
});
