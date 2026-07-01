import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestInterceptor {
  type: 'request';
  onFulfilled: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRejected?: (error: unknown) => Promise<never>;
}

export interface ResponseInterceptor {
  type: 'response';
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

export type AppInterceptor = RequestInterceptor | ResponseInterceptor;
