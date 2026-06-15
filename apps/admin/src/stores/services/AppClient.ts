import axios, { type AxiosInstance, type AxiosError } from 'axios';

// Single source of truth for authenticated Axios calls. Feature services
// receive this through constructor injection rather than instantiating
// axios directly. There is no backend yet, so feature services currently
// use fixture implementations and never construct this client — it exists
// to give `index.api.ts` implementations a stable shape to target later.
export class AppClient {
  private readonly instance: AxiosInstance;
  private static onUnauthorized?: () => void;

  public static registerUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL ?? '') {
    this.instance = axios.create({ baseURL });

    this.instance.interceptors.request.use(config => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url ?? '';
          const isAuthRequest = url.includes('/accounts/login/') || url.includes('/accounts/verify-otp/');
          if (!isAuthRequest) {
            AppClient.onUnauthorized?.();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string) {
    return this.instance.get<T>(url).then((response) => response.data);
  }

  post<T>(url: string, body?: unknown) {
    return this.instance.post<T>(url, body).then((response) => response.data);
  }

  put<T>(url: string, body?: unknown) {
    return this.instance.put<T>(url, body).then((response) => response.data);
  }

  patch<T>(url: string, body?: unknown) {
    return this.instance.patch<T>(url, body).then((response) => response.data);
  }

  delete<T>(url: string) {
    return this.instance.delete<T>(url).then((response) => response.data);
  }
}
