export type UserRole = 'CUSTOMER' | 'SHOP_OWNER';

export interface AuthDomain {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}
