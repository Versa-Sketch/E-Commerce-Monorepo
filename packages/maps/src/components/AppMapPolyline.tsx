import { Polyline } from 'react-native-maps';
import type { MapPolylineData } from '../types';

export interface AppMapPolylineProps {
  polyline: MapPolylineData;
}

export function AppMapPolyline({ polyline }: AppMapPolylineProps) {
  return (
    <Polyline
      coordinates={polyline.coordinates}
      strokeColor={polyline.strokeColor ?? '#2563EB'}
      strokeWidth={polyline.strokeWidth ?? 4}
    />
  );
}
