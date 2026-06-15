import { makeAutoObservable, runInAction } from 'mobx';
import { IAuthService, MeResponse, RegisterPayload } from '../Services';
import { User } from '../../../types/shared';
import {
  API_STATUS,
  ApiStatus,
  STORAGE_KEYS,
  apiRoleToAppRole,
  appRoleToApiRole,
} from '../../../Common/Constants';
import { StorageService } from '../../../services/storage';
export class AuthStore {
  user: User | null = null;
  token: string | null = null;
  refreshToken: string | null = null;
  status: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  constructor(private service: IAuthService) {
    makeAutoObservable(this);
    this.user         = StorageService.getObject<User>(STORAGE_KEYS.USER_DATA);
    this.token        = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN) ?? null;
    this.refreshToken = StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN) ?? null;
  }
  get isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }
  get currentUser(): User | null {
    return this.user;
  }
  get userRole() {
    return this.user?.role ?? null;
  }
  get isLoading(): boolean {
    return this.status === API_STATUS.FETCHING;
  }
  private _setLoading() {
    this.status = API_STATUS.FETCHING;
    this.error  = null;
  }
  private _setError(msg: string) {
    this.error  = msg;
    this.status = API_STATUS.ERROR;
  }
  private _applyTokens(access: string, refresh: string, apiRole: string, phone: string) {
    const appRole = apiRoleToAppRole(apiRole);
    const user: User = {
      id:            '',
      name:          '',
      email:         '',
      phone,
      role:          appRole,
      shopId:        null,
      walletBalance: 0,
      addresses:     [],
      createdAt:     new Date().toISOString(),
    };
    this.user         = user;
    this.token        = access;
    this.refreshToken = refresh;
    this.status       = API_STATUS.SUCCESS;
    StorageService.setObject(STORAGE_KEYS.USER_DATA, user);
    StorageService.set(STORAGE_KEYS.AUTH_TOKEN, access);
    StorageService.set(STORAGE_KEYS.REFRESH_TOKEN, refresh);
  }
  async register(phone: string, fullName: string): Promise<void> {
    this._setLoading();
    try {
      const payload: RegisterPayload = {
        phone_number: phone,       
        full_name:    fullName,
        role:         'CUSTOMER',  
      };
      const { message } = await this.service.register(payload);
      runInAction(() => {
        this.status = API_STATUS.SUCCESS;
        this.error  = null;
      });
      console.log('[AuthStore.register]', message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed.';
      runInAction(() => this._setError(msg));
      throw e; 
    }
  }
  async verifyOtp(phone: string, otp: string, apiRole = 'CUSTOMER'): Promise<void> {
    this._setLoading();
    try {
      const tokens = await this.service.verifyOtp({
        phone_number: phone,
        role:         apiRole as RegisterPayload['role'],
        otp,
      });
      runInAction(() => this._applyTokens(tokens.access, tokens.refresh, tokens.role, phone));
      await this.fetchProfile();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'OTP verification failed.';
      runInAction(() => this._setError(msg));
      throw e;
    }
  }
  private _mapMeToUser(me: MeResponse): Partial<User> {
    return {
      id:     me.id,
      name:   me.full_name,
      phone:  me.phone_number,
      role:   apiRoleToAppRole(me.role),
      shopId: me.shop_id,
    };
  }
  async fetchProfile(): Promise<void> {
    try {
      const me = await this.service.fetchMe();
      runInAction(() => this.patchUser(this._mapMeToUser(me)));
    } catch (e) {
      console.error('[AuthStore.fetchProfile] Failed to fetch profile:', e);
    }
  }
  async loginWithPhone(
    phone: string,
    role: User['role'] = 'customer'
  ): Promise<'ok' | 'not_found'> {
    this._setLoading();
    try {
      const apiRole = appRoleToApiRole(role);
      await this.service.login(phone, apiRole);
      runInAction(() => { this.status = API_STATUS.SUCCESS; this.error = null; });
      return 'ok';
    } catch (e) {
      const code = (e as { code?: string }).code;
      const msg  = e instanceof Error ? e.message : 'Login failed.';
      runInAction(() => this._setError(msg));
      if (code === 'NOT_FOUND') return 'not_found';
      return 'not_found';
    }
  }
  async logout(): Promise<void> {
    const rt = this.refreshToken || StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN);
    const at = this.token || StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
    console.log('[AuthStore.logout] Triggered logout with tokens:', { rt, at });

    runInAction(() => {
      this.user         = null;
      this.token        = null;
      this.refreshToken = null;
      this.status       = API_STATUS.IDLE;
      this.error        = null;
    });

    if (rt && at) {
      await this.service.logout(rt, at).catch((err) => {
        console.error('[AuthStore.logout] Logout API call failed:', err);
      });
    } else {
      console.warn('[AuthStore.logout] Missing refresh token or access token. Skipping API call.', { rt, at });
    }

    StorageService.delete(STORAGE_KEYS.USER_DATA);
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
  }
  clearSession(): void {
    this.user         = null;
    this.token        = null;
    this.refreshToken = null;
    this.status       = API_STATUS.IDLE;
    this.error        = null;
    StorageService.delete(STORAGE_KEYS.USER_DATA);
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
  }
  setCredentials(user: User, token: string, refreshToken?: string): void {
    this.user         = user;
    this.token        = token;
    if (refreshToken !== undefined) {
      this.refreshToken = refreshToken ?? null;
      if (refreshToken) {
        StorageService.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      } else {
        StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }
    StorageService.setObject(STORAGE_KEYS.USER_DATA, user);
    StorageService.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }
  updateWalletBalance(amount: number): void {
    if (this.user) {
      this.user = { ...this.user, walletBalance: amount };
      StorageService.setObject(STORAGE_KEYS.USER_DATA, this.user);
    }
  }
  patchUser(partial: Partial<User>): void {
    if (this.user) {
      this.user = { ...this.user, ...partial };
      StorageService.setObject(STORAGE_KEYS.USER_DATA, this.user);
    }
  }
}
