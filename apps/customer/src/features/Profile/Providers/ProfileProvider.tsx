import React, { useState } from 'react';
import { ProfileStore } from '../Store/ProfileStore';
import { ProfileStoreContext } from './useProfileStore';
import { useAuthStore } from '../../Auth/Providers/useAuthStore';
interface ProfileProviderProps {
  children: React.ReactNode;
}
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const authStore = useAuthStore();
  const [store] = useState(() => new ProfileStore(authStore));
  return (
    <ProfileStoreContext.Provider value={store}>
      {children}
    </ProfileStoreContext.Provider>
  );
};
