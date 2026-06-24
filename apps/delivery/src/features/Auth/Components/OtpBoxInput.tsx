import React, { useRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { colors, radius, spacing } from '../../../theme';

interface Props {
  length: number;
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  error?: boolean;
}

export function OtpBoxInput({ length, value, onChange, editable = true, error }: Props) {
  const inputs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, digit: string) => {
    const clean = digit.replace(/[^0-9]/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? clean : d)).join('');
    onChange(next);
    if (clean && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputs.current[index] = ref; }}
          style={[styles.box, error ? styles.boxError : null, digit ? styles.boxFilled : null]}
          value={digit}
          onChangeText={(t) => setDigit(index, t)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          keyboardType="number-pad"
          maxLength={1}
          editable={editable}
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  box: {
    flex: 1, height: 56, borderWidth: 1.5, borderColor: colors.gray100, borderRadius: radius.md,
    fontSize: 22, fontWeight: '700', color: colors.black87, backgroundColor: colors.gray50,
  },
  boxFilled: { borderColor: colors.orange, backgroundColor: colors.white },
  boxError: { borderColor: colors.red },
});
