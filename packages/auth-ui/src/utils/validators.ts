import { ValidationResult } from '../types/auth';

/**
 * Validates Indian mobile phone number
 * Must be exactly 10 digits starting with 6-9
 */
export function validateIndianPhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, error: 'Mobile number is required' };
  }

  if (phone.length !== 10) {
    return { valid: false, error: 'Mobile number must be exactly 10 digits' };
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { valid: false, error: 'Please enter a valid Indian mobile number' };
  }

  return { valid: true, error: null };
}

/**
 * Validates OTP format
 */
export function validateOTP(otp: string, length: number = 4): ValidationResult {
  if (!otp) {
    return { valid: false, error: 'OTP is required' };
  }

  if (otp.length !== length) {
    return { valid: false, error: `OTP must be ${length} digits` };
  }

  if (!/^\d+$/.test(otp)) {
    return { valid: false, error: 'OTP must contain only digits' };
  }

  return { valid: true, error: null };
}

/**
 * Cleans phone number input - removes non-numeric characters
 */
export function cleanPhoneInput(input: string, maxLength: number = 10): string {
  return input.replace(/[^0-9]/g, '').slice(0, maxLength);
}

/**
 * Cleans OTP input - removes non-numeric characters
 */
export function cleanOTPInput(input: string): string {
  return input.replace(/[^0-9]/g, '');
}

/**
 * Masks phone number for display
 * e.g., "9876543210" -> "+91 98765XXXXX"
 */
export function maskPhoneNumber(phone: string): string {
  if (phone.length < 10) return phone;
  const visible = phone.slice(0, 5);
  return `+91 ${visible}XXXXX`;
}
