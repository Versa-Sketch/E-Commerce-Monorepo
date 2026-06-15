import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../../constants';
import { StorageService } from '../storage';
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use(
  (config) => {
    const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          // Attempt refresh
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
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed, forcing logout.', refreshError);
        StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
        StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
        StorageService.delete(STORAGE_KEYS.USER_DATA);
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;
