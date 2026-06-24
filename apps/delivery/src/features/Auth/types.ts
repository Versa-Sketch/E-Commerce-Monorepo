export interface AuthTokens {
  access: string;
  refresh: string;
  role: string;
}

export interface MeResponse {
  id: string;
  phone_number: string;
  full_name?: string;
  role: string;
}

export interface DeliveryUser {
  id: string;
  phone: string;
  fullName?: string;
}
