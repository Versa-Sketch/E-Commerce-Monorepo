# `@ecommerce/maps` — File-by-File Guide

This document explains what every file in `packages/maps/src` does, in detail,
with usage examples. For the high-level overview (API keys, platform split,
configuration) see the package [README](../README.md).

> This package is **not yet imported by any app**. Everything below describes
> the package in isolation — wire-up into `apps/customer`, `apps/merchant`,
> and `apps/delivery` is a separate, future task.

---

## Top level

### `src/index.ts`

The public export barrel. Every type, component, hook, and utility a consuming
app is allowed to use is re-exported from here — nothing else should be
imported via deep paths (e.g. `@ecommerce/maps/src/hooks/useDirections` is not
a supported import).

```ts
import {
  AppMap,
  LocationPicker,
  LiveTrackingMap,
  useCurrentLocation,
  useWatchLocation,
  useDirections,
  pickedLocationToAddressFields,
  configureMaps,
} from '@ecommerce/maps';
```

### `src/types.ts`

The shared vocabulary used by every other file. None of these types depend on
React Native or Google Maps SDK types directly, so they're safe to use in
plain TS (e.g. inside a Zustand store or API layer).

| Type | Shape | Purpose |
| --- | --- | --- |
| `Coordinates` | `{ latitude, longitude }` | The base lat/lng pair used everywhere. |
| `Region` | `Coordinates & { latitudeDelta, longitudeDelta }` | A map viewport — matches `react-native-maps`' `Region`. The deltas control zoom level. |
| `MarkerKind` | `'self' \| 'destination' \| 'store' \| 'customer' \| 'pin' \| 'custom'` | Semantic tag for a marker, used for icon/styling decisions by the consuming app. |
| `MapMarkerData` | `Coordinates & { id, title?, description?, kind?, draggable?, rotation? }` | Declarative marker description passed to `AppMap`'s `markers` prop. `rotation` is used for a "self" marker (e.g. delivery partner heading). |
| `MapPolylineData` | `{ id, coordinates: Coordinates[], strokeColor?, strokeWidth? }` | A route line, e.g. from `useDirections`. |
| `MapCircleData` | `{ id, center, radiusMeters, strokeColor?, fillColor? }` | A radius overlay, e.g. a store's delivery radius. |
| `PickedLocation` | `Coordinates & { formattedAddress?, street?, city?, state?, postalCode? }` | The result of `LocationPicker` — shaped so it can be spread into an `AddressInput`-like object via `pickedLocationToAddressFields`. |
| `ResolvedLocation` | `Coordinates & { city?, district?, street?, state?, postalCode?, formattedAddress?, updatedAt }` | The result of reverse-geocoding (`useReverseGeocode`, `useCurrentLocation`). Includes a `district` field (useful for India-style addresses) and an `updatedAt` timestamp. |
| `DirectionsResult` | `{ polyline: Coordinates[], distanceMeters, durationSeconds, distanceText, durationText }` | The result of `useDirections` / `googleMapsClient.directions()`. |
| `PlaceSuggestion` | `{ placeId, description, mainText?, secondaryText? }` | One row in a Places Autocomplete dropdown. |
| `DirectionsMode` | `'driving' \| 'walking' \| 'bicycling' \| 'two_wheeler'` | Travel mode for the Directions API — `two_wheeler` is useful for delivery partners. |

### `src/config.ts`

A tiny "configure once" module-level singleton. Apps call `configureMaps()`
once (e.g. in their root layout) to set a default map region or override API
keys at runtime; everything else in the package reads `getMapsConfig()`.

```ts
export interface MapsConfig {
  googleMapsApiKey?: string;     // REST: Geocoding / Places / Directions
  googleMapsWebApiKey?: string;  // Maps JavaScript API (web rendering)
  defaultRegion?: Region;        // fallback center before GPS resolves
}
```

By default, `googleMapsApiKey` / `googleMapsWebApiKey` come from
`process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` / `EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY`.

**Example — app root layout:**

```tsx
import { configureMaps } from '@ecommerce/maps';

configureMaps({
  defaultRegion: { latitude: 17.385, longitude: 78.4867, latitudeDelta: 0.05, longitudeDelta: 0.05 }, // Hyderabad
});
```

**Example — overriding the key at runtime (e.g. per-environment):**

```ts
configureMaps({ googleMapsApiKey: remoteConfig.googleMapsKey });
```

---

## `src/utils/` — pure helper functions

### `src/utils/geo.ts`

Pure math, no dependencies. Used internally by `useDirections` (throttling) and
`AppMap.web.tsx` (region ↔ zoom conversion), but also useful directly in app code.

- **`toRadians(degrees: number): number`** — degrees → radians.
- **`haversineDistanceKm(a: Coordinates, b: Coordinates): number`** — great-circle
  distance between two points, in km, rounded to 1 decimal place.
- **`isWithinRadius(a, b, radiusKm): boolean`** — convenience wrapper:
  `haversineDistanceKm(a, b) <= radiusKm`. Useful for "is this address inside
  the store's delivery radius?" checks.
- **`regionToZoom(region: Region): number`** — approximates the Google Maps JS
  "zoom" level (1–20) that corresponds to a `react-native-maps` `Region`'s
  `longitudeDelta`. Used by `AppMap.web.tsx` to set `<GoogleMap zoom={...}>`.
- **`zoomToDelta(zoom: number): { latitudeDelta, longitudeDelta }`** — the
  inverse: converts a Google Maps zoom level back into deltas.
- **`centerZoomToRegion(center: Coordinates, zoom: number): Region`** —
  combines a center point + zoom into a full `Region`, used when the web map's
  `onIdle` event reports a new center/zoom and that needs to be converted back
  into the `Region` shape `AppMap`'s `onRegionChangeComplete` expects.

**Example:**

```ts
import { isWithinRadius, haversineDistanceKm } from '@ecommerce/maps';

const storeLocation = { latitude: 17.385, longitude: 78.4867 };
const customerAddress = { latitude: 17.41, longitude: 78.50 };

if (!isWithinRadius(storeLocation, customerAddress, 5)) {
  // 5 km delivery radius
  showError('This address is outside our delivery zone.');
}

console.log(haversineDistanceKm(storeLocation, customerAddress)); // e.g. 4.2
```

### `src/utils/polyline.ts`

A single function, `decodePolyline(encoded: string): Coordinates[]`. Implements
Google's [polyline algorithm format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
decoder — turns the compact `overview_polyline.points` string from a Directions
API response into an array of `{ latitude, longitude }` points that can be fed
straight into `AppMap`'s `polylines` prop (via `MapPolylineData.coordinates`).

This is used internally by `googleMapsClient.directions()`, so most app code
won't call it directly — but it's exported in case you need to decode a
polyline from some other source.

**Example:**

```ts
import { decodePolyline } from '@ecommerce/maps';

const points = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
// -> [{ latitude: 38.5, longitude: -120.2 }, { latitude: 40.7, longitude: -120.95 }, ...]
```

### `src/utils/addressMapping.ts`

One function, `pickedLocationToAddressFields(location: PickedLocation): AddressFields`,
where:

```ts
export interface AddressFields {
  latitude: number;
  longitude: number;
  state?: string;
  pincode?: string;
  address_line1?: string;
}
```

This exists purely to bridge `LocationPicker`'s output (`PickedLocation`, a
package-agnostic shape) to the field names used by the customer app's
`AddressInput` type (`apps/customer/src/types/shared.ts`) — **without** this
package importing or depending on that app-level type. `address_line1` falls
back from `formattedAddress` to `street` if the formatted address is missing,
and `pincode` comes from `postalCode`.

**Example — future integration in the customer address form:**

```tsx
import { LocationPicker, pickedLocationToAddressFields } from '@ecommerce/maps';

<LocationPicker
  onConfirm={(picked) => {
    setFormValues((prev) => ({ ...prev, ...pickedLocationToAddressFields(picked) }));
    // -> merges { latitude, longitude, state, pincode, address_line1 } into form state
  }}
/>
```

---

## `src/client/` — Google Maps REST client

### `src/client/googleMapsClient.types.ts`

Minimal hand-written TypeScript types for the subset of the Google Maps REST
API responses this package actually uses (Geocoding, Places Autocomplete,
Place Details, Directions). These mirror the *raw JSON* shape Google returns
(snake_case field names like `formatted_address`, `place_id`) — they are
**internal** types, consumed only by `googleMapsClient.ts`, and converted into
the package's own camelCase types (`PickedLocation`, `PlaceSuggestion`,
`DirectionsResult`) before being returned to callers.

### `src/client/googleMapsClient.ts`

A plain-`fetch` REST client against `https://maps.googleapis.com/maps/api`
(no axios dependency). Exports a single object, `googleMapsClient`, with four
methods. All methods read the API key via `getMapsConfig().googleMapsApiKey`
and throw a descriptive error if it isn't set (`requireApiKey()`).

- **`geocode(coordinates: Coordinates): Promise<PickedLocation | null>`**
  Reverse-geocodes lat/lng → address. Used by the **web** variant of
  `useReverseGeocode` (native uses `expo-location` instead, which is cheaper
  and works offline-ish).

  ```ts
  const place = await googleMapsClient.geocode({ latitude: 17.385, longitude: 78.4867 });
  // -> { latitude: 17.385, longitude: 78.4867, formattedAddress: '...', street: 'Tank Bund Road', city: 'Hyderabad', state: 'Telangana', postalCode: '500001' }
  ```

- **`autocomplete(input: string, options?: { components?: string; sessionToken?: string }): Promise<PlaceSuggestion[]>`**
  Wraps the Places Autocomplete API. Returns `[]` immediately for empty input
  (no network call). `components` restricts results, e.g. `'country:in'`.
  `sessionToken` groups an autocomplete session with the following
  `placeDetails` call for billing purposes (handled automatically by
  `usePlacesAutocomplete`).

  ```ts
  const suggestions = await googleMapsClient.autocomplete('Charminar', { components: 'country:in' });
  // -> [{ placeId: 'ChIJ...', description: 'Charminar, Hyderabad, Telangana, India', mainText: 'Charminar', secondaryText: 'Hyderabad, Telangana, India' }]
  ```

- **`placeDetails(placeId: string, sessionToken?: string): Promise<PickedLocation | null>`**
  Resolves a `placeId` (from `autocomplete`) into full coordinates + address
  components.

  ```ts
  const location = await googleMapsClient.placeDetails('ChIJ...');
  // -> { latitude: 17.3616, longitude: 78.4747, formattedAddress: 'Charminar, ...', city: 'Hyderabad', state: 'Telangana', postalCode: '500002' }
  ```

- **`directions(origin: Coordinates, destination: Coordinates, mode: DirectionsMode = 'driving'): Promise<DirectionsResult | null>`**
  Calls the Directions API and converts the first route's first leg into a
  `DirectionsResult`, decoding the overview polyline via `decodePolyline`.

  ```ts
  const route = await googleMapsClient.directions(deliveryPartnerLocation, storeLocation, 'two_wheeler');
  // -> { polyline: [...], distanceMeters: 4200, durationSeconds: 780, distanceText: '4.2 km', durationText: '13 mins' }
  ```

Internally, `geocodeResultToPickedLocation()` is a private helper that picks
the right `address_components` entries (`route` → street, `locality` →
city, `administrative_area_level_1` → state, `postal_code` → postal code) —
shared by `geocode` and `placeDetails`.

---

## `src/hooks/` — React hooks

### `src/hooks/useCurrentLocation.ts`

Wraps `expo-location` permission request + `getCurrentPositionAsync`, and
optionally reverse-geocodes the result via `useReverseGeocode`.

```ts
function useCurrentLocation(options?: {
  autoRequest?: boolean;     // default true — fetch on mount
  accuracy?: Location.LocationAccuracy; // default Balanced
  resolveAddress?: boolean;  // default true — also reverse-geocode
}): {
  location: ResolvedLocation | null;
  loading: boolean;
  error: Error | null;
  permissionGranted: boolean | null;
  refresh: () => Promise<void>;
}
```

**Example — auto-fetch on mount (default), with address:**

```tsx
function CurrentLocationBadge() {
  const { location, loading, error } = useCurrentLocation();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Couldn't get location: {error.message}</Text>;
  return <Text>{location?.formattedAddress ?? 'Unknown'}</Text>;
}
```

**Example — manual trigger, no reverse-geocoding (used by `LocationPicker`'s
"use current location" button):**

```tsx
const { location, refresh } = useCurrentLocation({ autoRequest: false, resolveAddress: false });

<Button title="Use my location" onPress={refresh} />
// once `location` updates, location.latitude / location.longitude are populated
```

### `src/hooks/useWatchLocation.ts`

Continuous location tracking via `Location.watchPositionAsync` — intended for
a delivery partner's live order-tracking screen. Manages permission request,
subscription lifecycle, and cleanup automatically.

```ts
function useWatchLocation(options?: {
  accuracy?: Location.LocationAccuracy;  // default BestForNavigation
  timeInterval?: number;                 // default 3000 ms
  distanceInterval?: number;             // default 10 m
  enabled?: boolean;                     // default true — set false to pause
}): {
  location: WatchedLocation | null; // { latitude, longitude, heading?, speed?, timestamp }
  error: Error | null;
  isWatching: boolean;
}
```

**Example:**

```tsx
function DeliveryTrackingScreen() {
  const [tracking, setTracking] = useState(true);
  const { location, isWatching, error } = useWatchLocation({ enabled: tracking });

  return (
    <>
      <LiveTrackingMap
        selfLocation={location}
        selfHeading={location?.heading}
        destination={customerAddress}
      />
      <Button title={isWatching ? 'Pause tracking' : 'Resume'} onPress={() => setTracking((t) => !t)} />
    </>
  );
}
```

### `src/hooks/useReverseGeocode.ts` (native) / `useReverseGeocode.web.ts` (web)

Two implementations of the same hook, selected automatically by Metro's
platform-extension resolution:

- **Native** (`useReverseGeocode.ts`) uses `expo-location.reverseGeocodeAsync`
  — fast, works without a network round-trip to Google.
- **Web** (`useReverseGeocode.web.ts`) falls back to
  `googleMapsClient.geocode()` (the Geocoding REST API), because
  `expo-location`'s reverse geocoding isn't available on web. It re-exports
  the same `UseReverseGeocodeResult` type as the native file so callers don't
  need to care which one is active.

```ts
function useReverseGeocode(coordinates: Coordinates | null): {
  result: ResolvedLocation | null;
  loading: boolean;
  error: Error | null;
}
```

Passing `null` clears the result (no request is made). The hook re-runs
whenever `coordinates.latitude` / `coordinates.longitude` change.

**Example:**

```tsx
const [tapped, setTapped] = useState<Coordinates | null>(null);
const { result, loading } = useReverseGeocode(tapped);

<AppMap region={region} onMapPress={setTapped} />
{loading && <ActivityIndicator />}
{result && <Text>{result.formattedAddress}</Text>}
```

### `src/hooks/usePlacesAutocomplete.ts`

Debounced Places Autocomplete search box logic — manages the query string,
debounced fetch, suggestion list, and session-token lifecycle for billing.

```ts
function usePlacesAutocomplete(options?: {
  debounceMs?: number;   // default 300
  components?: string;   // e.g. 'country:in'
}): {
  query: string;
  setQuery: (value: string) => void;
  suggestions: PlaceSuggestion[];
  loading: boolean;
  error: Error | null;
  selectSuggestion: (placeId: string) => Promise<PickedLocation | null>;
  clear: () => void;
}
```

This is the hook behind `SearchBox`, but can be used standalone for a custom
search UI.

**Example:**

```tsx
const { query, setQuery, suggestions, selectSuggestion, clear } = usePlacesAutocomplete({ components: 'country:in' });

<TextInput value={query} onChangeText={setQuery} placeholder="Search address" />
<FlatList
  data={suggestions}
  keyExtractor={(s) => s.placeId}
  renderItem={({ item }) => (
    <Pressable onPress={async () => {
      const location = await selectSuggestion(item.placeId);
      if (location) recenterMapTo(location);
      clear();
    }}>
      <Text>{item.description}</Text>
    </Pressable>
  )}
/>
```

### `src/hooks/useDirections.ts`

Fetches a route between two points and keeps it up to date as `origin` moves,
without spamming the Directions API on every tiny GPS jitter.

```ts
function useDirections(
  origin: Coordinates | null,
  destination: Coordinates | null,
  options?: {
    mode?: DirectionsMode;               // default 'driving'
    refetchThresholdMeters?: number;     // default 50
  },
): {
  directions: DirectionsResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

Behavior:
- If `origin` or `destination` is `null`, `directions` is cleared to `null` and
  no request is made.
- On first fetch (or whenever `origin` has moved ≥ `refetchThresholdMeters`
  since the last successful fetch — measured via `haversineDistanceKm`), it
  calls `googleMapsClient.directions()`.
- `refetch()` forces a re-fetch on the next render regardless of distance
  (resets the internal "last origin" tracking).

**Example (this is exactly how `LiveTrackingMap` uses it internally):**

```tsx
const { directions, loading } = useDirections(deliveryPartnerLocation, storeLocation, {
  mode: 'two_wheeler',
  refetchThresholdMeters: 100,
});

{directions && (
  <Text>{directions.distanceText} · {directions.durationText}</Text>
)}
```

---

## `src/components/` — UI components

### `src/components/AppMap.types.ts`

Shared prop types for `AppMap`, used by both the native (`AppMap.tsx`) and web
(`AppMap.web.tsx`) implementations so they present an identical API to callers.

```ts
interface AppMapRef {
  animateToRegion: (region: Region, durationMs?: number) => void;
}

interface AppMapProps {
  region: Region;
  onRegionChangeComplete?: (region: Region) => void;
  markers?: MapMarkerData[];
  polylines?: MapPolylineData[];
  circles?: MapCircleData[];
  onMapPress?: (coordinate: Coordinates) => void;
  onMarkerPress?: (markerId: string) => void;
  onMarkerDragEnd?: (markerId: string, coordinate: Coordinates) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mapRef?: RefObject<AppMapRef | null>;
  children?: ReactNode;
}
```

### `src/components/AppMap.tsx` (native) / `AppMap.web.tsx` (web)

The core cross-platform map view — the foundation everything else (`LocationPicker`,
`LiveTrackingMap`) is built on. Same props on both platforms; Metro picks the
right file automatically based on platform.

- **Native (`AppMap.tsx`)**: thin wrapper around `react-native-maps`'
  `<MapView provider={PROVIDER_GOOGLE}>`. Renders `markers`/`polylines`/`circles`
  arrays as `<Marker>`/`<Polyline>`/`<Circle>`, plus `{children}` for ad-hoc
  overlays. The `mapRef` (if provided) is bridged to expose
  `animateToRegion(region, durationMs)`, calling the underlying `MapView`
  instance's `animateToRegion`.

- **Web (`AppMap.web.tsx`)**: uses `@react-google-maps/api`'s `useJsApiLoader`
  (with `getMapsConfig().googleMapsWebApiKey`) + `<GoogleMap>`. Since the
  Google Maps JS API uses `center` + `zoom` rather than `Region`'s
  lat/lng-delta model, it converts between the two using `regionToZoom` /
  `centerZoomToRegion` from `utils/geo.ts`. `onRegionChangeComplete` fires from
  the map's `onIdle` event; `onMapPress` from `onClick`. While the script is
  loading, it renders an empty `<div>` matching the requested size.

**Example — a minimal read-only map:**

```tsx
import { AppMap } from '@ecommerce/maps';

<AppMap
  region={{ latitude: 17.385, longitude: 78.4867, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
  markers={[{ id: 'store', latitude: 17.385, longitude: 78.4867, kind: 'store', title: 'My Store' }]}
  zoomEnabled={false}
  scrollEnabled={false}
  style={{ height: 200, borderRadius: 12 }}
/>
```

**Example — interactive map with ref-based recenter:**

```tsx
const mapRef = useRef<AppMapRef | null>(null);

<AppMap region={region} mapRef={mapRef} onRegionChangeComplete={setRegion} onMapPress={(coord) => console.log(coord)} />
<RecenterButton onPress={() => mapRef.current?.animateToRegion(homeRegion)} />
```

### `src/components/AppMapMarker.tsx` / `.web.tsx`, `AppMapPolyline.tsx` / `.web.tsx`, `AppMapCircle.tsx` / `.web.tsx`

Platform-specific wrappers around a single marker / polyline / circle, for
callers who need to render one as a JSX `child` of `AppMap` (e.g. for
fine-grained press/drag handling) instead of via the declarative
`markers`/`polylines`/`circles` array props. `AppMap` itself uses the same
underlying primitives internally for its array props.

| File | Native renders | Web renders |
| --- | --- | --- |
| `AppMapMarker` | `react-native-maps`' `<Marker>` | `@react-google-maps/api`'s `<MarkerF>` |
| `AppMapPolyline` | `<Polyline>` | `<PolylineF>` |
| `AppMapCircle` | `<Circle>` | `<CircleF>` |

All three take a single data prop (`marker` / `polyline` / `circle`, typed as
`MapMarkerData` / `MapPolylineData` / `MapCircleData`) and apply sensible
defaults for colors (`#2563EB` stroke, light blue fill) and stroke width (`4`).

**Example — a draggable marker as a child:**

```tsx
<AppMap region={region}>
  <AppMapMarker
    marker={{ id: 'pin', latitude: region.latitude, longitude: region.longitude, draggable: true }}
    onDragEnd={(coord) => setRegion((r) => ({ ...r, ...coord }))}
  />
</AppMap>
```

### `src/components/RecenterButton.tsx`

A small floating circular `Pressable` button (default label `'◎'`), positioned
`absolute` at the bottom-right of its container. Purely presentational — the
caller supplies `onPress` (typically calling `mapRef.current?.animateToRegion(...)`
or `useCurrentLocation().refresh`).

```tsx
export interface RecenterButtonProps {
  onPress: () => void;
  label?: string; // default '◎'
}
```

**Example:**

```tsx
<RecenterButton onPress={() => mapRef.current?.animateToRegion(selfRegion)} />
<RecenterButton label="📍" onPress={refreshCurrentLocation} />
```

### `src/components/SearchBox.tsx`

A floating search input (top of the map) backed by `usePlacesAutocomplete`:
a `TextInput` + a dropdown `FlatList` of suggestions. Shows a small
`ActivityIndicator` while searching or resolving a selection. On selecting a
suggestion, it resolves full place details and calls `onSelect`, then clears
the query.

```ts
export interface SearchBoxProps {
  placeholder?: string;             // default 'Search for a place'
  onSelect: (location: PickedLocation, suggestion: PlaceSuggestion) => void;
}
```

**Example:**

```tsx
<SearchBox
  placeholder="Search for your address"
  onSelect={(location) => {
    setRegion({ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  }}
/>
```

(This is what `LocationPicker` renders when `showSearch` is true.)

### `src/components/LocationPicker.tsx`

The main "pick or display an address on a map" composed component. Two modes
controlled by `readOnly`:

```ts
export interface LocationPickerProps {
  initialLocation?: Coordinates;
  readOnly?: boolean;                 // default false
  radiusMeters?: number;              // readOnly only — draws a delivery-radius circle
  onConfirm?: (location: PickedLocation) => void;
  onLocationChange?: (location: PickedLocation) => void; // fires as the map settles, before confirm
  showCurrentLocationButton?: boolean; // default !readOnly
  showSearch?: boolean;                // default !readOnly
  height?: DimensionValue;             // default 280
  confirmLabel?: string;               // default 'Confirm location'
}
```

**Editable mode (`readOnly: false`, the default)** — a "drag the map under a
fixed center pin" UX (consistent cross-platform, avoids native drag-marker
quirks):
1. A 📍 pin is rendered fixed in the center of the map view (`pointerEvents="none"`).
2. As the user pans the map, `onRegionChangeComplete` updates `region`, and
   `useReverseGeocode` resolves the new center into an address — calling
   `onLocationChange` with the result.
3. `SearchBox` (if `showSearch`) lets the user jump to a searched address,
   recentering the map there.
4. A "use current location" `RecenterButton` (📍) calls
   `useCurrentLocation().refresh`; once resolved, the map recenters there
   (`mapRef.current?.animateToRegion`).
5. A "Confirm location" button (shown if `onConfirm` is provided) is disabled
   until reverse-geocoding has resolved, then calls `onConfirm` with the final
   `PickedLocation`.

**Read-only mode (`readOnly: true`)** — a static display, e.g. "view store
location":
- Map is non-interactive (`zoomEnabled={false} scrollEnabled={false}`).
- A single static marker (`kind: 'pin'`) at `initialLocation`.
- If `radiusMeters` is provided, draws a circle of that radius centered on
  `initialLocation` (e.g. visualizing a store's delivery zone).
- No search box, no current-location button, no confirm button, no
  reverse-geocoding.

**Example — customer address form (editable, future integration):**

```tsx
<LocationPicker
  initialLocation={existingAddress ?? undefined}
  height={300}
  onConfirm={(picked) => {
    setForm((f) => ({ ...f, ...pickedLocationToAddressFields(picked) }));
  }}
/>
```

**Example — merchant "store info" read-only view with delivery radius:**

```tsx
<LocationPicker
  readOnly
  initialLocation={{ latitude: shop.latitude, longitude: shop.longitude }}
  radiusMeters={parseFloat(shop.delivery_radius_km) * 1000}
  height={220}
/>
```

### `src/components/LiveTrackingMap.tsx`

The "live order tracking" composed component — shows a moving marker (e.g. a
delivery partner), a fixed destination marker (e.g. customer or store), the
route between them, and an ETA banner.

```ts
export interface LiveTrackingMapProps {
  selfLocation: Coordinates | null;   // typically from useWatchLocation()
  selfHeading?: number | null;        // rotates the 'self' marker
  destination: Coordinates;
  destinationLabel?: string;
  showRoute?: boolean;                // default true — fetches via useDirections
  directionsMode?: DirectionsMode;    // default 'driving'
  showEtaBanner?: boolean;            // default = showRoute
  showRecenterButton?: boolean;       // default true
  height?: DimensionValue;            // default 320
  onEtaUpdate?: (eta: { distanceText: string; durationText: string }) => void;
}
```

Behavior:
- Map region defaults to `selfLocation` (falling back to `destination` if
  `selfLocation` is `null`, e.g. before the first GPS fix).
- Renders a `self` marker (rotated by `selfHeading`, if provided — e.g. the
  delivery partner's direction of travel) and a `destination` marker (labeled
  with `destinationLabel`).
- If `showRoute`, calls `useDirections(selfLocation, destination, { mode: directionsMode })`
  and renders the decoded polyline.
- If `showEtaBanner`, renders a floating banner with `distanceText · durationText`
  (e.g. "4.2 km · 13 mins").
- `onEtaUpdate` is called (via `useEffect`) whenever the directions result
  updates — useful for e.g. pushing the ETA into a parent screen's header.
- A `RecenterButton` (if `showRecenterButton` and `selfLocation` is present)
  re-centers the map on `selfLocation` via `mapRef.current?.animateToRegion`.

**Example — delivery partner's order tracking screen (future integration):**

```tsx
function OrderTrackingScreen({ order }: { order: Order }) {
  const { location } = useWatchLocation();

  return (
    <LiveTrackingMap
      selfLocation={location}
      selfHeading={location?.heading}
      destination={{ latitude: order.customer_latitude, longitude: order.customer_longitude }}
      destinationLabel="Customer"
      directionsMode="two_wheeler"
      onEtaUpdate={(eta) => updateOrderEta(order.id, eta)}
    />
  );
}
```

**Example — customer-facing "track your order" view (self = delivery partner,
fetched from backend rather than `useWatchLocation`):**

```tsx
<LiveTrackingMap
  selfLocation={deliveryPartnerLocation}
  destination={{ latitude: shop.latitude, longitude: shop.longitude }}
  destinationLabel="Pickup: Store"
  showRecenterButton={false}
/>
```

---

## File-resolution summary

| Suffix-less import | Native resolves to | Web resolves to |
| --- | --- | --- |
| `./AppMap` | `AppMap.tsx` (`react-native-maps`) | `AppMap.web.tsx` (`@react-google-maps/api`) |
| `./AppMapMarker` | `AppMapMarker.tsx` | `AppMapMarker.web.tsx` |
| `./AppMapPolyline` | `AppMapPolyline.tsx` | `AppMapPolyline.web.tsx` |
| `./AppMapCircle` | `AppMapCircle.tsx` | `AppMapCircle.web.tsx` |
| `useReverseGeocode` | `useReverseGeocode.ts` (`expo-location`) | `useReverseGeocode.web.ts` (`googleMapsClient`) |

`LocationPicker`, `LiveTrackingMap`, `SearchBox`, `RecenterButton`, hooks
(other than `useReverseGeocode`), `googleMapsClient`, and all `utils/` have a
single shared implementation used on every platform.
