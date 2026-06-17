import React, { createContext, useContext, useState } from 'react';
import { DashboardStore } from '../Store';
import { useStores } from '../../Common/hooks/useStores';

const DashboardStoreContext = createContext<DashboardStore | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { sessionStore } = useStores();
  const [store] = useState(() => new DashboardStore(sessionStore));
  return <DashboardStoreContext.Provider value={store}>{children}</DashboardStoreContext.Provider>;
}

export function useDashboardStore(): DashboardStore {
  const store = useContext(DashboardStoreContext);
  if (!store) throw new Error('useDashboardStore must be inside HomeProvider');
  return store;
}
