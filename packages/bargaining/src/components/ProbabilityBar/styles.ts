import { StyleSheet } from 'react-native';
import type { BargainTheme } from '../../types/theme';

export function createProbabilityBarStyles(theme: BargainTheme) {
  return StyleSheet.create({
    track: {
      height: 5,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      marginTop: 6,
      marginBottom: 4,
    },
    fill: {
      height: '100%',
      borderRadius: theme.borderRadius.full,
    },
    label: {
      fontSize: 10,
    },
  });
}
