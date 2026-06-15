import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { OnboardingStore } from '../Store/OnboardingStore';
import { OnboardingApiService } from '../Services/OnboardingService/index.api';
import { AppClient } from '../../stores/services/AppClient';

const OnboardingStoreContext = createContext<OnboardingStore | null>(null);

export interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const service = useMemo(() => new OnboardingApiService(new AppClient()), []);
  const [store] = useState(() => new OnboardingStore(service));

  return (
    <OnboardingStoreContext.Provider value={store}>
      {children}
    </OnboardingStoreContext.Provider>
  );
};

export const useOnboardingStore = (): OnboardingStore => {
  const store = useContext(OnboardingStoreContext);
  if (!store) {
    throw new Error('useOnboardingStore must be used within an OnboardingProvider');
  }
  return store;
};
