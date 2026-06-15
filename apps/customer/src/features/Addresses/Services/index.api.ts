import { AxiosInstance } from 'axios';
import { ADDRESS_ENDPOINTS } from '../Constants/ADDRESS_ENDPOINTS';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import { AddressApi, AddressInput } from '../../../types/shared';
import { IAddressService } from './index';
export class AddressApiService implements IAddressService {
  constructor(private client: AxiosInstance) {}
  async getAddresses(): Promise<AddressApi[]> {
    try {
      const response = await this.client.get(ADDRESS_ENDPOINTS.LIST);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async getAddressById(addressId: string): Promise<AddressApi> {
    try {
      const response = await this.client.get(ADDRESS_ENDPOINTS.DETAIL.replace(':id', addressId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async createAddress(input: AddressInput): Promise<AddressApi> {
    try {
      const response = await this.client.post(ADDRESS_ENDPOINTS.CREATE, input);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async updateAddress(addressId: string, input: Partial<AddressInput>): Promise<AddressApi> {
    try {
      const response = await this.client.patch(ADDRESS_ENDPOINTS.UPDATE.replace(':id', addressId), input);
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async deleteAddress(addressId: string): Promise<void> {
    try {
      await this.client.delete(ADDRESS_ENDPOINTS.DELETE.replace(':id', addressId));
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
  async setDefaultAddress(addressId: string): Promise<AddressApi> {
    try {
      const response = await this.client.patch(ADDRESS_ENDPOINTS.SET_DEFAULT.replace(':id', addressId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}
export const addressService: IAddressService = new AddressApiService(AppClient);
