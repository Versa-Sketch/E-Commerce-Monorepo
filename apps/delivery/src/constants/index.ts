export const STORAGE_KEYS = {
  AUTH_TOKEN: 'delivery_auth_token',
  REFRESH_TOKEN: 'delivery_refresh_token',
  USER_DATA: 'delivery_user_data',
};

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://local-ecommerce-backend-production.up.railway.app/api',
  TIMEOUT: 15000,
};
