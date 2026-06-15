import { AuthTokens, IAuthService, MeResponse, OtpVerifyPayload, RegisterPayload } from './index';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const _registeredPhones = new Set<string>();
export class AuthFixtureService implements IAuthService {
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    await delay(600);
    if (_registeredPhones.has(payload.phone_number)) {
      throw Object.assign(new Error('An account with this number already exists.'), {
        code: 'CONFLICT',
      });
    }
    _registeredPhones.add(payload.phone_number);
    return { message: 'OTP sent successfully.' };
  }
  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthTokens> {
    await delay(700);
    if (payload.otp !== '1234') {
      throw new Error('Invalid OTP. Please try again.');
    }
    return {
      access:  'fixture_access_token',
      refresh: 'fixture_refresh_token',
      role:    payload.role,
    };
  }
  async login(phone_number: string, _role: string): Promise<{ message: string }> {
    await delay(500);
    if (phone_number.endsWith('0000')) {
      throw Object.assign(new Error('User not found.'), { code: 'NOT_FOUND' });
    }
    return { message: 'OTP sent successfully.' };
  }
  async logout(_refresh: string, _access: string): Promise<void> {
    await delay(200);
  }
  async fetchMe(): Promise<MeResponse> {
    await delay(300);
    return {
      id: 'fixture-user-id',
      phone_number: '+919876543210',
      full_name: 'Ravi Kumar',
      role: 'CUSTOMER',
      shop_id: null,
    };
  }
}
export const authService: IAuthService = new AuthFixtureService();
