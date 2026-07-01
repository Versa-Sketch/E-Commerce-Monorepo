import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../Common/Constants';
import { AppInterceptor } from './interceptors/types';
import { authInterceptor } from './interceptors/authInterceptor';
import { makeTokenRefreshInterceptor } from './interceptors/tokenRefreshInterceptor';
import { errorInterceptor } from './interceptors/errorInterceptor';

const client: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

function use(interceptor: AppInterceptor): void {
  if (interceptor.type === 'request') {
    client.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
  } else {
    client.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
  }
}

use(authInterceptor);
use(makeTokenRefreshInterceptor(client));
use(errorInterceptor);

export const AppClient = client;
export default AppClient;
