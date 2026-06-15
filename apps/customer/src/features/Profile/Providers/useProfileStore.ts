import { createContext, useContext } from 'react';
import { ProfileStore } from '../Store/ProfileStore';
export const ProfileStoreContext = createContext<ProfileStore | null>(null);
export const useProfileStore = (): ProfileStore => {
  const store = useContext(ProfileStoreContext);
  if (!store) {
    throw new Error('useProfileStore must be used within ProfileProvider');
  }
  return store;
};
