import { IAddressService } from './index';
import { AddressApi, AddressInput } from '../../../types/shared';

let MOCK_ADDRESSES: AddressApi[] = [
  {
    id: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
    address_line1: '221B Baker Street',
    address_line2: 'Near Central Park',
    latitude: '12.971600',
    longitude: '77.594600',
    state: 'Karnataka',
    pincode: '560001',
    address_type: 'HOME',
    is_default: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'a2b3c4d5-e6f7-8901-2345-67890abcdef1',
    address_line1: '15 Koramangala 5th Block',
    address_line2: 'Near Forum Mall',
    latitude: '12.935200',
    longitude: '77.624500',
    state: 'Karnataka',
    pincode: '560095',
    address_type: 'WORK',
    is_default: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

const generateId = () => `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export class AddressFixtureService implements IAddressService {
  async getAddresses(): Promise<AddressApi[]> {
    await new Promise((res) => setTimeout(res, 300));
    return [...MOCK_ADDRESSES].sort((a, b) => Number(b.is_default) - Number(a.is_default));
  }
  async getAddressById(addressId: string): Promise<AddressApi> {
    await new Promise((res) => setTimeout(res, 200));
    const address = MOCK_ADDRESSES.find((a) => a.id === addressId);
    if (!address) throw new Error('Address not found.');
    return address;
  }
  async createAddress(input: AddressInput): Promise<AddressApi> {
    await new Promise((res) => setTimeout(res, 300));
    const now = new Date().toISOString();
    const address: AddressApi = {
      id: generateId(),
      address_line1: input.address_line1,
      address_line2: input.address_line2,
      latitude: input.latitude !== undefined ? input.latitude.toFixed(6) : '0.000000',
      longitude: input.longitude !== undefined ? input.longitude.toFixed(6) : '0.000000',
      state: input.state,
      pincode: input.pincode,
      address_type: input.address_type ?? 'OTHER',
      is_default: input.is_default ?? MOCK_ADDRESSES.length === 0,
      created_at: now,
      updated_at: now,
    };
    if (address.is_default) {
      MOCK_ADDRESSES = MOCK_ADDRESSES.map((a) => ({ ...a, is_default: false }));
    }
    MOCK_ADDRESSES.push(address);
    return address;
  }
  async updateAddress(addressId: string, input: Partial<AddressInput>): Promise<AddressApi> {
    await new Promise((res) => setTimeout(res, 300));
    const idx = MOCK_ADDRESSES.findIndex((a) => a.id === addressId);
    if (idx === -1) throw new Error('Address not found.');
    if (input.is_default) {
      MOCK_ADDRESSES = MOCK_ADDRESSES.map((a) => ({ ...a, is_default: false }));
    }
    const existing = MOCK_ADDRESSES[idx];
    const updated: AddressApi = {
      ...existing,
      ...input,
      latitude: input.latitude !== undefined ? input.latitude.toFixed(6) : existing.latitude,
      longitude: input.longitude !== undefined ? input.longitude.toFixed(6) : existing.longitude,
      updated_at: new Date().toISOString(),
    };
    MOCK_ADDRESSES[idx] = updated;
    return updated;
  }
  async deleteAddress(addressId: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    MOCK_ADDRESSES = MOCK_ADDRESSES.filter((a) => a.id !== addressId);
  }
  async setDefaultAddress(addressId: string): Promise<AddressApi> {
    await new Promise((res) => setTimeout(res, 200));
    const idx = MOCK_ADDRESSES.findIndex((a) => a.id === addressId);
    if (idx === -1) throw new Error('Address not found.');
    MOCK_ADDRESSES = MOCK_ADDRESSES.map((a) => ({ ...a, is_default: a.id === addressId }));
    return MOCK_ADDRESSES[idx];
  }
}
export const addressService: IAddressService = new AddressFixtureService();
