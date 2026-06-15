import React, { useState } from 'react';
import { AddressStore } from '../Store/AddressStore';
// Swap '.fixture' <-> '.api' to toggle fixture data
import { addressService } from '../Services/index.api';
import { AddressStoreContext } from './useAddressStore';
interface AddressProviderProps {
  children: React.ReactNode;
}
export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [store] = useState(() => new AddressStore(addressService));
  return (
    <AddressStoreContext.Provider value={store}>
      {children}
    </AddressStoreContext.Provider>
  );
};
