import { useEffect, useState } from 'react';

export interface UseCountdownResult {
  secondsLeft: number;
  label: string;
  isExpired: boolean;
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Ticks down to expiresAt (epoch ms) purely on-device. Once a real backend supplies
 * authoritative expiry, this hook keeps working unchanged — it just reads the same prop.
 */
export function useCountdown(expiresAt: number | undefined): UseCountdownResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) {
    return { secondsLeft: 0, label: '', isExpired: false };
  }

  const secondsLeft = Math.max(0, Math.round((expiresAt - now) / 1000));
  return {
    secondsLeft,
    label: formatClock(secondsLeft),
    isExpired: secondsLeft <= 0,
  };
}
