export const AUTH_ENDPOINTS = {
  LOGIN: '/accounts/login/',
  VERIFY_OTP: '/accounts/verify-otp/',
  LOGOUT: '/accounts/logout/',
} as const;

export const AUTH_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SHOP_OWNER: 'SHOP_OWNER',
  ADMIN: 'ADMIN',
} as const;
