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

      const cached = StorageService.getObject<IUserLocation>(STORAGE_KEYS.USER_LOCATION);

      // 1. Request permission first so we can compare fresh coords against cache
      const granted = await LocationService.requestPermission();
      if (!granted) {
        // Fall back to cached location if permission denied
        if (cached) runInAction(() => { this.location = cached; });
        return;
      }

      // 2. Get accurate coordinates (waits for ≤15m fix, 10s timeout)
      const coords = await LocationService.getAccurateCoordinates();

      // 3. Check TTL + distance — bypass cache if user moved > 200m
      const cacheAge = cached ? Date.now() - cached.updatedAt : Infinity;
      const distanceMoved = cached
        ? LocationService.calculateDistance(cached, coords)
        : Infinity;

      if (cached && cacheAge < TEN_MINUTES && distanceMoved < 0.2) {
        runInAction(() => { this.location = cached; });
        return;
      }

      // 4. Check significant movement for reverse geocoding (> ~110m)
      const movedSignificantly =
        !cached ||
        Math.abs((cached.latitude ?? 0) - coords.latitude) > 0.001 ||
        Math.abs((cached.longitude ?? 0) - coords.longitude) > 0.001;

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
