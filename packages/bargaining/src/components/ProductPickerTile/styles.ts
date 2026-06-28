import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createProductPickerTileStyles(theme: BargainTheme) {
  return StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 6,
      gap: 6,
    },
    name: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    price: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
  });
}
