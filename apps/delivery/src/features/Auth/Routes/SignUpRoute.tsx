import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../../theme';
import { useAuthStore } from '../Store/useAuthStore';

export function SignUpRoute({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = fullName.trim().length >= 2 && phone.length === 10;

  const handleCreateAccount = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    setError(null);
    try {
      await useAuthStore.getState().register(phone, fullName.trim());
      navigation.navigate('OtpVerify', { phone });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.black87} />
          </TouchableOpacity>

          <Text style={styles.heading}>Create your delivery partner account</Text>
          <Text style={styles.sub}>Enter your name and mobile number to get started</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholderTextColor={colors.gray300}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
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
            style={[styles.btn, (!canContinue || submitting) && styles.btnDisabled]}
            onPress={handleCreateAccount}
            disabled={!canContinue || submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{submitting ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('PhoneInput')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log in</Text>
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
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  back: { marginBottom: spacing.lg },
  heading: { ...typography.h1, color: colors.black87, marginBottom: 8 },
  sub: { ...typography.body, color: colors.gray700, marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.gray700, marginBottom: spacing.xs, textTransform: 'uppercase', marginTop: spacing.md },
  input: {
    borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 14, ...typography.body, color: colors.black87,
  },
  inputRow: { flexDirection: 'row', borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10, overflow: 'hidden' },
  prefix: { backgroundColor: colors.gray50, paddingHorizontal: 14, justifyContent: 'center', borderRightWidth: 1, borderRightColor: colors.gray100 },
  prefixText: { ...typography.body, color: colors.black87, fontWeight: '600' },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, ...typography.body, color: colors.black87 },
  error: { ...typography.small, color: colors.red, marginTop: spacing.md },
  btn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  btnDisabled: { backgroundColor: colors.gray300 },
  btnText: { ...typography.h3, color: colors.white },
  loginRow: { marginTop: spacing.lg, alignItems: 'center' },
  loginText: { ...typography.body, color: colors.gray700 },
  loginLink: { color: colors.orange, fontWeight: '700' },
});
