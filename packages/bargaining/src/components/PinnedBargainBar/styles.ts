import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createPinnedBargainBarStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingVertical: 8,
      paddingHorizontal: 14,
      backgroundColor: theme.colors.primaryLight,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    text: {
      flex: 1,
      fontSize: 11,
      color: theme.colors.primaryDark,
    },
    badge: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.primaryDark,
      backgroundColor: theme.colors.surface,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: theme.borderRadius.full,
    },
  });
}
