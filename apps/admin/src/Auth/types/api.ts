export interface LoginRequestApi {
  phone_number: string;
  role: string;
}

export interface LoginResponseApi {
  status_code: number;
  message: string;
  data: Record<string, never>;
}

export interface VerifyOtpRequestApi {
  phone_number: string;
  role: string;
  otp: string;
}

export interface VerifyOtpResponseApi {
  status_code: number;
  message: string;
  data: {
    access: string;
    refresh: string;
    role: string;
  };
}

export interface LogoutRequestApi {
  access: string;
  refresh: string;
}

export interface LogoutResponseApi {
  status: number;
  message: string;
}
