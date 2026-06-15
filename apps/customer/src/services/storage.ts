import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../Common/Constants';

const webStorageFallback = {
  multiGet: async (keys: string[]): Promise<Array<[string, string | null]>> =>
    keys.map((key) => [key, typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null]),
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
  clear: async (): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
  },
};

const AsyncStorage = Platform.OS === 'web' ? webStorageFallback : require('@react-native-async-storage/async-storage').default;

let mmkvInstance: any = null;
let useFallback = false;
const cache = new Map<string, string>();
try {
  if (Platform.OS === 'web') throw new Error('MMKV is not supported on web');
  const { MMKV } = require('react-native-mmkv');
  mmkvInstance = new MMKV({
    id: 'localio-app-core-storage',
  });
} catch (error) {
  console.warn('MMKV could not be initialized (often happens in standard Expo Go). Falling back to AsyncStorage-backed cache.', error);
  useFallback = true;
}
export const hydrateStorage = async (): Promise<void> => {
  if (!useFallback || mmkvInstance) return;
  try {
    const entries = await AsyncStorage.multiGet(Object.values(STORAGE_KEYS));
    for (const [key, value] of entries) {
      if (value !== null) cache.set(key, value);
    }
  } catch (e) {
    console.error('StorageService: Failed to hydrate cache from AsyncStorage', e);
  }
};
export const StorageService = {
  set: (key: string, value: string | number | boolean): void => {
    if (useFallback || !mmkvInstance) {
      const str = String(value);
      cache.set(key, str);
      AsyncStorage.setItem(key, str).catch((e: unknown) => console.error(`StorageService: Failed to persist key "${key}"`, e));
      return;
    }
    mmkvInstance.set(key, value);
  },
  getString: (key: string): string | undefined => {
    if (useFallback || !mmkvInstance) {
      return cache.get(key);
    }
    return mmkvInstance.getString(key);
  },
  getNumber: (key: string): number | undefined => {
    if (useFallback || !mmkvInstance) {
      const val = cache.get(key);
      return val ? Number(val) : undefined;
    }
    return mmkvInstance.getNumber(key);
  },
  getBoolean: (key: string): boolean | undefined => {
    if (useFallback || !mmkvInstance) {
      const val = cache.get(key);
      return val ? val === 'true' : undefined;
    }
    return mmkvInstance.getBoolean(key);
  },
  delete: (key: string): void => {
    if (useFallback || !mmkvInstance) {
      cache.delete(key);
      AsyncStorage.removeItem(key).catch((e: unknown) => console.error(`StorageService: Failed to remove key "${key}"`, e));
      return;
    }
    mmkvInstance.delete(key);
  },
  clearAll: (): void => {
    if (useFallback || !mmkvInstance) {
      cache.clear();
      AsyncStorage.clear().catch((e: unknown) => console.error('StorageService: Failed to clear AsyncStorage', e));
      return;
    }
    mmkvInstance.clearAll();
  },
  setObject: <T>(key: string, value: T): void => {
    try {
      const jsonStr = JSON.stringify(value);
      if (useFallback || !mmkvInstance) {
        cache.set(key, jsonStr);
        AsyncStorage.setItem(key, jsonStr).catch((e: unknown) => console.error(`StorageService: Failed to persist key "${key}"`, e));
        return;
      }
      mmkvInstance.set(key, jsonStr);
    } catch (e) {
      console.error(`StorageService: Error serializing object for key "${key}"`, e);
    }
  },
  getObject: <T>(key: string): T | null => {
    try {
      const value = useFallback || !mmkvInstance
        ? cache.get(key)
        : mmkvInstance.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(`StorageService: Error deserializing object for key "${key}"`, e);
      return null;
    }
  },
};
