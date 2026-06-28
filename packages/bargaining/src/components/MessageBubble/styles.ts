import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createMessageBubbleStyles(theme: BargainTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    rowOwn: {
      justifyContent: 'flex-end',
    },
    rowOther: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '80%',
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 9,
      paddingHorizontal: 12,
    },
    bubbleOwn: {
      backgroundColor: theme.colors.primaryLight,
    },
    bubbleOther: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    text: {
      fontSize: 13,
      color: theme.colors.text,
    },
  });
}
