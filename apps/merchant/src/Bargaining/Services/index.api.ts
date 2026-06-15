import { apiRequest, type ApiResult } from '../../Common/services/http';
import { BARGAIN_ENDPOINTS } from '../Constants/api';

export interface TokenProvider {
  accessToken: string | null;
}

export class BargainingApiService {
  constructor(private session: TokenProvider) {}

  private get token() {
    return this.session.accessToken;
  }

  getActiveSessions(): Promise<ApiResult<{ sessions: Record<string, any>[] }>> {
    return apiRequest<{ sessions: Record<string, any>[] }>(BARGAIN_ENDPOINTS.ACTIVE_SESSIONS, { token: this.token });
  }

  getSession(sessionId: string): Promise<ApiResult<Record<string, any>>> {
    return apiRequest<Record<string, any>>(BARGAIN_ENDPOINTS.SESSION(sessionId), { token: this.token });
  }

  getSessionHistory(sessionId: string): Promise<ApiResult<Record<string, any>>> {
    return apiRequest<Record<string, any>>(BARGAIN_ENDPOINTS.SESSION_HISTORY(sessionId), { token: this.token });
  }
}
