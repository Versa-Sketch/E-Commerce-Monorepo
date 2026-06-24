import { useEffect, useState } from 'react';
import { secondsRemaining } from '../utils/bargainMath';

// Extracted from the store's old baked-in "1-second tick" so a screen can
// opt into a live countdown without needing the whole store to re-derive
// every second — useful for a single CountdownBadge on a detail screen.
export function useBargainCountdown(expiresAt: string | null): number {
  const [seconds, setSeconds] = useState(() => secondsRemaining(expiresAt));

  useEffect(() => {
    setSeconds(secondsRemaining(expiresAt));
    const timer = setInterval(() => setSeconds(secondsRemaining(expiresAt)), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return seconds;
}
