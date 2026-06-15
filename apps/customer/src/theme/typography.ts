import { TextStyle } from 'react-native';
export const typography = {
  fonts: {
    poppins100Thin: 'Poppins-Thin',
    poppins200ExtraLight: 'Poppins-ExtraLight',
    poppins300Light: 'Poppins-Light',
    poppins400Regular: 'Poppins-Regular',
    poppins500Medium: 'Poppins-Medium',
    poppins600SemiBold: 'Poppins-SemiBold',
    poppins700Bold: 'Poppins-Bold',
    poppins800ExtraBold: 'Poppins-ExtraBold',
    poppins900Black: 'Poppins-Black',
    inter100Thin: 'Inter-Thin',
    inter200ExtraLight: 'Inter-ExtraLight',
    inter300Light: 'Inter-Light',
    inter400Regular: 'Inter-Regular',
    inter500Medium: 'Inter-Medium',
    inter600SemiBold: 'Inter-SemiBold',
    inter700Bold: 'Inter-Bold',
    inter800ExtraBold: 'Inter-ExtraBold',
    inter900Black: 'Inter-Black',
    manrope200ExtraLight: 'Manrope-ExtraLight',
    manrope300Light: 'Manrope-Light',
    manrope400Regular: 'Manrope-Regular',
    manrope500Medium: 'Manrope-Medium',
    manrope600SemiBold: 'Manrope-SemiBold',
    manrope700Bold: 'Manrope-Bold',
    manrope800ExtraBold: 'Manrope-ExtraBold',
    pacifico400Regular: 'Pacifico-Regular',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    h1: 32,
  },
  lineHeights: {
    xs: 14,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 26,
    xxl: 30,
    xxxl: 36,
    h1: 42,
  },
};
export type TypographyPreset =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'caption'
  | 'button'
  | 'label';
export const textPresets: Record<TypographyPreset, TextStyle> = {
  h1: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.h1,
    lineHeight: typography.lineHeights.h1,
    fontWeight: '700',
  },
  h2: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xxxl,
    lineHeight: typography.lineHeights.xxxl,
    fontWeight: '600',
  },
  h3: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xxl,
    lineHeight: typography.lineHeights.xxl,
    fontWeight: '600',
  },
  bodyLarge: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    lineHeight: typography.lineHeights.lg,
    fontWeight: '500',
  },
  bodyMedium: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: '400',
  },
  caption: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
    fontWeight: '400',
  },
  button: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: '600',
  },
  label: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: '500',
  },
};
