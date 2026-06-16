import type { Coordinates, Region } from '../types';

const EARTH_RADIUS_KM = 6371;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * sinLon * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

export function isWithinRadius(a: Coordinates, b: Coordinates, radiusKm: number): boolean {
  return haversineDistanceKm(a, b) <= radiusKm;
}

/** Approximates a react-native-maps Region's zoom level for the Google Maps JS API */
export function regionToZoom(region: Region): number {
  const zoom = Math.log2(360 / region.longitudeDelta);
  return Math.min(20, Math.max(1, Math.round(zoom)));
}

export function zoomToDelta(zoom: number): { latitudeDelta: number; longitudeDelta: number } {
  const longitudeDelta = 360 / Math.pow(2, zoom);
  return { latitudeDelta: longitudeDelta, longitudeDelta };
}

export function centerZoomToRegion(center: Coordinates, zoom: number): Region {
  return { ...center, ...zoomToDelta(zoom) };
}
