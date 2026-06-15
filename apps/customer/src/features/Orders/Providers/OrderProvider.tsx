import React, { useState } from 'react';
import { OrderStore } from '../Store/OrderStore';
// Swap '.fixture' <-> '.api' to toggle fixture data
import { orderService } from '../Services/index.api';
import { OrderStoreContext } from './useOrderStore';
interface OrderProviderProps {
  children: React.ReactNode;
}
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [store] = useState(() => new OrderStore(orderService));
  return (
    <OrderStoreContext.Provider value={store}>
      {children}
    </OrderStoreContext.Provider>
  );
};
