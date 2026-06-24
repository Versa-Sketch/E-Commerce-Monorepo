import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { spacing, typography } from '../../../theme';
import { obColors } from '../theme';

interface Props {
  label: string;
  value?: string; // 'YYYY-MM-DD'
  onChange: (isoDate: string) => void;
  error?: string | null;
  maximumDate?: Date;
  minimumDate?: Date;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function DateField({ label, value, onChange, error, maximumDate, minimumDate }: Props) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          mode="outlined"
          label={label}
          value={value ?? ''}
          editable={false}
          error={!!error}
          style={styles.input}
          right={<TextInput.Icon icon="calendar" color={obColors.textMuted} />}
        />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {open && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={(_, selected) => {
            setOpen(Platform.OS === 'ios');
            if (selected) onChange(toIso(selected));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  input: { backgroundColor: obColors.inputFill },
  error: { ...typography.small, color: obColors.error, marginTop: spacing.xs },
});
