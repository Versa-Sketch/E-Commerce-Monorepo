import type { AppClient } from '../../../stores/services/AppClient';
import type { AuthServiceInterface } from './index';
import type { LoginResponseApi, VerifyOtpResponseApi, LogoutResponseApi } from '../../types/api';
import { AUTH_ENDPOINTS } from '../../Constants/authConstants';

export class AuthApiService implements AuthServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  async requestOtp(phone: string, role: string): Promise<void> {
    await this.client.post<LoginResponseApi>(AUTH_ENDPOINTS.LOGIN, {
      phone_number: phone,
      role,
    });
  }

  async verifyOtp(
    phone: string,
    role: string,
    otp: string,
  ): Promise<{ access: string; refresh: string; role: string }> {
    const response = await this.client.post<VerifyOtpResponseApi>(AUTH_ENDPOINTS.VERIFY_OTP, {
      phone_number: phone,
      role,
      otp,
    });
    return response.data;
  }

  async logout(access: string, refresh: string): Promise<void> {
    await this.client.post<LogoutResponseApi>(AUTH_ENDPOINTS.LOGOUT, { access, refresh });
  }
}
