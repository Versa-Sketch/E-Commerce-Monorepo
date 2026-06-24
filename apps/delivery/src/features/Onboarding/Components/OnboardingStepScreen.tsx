import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { spacing, typography } from '../../../theme';
import { obColors, onboardingPaperTheme } from '../theme';
import { StepHeader } from './StepHeader';

interface Props {
  title: string;
  stepNumber: number;
  onBack?: () => void;
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export function OnboardingStepScreen({ title, stepNumber, onBack, error, children, footer }: Props) {
  return (
    <PaperProvider theme={onboardingPaperTheme}>
      <SafeAreaView style={styles.safe}>
        <StepHeader title={title} stepNumber={stepNumber} onBack={onBack} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            {children}
          </ScrollView>
          {footer}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 24 },
  errorBanner: { ...typography.small, color: obColors.error, marginBottom: spacing.sm },
});
