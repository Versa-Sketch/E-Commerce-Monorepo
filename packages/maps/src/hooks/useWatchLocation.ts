import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export interface WatchedLocation {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface UseWatchLocationOptions {
  accuracy?: Location.LocationAccuracy;
  /** minimum time between updates, in ms; default 3000 */
  timeInterval?: number;
  /** minimum distance between updates, in meters; default 10 */
  distanceInterval?: number;
  /** set false to pause watching; default true */
  enabled?: boolean;
}

export interface UseWatchLocationResult {
  location: WatchedLocation | null;
  error: Error | null;
  isWatching: boolean;
}

/** Live location tracking, e.g. for a delivery partner's order-tracking screen */
export function useWatchLocation(options: UseWatchLocationOptions = {}): UseWatchLocationResult {
  const {
    accuracy = Location.Accuracy.BestForNavigation,
    timeInterval = 3000,
    distanceInterval = 10,
    enabled = true,
  } = options;

  const [location, setLocation] = useState<WatchedLocation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!enabled) {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reflect that watching stopped when disabled
      setIsWatching(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError(new Error('Location permission not granted'));
          return;
        }
        if (cancelled) return;

        subscriptionRef.current = await Location.watchPositionAsync(
          { accuracy, timeInterval, distanceInterval },
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp: position.timestamp,
            });
          },
        );
        setIsWatching(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to watch location'));
      }
    })();

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      setIsWatching(false);
    };
  }, [enabled, accuracy, timeInterval, distanceInterval]);

  return { location, error, isWatching };
}
