import axios from 'axios';
import { http, ApiError } from './http';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { StorageService } from './storage';
import {
  AcceptedOrderData,
  OtpVerifyResponse,
  PhotoUploadResponse,
  CompleteDeliveryResponse,
} from '../types/dispatch';

const BASE = '/logistics/orders';

export const DispatchService = {
  acceptOffer(orderId: string) {
    return http.post<AcceptedOrderData>(`${BASE}/${orderId}/delivery-offer/accept/`, {});
  },

  declineOffer(orderId: string) {
    return http.post<Record<string, never>>(`${BASE}/${orderId}/delivery-offer/decline/`, {});
  },

  verifyPickupOtp(orderId: string, otp: string) {
    return http.post<OtpVerifyResponse>(`${BASE}/${orderId}/verify-pickup-otp/`, { otp });
  },

  async uploadPhotos(orderId: string, photoUris: string[]): Promise<{ data: PhotoUploadResponse }> {
    const form = new FormData();
    photoUris.forEach((uri, i) => {
      form.append('photos', {
        uri,
        name: `order_photo_${i + 1}.jpg`,
        type: 'image/jpeg',
      } as any);
    });
    const token = await StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
    try {
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}${BASE}/${orderId}/photos/`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      return { data: res.data.data as PhotoUploadResponse };
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Photo upload failed.';
      throw new ApiError(msg, err?.response?.status);
    }
  },

  completeDelivery(orderId: string) {
    return http.post<CompleteDeliveryResponse>(`${BASE}/${orderId}/complete/`, {});
  },
};
