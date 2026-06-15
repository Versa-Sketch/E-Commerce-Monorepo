import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { router } from 'expo-router';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS, API_CONFIG } from '../Common/Constants';
import { getAuthStoreInstance } from '../features/Auth/Providers/authStoreInstance';
import axios from 'axios';
function redirectToLogin(): void {
  const authStore = getAuthStoreInstance();
  if (authStore) {
    authStore.clearSession();
  } else {
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
    StorageService.delete(STORAGE_KEYS.USER_DATA);
  }
  router.replace('/auth');
}
export function applyRequestMiddleware(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error)
  );
}
export function applyResponseMiddleware(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
      const originalRequest = error.config;
      if (error.response?.status === 401) {
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
            } catch (refreshError) {
              redirectToLogin();
              return Promise.reject(error);
            }
          }
          redirectToLogin();
          return Promise.reject(error);
        }
        // Already retried once with a refreshed token and still unauthorized.
        redirectToLogin();
      }
      return Promise.reject(error);
    }
  );
}
