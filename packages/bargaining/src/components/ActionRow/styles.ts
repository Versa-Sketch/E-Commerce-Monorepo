import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createActionRowStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 6,
      marginTop: theme.spacing.sm,
    },
    chip: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: theme.borderRadius.full,
      borderWidth: 0.5,
      borderColor: theme.colors.borderSecondary,
      backgroundColor: theme.colors.surface,
    },
    chipLabel: {
      fontSize: 12,
      color: theme.colors.text,
    },
    acceptChip: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    acceptLabel: {
      color: theme.colors.onPrimary,
      fontWeight: '600',
    },
    declineLabel: {
      color: theme.colors.danger,
    },
    waitingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: theme.spacing.sm,
    },
    waitingDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    waitingLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
  });
}
