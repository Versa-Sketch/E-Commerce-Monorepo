export interface AuthServiceInterface {
  requestOtp(phone: string, role: string): Promise<void>;
  verifyOtp(phone: string, role: string, otp: string): Promise<{ access: string; refresh: string; role: string }>;
  logout(access: string, refresh: string): Promise<void>;
}
