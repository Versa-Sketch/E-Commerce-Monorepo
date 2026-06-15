import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ShopTypeCategoriesStore } from '../Store/ShopTypeCategoriesStore';
import { ShopTypeCategoriesApiService } from '../Services/ShopTypeCategoriesService/index.api';
import { AppClient } from '../../stores/services/AppClient';

const ShopTypeCategoriesStoreContext = createContext<ShopTypeCategoriesStore | null>(null);

export interface ShopTypeCategoriesProviderProps {
  children: ReactNode;
}

export const ShopTypeCategoriesProvider = ({ children }: ShopTypeCategoriesProviderProps) => {
  const service = useMemo(() => new ShopTypeCategoriesApiService(new AppClient()), []);
  const [store] = useState(() => new ShopTypeCategoriesStore(service));

  return (
    <ShopTypeCategoriesStoreContext.Provider value={store}>
      {children}
    </ShopTypeCategoriesStoreContext.Provider>
  );
};

export const useShopTypeCategoriesStore = (): ShopTypeCategoriesStore => {
  const store = useContext(ShopTypeCategoriesStoreContext);
  if (!store) {
    throw new Error('useShopTypeCategoriesStore must be used within a ShopTypeCategoriesProvider');
  }
  return store;
};
