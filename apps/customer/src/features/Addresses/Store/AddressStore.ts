import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, ApiStatus } from '../../../Common/Constants';
import { normalizeError } from '../../../Common/utils/errorNormalizer';
import { AddressApi, AddressInput } from '../../../types/shared';
import { IAddressService } from '../Services';

export class AddressStore {
  addresses: AddressApi[] = [];
  fetchStatus: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;

  mutationStatus: ApiStatus = API_STATUS.IDLE;
  mutationError: string | null = null;

  constructor(private service: IAddressService) {
    makeAutoObservable(this);
  }

  get defaultAddress(): AddressApi | undefined {
    return this.addresses.find((a) => a.is_default);
  }

  async fetchAddresses(): Promise<void> {
    this.fetchStatus = API_STATUS.FETCHING;
    this.error = null;
    try {
      const addresses = await this.service.getAddresses();
      runInAction(() => {
        this.addresses = addresses;
        this.fetchStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.error = normalizeError(e);
        this.fetchStatus = API_STATUS.ERROR;
      });
    }
  }

  async createAddress(input: AddressInput): Promise<AddressApi | null> {
    this.mutationStatus = API_STATUS.FETCHING;
    this.mutationError = null;
    try {
      const address = await this.service.createAddress(input);
      runInAction(() => {
        if (address.is_default) {
          this.addresses = this.addresses.map((a) => ({ ...a, is_default: false }));
        }
        this.addresses.push(address);
        this.mutationStatus = API_STATUS.SUCCESS;
      });
      return address;
    } catch (e) {
      runInAction(() => {
        this.mutationError = normalizeError(e);
        this.mutationStatus = API_STATUS.ERROR;
      });
      return null;
    }
  }

  async updateAddress(addressId: string, input: Partial<AddressInput>): Promise<AddressApi | null> {
    this.mutationStatus = API_STATUS.FETCHING;
    this.mutationError = null;
    try {
      const address = await this.service.updateAddress(addressId, input);
      runInAction(() => {
        if (address.is_default) {
          this.addresses = this.addresses.map((a) => ({ ...a, is_default: false }));
        }
        this.addresses = this.addresses.map((a) => (a.id === addressId ? address : a));
        this.mutationStatus = API_STATUS.SUCCESS;
      });
      return address;
    } catch (e) {
      runInAction(() => {
        this.mutationError = normalizeError(e);
        this.mutationStatus = API_STATUS.ERROR;
      });
      return null;
    }
  }

  async deleteAddress(addressId: string): Promise<boolean> {
    this.mutationStatus = API_STATUS.FETCHING;
    this.mutationError = null;
    try {
      await this.service.deleteAddress(addressId);
      runInAction(() => {
        this.addresses = this.addresses.filter((a) => a.id !== addressId);
        this.mutationStatus = API_STATUS.SUCCESS;
      });
      return true;
    } catch (e) {
      runInAction(() => {
        this.mutationError = normalizeError(e);
        this.mutationStatus = API_STATUS.ERROR;
      });
      return false;
    }
  }

  async setDefaultAddress(addressId: string): Promise<boolean> {
    this.mutationStatus = API_STATUS.FETCHING;
    this.mutationError = null;
    try {
      const address = await this.service.setDefaultAddress(addressId);
      runInAction(() => {
        this.addresses = this.addresses.map((a) => ({ ...a, is_default: a.id === address.id }));
        this.mutationStatus = API_STATUS.SUCCESS;
      });
      return true;
    } catch (e) {
      runInAction(() => {
        this.mutationError = normalizeError(e);
        this.mutationStatus = API_STATUS.ERROR;
      });
      return false;
    }
  }
}
