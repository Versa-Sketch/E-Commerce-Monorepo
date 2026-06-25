import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createChatHeaderStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: 2,
    },
    nameBlock: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 2,
    },
    onlineDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    statusLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
  });
}
