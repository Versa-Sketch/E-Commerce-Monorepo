import { useEffect, useRef, useState } from 'react';
import { googleMapsClient } from '../client/googleMapsClient';
import { haversineDistanceKm } from '../utils/geo';
import type { Coordinates, DirectionsMode, DirectionsResult } from '../types';

export interface UseDirectionsOptions {
  mode?: DirectionsMode;
  /** re-fetch when origin moves beyond this distance; default 50 */
  refetchThresholdMeters?: number;
}

export interface UseDirectionsResult {
  directions: DirectionsResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDirections(
  origin: Coordinates | null,
  destination: Coordinates | null,
  options: UseDirectionsOptions = {},
): UseDirectionsResult {
  const { mode = 'driving', refetchThresholdMeters = 50 } = options;

  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastOriginRef = useRef<Coordinates | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    if (!origin || !destination) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale route when inputs become unavailable
      setDirections(null);
      return;
    }

    const last = lastOriginRef.current;
    if (last) {
      const movedKm = haversineDistanceKm(last, origin);
      if (movedKm * 1000 < refetchThresholdMeters) return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    googleMapsClient
      .directions(origin, destination, mode)
      .then((result) => {
        if (cancelled) return;
        setDirections(result);
        lastOriginRef.current = origin;
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Directions request failed'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude, mode, refetchThresholdMeters, refetchToken]);

  const refetch = () => {
    lastOriginRef.current = null;
    setRefetchToken((t) => t + 1);
  };

  return { directions, loading, error, refetch };
}
