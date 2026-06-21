// Components
export { PhoneInputScreen } from './components/PhoneInputScreen';
export { OtpVerifyScreen } from './components/OtpVerifyScreen';

// Hooks
export { usePhoneValidation } from './hooks/usePhoneValidation';
export { useOtpTimer } from './hooks/useOtpTimer';
export { useOtpInput } from './hooks/useOtpInput';

// Types
export type {
  AuthRole,
  Theme,
  ThemeColors,
  ThemeSpacing,
  ThemeBorderRadius,
  AuthLabels,
  PhoneInputScreenProps,
  OtpVerifyScreenProps,
  ValidationResult,
} from './types/auth';

// Utils
export {
  validateIndianPhone,
  validateOTP,
  cleanPhoneInput,
  cleanOTPInput,
  maskPhoneNumber,
} from './utils/validators';
