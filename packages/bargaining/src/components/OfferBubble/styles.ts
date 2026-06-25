import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createOfferBubbleStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    rowOwn: {
      justifyContent: 'flex-end',
    },
    rowOther: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '82%',
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 9,
      paddingHorizontal: 12,
    },
    bubbleDefault: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    bubbleOwnDefault: {
      backgroundColor: theme.colors.primaryLight,
    },
    bubbleCounter: {
      backgroundColor: theme.colors.primaryLight,
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
    },
    productTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 8,
      marginBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    productTagCounter: {
      borderBottomColor: theme.colors.primary,
    },
    productName: {
      flex: 1,
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text,
    },
    productNameCounter: {
      color: theme.colors.primaryDark,
    },
    productPrice: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    price: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    priceCounter: {
      color: theme.colors.primaryDark,
    },
    dealTag: {
      alignSelf: 'flex-start',
      fontSize: 9,
      fontWeight: '600',
      color: theme.colors.primaryDark,
      backgroundColor: theme.colors.surface,
      paddingVertical: 2,
      paddingHorizontal: 7,
      borderRadius: theme.borderRadius.full,
      marginTop: 4,
      marginBottom: 2,
    },
  });
}
