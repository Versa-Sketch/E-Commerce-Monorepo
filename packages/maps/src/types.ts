export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Region extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export type MarkerKind = 'self' | 'destination' | 'store' | 'customer' | 'pin' | 'custom';

export interface MapMarkerData extends Coordinates {
  id: string;
  title?: string;
  description?: string;
  kind?: MarkerKind;
  draggable?: boolean;
  /** heading in degrees, used for 'self' markers */
  rotation?: number;
}

export interface MapPolylineData {
  id: string;
  coordinates: Coordinates[];
  strokeColor?: string;
  strokeWidth?: number;
}

export interface MapCircleData {
  id: string;
  center: Coordinates;
  radiusMeters: number;
  strokeColor?: string;
  fillColor?: string;
}

/**
 * Result of LocationPicker - intentionally shaped so callers can spread it
 * into AddressInput-like objects via pickedLocationToAddressFields().
 */
export interface PickedLocation extends Coordinates {
  formattedAddress?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface ResolvedLocation extends Coordinates {
  city?: string;
  district?: string;
  street?: string;
  state?: string;
  postalCode?: string;
  formattedAddress?: string;
  updatedAt: number;
}

export interface DirectionsResult {
  polyline: Coordinates[];
  distanceMeters: number;
  durationSeconds: number;
  distanceText: string;
  durationText: string;
}

export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText?: string;
  secondaryText?: string;
}

export type DirectionsMode = 'driving' | 'walking' | 'bicycling' | 'two_wheeler';
