export const PROFILE_ENDPOINTS = {
  GET: '/profile/me',
  UPDATE: '/profile/me',
  ADDRESSES: '/profile/addresses',
  ADD_ADDRESS: '/profile/addresses',
  UPDATE_ADDRESS: '/profile/addresses/:id',
  DELETE_ADDRESS: '/profile/addresses/:id',
} as const;
