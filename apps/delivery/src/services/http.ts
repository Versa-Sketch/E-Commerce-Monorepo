import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { StorageService } from './storage';

export interface PickedFile {
  uri: string;
  name: string;
  type: string;
  // Populated on web only — the picker returns a real File/Blob there,
  // which is what FormData.append needs (the {uri,name,type} shape is RN-only).
  file?: Blob;
}

export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refreshToken = StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_CONFIG.BASE_URL}/accounts/refresh/`, { refresh: refreshToken });
          const access = data?.data?.access;
          if (access) {
            StorageService.set(STORAGE_KEYS.AUTH_TOKEN, access);
            if (original.headers) original.headers.Authorization = `Bearer ${access}`;
            return client(original);
          }
        } catch {
          StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
          StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
          StorageService.delete(STORAGE_KEYS.USER_DATA);
        }
      }
    }
    return Promise.reject(error);
  }
);

function unwrapError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as Partial<ApiEnvelope<unknown>> | undefined;
    return new ApiError(body?.message ?? error.message, error.response?.status);
  }
  return new ApiError(error instanceof Error ? error.message : 'Unknown error');
}

// Native: RN's FormData wants the { uri, name, type } shape, not a Blob.
// Web: the picker hands back a real Blob/File, which is what a browser FormData needs.
export function appendFile(fd: FormData, key: string, file: PickedFile): void {
  if (Platform.OS === 'web' && file.file) {
    fd.append(key, file.file, file.name);
    return;
  }
  fd.append(key, { uri: file.uri, name: file.name, type: file.type } as any);
}

export const http = {
  async get<T>(url: string): Promise<ApiEnvelope<T>> {
    try {
      const res = await client.get<ApiEnvelope<T>>(url);
      return res.data;
    } catch (e) {
      throw unwrapError(e);
    }
  },

  async post<T>(url: string, body?: Record<string, unknown>): Promise<ApiEnvelope<T>> {
    try {
      const res = await client.post<ApiEnvelope<T>>(url, body);
      return res.data;
    } catch (e) {
      throw unwrapError(e);
    }
  },

  async patch<T>(url: string, body?: Record<string, unknown>): Promise<ApiEnvelope<T>> {
    try {
      const res = await client.patch<ApiEnvelope<T>>(url, body);
      return res.data;
    } catch (e) {
      throw unwrapError(e);
    }
  },

  // fields: plain values to append as-is; files: { key: PickedFile | null } — null/undefined files are skipped.
  async postFormData<T>(url: string, fields: Record<string, unknown>, files: Record<string, PickedFile | null | undefined>): Promise<ApiEnvelope<T>> {
    return submitFormData<T>('post', url, fields, files);
  },

  async patchFormData<T>(url: string, fields: Record<string, unknown>, files: Record<string, PickedFile | null | undefined>): Promise<ApiEnvelope<T>> {
    return submitFormData<T>('patch', url, fields, files);
  },
};

async function submitFormData<T>(
  method: 'post' | 'patch',
  url: string,
  fields: Record<string, unknown>,
  files: Record<string, PickedFile | null | undefined>
): Promise<ApiEnvelope<T>> {
  const fd = new FormData();
  let partCount = 0;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    fd.append(key, String(value));
    partCount += 1;
  }
  for (const [key, file] of Object.entries(files)) {
    // Skip docs that are already-uploaded remote URLs (unchanged on resume) —
    // only freshly-picked local files (file://, content://, blob web URIs) get sent.
    if (!file || file.uri.startsWith('http')) continue;
    appendFile(fd, key, file);
    partCount += 1;
  }
  // React Native's FormData throws when serialized with zero parts.
  if (partCount === 0) fd.append('_empty', '1');

  try {
    const res = await client[method]<ApiEnvelope<T>>(url, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (e) {
    throw unwrapError(e);
  }
}

export default http;
