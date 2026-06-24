import { MaxLoad, ScheduleDay } from '../Onboarding/types/domain';

export interface CodSettings {
  cod_enabled: boolean;
  cod_limit_per_order: string;
  cod_limit_per_day: string;
}

export interface WorkPreference {
  max_load: MaxLoad;
  willing_long_distance: boolean;
  long_distance_km: number;
  max_orders_per_shift: number;
}

export interface ConfigData {
  partner_id: string;
  is_online: boolean;
  cod: CodSettings;
  schedule: ScheduleDay[];
  work_preference: WorkPreference;
}

export interface ConfigUpdatePayload {
  cod_enabled?: boolean;
  cod_limit_per_order?: number;
  cod_limit_per_day?: number;
  is_online?: boolean;
  schedule?: ScheduleDay[];
  max_load?: MaxLoad;
  willing_long_distance?: boolean;
  long_distance_km?: number;
  max_orders_per_shift?: number;
}
