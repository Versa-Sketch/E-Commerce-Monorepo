import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createBargainChatScreenStyles(theme: BargainTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
}
