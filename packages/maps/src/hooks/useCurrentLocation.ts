import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { ResolvedLocation } from '../types';
import { useReverseGeocode } from './useReverseGeocode';

export interface UseCurrentLocationOptions {
  autoRequest?: boolean;
  accuracy?: Location.LocationAccuracy;
  resolveAddress?: boolean;
}

export interface UseCurrentLocationResult {
  location: ResolvedLocation | null;
  loading: boolean;
  error: Error | null;
  permissionGranted: boolean | null;
  refresh: () => Promise<void>;
}

export function useCurrentLocation(
  options: UseCurrentLocationOptions = {},
): UseCurrentLocationResult {
  const { autoRequest = true, accuracy = Location.Accuracy.Balanced, resolveAddress = true } = options;

  const [coords, setCoords] = useState<{ latitude: number; longitude: number; updatedAt: number } | null>(null);
  const [loading, setLoading] = useState(autoRequest);
  const [error, setError] = useState<Error | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const permissionGrantedRef = useRef<boolean | null>(null);

  const { result: resolved } = useReverseGeocode(resolveAddress ? coords ?? null : null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Only request permission if we haven't confirmed it yet
      if (permissionGrantedRef.current !== true) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        permissionGrantedRef.current = granted;
        setPermissionGranted(granted);
        if (!granted) {
          setLoading(false);
          return;
        }
      }

      // Snap immediately to last known position so map moves right away
      const last = await Location.getLastKnownPositionAsync();
      if (last) {
        setCoords({
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
          updatedAt: Date.now(),
        });
        setLoading(false);
      }

      // Then refine with a fresh GPS fix in the background
      const fresh = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      setCoords({
        latitude: fresh.coords.latitude,
        longitude: fresh.coords.longitude,
        updatedAt: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get current location'));
    } finally {
      setLoading(false);
    }
  }, [accuracy]);

  useEffect(() => {
    if (autoRequest) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRequest]);

  const location: ResolvedLocation | null = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        updatedAt: coords.updatedAt,
        ...resolved,
      }
    : null;

  return { location, loading, error, permissionGranted, refresh };
}
