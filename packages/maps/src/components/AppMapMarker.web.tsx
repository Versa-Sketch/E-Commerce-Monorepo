import { MarkerF } from '@react-google-maps/api';
import type { Coordinates, MapMarkerData } from '../types';

export interface AppMapMarkerProps {
  marker: MapMarkerData;
  onPress?: () => void;
  onDragEnd?: (coordinate: Coordinates) => void;
}

export function AppMapMarker({ marker, onPress, onDragEnd }: AppMapMarkerProps) {
  return (
    <MarkerF
      position={{ lat: marker.latitude, lng: marker.longitude }}
      title={marker.title}
      draggable={marker.draggable}
      onClick={onPress}
      onDragEnd={(event) => {
        if (event.latLng) {
          onDragEnd?.({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
        }
      }}
    />
  );
}
