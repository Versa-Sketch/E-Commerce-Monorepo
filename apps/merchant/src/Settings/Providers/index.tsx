import React, { createContext, useContext, useState } from 'react';
import { AuthStore } from '../Store';

const AuthStoreContext = createContext<AuthStore | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => new AuthStore({} as any));
  return <AuthStoreContext.Provider value={store}>{children}</AuthStoreContext.Provider>;
}

export function useAuthStore(): AuthStore {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error('useAuthStore must be inside SettingsProvider');
  return store;
}
