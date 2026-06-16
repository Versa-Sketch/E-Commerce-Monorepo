import { Marker } from 'react-native-maps';
import type { Coordinates, MapMarkerData } from '../types';

export interface AppMapMarkerProps {
  marker: MapMarkerData;
  onPress?: () => void;
  onDragEnd?: (coordinate: Coordinates) => void;
}

export function AppMapMarker({ marker, onPress, onDragEnd }: AppMapMarkerProps) {
  return (
    <Marker
      coordinate={marker}
      title={marker.title}
      description={marker.description}
      draggable={marker.draggable}
      rotation={marker.rotation}
      onPress={onPress}
      onDragEnd={(event) => onDragEnd?.(event.nativeEvent.coordinate)}
    />
  );
}
