export const colors = {
  black: '#000000',
  white: '#FFFFFF',

  // Primary action — black replaces orange everywhere
  orange: '#111111',
  orangeLight: '#F0F0F0',

  // Online / success — dark replaces green
  green: '#111111',
  greenLight: '#F0F0F0',

  // Earnings card — dark replaces teal
  teal: '#1A1A1A',
  tealLight: '#F0F0F0',

  // SOS / error — keep red for safety-critical only
  red: '#E02020',
  redLight: '#FFF0F0',

  // Grays
  gray50: '#F7F7F7',
  gray100: '#E8E8E8',
  gray300: '#AAAAAA',
  gray700: '#555555',
  black87: '#1A1A1A',

  cardBg: '#FFFFFF',
  shiftHeaderBg: '#111111',
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};
