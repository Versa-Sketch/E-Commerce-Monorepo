import { create } from 'zustand';
import { STORAGE_KEYS } from '../../../constants';
import { APPROVED_BANNER_SEEN_KEY } from '../../../components/OnboardingStatusBanner';
import { clearAllStepDrafts } from '../../Onboarding/hooks/useStepDraft';
import { useOnboardingStore } from '../../Onboarding/Store/useOnboardingStore';
import { StorageService } from '../../../services/storage';
import { AuthService } from '../Services';
import { DeliveryUser } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AuthState {
  phone: string;
  token: string | null;
  refreshToken: string | null;
  user: DeliveryUser | null;
  status: Status;
  error: string | null;

  isAuthenticated: () => boolean;
  restoreSession: () => void;
  register: (phone: string, fullName: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  phone: '',
  token: StorageService.getString(STORAGE_KEYS.AUTH_TOKEN) ?? null,
  refreshToken: StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN) ?? null,
  user: StorageService.getObject<DeliveryUser>(STORAGE_KEYS.USER_DATA),
  status: 'idle',
  error: null,

  isAuthenticated: () => !!get().token,

  restoreSession: () => {
    set({
      token: StorageService.getString(STORAGE_KEYS.AUTH_TOKEN) ?? null,
      refreshToken: StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN) ?? null,
      user: StorageService.getObject<DeliveryUser>(STORAGE_KEYS.USER_DATA),
    });
  },

  register: async (phone, fullName) => {
    set({ status: 'loading', error: null, phone });
    try {
      await AuthService.register(phone, fullName);
      set({ status: 'success' });
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Registration failed' });
      throw e;
    }
  },

  sendOtp: async (phone) => {
    set({ status: 'loading', error: null, phone });
    try {
      await AuthService.sendOtp(phone);
      set({ status: 'success' });
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Failed to send OTP' });
      throw e;
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ status: 'loading', error: null });
    try {
      const tokens = await AuthService.verifyOtp(phone, otp);
      StorageService.set(STORAGE_KEYS.AUTH_TOKEN, tokens.access);
      StorageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
      const minimalUser: DeliveryUser = { id: '', phone };
      StorageService.setObject(STORAGE_KEYS.USER_DATA, minimalUser);
      set({ token: tokens.access, refreshToken: tokens.refresh, user: minimalUser, status: 'success' });
      await get().fetchProfile();
    } catch (e) {
      set({ status: 'error', error: e instanceof Error ? e.message : 'Invalid OTP' });
      throw e;
    }
  },

  fetchProfile: async () => {
    try {
      const me = await AuthService.fetchMe();
      const user: DeliveryUser = { id: me.id, phone: me.phone_number, fullName: me.full_name };
      StorageService.setObject(STORAGE_KEYS.USER_DATA, user);
      set({ user });
    } catch {
      // non-fatal — onboarding store will still load via its own status call
    }
  },

  logout: async () => {
    const { token, refreshToken } = get();
    if (refreshToken && token) await AuthService.logout(refreshToken, token);
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
    StorageService.delete(STORAGE_KEYS.USER_DATA);

    // A logged-out session's onboarding step/status/prefill and any
    // in-progress (unsaved) drafts must not leak into the next login on this
    // device — could be a different partner.
    clearAllStepDrafts();
    StorageService.delete(APPROVED_BANNER_SEEN_KEY);
    useOnboardingStore.getState().reset();

    set({ token: null, refreshToken: null, user: null, status: 'idle', error: null });
  },
}));
