import type { AuthServiceInterface } from './index';

const FIXTURE_OTP = '1234';
const FIXTURE_ACCESS = 'fixture-access-token';
const FIXTURE_REFRESH = 'fixture-refresh-token';

export class AuthFixtureService implements AuthServiceInterface {
  async requestOtp(_phone: string, _role: string): Promise<void> {
    await delay(400);
  }

  async verifyOtp(
    _phone: string,
    _role: string,
    otp: string,
  ): Promise<{ access: string; refresh: string; role: string }> {
    await delay(400);
    if (otp !== FIXTURE_OTP) {
      throw new Error('Invalid OTP. Please try again.');
    }
    return { access: FIXTURE_ACCESS, refresh: FIXTURE_REFRESH, role: 'SHOP_OWNER' };
  }

  async logout(_access: string, _refresh: string): Promise<void> {
    await delay(300);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
