import { makeAutoObservable, runInAction } from 'mobx';
import type { SessionStore } from '../../Auth/Store';
import { USE_FIXTURES } from '../../Common/services/config';
import type { ISettingsService } from '../Services';
import { SettingsApiService } from '../Services/index.api';
import { SettingsFixtureService } from '../Services/index.fixture';
import type { ShopProfile, OperatingHourItem, ShopProfileUpdateRequest } from '../types/domain';

export type LoadState = 'idle' | 'loading' | 'error';

export class AuthStore {
  // UI Bindings (Mirroring ShopProfile fields)
  storeName: string = 'FreshMart Hyperlocal';
  ownerName: string = 'Priya Sharma';
  storeType: string = 'Grocery';
  logo: string = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200';
  coverImage: string = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800';
  description: string = 'Providing organic farm-fresh fruits, vegetables, and daily essentials straight to your doorstep.';
  timings: string = '07:00 AM - 10:00 PM';
  deliveryRadius: number = 5.5;
  minimumOrder: number = 150;
  codEnabled: boolean = true;
  surgeFee: number = 20;
  refundPolicy: string = 'Refunds approved for products returned within 24 hours of delivery in original packaging.';
  returnPolicy: string = 'Easy return on spot or within 24 hours for fresh items.';
  cancellationWindow: number = 5;
  isAuthenticated: boolean = true;

  operatingHours: OperatingHourItem[] = [];
  profileState: LoadState = 'idle';
  profileError: string | null = null;
  saving: boolean = false;

  private session: SessionStore;
  private service: ISettingsService;

  constructor(session: SessionStore, service?: ISettingsService) {
    this.session = session;
    this.service =
      service ??
      (USE_FIXTURES
        ? new SettingsFixtureService()
        : new SettingsApiService(session));
    makeAutoObservable(this);
  }

  formatTimings(hours: OperatingHourItem[]): string {
    const active = hours.find((h) => !h.is_closed);
    if (!active) return 'Closed';
    
    // Format "07:00:00" to "07:00 AM" if needed, or display as is
    const formatTime = (t: string) => {
      const parts = t.split(':');
      if (parts.length < 2) return t;
      let hour = parseInt(parts[0], 10);
      const min = parts[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      return `${hour}:${min} ${ampm}`;
    };

    return `${formatTime(active.opening_time)} - ${formatTime(active.closing_time)}`;
  }

  async fetchProfile(): Promise<void> {
    runInAction(() => {
      this.profileState = 'loading';
      this.profileError = null;
    });
    const res = await this.service.fetchProfile();
    runInAction(() => {
      if (res.ok && res.data) {
        this.storeName = res.data.name;
        this.description = res.data.description;
        this.logo = res.data.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200';
        this.coverImage = res.data.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800';
        this.deliveryRadius = res.data.delivery_radius_km;
        this.operatingHours = res.data.operating_hours;
        if (res.data.operating_hours && res.data.operating_hours.length > 0) {
          this.timings = this.formatTimings(res.data.operating_hours);
        }
        this.profileState = 'idle';
      } else {
        this.profileState = 'error';
        this.profileError = res.message;
      }
    });
  }

  async updateSettings(fields: {
    storeName?: string;
    description?: string;
    timings?: string;
    deliveryRadius?: number;
    minimumOrder?: number;
    codEnabled?: boolean;
    surgeFee?: number;
    refundPolicy?: string;
    returnPolicy?: string;
    cancellationWindow?: number;
  }): Promise<{ ok: boolean; message: string }> {
    runInAction(() => {
      this.saving = true;
    });

    const updatePayload: ShopProfileUpdateRequest = {};
    if (fields.storeName !== undefined) updatePayload.name = fields.storeName;
    if (fields.description !== undefined) updatePayload.description = fields.description;
    if (fields.deliveryRadius !== undefined) updatePayload.delivery_radius_km = fields.deliveryRadius;

    // If timings are provided and changed, we can update operating hours
    if (fields.timings !== undefined) {
      this.timings = fields.timings;
      // Parse timings of format "07:00 AM - 10:00 PM"
      const parts = fields.timings.split('-');
      if (parts.length === 2) {
        const parseTimeStr = (s: string) => {
          s = s.trim().toUpperCase();
          const match = s.match(/(\d+):(\d+)\s*(AM|PM)?/);
          if (match) {
            let hour = parseInt(match[1], 10);
            const min = match[2];
            const ampm = match[3];
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            return `${hour.toString().padStart(2, '0')}:${min}:00`;
          }
          return '09:00:00';
        };
        const opening = parseTimeStr(parts[0]);
        const closing = parseTimeStr(parts[1]);
        const updatedHours = Array.from({ length: 7 }, (_, i) => ({
          day_of_week: i,
          opening_time: opening,
          closing_time: closing,
          is_closed: false,
        }));
        updatePayload.operating_hours = updatedHours;
      }
    }

    const res = await this.service.updateProfile(updatePayload);

    let success = false;
    let msg = '';
    runInAction(() => {
      this.saving = false;
      if (res.ok && res.data) {
        this.storeName = res.data.name;
        this.description = res.data.description;
        this.logo = res.data.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200';
        this.coverImage = res.data.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800';
        this.deliveryRadius = res.data.delivery_radius_km;
        this.operatingHours = res.data.operating_hours;
        if (res.data.operating_hours && res.data.operating_hours.length > 0) {
          this.timings = this.formatTimings(res.data.operating_hours);
        }
        // Local fields
        if (fields.minimumOrder !== undefined) this.minimumOrder = fields.minimumOrder;
        if (fields.codEnabled !== undefined) this.codEnabled = fields.codEnabled;
        if (fields.surgeFee !== undefined) this.surgeFee = fields.surgeFee;
        if (fields.refundPolicy !== undefined) this.refundPolicy = fields.refundPolicy;
        if (fields.returnPolicy !== undefined) this.returnPolicy = fields.returnPolicy;
        if (fields.cancellationWindow !== undefined) this.cancellationWindow = fields.cancellationWindow;
        
        success = true;
        msg = 'Profile updated successfully.';
      } else {
        msg = res.message ?? 'Failed to update profile.';
      }
    });

    return { ok: success, message: msg };
  }

  toggleCOD() {
    this.codEnabled = !this.codEnabled;
  }
}

export type AuthStoreType = AuthStore;
