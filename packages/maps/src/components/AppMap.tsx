import { StyleSheet } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { getMapsConfig } from '../config';
import type { AppMapProps } from './AppMap.types';

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
  showsUserLocation,
  followsUserLocation,
  zoomEnabled = true,
  scrollEnabled = true,
  style,
  mapRef,
  mapId,
  colorScheme = 'light',
  children,
}: AppMapProps) {
  return (
    <MapView
      ref={(instance) => {
        if (!mapRef) return;
        mapRef.current = instance
          ? {
              animateToRegion: (nextRegion, duration) =>
                instance.animateToRegion(nextRegion, duration ?? 300),
            }
          : null;
      }}
      provider={PROVIDER_GOOGLE}
      googleMapId={mapId ?? getMapsConfig().mapId}
      userInterfaceStyle={colorScheme}
      style={[StyleSheet.absoluteFill, style]}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
      onRegionChange={onRegionChange}
      minZoomLevel={minZoomLevel}
      maxZoomLevel={maxZoomLevel}
      onPress={(event) => onMapPress?.(event.nativeEvent.coordinate)}
      showsUserLocation={showsUserLocation}
      followsUserLocation={followsUserLocation}
      zoomEnabled={zoomEnabled}
      scrollEnabled={scrollEnabled}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker}
          title={marker.title}
          description={marker.description}
          draggable={marker.draggable}
          rotation={marker.rotation}
          onPress={() => onMarkerPress?.(marker.id)}
          onDragEnd={(event) => onMarkerDragEnd?.(marker.id, event.nativeEvent.coordinate)}
        />
      ))}
      {polylines.map((polyline) => (
        <Polyline
          key={polyline.id}
          coordinates={polyline.coordinates}
          strokeColor={polyline.strokeColor ?? '#2563EB'}
          strokeWidth={polyline.strokeWidth ?? 4}
        />
      ))}
      {circles.map((circle) => (
        <Circle
          key={circle.id}
          center={circle.center}
          radius={circle.radiusMeters}
          strokeColor={circle.strokeColor ?? 'rgba(37, 99, 235, 0.5)'}
          fillColor={circle.fillColor ?? 'rgba(37, 99, 235, 0.1)'}
        />
      ))}
      {children}
    </MapView>
  );
}
