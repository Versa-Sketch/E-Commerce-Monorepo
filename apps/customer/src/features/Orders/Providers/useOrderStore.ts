import { createContext, useContext } from 'react';
import { OrderStore } from '../Store/OrderStore';
export const OrderStoreContext = createContext<OrderStore | null>(null);
export const useOrderStore = (): OrderStore => {
  const store = useContext(OrderStoreContext);
  if (!store) {
    throw new Error('useOrderStore must be used within OrderProvider');
  }
  return store;
};
