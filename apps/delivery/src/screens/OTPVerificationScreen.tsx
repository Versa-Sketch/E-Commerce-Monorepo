import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OtpBoxInput } from '../features/Auth/Components/OtpBoxInput';
import { appStore } from '../store/useAppStore';
import { DispatchService } from '../services/dispatch';
import { ApiError } from '../services/http';
import { colors, typography, spacing, radius } from '../theme';

export function OTPVerificationScreen({ navigation }: any) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const order = appStore.activeOrderDetail;
  const isComplete = otp.length === 4;

  async function handleVerify() {
    if (!order || !isComplete || loading) return;

    if (__DEV__) {
      navigation.navigate('PhotoUpload');
      return;
    }

    setLoading(true);
    setError(false);
    try {
      await DispatchService.verifyPickupOtp(order.order_id, otp);
      navigation.navigate('PhotoUpload');
    } catch (err) {
      setError(true);
      const message =
        err instanceof ApiError ? err.message : 'Invalid OTP. Please check with the customer.';
      Alert.alert('Verification failed', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Verify pickup OTP</Text>
          <Text style={styles.headerSub}>Ask the customer for their 4-digit OTP</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        {/* Customer context */}
        <View style={styles.contextCard}>
          <View style={styles.shopAvatar}>
            <Text style={styles.shopAvatarText}>
              {(order?.shop_name ?? 'S').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.shopNameText}>{order?.shop_name ?? '—'}</Text>
            <Text style={styles.orderIdText}>
              Order #{order?.order_id?.slice(-8).toUpperCase() ?? '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.otpLabel}>Enter 4-digit OTP</Text>

        <OtpBoxInput
          length={4}
          value={otp}
          onChange={(val) => { setOtp(val); setError(false); }}
          error={error}
        />

        <Text style={styles.hint}>
          The customer received this OTP on their phone when the order was confirmed.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.verifyBtn, (!isComplete || loading) && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.verifyBtnText}>Verify OTP</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },

  header: {
    backgroundColor: colors.black87,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', gap: 6 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitle: { ...typography.h2, color: colors.white },
  headerSub: { ...typography.body, color: 'rgba(255,255,255,0.6)' },

  body: { flex: 1, padding: spacing.xl, gap: spacing.xl },

  contextCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  shopAvatar: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.black87,
    alignItems: 'center', justifyContent: 'center',
  },
  shopAvatarText: { ...typography.h2, color: colors.white },
  shopNameText: { ...typography.h3, color: colors.black87 },
  orderIdText: { ...typography.small, color: colors.gray300, marginTop: 2 },

  otpLabel: { ...typography.label, color: colors.gray700 },

  hint: {
    ...typography.small, color: colors.gray300, lineHeight: 18, textAlign: 'center',
  },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  verifyBtn: {
    backgroundColor: colors.black87,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  verifyBtnText: { ...typography.h3, color: colors.white },
  btnDisabled: { opacity: 0.4 },
});
