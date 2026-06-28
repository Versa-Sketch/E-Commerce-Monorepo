import { http, ApiEnvelope } from './http';

export interface DeliveryPartnerLocation {
  partner_id: string;
  latitude: string;
  longitude: string;
}

export function updatePartnerLocation(
  latitude: number,
  longitude: number
): Promise<ApiEnvelope<DeliveryPartnerLocation>> {
  return http.patch<DeliveryPartnerLocation>('/delivery-partners/me/location/', { latitude, longitude });
}
