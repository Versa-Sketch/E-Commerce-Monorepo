import { useEffect, useState } from 'react';
import { googleMapsClient } from '../client/googleMapsClient';
import type { Coordinates, ResolvedLocation } from '../types';

export interface UseReverseGeocodeResult {
  result: ResolvedLocation | null;
  loading: boolean;
  error: Error | null;
}

export function useReverseGeocode(coordinates: Coordinates | null): UseReverseGeocodeResult {
  const [result, setResult] = useState<ResolvedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coordinates) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale result when coordinates become unavailable
      setResult(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    googleMapsClient
      .geocode(coordinates)
      .then((picked) => {
        if (cancelled) return;
        if (!picked) {
          setResult(null);
          return;
        }
        setResult({
          latitude: picked.latitude,
          longitude: picked.longitude,
          street: picked.street,
          city: picked.city,
          state: picked.state,
          postalCode: picked.postalCode,
          formattedAddress: picked.formattedAddress,
          updatedAt: Date.now(),
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Reverse geocode failed'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coordinates?.latitude, coordinates?.longitude]);

  return { result, loading, error };
}
