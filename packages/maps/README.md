# @ecommerce/maps

Shared Google Maps components and hooks for the customer, merchant, and delivery apps.

## Platform implementation

- Native (Android/iOS): `react-native-maps` with `PROVIDER_GOOGLE`.
- Web: `@react-google-maps/api` (Google Maps JavaScript API), via `.web.tsx` platform files.

This package ships TypeScript source only (no build step) — consuming apps resolve
`src/**` directly through Metro.

## Configuration

Call `configureMaps()` once (e.g. in an app's root layout) to set a default region, or rely on
the `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` / `EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY` env vars.

## Google Maps API keys

This package needs **up to four separate API keys**, each with a different restriction type in
the Google Cloud Console:

| Key | Used for | Restrict to |
| --- | --- | --- |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Geocoding, Places, Directions REST APIs (`googleMapsClient`) | Geocoding API, Places API, Directions API |
| `EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY` | Maps JavaScript API (`AppMap.web.tsx`) | Maps JavaScript API + HTTP referrer |
| `ANDROID_GOOGLE_MAPS_API_KEY` | Native Android Maps SDK (`app.config` `android.config.googleMaps.apiKey`) | Maps SDK for Android + package name/SHA-1 |
| `IOS_GOOGLE_MAPS_API_KEY` | Native iOS Maps SDK (`app.config` `ios.config.googleMapsApiKey`) | Maps SDK for iOS + bundle ID |

The `EXPO_PUBLIC_*` keys are inlined into the JS bundle and sent from the client — restrict them
tightly. The native keys are config-time only and must **not** use the `EXPO_PUBLIC_` prefix.

## Peer dependencies

`react-native-maps` and `expo-location` have native code and must be installed directly by each
consuming app (matching the versions declared in `peerDependencies`) so Expo's autolinking and
config plugins pick them up. `react-native-maps` requires a custom dev client — it does not run
in Expo Go.

## Exports

- `AppMap`, `AppMapMarker`, `AppMapPolyline`, `AppMapCircle` — low-level cross-platform map primitives.
- `LocationPicker` — search + drag-to-pin address picker (also supports a `readOnly` display mode).
- `LiveTrackingMap` — live position + destination + route/ETA for order tracking.
- `useCurrentLocation`, `useWatchLocation`, `useReverseGeocode`, `usePlacesAutocomplete`, `useDirections`.
- `googleMapsClient`, geo/polyline utilities, `pickedLocationToAddressFields`.
