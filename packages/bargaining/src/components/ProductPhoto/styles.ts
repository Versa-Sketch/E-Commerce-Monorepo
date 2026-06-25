import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createProductPhotoStyles(theme: BargainTheme) {
  return StyleSheet.create({
    tile: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryLight,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
}
