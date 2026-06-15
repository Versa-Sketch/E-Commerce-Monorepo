import { locationStore } from '../stores/LocationStore';

export const useCurrentLocation = () => {
  return {
    location: locationStore.location,
    loading: locationStore.loading,
    refreshLocation: () => locationStore.refreshLocation(),
  };
};
