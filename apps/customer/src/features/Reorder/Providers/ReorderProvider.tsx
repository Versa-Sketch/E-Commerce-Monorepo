import React, { useState } from 'react';
import { ReorderStore } from '../Store/ReorderStore';
import { ReorderStoreContext } from './useReorderStore';

interface ReorderProviderProps {
  children: React.ReactNode;
}

export const ReorderProvider: React.FC<ReorderProviderProps> = ({ children }) => {
  const [store] = useState(() => new ReorderStore());
  return (
    <ReorderStoreContext.Provider value={store}>
      {children}
    </ReorderStoreContext.Provider>
  );
};
