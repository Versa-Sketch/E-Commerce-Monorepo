import { useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../types';

export interface UseSimulatedRouteOptions {
  intervalMs?: number;
}

export interface UseSimulatedRouteResult {
  location: Coordinates | null;
  heading: number | null;
  stepIndex: number;
  totalSteps: number;
}

function bearingBetween(from: Coordinates, to: Coordinates): number {
  const dLat = to.latitude - from.latitude;
  const dLng = to.longitude - from.longitude;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

export function useSimulatedRoute(
  waypoints: Coordinates[],
  { intervalMs = 5000 }: UseSimulatedRouteOptions = {},
): UseSimulatedRouteResult {
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (waypoints.length < 2) return;
    timerRef.current = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % waypoints.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [waypoints.length, intervalMs]);

  if (!waypoints.length) {
    return { location: null, heading: null, stepIndex: 0, totalSteps: 0 };
  }

  const location = waypoints[stepIndex];
  const nextIndex = Math.min(stepIndex + 1, waypoints.length - 1);
  const heading = stepIndex < waypoints.length - 1
    ? bearingBetween(location, waypoints[nextIndex])
    : null;

  return { location, heading, stepIndex, totalSteps: waypoints.length };
}
