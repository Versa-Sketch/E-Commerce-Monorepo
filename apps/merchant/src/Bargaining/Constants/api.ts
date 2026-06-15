import { API_BASE } from '../../Auth/Constants/api';

export const BARGAIN_ENDPOINTS = {
  ACTIVE_SESSIONS: `${API_BASE}/logistics/bargain/sessions/active/`,
  SESSION: (sessionId: string) => `${API_BASE}/logistics/bargain/sessions/${sessionId}/`,
  SESSION_HISTORY: (sessionId: string) => `${API_BASE}/logistics/bargain/sessions/${sessionId}/history/`,
} as const;

/** Derives the `/ws/bargain/` gateway URL from API_BASE, e.g.
 * `https://host/api` -> `wss://host/ws/bargain/?token=<token>`. */
export function bargainWsUrl(token: string | null): string {
  const httpBase = API_BASE.replace(/\/api\/?$/, '');
  const wsBase = httpBase.replace(/^http/, 'ws');
  return `${wsBase}/ws/bargain/?token=${encodeURIComponent(token ?? '')}`;
}
