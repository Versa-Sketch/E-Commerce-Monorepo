import { createContext, useContext } from 'react';
import { AddressStore } from '../Store/AddressStore';
export const AddressStoreContext = createContext<AddressStore | null>(null);
export const useAddressStore = (): AddressStore => {
  const store = useContext(AddressStoreContext);
  if (!store) {
    throw new Error('useAddressStore must be used within AddressProvider');
  }
  return store;
};
