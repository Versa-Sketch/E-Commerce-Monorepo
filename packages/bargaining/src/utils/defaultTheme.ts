import type { BargainTheme, BargainThemeColors } from '../types/theme';

/**
 * Builds a complete theme from just a brand color. Each host app supplies its own
 * primary/dark/light triplet (customer green, merchant orange, ...) and gets a
 * fully-populated theme back without having to specify every token.
 */
export function createBargainTheme(overrides: {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  colors?: Partial<BargainThemeColors>;
}): BargainTheme {
  return {
    colors: {
      primary: overrides.primary,
      primaryDark: overrides.primaryDark,
      primaryLight: overrides.primaryLight,
      onPrimary: '#FFFFFF',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      surfaceSecondary: '#F3F4F6',
      text: '#111827',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      border: '#E5E7EB',
      borderSecondary: '#D1D5DB',
      success: '#16A34A',
      successBackground: '#DCFCE7',
      danger: '#DC2626',
      dangerBackground: '#FEE2E2',
      warning: '#B45309',
      warningBackground: '#FEF3C7',
      ...overrides.colors,
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    borderRadius: { sm: 8, md: 12, lg: 18, full: 999 },
  };
}

export const defaultBargainTheme: BargainTheme = createBargainTheme({
  primary: '#16A34A',
  primaryDark: '#047857',
  primaryLight: '#ECFDF5',
});
