import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CategoriesStore } from '../Store/CategoriesStore';
import { CategoriesApiService } from '../Services/CategoriesService/index.api';
import { AppClient } from '../../stores/services/AppClient';

const CategoriesStoreContext = createContext<CategoriesStore | null>(null);

export interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
  const service = useMemo(() => new CategoriesApiService(new AppClient()), []);
  const [store] = useState(() => new CategoriesStore(service));

  return (
    <CategoriesStoreContext.Provider value={store}>
      {children}
    </CategoriesStoreContext.Provider>
  );
};

export const useCategoriesStore = (): CategoriesStore => {
  const store = useContext(CategoriesStoreContext);
  if (!store) {
    throw new Error('useCategoriesStore must be used within a CategoriesProvider');
  }
  return store;
};
