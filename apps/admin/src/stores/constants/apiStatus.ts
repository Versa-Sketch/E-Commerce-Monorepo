export const API_STATUS = {
  IDLE: 'IDLE',
  FETCHING: 'FETCHING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
