import { StyleSheet } from 'react-native';
import type { Theme } from '../../types/auth';

export function createOtpVerifyStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: theme.spacing.md || 16,
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface || '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    content: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 32,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.sm || 12,
      marginBottom: 24,
    },
    otpBox: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.md || 12,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    otpInput: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      fontWeight: '600',
    },
    errorText: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 16,
    },
    timerRow: {
      alignItems: 'center',
      marginBottom: 24,
      height: 40,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '500',
    },
    resendBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    resendText: {
      fontSize: 14,
      fontWeight: '600',
    },
    verifyBtn: {
      borderRadius: theme.borderRadius.lg || 28,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#EA580C',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 5,
    },
    verifyText: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
  });
}
