import { createContext, useContext } from 'react';
import { ReorderStore } from '../Store/ReorderStore';

export const ReorderStoreContext = createContext<ReorderStore | null>(null);

export const useReorderStore = (): ReorderStore => {
  const store = useContext(ReorderStoreContext);
  if (!store) {
    throw new Error('useReorderStore must be used within ReorderProvider');
  }
  return store;
};
