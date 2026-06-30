export const API_STATUS = {
  IDLE: "IDLE",
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;
export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
export const API_IDLE = API_STATUS.IDLE;
export const API_FETCHING = API_STATUS.FETCHING;
export const API_SUCCESS = API_STATUS.SUCCESS;
export const API_ERROR = API_STATUS.ERROR;
export const STORAGE_KEYS = {
  AUTH_TOKEN: "localio_auth_token",
  REFRESH_TOKEN: "localio_refresh_token",
  USER_DATA: "localio_user_data",
  CART: "localio_cart",
  THEME: "localio_theme",
  USER_LOCATION: "localio_user_location",
} as const;
export const API_CONFIG = {
  // BASE_URL: "http://127.0.0.1:8000/api",
  // BASE_URL: "https://local-ecommerce-backend-production.up.railway.app/api",
  BASE_URL: "https://web-production-4c447.up.railway.app/api",
  // BASE_URL: "http://10.10.48.106:8000/api",

  TIMEOUT: 10000,
} as const;
export const ROLES = {
  CUSTOMER: "customer",
  MERCHANT: "merchant",
  DELIVERY: "delivery",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof ROLES)[keyof typeof ROLES];
export const API_ROLES = {
  CUSTOMER: "CUSTOMER",
  SHOP_OWNER: "SHOP_OWNER",
  DELIVERY: "DELIVERY",
  ADMIN: "ADMIN",
} as const;
export type ApiRole = (typeof API_ROLES)[keyof typeof API_ROLES];
export function apiRoleToAppRole(apiRole: string): UserRole {
  switch (apiRole) {
    case "SHOP_OWNER":
      return "merchant";
    case "DELIVERY":
      return "delivery";
    case "ADMIN":
      return "admin";
    default:
      return "customer";
  }
}
export function appRoleToApiRole(role: UserRole): ApiRole {
  switch (role) {
    case "merchant":
      return "SHOP_OWNER";
    case "delivery":
      return "DELIVERY";
    case "admin":
      return "ADMIN";
    default:
      return "CUSTOMER";
  }
}
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ORDER_STATUS_UPDATE: "order:status_update",
  COURIER_LOCATION: "courier:location",
  BARGAIN_RESPONSE: "bargain:response",
} as const;
export const FEES = {
  PLATFORM_FEE: 2.0,
  DEFAULT_DELIVERY_FEE: 15.0,
} as const;
