import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createTypingIndicatorStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: theme.spacing.sm,
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.colors.textTertiary,
    },
    label: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginLeft: 4,
    },
  });
}
