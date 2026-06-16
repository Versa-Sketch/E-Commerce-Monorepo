import { PolylineF } from '@react-google-maps/api';
import type { MapPolylineData } from '../types';

export interface AppMapPolylineProps {
  polyline: MapPolylineData;
}

export function AppMapPolyline({ polyline }: AppMapPolylineProps) {
  return (
    <PolylineF
      path={polyline.coordinates.map((coord) => ({ lat: coord.latitude, lng: coord.longitude }))}
      options={{
        strokeColor: polyline.strokeColor ?? '#2563EB',
        strokeWeight: polyline.strokeWidth ?? 4,
      }}
    />
  );
}
