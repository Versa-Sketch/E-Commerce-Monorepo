import { create } from 'zustand';
import { ConfigService } from '../Services';
import { ConfigData, ConfigUpdatePayload } from '../types';

type Status = 'idle' | 'loading' | 'saving' | 'error';

interface ConfigState {
  config: ConfigData | null;
  status: Status;
  error: string | null;

  load: () => Promise<void>;
  save: (payload: ConfigUpdatePayload) => Promise<void>;
  toggleOnline: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  status: 'idle',
  error: null,

  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const config = await ConfigService.getConfig();
      set({ config, status: 'idle' });
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Could not load config' });
    }
  },

  save: async (payload) => {
    set({ status: 'saving', error: null });
    try {
      const config = await ConfigService.patchConfig(payload);
      set({ config, status: 'idle' });
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Could not save changes' });
      throw e;
    }
  },

  toggleOnline: async () => {
    const current = get().config;
    if (!current) return;
    await get().save({ is_online: !current.is_online });
  },
}));
