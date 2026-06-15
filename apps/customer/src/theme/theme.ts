import { palette, ThemeColors } from './colors';
import { typography, textPresets } from './typography';
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  round: 9999,
};
export interface AppTheme {
  dark: boolean;
  colors: ThemeColors & {
    primary: string;
    deepPrimary: string;
    accent: string;
    accentSoft: string;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  textPresets: typeof textPresets;
}
export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    ...palette.light,
    primary: palette.mint,
    deepPrimary: palette.forest,
    accent: palette.charcoal,
    accentSoft: palette.ice,
  },
  spacing,
  borderRadius,
  typography,
  textPresets,
};
export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    ...palette.dark,
    primary: palette.mint,
    deepPrimary: palette.forest,
    accent: palette.charcoal,
    accentSoft: palette.ice,
  },
  spacing,
  borderRadius,
  typography,
  textPresets,
};
