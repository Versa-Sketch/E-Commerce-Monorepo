export interface DeliveryOffer {
  offer_id: string;
  order_id: string;
  round_number: number;
  shop_name: string;
  pickup_distance_km: number;
  drop_distance_km: number;
  order_value: string;
  items_count: number;
  expires_at: string;
}

export interface AcceptedOrderData {
  order_id: string;
  shop_name: string;
  shop_latitude: string;
  shop_longitude: string;
  drop_address: string;
}

export interface OfferClosedPayload {
  offer_id: string;
  order_id: string;
  reason: 'ASSIGNED_TO_ANOTHER_PARTNER' | 'ORDER_CANCELLED' | 'CAPACITY_EXCEEDED';
}

export interface OtpVerifyResponse {
  order_id: string;
  verified: boolean;
}

export interface PhotoUploadResponse {
  order_id: string;
  photos_uploaded: number;
}

export interface CompleteDeliveryResponse {
  order_id: string;
  earnings: number;
}

export type WsEventType =
  | 'DELIVERY_OFFER'
  | 'DELIVERY_OFFER_CLOSED'
  | 'ORDER_OUT_FOR_DELIVERY'
  | 'ORDER_DISPATCH_FAILED';

export interface WsMessage<T = unknown> {
  event_type: WsEventType;
  payload: T;
}
