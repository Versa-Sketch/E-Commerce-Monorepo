import { apiRequest, type ApiResult } from '../../Common/services/http';
import { BARGAIN_ENDPOINTS } from '../Constants/api';
import type { BargainHistorySession } from '../Models/Bargain';
import { USE_FIXTURES, fixtureDelay } from '../../Common/services/config';

export interface TokenProvider {
  accessToken: string | null;
}

export class BargainingApiService {
  constructor(private session: TokenProvider) {}

  private get token() {
    return this.session.accessToken;
  }

  getActiveSessions(): Promise<ApiResult<Record<string, any>[] | { sessions: Record<string, any>[] }>> {
    if (USE_FIXTURES) {
      return fixtureDelay({
        ok: true,
        status: 200,
        message: null,
        data: [],
      });
    }
    return apiRequest<Record<string, any>[] | { sessions: Record<string, any>[] }>(
      BARGAIN_ENDPOINTS.ACTIVE_SESSIONS,
      { token: this.token },
    );
  }

  getSession(sessionId: string): Promise<ApiResult<Record<string, any>>> {
    return apiRequest<Record<string, any>>(BARGAIN_ENDPOINTS.SESSION(sessionId), { token: this.token });
  }

  getSessionHistory(sessionId: string): Promise<ApiResult<Record<string, any>>> {
    return apiRequest<Record<string, any>>(BARGAIN_ENDPOINTS.SESSION_HISTORY(sessionId), { token: this.token });
  }

  getResolvedHistory(shopId: string): Promise<ApiResult<BargainHistorySession[]>> {
    if (USE_FIXTURES) {
      const mockHistory: BargainHistorySession[] = [
        {
          session_id: 'hist-1',
          cart_id: 'cart-1',
          status: 'ENDED',
          customer_name: 'Sneha Patil',
          started_at: new Date(Date.now() - 3600 * 1000).toISOString(),
          expires_at: new Date(Date.now() - 3500 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 3550 * 1000).toISOString(),
          final_accepted_amount: '250.00'
        },
        {
          session_id: 'hist-2',
          cart_id: 'cart-2',
          status: 'EXPIRED',
          customer_name: 'Rohan Shah',
          started_at: new Date(Date.now() - 7200 * 1000).toISOString(),
          expires_at: new Date(Date.now() - 7100 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 7150 * 1000).toISOString(),
          final_accepted_amount: null
        }
      ];
      return fixtureDelay({
        ok: true,
        status: 200,
        message: null,
        data: mockHistory
      });
    }
    return apiRequest<BargainHistorySession[]>(BARGAIN_ENDPOINTS.HISTORY(shopId), { token: this.token });
  }
}


