export interface BargainThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderSecondary: string;
  success: string;
  successBackground: string;
  danger: string;
  dangerBackground: string;
  warning: string;
  warningBackground: string;
}

export interface BargainThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface BargainThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface BargainTheme {
  colors: BargainThemeColors;
  spacing: BargainThemeSpacing;
  borderRadius: BargainThemeBorderRadius;
}
