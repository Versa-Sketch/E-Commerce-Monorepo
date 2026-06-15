export const Colors = {
  brand: {
    primary: '#16A34A', 
    dark: '#047857', 
    light: '#ECFDF5', 
    onLight: '#065F46', 
  },
  accent: {
    DEFAULT: '#F59E0B', 
    light: '#FFFBEB', 
    onLight: '#78350F', 
  },
  surface: {
    page: '#F9FAFB', 
    card: '#FFFFFF',
    border: '#E5E7EB',
    borderStrong: '#D1D5DB',
  },
  text: {
    primary: '#111827', 
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    onPrimary: '#FFFFFF', 
  },
  semantic: {
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
  },
} as const;
export const palette = {
  mint: Colors.brand.primary,
  forest: Colors.brand.dark,
  ice: Colors.brand.light,
  saffron: Colors.accent.DEFAULT,
  snow: Colors.surface.page,
  charcoal: Colors.text.primary,
  light: {
    background: Colors.surface.page,
    surface: Colors.surface.card,
    surfaceSecondary: Colors.brand.light,
    textPrimary: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    textMuted: Colors.text.tertiary,
    border: Colors.surface.border,
    success: Colors.semantic.success,
    warning: Colors.semantic.warning,
    error: Colors.semantic.error,
    cardShadow: 'rgba(17, 24, 39, 0.05)',
  },
  dark: {
    background: '#0B0F19',
    surface: '#111827',
    surfaceSecondary: '#1F2937',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    border: '#374151',
    success: Colors.semantic.success,
    warning: Colors.semantic.warning,
    error: Colors.semantic.error,
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  cardShadow: string;
}
