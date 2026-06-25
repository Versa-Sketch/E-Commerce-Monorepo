import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createProductCardStyles(theme: BargainTheme) {
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
    card: {
      maxWidth: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 0.5,
      borderColor: theme.colors.borderSecondary,
      backgroundColor: theme.colors.surface,
      paddingVertical: 9,
      paddingHorizontal: 11,
    },
    name: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text,
    },
    price: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginTop: 1,
    },
  });
}
