import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AuthStore } from "../Store/AuthStore";
import { AuthApiService } from "../Services/AuthService/index.api";
import { AppClient } from "../../stores/services/AppClient";

const AuthStoreContext = createContext<AuthStore | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const service = useMemo(() => new AuthApiService(new AppClient()), []);
  const [store] = useState(() => new AuthStore(service));

  useEffect(() => {
    AppClient.registerUnauthorizedCallback(() => {
      store.logout();
    });
    return () => {
      AppClient.registerUnauthorizedCallback(() => {});
    };
  }, [store]);

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthStore = (): AuthStore => {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return store;
};
