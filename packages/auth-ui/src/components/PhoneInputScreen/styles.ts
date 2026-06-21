import { StyleSheet } from 'react-native';
import type { Theme } from '../../types/auth';

export function createPhoneInputStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      paddingTop: 16,
      paddingHorizontal: theme.spacing.md || 24,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 28,
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
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 38,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
    },
    card: {
      borderRadius: theme.borderRadius.lg || 28,
      padding: theme.spacing.lg || 24,
      marginTop: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 20,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 14,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      borderRadius: theme.borderRadius.md || 16,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      marginBottom: 8,
      overflow: 'hidden',
    },
    countryPrefix: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      height: '100%',
    },
    countryFlag: {
      fontSize: 16,
      marginRight: 4,
    },
    countryCode: {
      fontSize: 13,
      fontWeight: '600',
    },
    divider: {
      width: 1,
      height: 28,
    },
    phoneInput: {
      flex: 1,
      paddingHorizontal: 14,
      fontSize: 14,
      height: '100%',
    },
    errorText: {
      fontSize: 12,
      marginBottom: 10,
      marginTop: -2,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.lg || 28,
      paddingVertical: 16,
      marginTop: 18,
      marginBottom: 20,
      shadowColor: '#EA580C',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 5,
    },
    ctaText: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    createRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    createLabel: {
      fontSize: 14,
    },
    createLink: {
      fontSize: 14,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    secureRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
    },
    secureText: {
      fontSize: 12,
    },
  });
}
