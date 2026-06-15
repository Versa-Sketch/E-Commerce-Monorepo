import { createContext, useContext } from 'react';
import { StoresStore } from '../Store/StoresStore';
export const StoresStoreContext = createContext<StoresStore | null>(null);
export const useStoresStore = (): StoresStore => {
  const store = useContext(StoresStoreContext);
  if (!store) {
    throw new Error('useStoresStore must be used within StoresProvider');
  }
  return store;
};
