import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createOfferComposerStyles(theme: BargainTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    productTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 8,
      marginBottom: 2,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    productName: {
      flex: 1,
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text,
    },
    productPrice: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    stepperButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 0.5,
      borderColor: theme.colors.borderSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    price: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.colors.text,
    },
    rangeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rangeLabel: {
      fontSize: 10,
      color: theme.colors.textTertiary,
    },
    presetRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    presetChip: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: theme.borderRadius.full,
      borderWidth: 0.5,
      borderColor: theme.colors.borderSecondary,
    },
    presetLabel: {
      fontSize: 11,
      color: theme.colors.text,
    },
    sendButton: {
      alignItems: 'center',
      paddingVertical: 11,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    sendLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onPrimary,
    },
  });
}
