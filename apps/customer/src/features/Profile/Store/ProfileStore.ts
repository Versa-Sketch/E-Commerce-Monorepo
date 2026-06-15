import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Address, User } from '../../../types/shared';
import { AuthStore } from '../../Auth/Store/AuthStore';
import { STORAGE_KEYS } from '../../../Common/Constants';
import { StorageService } from '../../../services/storage';
export class ProfileStore {
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  isLocationConfirmed: boolean = false;
  constructor(private authStore: AuthStore) {
    makeAutoObservable(this);
    this.initializeAddresses();
    reaction(
      () => this.authStore.user,
      (user) => {
        if (user) {
          const savedAddresses = user.addresses || [];
          if (savedAddresses.length > 0) {
            this.addresses = savedAddresses;
          }
          if (!this.selectedAddress && this.addresses.length > 0) {
            this.selectedAddress = this.addresses.find((a) => a.isDefault) ?? this.addresses[0] ?? null;
          }
        }
      }
    );
  }
  private initializeAddresses() {
    const user = this.authStore.user;
    if (user) {
      const savedAddresses = user.addresses || [];
      if (savedAddresses.length > 0) {
        this.addresses = savedAddresses;
      } else {
        this.addresses = [
          {
            id: 'addr_home',
            label: 'Home',
            streetAddress: '24 Indiranagar 100 Feet Rd',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            latitude: 12.9716,
            longitude: 77.6406,
            isDefault: true,
          },
          {
            id: 'addr_work',
            label: 'Work',
            streetAddress: '15 Koramangala 5th Block',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560095',
            latitude: 12.9352,
            longitude: 77.6245,
            isDefault: false,
          },
          {
            id: 'addr_other',
            label: 'Other',
            streetAddress: '88 Whitefield Main Rd',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560066',
            latitude: 12.9698,
            longitude: 77.7499,
            isDefault: false,
          },
        ];
        this.syncToAuth();
      }
      this.selectedAddress = this.addresses.find((a) => a.isDefault) ?? this.addresses[0] ?? null;
    }
  }
  get currentUser(): User | null {
    return this.authStore.user;
  }
  get hasAddresses(): boolean {
    return this.addresses.length > 0;
  }
  addAddress(address: Address): void {
    this.addresses.push(address);
    if (address.isDefault || this.addresses.length === 1) {
      this.selectedAddress = address;
    }
    this.syncToAuth();
  }
  updateAddress(id: string, updates: Partial<Address>): void {
    const idx = this.addresses.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.addresses[idx] = { ...this.addresses[idx], ...updates };
      if (this.selectedAddress?.id === id) {
        this.selectedAddress = this.addresses[idx];
      }
      this.syncToAuth();
    }
  }
  removeAddress(id: string): void {
    this.addresses = this.addresses.filter((a) => a.id !== id);
    if (this.selectedAddress?.id === id) {
      this.selectedAddress = this.addresses.find((a) => a.isDefault) ?? this.addresses[0] ?? null;
    }
    this.syncToAuth();
  }
  setSelectedAddress(address: Address): void {
    this.selectedAddress = address;
  }
  setLocationConfirmed(confirmed: boolean): void {
    this.isLocationConfirmed = confirmed;
  }
  private syncToAuth(): void {
    if (this.authStore.user) {
      this.authStore.setCredentials(
        { ...this.authStore.user, addresses: this.addresses },
        this.authStore.token ?? ''
      );
    }
  }
}
