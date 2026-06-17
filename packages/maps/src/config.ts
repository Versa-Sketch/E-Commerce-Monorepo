import type { Region } from './types';

export interface MapsConfig {
  /** Used by googleMapsClient for Geocoding/Places/Directions REST APIs */
  googleMapsApiKey?: string;
  /** Used by AppMap.web.tsx (Maps JavaScript API) */
  googleMapsWebApiKey?: string;
  /** Fallback map center before GPS resolves */
  defaultRegion?: Region;
  /** Google Cloud-based Map Styling (CBMS) Map ID, applied on native (googleMapId) and web (mapId) */
  mapId?: string;
}

let config: MapsConfig = {
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  googleMapsWebApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY || "",
  mapId: "17374856d82720bd69aace30",
};

export function configureMaps(overrides: Partial<MapsConfig>): void {
  config = { ...config, ...overrides };
}

export function getMapsConfig(): Readonly<MapsConfig> {
  return config;
}
