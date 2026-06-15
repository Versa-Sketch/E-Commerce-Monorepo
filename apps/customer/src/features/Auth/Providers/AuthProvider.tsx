import React, { useEffect, useState } from "react";
import { AuthStore } from "../Store/AuthStore";
// Swap '.fixture' <-> '.api' to toggle fixture data
import { authService } from "../Services/index.api";
import { AuthStoreContext } from "./useAuthStore";
import { setAuthStoreInstance } from "./authStoreInstance";
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [store] = useState(() => new AuthStore(authService));
  useEffect(() => {
    setAuthStoreInstance(store);
    if (store.isAuthenticated) {
      store.fetchProfile();
    }
  }, [store]);
  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
};
