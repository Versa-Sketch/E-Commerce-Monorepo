import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createBargainMessageListStyles(theme: BargainTheme) {
  return StyleSheet.create({
    list: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
  });
}
