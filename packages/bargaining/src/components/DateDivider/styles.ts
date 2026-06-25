import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createDateDividerStyles(theme: BargainTheme) {
  return StyleSheet.create({
    label: {
      textAlign: 'center',
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.md,
    },
  });
}
