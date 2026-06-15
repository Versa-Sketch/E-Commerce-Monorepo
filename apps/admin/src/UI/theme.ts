// Design tokens matching the mint/green admin theme
export const theme = {
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },
  colors: {
    bg: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#ECFDF5',
    primary: '#10B981',
    primaryHover: '#059669',
    deepPrimary: '#047857',
    accent: '#111827',
    accentSoft: '#ECFDF5',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    borderGlow: 'rgba(16,185,129,0.12)',
    secondary: '#F59E0B',
    secondaryHover: '#D97706',
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    danger: '#EF4444',
    dangerBg: '#FEF2F2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
  },
} as const;

export type ThemeColors = typeof theme.colors;
export type AppTheme = typeof theme;
