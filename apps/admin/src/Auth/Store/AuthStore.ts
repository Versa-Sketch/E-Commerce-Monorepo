import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { AuthServiceInterface } from '../Services/AuthService';
import type { UserRole } from '../types/domain';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  ROLE: 'user_role',
} as const;

export class AuthStore {
  status: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  role: UserRole | null = null;
  phoneNumber = '';
  selectedRole = '';

  private readonly service: AuthServiceInterface;

  constructor(service: AuthServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
    this.hydrate();
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private hydrate(): void {
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS);
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH);
    this.role = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole | null;
  }

  async requestOtp(phone: string, role: string): Promise<void> {
    this.status = API_STATUS.FETCHING;
    this.error = null;
    try {
      await this.service.requestOtp(phone, role);
      runInAction(() => {
        this.phoneNumber = phone;
        this.selectedRole = role;
        this.status = API_STATUS.SUCCESS;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to send OTP.';
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async verifyOtp(otp: string): Promise<void> {
    this.status = API_STATUS.FETCHING;
    this.error = null;
    try {
      const tokens = await this.service.verifyOtp(this.phoneNumber, this.selectedRole, otp);
      runInAction(() => {
        this.accessToken = tokens.access;
        this.refreshToken = tokens.refresh;
        this.role = tokens.role as UserRole;
        this.status = API_STATUS.SUCCESS;
      });
      localStorage.setItem(STORAGE_KEYS.ACCESS, tokens.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH, tokens.refresh);
      localStorage.setItem(STORAGE_KEYS.ROLE, tokens.role);
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async logout(): Promise<void> {
    const access = this.accessToken;
    const refresh = this.refreshToken;
    this.accessToken = null;
    this.refreshToken = null;
    this.role = null;
    localStorage.removeItem(STORAGE_KEYS.ACCESS);
    localStorage.removeItem(STORAGE_KEYS.REFRESH);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    if (access && refresh) {
      try {
        await this.service.logout(access, refresh);
      } catch {
        // tokens already invalid — ignore
      }
    }
  }

  setError(error: string | null): void {
    this.error = error;
  }

  resetStatus(): void {
    this.status = API_STATUS.IDLE;
    this.error = null;
  }
}
