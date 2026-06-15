import {
  BargainCartHistory,
  BargainClientMessage,
  BargainMessage,
  BargainOffer,
  BargainOfferAction,
  BargainServerEvent,
  BargainSession,
  BargainSessionHistory,
} from '../types/domain';

export interface IBargainingService {
  startSession(cartId: string): Promise<BargainSession>;
  getSession(sessionId: string): Promise<BargainSession>;
  endSession(sessionId: string): Promise<BargainSession>;
  createOffer(sessionId: string, cartItemId: string, offeredAmount: string): Promise<BargainOffer>;
  respondToOffer(offerId: string, action: BargainOfferAction, counterAmount?: string): Promise<BargainOffer>;
  getMessages(sessionId: string): Promise<BargainMessage[]>;
  getCartItemThread(cartItemId: string): Promise<BargainOffer[]>;
  getSessionHistory(sessionId: string): Promise<BargainSessionHistory>;
  getCartHistory(cartId: string): Promise<BargainCartHistory>;
}

export type BargainConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface IBargainSocket {
  connect(
    sessionId: string,
    onMessage: (event: BargainServerEvent) => void,
    onStatusChange?: (status: BargainConnectionStatus) => void
  ): void;
  send(message: BargainClientMessage): void;
  disconnect(): void;
}

export interface IBargainSocketFactory {
  create(): IBargainSocket;
}
