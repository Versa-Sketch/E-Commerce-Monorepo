import type { PickedLocation } from '../types';

export interface AddressFields {
  latitude: number;
  longitude: number;
  state?: string;
  pincode?: string;
  address_line1?: string;
}

/**
 * Maps a PickedLocation (from LocationPicker) into the field names used by
 * AddressInput (apps/customer/src/types/shared.ts), without this package
 * depending on that app-level type.
 */
export function pickedLocationToAddressFields(location: PickedLocation): AddressFields {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    state: location.state,
    pincode: location.postalCode,
    address_line1: location.formattedAddress ?? location.street,
  };
}
