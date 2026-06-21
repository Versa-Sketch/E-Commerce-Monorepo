export type AuthRole = 'customer' | 'SHOP_OWNER';

export interface ThemeColors {
  primary: string;
  primaryDark?: string;
  background: string;
  surface?: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
}

export interface ThemeSpacing {
  [key: string]: number;
}

export interface ThemeBorderRadius {
  [key: string]: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

export interface AuthLabels {
  title: string;
  subtitle: string;
  placeholder?: string;
  buttonText: string;
  createAccountText?: string;
  createAccountLink?: string;
  securityNote?: string;
  enterOtpTitle?: string;
  enterOtpSubtitle?: string;
  resendOtp?: string;
  verifyButton?: string;
}

export interface PhoneInputScreenProps {
  onContinue: (phone: string, needsOtp: boolean) => void | Promise<void>;
  onBack: () => void;
  onCreateAccount: () => void;
  theme: Theme;
  labels: AuthLabels;
  role: AuthRole;
  isLoading?: boolean;
  error?: string;
}

export interface OtpVerifyScreenProps {
  phoneNumber: string;
  role: AuthRole;
  onBack: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  theme: Theme;
  labels: AuthLabels;
  otpLength?: number;
  isLoading?: boolean;
  error?: string;
  onResendOtp?: () => Promise<void>;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}
