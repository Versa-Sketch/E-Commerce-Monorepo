import { InternalAxiosRequestConfig } from 'axios';
import { StorageService } from '../../services/storage';
import { STORAGE_KEYS } from '../../Common/Constants';
import { RequestInterceptor } from './types';

export const authInterceptor: RequestInterceptor = {
  type: 'request',
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
};
