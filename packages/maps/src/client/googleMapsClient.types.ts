export interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodeResult {
  formatted_address: string;
  address_components: GeocodeAddressComponent[];
  geometry: { location: { lat: number; lng: number } };
}

export interface GeocodeResponse {
  status: string;
  results: GeocodeResult[];
}

export interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting?: { main_text: string; secondary_text?: string };
}

export interface AutocompleteResponse {
  status: string;
  predictions: AutocompletePrediction[];
}

export interface PlaceDetailsResponse {
  status: string;
  result?: GeocodeResult;
}

export interface DirectionsLeg {
  distance: { value: number; text: string };
  duration: { value: number; text: string };
}

export interface DirectionsRoute {
  overview_polyline: { points: string };
  legs: DirectionsLeg[];
}

export interface DirectionsResponse {
  status: string;
  routes: DirectionsRoute[];
}
