import { createContext, useContext } from 'react';
import { AuthStore } from '../Store/AuthStore';
export const AuthStoreContext = createContext<AuthStore | null>(null);
export const useAuthStore = (): AuthStore => {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }
  return store;
};
