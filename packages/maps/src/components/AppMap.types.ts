import type { ReactNode, RefObject } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Coordinates, MapCircleData, MapMarkerData, MapPolylineData, Region } from '../types';

export interface AppMapRef {
  animateToRegion: (region: Region, durationMs?: number) => void;
}

export interface AppMapProps {
  region: Region;
  onRegionChangeComplete?: (region: Region) => void;
  /** Fires continuously while the map is being panned/zoomed (before it settles) */
  onRegionChange?: (region: Region) => void;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  markers?: MapMarkerData[];
  polylines?: MapPolylineData[];
  circles?: MapCircleData[];
  onMapPress?: (coordinate: Coordinates) => void;
  onMarkerPress?: (markerId: string) => void;
  onMarkerDragEnd?: (markerId: string, coordinate: Coordinates) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mapRef?: RefObject<AppMapRef | null>;
  /** Override the configured Cloud-based Map Styling (CBMS) Map ID for this map */
  mapId?: string;
  /** Force the map's light/dark appearance, overriding the device theme. Defaults to 'light'. */
  colorScheme?: 'light' | 'dark';
  children?: ReactNode;
}
