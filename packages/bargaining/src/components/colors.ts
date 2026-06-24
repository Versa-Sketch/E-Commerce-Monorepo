// Self-contained palette for the bargaining UI — the package can't depend on
// either app's theme module, so these are the same tokens merchant's
// DealVisuals already used (the chosen visual direction for both apps).
export const Colors = {
  primary: '#EA580C',
  primaryDark: '#C2410C',
  primaryLight: '#FFF7ED',
  success: '#22C55E',
  successBg: '#DCFCE7',
  warning: '#F59E0B',
  warningBg: '#FEF9C3',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  gradientPrimary: ['#EA580C', '#F97316'] as [string, string],
};
