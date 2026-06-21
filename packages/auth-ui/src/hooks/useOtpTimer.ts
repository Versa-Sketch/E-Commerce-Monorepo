import { useEffect, useState } from 'react';

export interface UseOtpTimerResult {
  timer: number;
  canResend: boolean;
  reset: () => void;
}

/**
 * OTP countdown timer hook
 * Manages the resend OTP countdown
 */
export function useOtpTimer(initialSeconds: number = 30): UseOtpTimerResult {
  const [timer, setTimer] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setCanResend(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const reset = () => {
    setTimer(initialSeconds);
    setCanResend(false);
  };

  return { timer, canResend, reset };
}
