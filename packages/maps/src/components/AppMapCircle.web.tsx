import { CircleF } from '@react-google-maps/api';
import type { MapCircleData } from '../types';

export interface AppMapCircleProps {
  circle: MapCircleData;
}

export function AppMapCircle({ circle }: AppMapCircleProps) {
  return (
    <CircleF
      center={{ lat: circle.center.latitude, lng: circle.center.longitude }}
      radius={circle.radiusMeters}
      options={{
        strokeColor: circle.strokeColor ?? 'rgba(37, 99, 235, 0.5)',
        fillColor: circle.fillColor ?? 'rgba(37, 99, 235, 0.1)',
      }}
    />
  );
}
