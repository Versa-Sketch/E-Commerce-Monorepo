export * from './types';
export * from './config';

export { AppMap } from './components/AppMap';
export type { AppMapProps, AppMapRef } from './components/AppMap.types';
export { AppMapMarker } from './components/AppMapMarker';
export { AppMapPolyline } from './components/AppMapPolyline';
export { AppMapCircle } from './components/AppMapCircle';
export { LocationPicker } from './components/LocationPicker';
export type { LocationPickerProps, LocationPickerRef } from './components/LocationPicker';
export { LiveTrackingMap } from './components/LiveTrackingMap';
export type { LiveTrackingMapProps } from './components/LiveTrackingMap';
export { SearchBox } from './components/SearchBox';
export { RecenterButton } from './components/RecenterButton';

export { useCurrentLocation } from './hooks/useCurrentLocation';
export type { UseCurrentLocationOptions, UseCurrentLocationResult } from './hooks/useCurrentLocation';
export { useWatchLocation } from './hooks/useWatchLocation';
export type { UseWatchLocationOptions, UseWatchLocationResult, WatchedLocation } from './hooks/useWatchLocation';
export { useReverseGeocode } from './hooks/useReverseGeocode';
export type { UseReverseGeocodeResult } from './hooks/useReverseGeocode';
export { usePlacesAutocomplete } from './hooks/usePlacesAutocomplete';
export type { UsePlacesAutocompleteOptions, UsePlacesAutocompleteResult } from './hooks/usePlacesAutocomplete';
export { useDirections } from './hooks/useDirections';
export type { UseDirectionsOptions, UseDirectionsResult } from './hooks/useDirections';

export { googleMapsClient } from './client/googleMapsClient';
export { decodePolyline } from './utils/polyline';
export { centerZoomToRegion, haversineDistanceKm, isWithinRadius, regionToZoom, zoomToDelta } from './utils/geo';
export { pickedLocationToAddressFields } from './utils/addressMapping';
export type { AddressFields } from './utils/addressMapping';
