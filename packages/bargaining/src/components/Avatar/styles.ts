import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createAvatarStyles(theme: BargainTheme) {
  return StyleSheet.create({
    circle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryLight,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    initials: {
      color: theme.colors.primaryDark,
      fontWeight: '600',
    },
  });
}
