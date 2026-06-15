import React from 'react';
import { useStores } from '../../Common/hooks/useStores';
import { BargainingStore } from '../Store';

export function BargainingProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useBargainingStore(): BargainingStore {
  return useStores().bargainingStore;
}
