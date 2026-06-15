import { AddressApi, AddressInput } from '../../../types/shared';
export interface IAddressService {
  getAddresses(): Promise<AddressApi[]>;
  getAddressById(addressId: string): Promise<AddressApi>;
  createAddress(input: AddressInput): Promise<AddressApi>;
  updateAddress(addressId: string, input: Partial<AddressInput>): Promise<AddressApi>;
  deleteAddress(addressId: string): Promise<void>;
  setDefaultAddress(addressId: string): Promise<AddressApi>;
}
