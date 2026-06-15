import { AxiosInstance } from 'axios';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import { AUTH_ENDPOINTS } from '../Constants/AUTH_ENDPOINTS';
import {
  AuthTokens,
  IAuthService,
  MeResponse,
  OtpVerifyPayload,
  RegisterPayload,
} from './index';
export class AuthApiService implements IAuthService {
  constructor(private client: AxiosInstance) { }
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    try {
      const response = await this.client.post(AUTH_ENDPOINTS.REGISTER, payload);
      return { message: response.data?.message ?? 'OTP sent successfully.' };
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthTokens> {
    try {
      const response = await this.client.post(AUTH_ENDPOINTS.VERIFY_OTP, payload);
      const data = response.data?.data ?? response.data;
      return {
        access: data.access,
        refresh: data.refresh,
        role: data.role,
      };
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }


  async login(phone_number: string, role: string): Promise<{ message: string }> {
    try {
      const response = await this.client.post(AUTH_ENDPOINTS.LOGIN, {
        phone_number,
        role,
      });
      return { message: response.data?.message ?? 'OTP sent successfully.' };
    } catch (e) {
      const msg = extractErrorMessage(e);
      if (
        e &&
        typeof e === 'object' &&
        'response' in e &&
        (e as { response?: { status?: number } }).response?.status === 404
      ) {
        throw Object.assign(new Error(msg), { code: 'NOT_FOUND' });
      }
      throw new Error(msg);
    }
  }


  async logout(refresh: string, access: string): Promise<void> {
    try {
      await this.client.post(AUTH_ENDPOINTS.LOGOUT, { refresh, access });
    } catch (e) {
      console.error('[AuthApiService.logout] API call failed:', e);
    }
  }
  async fetchMe(): Promise<MeResponse> {
    try {
      const response = await this.client.get(AUTH_ENDPOINTS.ME);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}

export const authService: IAuthService = new AuthApiService(AppClient);
