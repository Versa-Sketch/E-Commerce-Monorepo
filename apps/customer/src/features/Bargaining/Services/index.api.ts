import { AxiosInstance } from 'axios';
import { IBargainingService } from './index';
import { BARGAINING_ENDPOINTS } from '../Constants/BARGAINING_ENDPOINTS';
import { extractErrorMessage } from '../../../Common/utils/errorNormalizer';
import AppClient from '../../../infrastructure/AppClient';
import {
  BargainCartHistory,
  BargainMessage,
  BargainOffer,
  BargainOfferAction,
  BargainSession,
  BargainSessionHistory,
} from '../types/domain';

export class BargainingApiService implements IBargainingService {
  constructor(private client: AxiosInstance) {}

  async startSession(cartId: string): Promise<BargainSession> {
    try {
      const response = await this.client.post(BARGAINING_ENDPOINTS.CREATE_SESSION, { cart_id: cartId });
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getSession(sessionId: string): Promise<BargainSession> {
    try {
      const response = await this.client.get(BARGAINING_ENDPOINTS.GET_SESSION.replace(':sessionId', sessionId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async endSession(sessionId: string): Promise<BargainSession> {
    try {
      const response = await this.client.post(BARGAINING_ENDPOINTS.END_SESSION.replace(':sessionId', sessionId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async createOffer(sessionId: string, cartItemId: string, offeredAmount: string): Promise<BargainOffer> {
    try {
      const response = await this.client.post(BARGAINING_ENDPOINTS.CREATE_OFFER.replace(':sessionId', sessionId), {
        cart_item_id: cartItemId,
        offered_amount: offeredAmount,
      });
      const data = response.data?.data ?? response.data;
      return data.offer ?? data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async respondToOffer(offerId: string, action: BargainOfferAction, counterAmount?: string): Promise<BargainOffer> {
    try {
      const response = await this.client.post(BARGAINING_ENDPOINTS.RESPOND_OFFER.replace(':offerId', offerId), {
        action,
        ...(counterAmount ? { counter_amount: counterAmount } : {}),
      });
      const data = response.data?.data ?? response.data;
      return data.offer ?? data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getMessages(sessionId: string): Promise<BargainMessage[]> {
    try {
      const response = await this.client.get(BARGAINING_ENDPOINTS.GET_MESSAGES.replace(':sessionId', sessionId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getCartItemThread(cartItemId: string): Promise<BargainOffer[]> {
    try {
      const response = await this.client.get(BARGAINING_ENDPOINTS.GET_ITEM_THREAD.replace(':cartItemId', cartItemId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getSessionHistory(sessionId: string): Promise<BargainSessionHistory> {
    try {
      const response = await this.client.get(BARGAINING_ENDPOINTS.GET_SESSION_HISTORY.replace(':sessionId', sessionId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }

  async getCartHistory(cartId: string): Promise<BargainCartHistory> {
    try {
      const response = await this.client.get(BARGAINING_ENDPOINTS.GET_CART_HISTORY.replace(':cartId', cartId));
      return response.data?.data ?? response.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  }
}

export const bargainingService: IBargainingService = new BargainingApiService(AppClient);
