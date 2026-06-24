import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../../theme';
import { OtpBoxInput } from '../Components/OtpBoxInput';
import { useAuthStore } from '../Store/useAuthStore';

const OTP_LENGTH = 4;

export function OtpVerifyRoute({ navigation, route }: any) {
  const phone: string = route.params?.phone ?? '';
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (val: string) => {
    setOtp(val);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (otp.length !== OTP_LENGTH) return;
    setSubmitting(true);
    setError(null);
    try {
      await useAuthStore.getState().verifyOtp(phone, otp);
      // Navigation onward to Onboarding/MainTabs is handled by the root navigator
      // re-evaluating isAuthenticated() once the store updates.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSeconds(30);
    setError(null);
    setOtp('');
    try {
      await useAuthStore.getState().sendOtp(phone);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not resend OTP.');
    }
  };

  const canSubmit = otp.length === OTP_LENGTH && !submitting;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.black87} />
        </TouchableOpacity>

        <Text style={styles.heading}>Enter OTP</Text>
        <Text style={styles.sub}>Sent via SMS to +91 {phone}</Text>

        <OtpBoxInput length={OTP_LENGTH} value={otp} onChange={handleChange} editable={!submitting} error={!!error} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {seconds > 0 ? (
          <Text style={styles.timer}>Resend OTP in 00:{seconds.toString().padStart(2, '0')}</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Submit OTP</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  back: { marginBottom: 24 },
  heading: { ...typography.h1, color: colors.black87, marginBottom: 8 },
  sub: { ...typography.body, color: colors.gray700, marginBottom: 28 },
  error: { ...typography.small, color: colors.red, marginBottom: spacing.md },
  timer: { ...typography.body, color: colors.gray300 },
  resend: { ...typography.body, color: colors.orange, fontWeight: '600' },
  submitBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md, paddingVertical: 16,
    alignItems: 'center', marginTop: spacing.xl,
  },
  submitBtnDisabled: { backgroundColor: colors.gray300 },
  submitText: { ...typography.h3, color: colors.white },
});
