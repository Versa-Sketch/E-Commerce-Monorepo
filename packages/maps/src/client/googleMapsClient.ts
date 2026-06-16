import { getMapsConfig } from '../config';
import { decodePolyline } from '../utils/polyline';
import type {
  Coordinates,
  DirectionsMode,
  DirectionsResult,
  PickedLocation,
  PlaceSuggestion,
} from '../types';
import type {
  AutocompleteResponse,
  DirectionsResponse,
  GeocodeResponse,
  GeocodeResult,
  PlaceDetailsResponse,
} from './googleMapsClient.types';

const BASE_URL = 'https://maps.googleapis.com/maps/api';

function requireApiKey(): string {
  const key = getMapsConfig().googleMapsApiKey;
  if (!key) {
    throw new Error(
      '[@ecommerce/maps] Google Maps API key not configured. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY or call configureMaps({ googleMapsApiKey }).',
    );
  }
  return key;
}

function geocodeResultToPickedLocation(result: GeocodeResult): PickedLocation {
  const component = (type: string) =>
    result.address_components.find((c) => c.types.includes(type))?.long_name;

  // Prefer the most specific named place: subpremise > premise > route
  const premise = component('subpremise') ?? component('premise');
  const route = component('route');
  const street = premise && route ? `${premise}, ${route}` : premise ?? route;

  return {
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
    street,
    city: component('locality') ?? component('administrative_area_level_2'),
    state: component('administrative_area_level_1'),
    postalCode: component('postal_code'),
  };
}

async function fetchJson<T>(path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ ...params, key: requireApiKey() });
  const response = await fetch(`${BASE_URL}${path}?${query.toString()}`);
  return (await response.json()) as T;
}

export const googleMapsClient = {
  async geocode(coordinates: Coordinates): Promise<PickedLocation | null> {
    const data = await fetchJson<GeocodeResponse>('/geocode/json', {
      latlng: `${coordinates.latitude},${coordinates.longitude}`,
    });
    if (data.status !== 'OK' || data.results.length === 0) return null;
    return geocodeResultToPickedLocation(data.results[0]);
  },

  async autocomplete(
    input: string,
    options?: { components?: string; sessionToken?: string },
  ): Promise<PlaceSuggestion[]> {
    if (!input.trim()) return [];
    const data = await fetchJson<AutocompleteResponse>('/place/autocomplete/json', {
      input,
      ...(options?.components ? { components: options.components } : {}),
      ...(options?.sessionToken ? { sessiontoken: options.sessionToken } : {}),
    });
    if (data.status !== 'OK') return [];
    return data.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting?.main_text,
      secondaryText: prediction.structured_formatting?.secondary_text,
    }));
  },

  async placeDetails(placeId: string, sessionToken?: string): Promise<PickedLocation | null> {
    const data = await fetchJson<PlaceDetailsResponse>('/place/details/json', {
      place_id: placeId,
      fields: 'formatted_address,address_component,geometry',
      ...(sessionToken ? { sessiontoken: sessionToken } : {}),
    });
    if (data.status !== 'OK' || !data.result) return null;
    return geocodeResultToPickedLocation(data.result);
  },

  async directions(
    origin: Coordinates,
    destination: Coordinates,
    mode: DirectionsMode = 'driving',
  ): Promise<DirectionsResult | null> {
    const data = await fetchJson<DirectionsResponse>('/directions/json', {
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      mode,
    });
    if (data.status !== 'OK' || data.routes.length === 0) return null;

    const route = data.routes[0];
    const leg = route.legs[0];
    return {
      polyline: decodePolyline(route.overview_polyline.points),
      distanceMeters: leg.distance.value,
      durationSeconds: leg.duration.value,
      distanceText: leg.distance.text,
      durationText: leg.duration.text,
    };
  },
};
