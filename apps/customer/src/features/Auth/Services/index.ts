export interface RegisterPayload {
  phone_number: string;
  full_name: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'DELIVERY' | 'ADMIN';
}
export interface OtpVerifyPayload {
  phone_number: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'DELIVERY' | 'ADMIN';
  otp: string;
}
export interface AuthTokens {
  access: string;
  refresh: string;
  role: string;
}
export interface MeResponse {
  id: string;
  phone_number: string;
  full_name: string;
  role: 'CUSTOMER';
  shop_id: string | null;
}
export interface IAuthService {
  register(payload: RegisterPayload): Promise<{ message: string }>;
  verifyOtp(payload: OtpVerifyPayload): Promise<AuthTokens>;
  login(phone_number: string, role: string): Promise<{ message: string }>;
  logout(refresh: string, access: string): Promise<void>;
  fetchMe(): Promise<MeResponse>;
}
