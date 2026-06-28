import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createChatInputBarStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border,
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: theme.colors.surface,
    },
    iconButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    attachButton: {
      backgroundColor: theme.colors.primary,
    },
    plainButton: {
      borderWidth: 0.5,
      borderColor: theme.colors.borderSecondary,
    },
    input: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.text,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.borderRadius.md,
      borderWidth: 0.5,
      borderColor: theme.colors.border,
    },
  });
}
