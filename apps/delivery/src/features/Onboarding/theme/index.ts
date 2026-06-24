import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// ── Flip this one variable to switch the entire onboarding/KYC flow's look ──
// All 9 step screens + Config read colors exclusively through `obColors`
// below, so changing this is the only edit needed to swap the whole theme.
const THEME_VARIANT: 'light' | 'dark' = 'light';

const darkPalette = {
  bg: '#111111',
  surface: '#1E1E1E',
  surfaceMuted: '#1A1A1A',
  border: '#2A2A2A',
  inputFill: '#1E1E1E',
  inputBorder: '#3A3A3A',
  text: '#FFFFFF',
  textMuted: '#B5B5B5',
  textFaint: '#555555',
  accent: '#FFFFFF',
  accentMuted: 'rgba(255,255,255,0.12)',
  onAccent: '#111111',
  error: '#E45B5B',
  errorMuted: '#3A1A1A',
  white: '#FFFFFF',
};

const lightPalette = {
  bg: '#FFFFFF',
  surface: '#F6F6F6',
  surfaceMuted: '#F0F0F0',
  border: '#E0E0E0',
  inputFill: '#F6F6F6',
  inputBorder: '#D5D5D5',
  text: '#111111',
  textMuted: '#6B6B6B',
  textFaint: '#9A9A9A',
  accent: '#111111',
  accentMuted: 'rgba(17,17,17,0.08)',
  onAccent: '#FFFFFF',
  error: '#C0392B',
  errorMuted: '#FBE5E3',
  white: '#FFFFFF',
};

// Variant B (dark) is kept exactly as it was — only the active selection
// above changes which palette `obColors` resolves to.
export const obColors = THEME_VARIANT === 'light' ? lightPalette : darkPalette;

const basePaperTheme = THEME_VARIANT === 'light' ? MD3LightTheme : MD3DarkTheme;

export const onboardingPaperTheme = {
  ...basePaperTheme,
  roundness: 10,
  colors: {
    ...basePaperTheme.colors,
    primary: obColors.accent,
    background: obColors.bg,
    surface: obColors.surface,
    surfaceVariant: obColors.surface,
    onSurface: obColors.text,
    onSurfaceVariant: obColors.textMuted,
    outline: obColors.inputBorder,
    outlineVariant: obColors.inputBorder,
    error: obColors.error,
  },
};
