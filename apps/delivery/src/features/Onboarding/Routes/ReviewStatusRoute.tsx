import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing, typography } from '../../../theme';
import { obColors } from '../theme';
import { useOnboardingStore } from '../Store/useOnboardingStore';

const POLL_INTERVAL_MS = 15000;

const STATUS_COPY: Record<string, { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; tone: 'pending' | 'error' }> = {
  SUBMITTED: { icon: 'time-outline', title: 'Application submitted', body: "We've received your details and will begin review shortly.", tone: 'pending' },
  UNDER_REVIEW: { icon: 'search-outline', title: 'Under review', body: 'Our team is verifying your documents. This usually takes 24-48 hours.', tone: 'pending' },
  REJECTED: { icon: 'close-circle-outline', title: 'Application rejected', body: 'Some details could not be verified. Please contact support to resubmit.', tone: 'error' },
};

export function ReviewStatusRoute() {
  const onboardingStatus = useOnboardingStore((s) => s.onboardingStatus);
  const loadStatus = useOnboardingStore((s) => s.loadStatus);

  useEffect(() => {
    const t = setInterval(() => loadStatus(), POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [loadStatus]);

  const copy = STATUS_COPY[onboardingStatus] ?? STATUS_COPY.SUBMITTED;
  const iconColor = copy.tone === 'error' ? obColors.error : obColors.accent;
  const iconBg = copy.tone === 'error' ? obColors.errorMuted : obColors.accentMuted;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={copy.icon} size={36} color={iconColor} />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.body}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconWrap: { width: 72, height: 72, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: obColors.text, marginBottom: spacing.sm, textAlign: 'center' },
  body: { ...typography.body, color: obColors.textMuted, textAlign: 'center' },
});
