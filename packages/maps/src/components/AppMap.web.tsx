import { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { getMapsConfig } from '../config';
import { centerZoomToRegion, regionToZoom } from '../utils/geo';
import type { AppMapProps } from './AppMap.types';
import { AppMapCircle } from './AppMapCircle';
import { AppMapMarker } from './AppMapMarker';
import { AppMapPolyline } from './AppMapPolyline';

const containerStyle = { width: '100%', height: '100%' };

export function AppMap({
  region,
  onRegionChangeComplete,
  onRegionChange,
  minZoomLevel,
  maxZoomLevel,
  markers = [],
  polylines = [],
  circles = [],
  onMapPress,
  onMarkerPress,
  onMarkerDragEnd,
  zoomEnabled = true,
  scrollEnabled = true,
  style,
  mapRef,
  mapId,
  colorScheme = 'light',
  children,
}: AppMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'ecommerce-google-map-script',
    googleMapsApiKey: getMapsConfig().googleMapsWebApiKey ?? '',
    mapIds: [mapId ?? getMapsConfig().mapId ?? ''].filter(Boolean),
  });
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const handleLoad = useCallback(
    (map: google.maps.Map) => {
      mapInstanceRef.current = map;
      if (mapRef) {
        mapRef.current = {
          animateToRegion: (nextRegion) => {
            map.panTo({ lat: nextRegion.latitude, lng: nextRegion.longitude });
            map.setZoom(regionToZoom(nextRegion));
          },
        };
      }
    },
    [mapRef],
  );

  const handleIdle = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !onRegionChangeComplete) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    if (!center || zoom === undefined) return;
    onRegionChangeComplete(centerZoomToRegion({ latitude: center.lat(), longitude: center.lng() }, zoom));
  }, [onRegionChangeComplete]);

  const handleDrag = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !onRegionChange) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    if (!center || zoom === undefined) return;
    onRegionChange(centerZoomToRegion({ latitude: center.lat(), longitude: center.lng() }, zoom));
  }, [onRegionChange]);

  if (!isLoaded) {
    return <div style={{ ...containerStyle, ...(style as object) }} />;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ ...containerStyle, ...(style as object) }}
      center={{ lat: region.latitude, lng: region.longitude }}
      zoom={regionToZoom(region)}
      onLoad={handleLoad}
      onIdle={handleIdle}
      onDrag={handleDrag}
      onClick={(event) => {
        if (event.latLng) {
          onMapPress?.({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
        }
      }}
      options={{
        zoomControl: zoomEnabled,
        scrollwheel: scrollEnabled,
        gestureHandling: scrollEnabled ? 'auto' : 'none',
        mapId: mapId ?? getMapsConfig().mapId,
        colorScheme: colorScheme.toUpperCase() as google.maps.ColorScheme,
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel,
      }}
    >
      {markers.map((marker) => (
        <AppMapMarker
          key={marker.id}
          marker={marker}
          onPress={() => onMarkerPress?.(marker.id)}
          onDragEnd={(coordinate) => onMarkerDragEnd?.(marker.id, coordinate)}
        />
      ))}
      {polylines.map((polyline) => (
        <AppMapPolyline key={polyline.id} polyline={polyline} />
      ))}
      {circles.map((circle) => (
        <AppMapCircle key={circle.id} circle={circle} />
      ))}
      {children}
    </GoogleMap>
  );
}
