import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createResolvedCardStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 9,
      paddingHorizontal: 11,
      marginBottom: theme.spacing.sm,
    },
    text: {
      fontSize: 11,
      flex: 1,
    },
  });
}
