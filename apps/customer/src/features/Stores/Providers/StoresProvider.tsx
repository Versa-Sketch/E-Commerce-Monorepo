import React, { useState } from 'react';
import { StoresStore } from '../Store/StoresStore';
// Swap '.fixture' <-> '.api' to toggle fixture data
import { storeService } from '../Services/index.api';
import { StoresStoreContext } from './useStoresStore';
interface StoresProviderProps {
  children: React.ReactNode;
}
export const StoresProvider: React.FC<StoresProviderProps> = ({ children }) => {
  const [store] = useState(() => new StoresStore(storeService));
  return (
    <StoresStoreContext.Provider value={store}>
      {children}
    </StoresStoreContext.Provider>
  );
};
