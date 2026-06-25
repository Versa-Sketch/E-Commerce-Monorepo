import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createProductPickerContentStyles(theme: BargainTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 12,
      color: theme.colors.text,
      padding: 0,
    },
    categoryRow: {
      gap: 6,
    },
    categoryChip: {
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
    },
    categoryLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    categoryLabelActive: {
      color: theme.colors.onPrimary,
      fontWeight: '600',
    },
    grid: {
      gap: 8,
    },
    gridRow: {
      gap: 8,
    },
    emptyText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 20,
    },
  });
}
