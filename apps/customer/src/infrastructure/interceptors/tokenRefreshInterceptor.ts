import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { StorageService } from '../../services/storage';
import { STORAGE_KEYS, API_CONFIG } from '../../Common/Constants';
import { getAuthStoreInstance } from '../../features/Auth/Providers/authStoreInstance';
import { ResponseInterceptor } from './types';

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function redirectToLogin(): void {
  const authStore = getAuthStoreInstance();
  if (authStore) {
    authStore.clearSession();
  } else {
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
    StorageService.delete(STORAGE_KEYS.USER_DATA);
  }
  router.replace('/landing');
}

export function makeTokenRefreshInterceptor(client: AxiosInstance): ResponseInterceptor {
  return {
    type: 'response',
    onRejected: async (error: unknown) => {
      const axiosError = error as AxiosError & { config: RetryableConfig };
      const originalRequest = axiosError.config;

      if (axiosError.response?.status === 401 && originalRequest) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken, newRefreshToken } = response.data;
              StorageService.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
              if (newRefreshToken) {
                StorageService.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              }
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return client(originalRequest);
            } catch {
              redirectToLogin();
              return Promise.reject(error);
            }
          }
          redirectToLogin();
          return Promise.reject(error);
        }
        redirectToLogin();
      }
      return Promise.reject(error);
    },
  };
}
