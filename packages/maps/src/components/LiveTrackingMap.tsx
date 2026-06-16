import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { useDirections } from '../hooks/useDirections';
import type { Coordinates, DirectionsMode, MapMarkerData, MapPolylineData, Region } from '../types';
import { AppMap } from './AppMap';
import type { AppMapRef } from './AppMap.types';
import { RecenterButton } from './RecenterButton';

const DEFAULT_DELTA = { latitudeDelta: 0.02, longitudeDelta: 0.02 };

export interface LiveTrackingMapProps {
  /** the moving marker, e.g. a delivery partner's live position */
  selfLocation: Coordinates | null;
  selfHeading?: number | null;
  /** the static marker, e.g. a store or customer address */
  destination: Coordinates;
  destinationLabel?: string;
  /** fetch and render a route polyline + ETA via the Directions API; default true */
  showRoute?: boolean;
  directionsMode?: DirectionsMode;
  showEtaBanner?: boolean;
  showRecenterButton?: boolean;
  height?: DimensionValue;
  onEtaUpdate?: (eta: { distanceText: string; durationText: string }) => void;
}

export function LiveTrackingMap({
  selfLocation,
  selfHeading,
  destination,
  destinationLabel,
  showRoute = true,
  directionsMode = 'driving',
  showEtaBanner = showRoute,
  showRecenterButton = true,
  height = 320,
  onEtaUpdate,
}: LiveTrackingMapProps) {
  const mapRef = useRef<AppMapRef | null>(null);
  const { directions } = useDirections(selfLocation, showRoute ? destination : null, {
    mode: directionsMode,
  });

  useEffect(() => {
    if (directions && onEtaUpdate) {
      onEtaUpdate({ distanceText: directions.distanceText, durationText: directions.durationText });
    }
  }, [directions, onEtaUpdate]);

  const region: Region = {
    ...(selfLocation ?? destination),
    ...DEFAULT_DELTA,
  };

  const markers: MapMarkerData[] = [
    ...(selfLocation
      ? [{ id: 'self', ...selfLocation, kind: 'self' as const, rotation: selfHeading ?? undefined }]
      : []),
    { id: 'destination', ...destination, kind: 'destination' as const, title: destinationLabel },
  ];

  const polylines: MapPolylineData[] = directions ? [{ id: 'route', coordinates: directions.polyline }] : [];

  const handleRecenter = () => {
    if (selfLocation) {
      mapRef.current?.animateToRegion({ ...selfLocation, ...DEFAULT_DELTA });
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <AppMap region={region} mapRef={mapRef} markers={markers} polylines={polylines} />

      {showRecenterButton && selfLocation && <RecenterButton onPress={handleRecenter} />}

      {showEtaBanner && directions && (
        <View style={styles.etaBanner}>
          <Text style={styles.etaText}>
            {directions.distanceText} · {directions.durationText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  etaBanner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
