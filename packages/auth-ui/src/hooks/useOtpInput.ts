import { useRef, useState, useCallback } from 'react';
import { TextInput } from 'react-native';
import { cleanOTPInput } from '../utils/validators';

export interface UseOtpInputResult {
  otp: string[];
  setOtp: (otp: string[]) => void;
  refs: React.RefObject<(TextInput | null)[]>;
  handleOtpChange: (text: string, index: number) => void;
  handleKeyPress: (key: string, index: number) => void;
  clear: () => void;
}

/**
 * Manages OTP input field navigation and state
 * Handles auto-focus, tab between fields, paste, and backspace
 */
export function useOtpInput(length: number = 4): UseOtpInputResult {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(TextInput | null)[]>(Array(length).fill(null));

  const handleOtpChange = useCallback((text: string, index: number) => {
    // Handle paste - if pasted text has multiple digits
    if (text.length > 1) {
      const digits = cleanOTPInput(text).slice(0, length - index);
      const newOtp = [...otp];
      digits.split('').forEach((d, i) => {
        if (index + i < length) newOtp[index + i] = d;
      });
      setOtp(newOtp);

      const nextIdx = Math.min(index + digits.length, length - 1);
      refs.current[nextIdx]?.focus();
      return;
    }

    // Handle single digit input
    const digit = cleanOTPInput(text);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next field if digit entered
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }, [otp, length]);

  const handleKeyPress = useCallback((key: string, index: number) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];

      // If current field is empty and not first field, move to previous
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        refs.current[index - 1]?.focus();
      } else {
        // Clear current field
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  }, [otp]);

  const clear = useCallback(() => {
    setOtp(Array(length).fill(''));
    refs.current[0]?.focus();
  }, [length]);

  return {
    otp,
    setOtp,
    refs,
    handleOtpChange,
    handleKeyPress,
    clear,
  };
}
