import type { PickedLocation } from '@ecommerce/maps';
import type { AddressType } from '../../../types/shared';

/**
 * Minimal one-shot bridge for passing a map-picked location back to the
 * address form screen. The map picker screen writes here and navigates back;
 * the form screen reads + clears it in a useFocusEffect.
 */
export interface PendingPickedLocation extends PickedLocation {
  /** House / flat / floor number entered by the user on the map picker */
  flatNo?: string;
  /** Landmark entered by the user on the map picker */
  landmark?: string;
  addressType?: AddressType;
}

let pendingLocation: PendingPickedLocation | null = null;

export function setPendingPickedLocation(location: PendingPickedLocation): void {
  pendingLocation = location;
}

export function consumePendingPickedLocation(): PendingPickedLocation | null {
  const location = pendingLocation;
  pendingLocation = null;
  return location;
}
