import { http } from '../../../services/http';
import { AuthTokens, MeResponse } from '../types';

const ROLE = 'DELIVERY_PARTNER';

export const AuthService = {
  async register(phone: string, fullName: string): Promise<void> {
    await http.post('/accounts/register/', { phone_number: phone, full_name: fullName, role: ROLE });
  },

  async sendOtp(phone: string): Promise<void> {
    await http.post('/accounts/login/', { phone_number: phone, role: ROLE });
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthTokens> {
    const res = await http.post<AuthTokens>('/accounts/verify-otp/', {
      phone_number: phone,
      role: ROLE,
      otp,
    });
    return res.data;
  },

  async fetchMe(): Promise<MeResponse> {
    const res = await http.get<MeResponse>('/accounts/me/');
    return res.data;
  },

  async logout(refresh: string, access: string): Promise<void> {
    try {
      await http.post('/accounts/logout/', { refresh, access });
    } catch {
      // best-effort — local session is cleared regardless
    }
  },
};
