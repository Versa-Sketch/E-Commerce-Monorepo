import { Circle } from 'react-native-maps';
import type { MapCircleData } from '../types';

export interface AppMapCircleProps {
  circle: MapCircleData;
}

export function AppMapCircle({ circle }: AppMapCircleProps) {
  return (
    <Circle
      center={circle.center}
      radius={circle.radiusMeters}
      strokeColor={circle.strokeColor ?? 'rgba(37, 99, 235, 0.5)'}
      fillColor={circle.fillColor ?? 'rgba(37, 99, 235, 0.1)'}
    />
  );
}
