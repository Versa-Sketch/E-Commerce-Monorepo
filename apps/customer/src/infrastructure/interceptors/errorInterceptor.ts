import { AxiosError } from 'axios';
import { ResponseInterceptor } from './types';

export interface AppError {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

export const errorInterceptor: ResponseInterceptor = {
  type: 'response',
  onRejected: (error: unknown) => {
    const axiosError = error as AxiosError<{ code?: string; message?: string; details?: unknown }>;
    const data = axiosError.response?.data;
    const normalized: AppError = {
      code: data?.code ?? 'UNKNOWN_ERROR',
      message: data?.message ?? axiosError.message ?? 'An unexpected error occurred',
      status: axiosError.response?.status ?? 0,
      details: data?.details,
    };
    return Promise.reject(normalized);
  },
};
