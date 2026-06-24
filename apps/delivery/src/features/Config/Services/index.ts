import { http } from '../../../services/http';
import { ConfigData, ConfigUpdatePayload } from '../types';

const BASE = '/delivery-partners/config';

export const ConfigService = {
  async getConfig(): Promise<ConfigData> {
    const res = await http.get<ConfigData>(`${BASE}/detail/`);
    return res.data;
  },

  async saveConfig(payload: ConfigUpdatePayload): Promise<ConfigData> {
    const res = await http.post<ConfigData>(`${BASE}/`, { ...payload });
    return res.data;
  },

  async patchConfig(payload: ConfigUpdatePayload): Promise<ConfigData> {
    const res = await http.patch<ConfigData>(`${BASE}/update/`, { ...payload });
    return res.data;
  },
};
