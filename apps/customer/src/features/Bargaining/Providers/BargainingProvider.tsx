import React, { useState } from 'react';
import { BargainingStore } from '../Store/BargainingStore';
// Swap '.fixture' <-> '.api' to toggle fixture data
import { bargainingService } from '../Services/index.api';
import { bargainSocketFactory } from '../Services/BargainSocket.api';
import { BargainingStoreContext } from './useBargainingStore';
interface BargainingProviderProps {
  children: React.ReactNode;
}
export const BargainingProvider: React.FC<BargainingProviderProps> = ({ children }) => {
  const [store] = useState(() => {
    console.log('[Bargaining] mode: REAL API (REST + WebSocket)');
    return new BargainingStore(bargainingService, bargainSocketFactory);
  });
  return (
    <BargainingStoreContext.Provider value={store}>
      {children}
    </BargainingStoreContext.Provider>
  );
};
