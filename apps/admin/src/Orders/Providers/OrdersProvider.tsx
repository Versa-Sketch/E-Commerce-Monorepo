import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { OrdersStore } from '../Store/OrdersStore';
import { OrdersFixtureService } from '../Services/OrdersService/index.fixture';

const OrdersStoreContext = createContext<OrdersStore | null>(null);

export interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const service = useMemo(() => new OrdersFixtureService(), []);
  const [store] = useState(() => new OrdersStore(service));

  return <OrdersStoreContext.Provider value={store}>{children}</OrdersStoreContext.Provider>;
};

export const useOrdersStore = (): OrdersStore => {
  const store = useContext(OrdersStoreContext);
  if (!store) {
    throw new Error('useOrdersStore must be used within an OrdersProvider');
  }
  return store;
};
