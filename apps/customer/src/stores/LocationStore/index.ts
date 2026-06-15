import { makeAutoObservable, runInAction } from 'mobx';
import { StorageService } from '../../services/storage';
import { IUserLocation, LocationService } from '../../services/location/LocationService';
import { STORAGE_KEYS } from '../../Common/Constants';

const TEN_MINUTES = 10 * 60 * 1000;

class LocationStore {
  location: IUserLocation | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  hydrate() {
    const cached = StorageService.getObject<IUserLocation>(STORAGE_KEYS.USER_LOCATION);
    if (cached) {
      this.location = cached;
    }
  }

  async refreshLocation() {
    try {
      this.loading = true;

      // 1. Check TTL: if cache is fresh (less than 10 minutes old), skip GPS request
      const cached = StorageService.getObject<IUserLocation>(STORAGE_KEYS.USER_LOCATION);
      if (cached && Date.now() - cached.updatedAt < TEN_MINUTES) {
        runInAction(() => {
          this.location = cached;
        });
        return;
      }

      // 2. Request permission
      const granted = await LocationService.requestPermission();
      if (!granted) {
        return;
      }

      // 3. Get coordinates
      const coords = await LocationService.getCurrentCoordinates();

      // 4. Check significant movement (threshold: > 0.001 delta, ~110m)
      const oldLat = cached?.latitude ?? 0;
      const oldLng = cached?.longitude ?? 0;
      const movedSignificantly =
        !cached ||
        Math.abs(oldLat - coords.latitude) > 0.001 ||
        Math.abs(oldLng - coords.longitude) > 0.001;

      let address: Partial<IUserLocation> = {};
      if (movedSignificantly) {
        try {
          address = await LocationService.reverseGeocode(coords.latitude, coords.longitude);
        } catch (geocodeErr) {
          console.warn('Reverse geocoding failed, falling back to coordinates only', geocodeErr);
          // Keep old address if available, otherwise fallback to basic label
          address = {
            city: cached?.city || '',
            district: cached?.district || '',
            street: cached?.street || '',
            postalCode: cached?.postalCode || '',
            formattedAddress: cached?.formattedAddress || `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`,
          };
        }
      } else {
        // Reuse old address details
        address = {
          city: cached.city,
          district: cached.district,
          street: cached.street,
          postalCode: cached.postalCode,
          formattedAddress: cached.formattedAddress,
        };
      }

      const newLocation: IUserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        ...address,
        updatedAt: Date.now(),
      };

      runInAction(() => {
        this.location = newLocation;
      });

      StorageService.setObject(STORAGE_KEYS.USER_LOCATION, newLocation);
    } catch (e) {
      console.error('refreshLocation error:', e);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const locationStore = new LocationStore();
