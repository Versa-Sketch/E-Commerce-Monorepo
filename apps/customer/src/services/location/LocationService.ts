import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface IUserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  formattedAddress?: string;
  updatedAt: number;
}

export const LocationService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },

  async getCurrentCoordinates(): Promise<Coordinates> {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<Partial<IUserLocation>> {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (!result || result.length === 0) {
      return {};
    }
    const place = result[0];
    return {
      city: place.city || '',
      district: place.district || '',
      street: place.street || '',
      postalCode: place.postalCode || '',
      formattedAddress: [
        place.street,
        place.city,
        place.region,
      ]
        .filter(Boolean)
        .join(', '),
    };
  },

  calculateDistance: (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  },

  isWithinBounds: (clientLoc: Coordinates, storeLoc: Coordinates, radiusLimitKm = 5.0): boolean => {
    return LocationService.calculateDistance(clientLoc, storeLoc) <= radiusLimitKm;
  },
};

export default LocationService;
