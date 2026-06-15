import { createContext, useContext } from 'react';
import { BargainingStore } from '../Store/BargainingStore';
export const BargainingStoreContext = createContext<BargainingStore | null>(null);
export const useBargainingStore = (): BargainingStore => {
  const store = useContext(BargainingStoreContext);
  if (!store) {
    throw new Error('useBargainingStore must be used within BargainingProvider');
  }
  return store;
};
