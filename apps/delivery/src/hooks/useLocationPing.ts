import { useEffect, useRef } from 'react';
import { reaction } from 'mobx';
import * as Location from 'expo-location';
import { appStore } from '../store/useAppStore';
import { useOnboardingStore } from '../features/Onboarding/Store/useOnboardingStore';
import { updatePartnerLocation } from '../services/location';

const PING_INTERVAL_MS = 60_000;

// Pings the backend with the partner's current GPS position every 60s, but
// only while they're toggled online AND fully approved — matches the
// "verified + online" gate the API expects (a non-approved partner has no
// delivery-partner profile yet, which 404s).
export function useLocationPing(): void {
  const isApproved = useOnboardingStore((s) => s.onboardingStatus === 'APPROVED');
  const hasPermission = useRef(false);

  useEffect(() => {
    // MobX reaction fires whenever isOnline changes; we also re-run when
    // isApproved flips via the outer useEffect dependency.
    if (!isApproved) return;

    let cancelled = false;

    async function pingOnce() {
      console.log('pingOnce', appStore.isOnline);

      if (!appStore.isOnline || cancelled) return;
      try {
        if (!hasPermission.current) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          hasPermission.current = status === 'granted';
        }
        if (!hasPermission.current || cancelled) return;

        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (cancelled) return;

        await updatePartnerLocation(position.coords.latitude, position.coords.longitude);
      } catch {
        // Best-effort background ping — a single failed send (GPS unavailable,
        // network blip) shouldn't surface to the user; the next tick retries.
      }
    }

    // React immediately when isOnline toggles, and keep a 60s interval while online.
    let interval: ReturnType<typeof setInterval> | null = null;

    const dispose = reaction(
      () => appStore.isOnline,
      (online) => {
        if (interval) { clearInterval(interval); interval = null; }
        if (online && !cancelled) {
          pingOnce();
          interval = setInterval(pingOnce, PING_INTERVAL_MS);
        }
      },
      { fireImmediately: true },
    );

    return () => {
      cancelled = true;
      dispose();
      if (interval) clearInterval(interval);
    };
  }, [isApproved]);
}
