import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ShopTypesStore } from '../Store/ShopTypesStore';
import { ShopTypesApiService } from '../Services/ShopTypesService/index.api';
import { AppClient } from '../../stores/services/AppClient';

const ShopTypesStoreContext = createContext<ShopTypesStore | null>(null);

export interface ShopTypesProviderProps {
  children: ReactNode;
}

export const ShopTypesProvider = ({ children }: ShopTypesProviderProps) => {
  const service = useMemo(() => new ShopTypesApiService(new AppClient()), []);
  const [store] = useState(() => new ShopTypesStore(service));

  return (
    <ShopTypesStoreContext.Provider value={store}>
      {children}
    </ShopTypesStoreContext.Provider>
  );
};

export const useShopTypesStore = (): ShopTypesStore => {
  const store = useContext(ShopTypesStoreContext);
  if (!store) {
    throw new Error('useShopTypesStore must be used within a ShopTypesProvider');
  }
  return store;
};
