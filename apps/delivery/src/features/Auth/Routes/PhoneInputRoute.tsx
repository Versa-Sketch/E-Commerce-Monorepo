import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../../theme';
import { useAuthStore } from '../Store/useAuthStore';

export function PhoneInputRoute({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (phone.length !== 10) return;
    setSubmitting(true);
    setError(null);
    try {
      await useAuthStore.getState().sendOtp(phone);
      navigation.navigate('OtpVerify', { phone });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.logoWrap}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>Local Sea</Text>
              <Text style={styles.logoSub}>Delivery</Text>
            </View>
          </View>

          <Text style={styles.heading}>Enter your mobile number</Text>
          <Text style={styles.sub}>We'll send a one-time password to verify your number</Text>

          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor={colors.gray300}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, (phone.length !== 10 || submitting) && styles.btnDisabled]}
            onPress={handleSendOtp}
            disabled={phone.length !== 10 || submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{submitting ? 'Sending…' : 'Send OTP'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createAccountRow} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.createAccountText}>
              Don't have an account? <Text style={styles.createAccountLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logoBox: { alignItems: 'center' },
  logoText: { fontSize: 42, fontWeight: '900', color: colors.orange, letterSpacing: -1 },
  logoSub: { fontSize: 12, fontWeight: '600', color: colors.orange, letterSpacing: 2 },
  heading: { ...typography.h1, color: colors.black87, marginBottom: 8 },
  sub: { ...typography.body, color: colors.gray700, marginBottom: 32 },
  inputRow: { flexDirection: 'row', borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10, overflow: 'hidden', marginBottom: spacing.sm },
  prefix: { backgroundColor: colors.gray50, paddingHorizontal: 14, justifyContent: 'center', borderRightWidth: 1, borderRightColor: colors.gray100 },
  prefixText: { ...typography.body, color: colors.black87, fontWeight: '600' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, ...typography.body, color: colors.black87 },
  error: { ...typography.small, color: colors.red, marginBottom: spacing.md },
  btn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: spacing.md },
  btnDisabled: { backgroundColor: colors.gray300 },
  btnText: { ...typography.h3, color: colors.white },
  createAccountRow: { marginTop: spacing.lg, alignItems: 'center' },
  createAccountText: { ...typography.body, color: colors.gray700 },
  createAccountLink: { color: colors.orange, fontWeight: '700' },
});
