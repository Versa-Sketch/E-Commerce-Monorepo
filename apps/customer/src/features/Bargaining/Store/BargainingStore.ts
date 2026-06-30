import { makeAutoObservable, runInAction } from 'mobx';
import { BargainConnectionStatus, IBargainingService, IBargainSocket, IBargainSocketFactory } from '../Services';
import {
  BargainCartHistory,
  BargainCartUpdate,
  BargainOffer,
  BargainOfferAction,
  BargainServerEvent,
  BargainSession,
  BargainSessionHistory,
} from '../types/domain';
import { API_STATUS, ApiStatus } from '../../../Common/Constants';
import { normalizeError } from '../../../Common/utils/errorNormalizer';

export class BargainingStore {
  session: BargainSession | null = null;
  sessionStatus: ApiStatus = API_STATUS.IDLE;
  sessionError: string | null = null;
  connectionStatus: BargainConnectionStatus = 'closed';
  typingUsers: Map<string, boolean> = new Map();

  cartHistory: BargainCartHistory | null = null;
  cartHistoryStatus: ApiStatus = API_STATUS.IDLE;
  cartHistoryError: string | null = null;

  sessionHistory: BargainSessionHistory | null = null;
  sessionHistoryStatus: ApiStatus = API_STATUS.IDLE;
  sessionHistoryError: string | null = null;

  private socket: IBargainSocket | null = null;
  private connectedSessionId: string | null = null;

  constructor(private service: IBargainingService, private socketFactory: IBargainSocketFactory) {
    makeAutoObservable(this, {
      service: false,
      socketFactory: false,
      socket: false,
      connectedSessionId: false,
    } as never);
  }

  get isActive(): boolean {
    return this.session?.status === 'ACTIVE';
  }

  get offersByCartItem(): Record<string, import('../types/domain').BargainOffer> {
    return this.session?.offers ?? {};
  }

  get messages(): import('../types/domain').BargainMessage[] {
    return this.session?.messages ?? [];
  }

  get expiresAt(): string | null {
    return this.session?.expires_at ?? null;
  }

  async startSession(cartId: string): Promise<BargainSession> {
    console.log('[Bargaining] startSession → cartId:', cartId);
    this.sessionStatus = API_STATUS.FETCHING;
    this.sessionError = null;
    try {
      const session = this.normalizeSession(await this.service.startSession(cartId));
      console.log('[Bargaining] startSession ✓ sessionId:', session.session_id);
      runInAction(() => {
        this.session = session;
        this.sessionStatus = API_STATUS.SUCCESS;
      });
      return session;
    } catch (e) {
      runInAction(() => {
        this.sessionError = normalizeError(e);
        this.sessionStatus = API_STATUS.ERROR;
      });
      throw e;
    }
  }

  async loadSession(sessionId: string): Promise<void> {
    console.log('[Bargaining] loadSession → sessionId:', sessionId);
    this.sessionStatus = API_STATUS.FETCHING;
    this.sessionError = null;
    try {
      const session = this.normalizeSession(await this.service.getSession(sessionId));
      console.log('[Bargaining] loadSession ✓ messages:', session.messages?.length, 'offers:', Object.keys(session.offers ?? {}).length);
      runInAction(() => {
        this.session = session;
        this.sessionStatus = API_STATUS.SUCCESS;
      });
      this.connectSocket();
    } catch (e) {
      runInAction(() => {
        this.sessionError = normalizeError(e);
        this.sessionStatus = API_STATUS.ERROR;
      });
    }
  }

  async loadCartHistory(cartId: string): Promise<void> {
    console.log('[Bargaining] loadCartHistory → cartId:', cartId);
    this.cartHistoryStatus = API_STATUS.FETCHING;
    this.cartHistoryError = null;
    try {
      const history = await this.service.getCartHistory(cartId);
      console.log('[Bargaining] loadCartHistory ✓ sessions:', (history as any)?.sessions?.length ?? JSON.stringify(history));
      runInAction(() => {
        this.cartHistory = history;
        this.cartHistoryStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      const msg = normalizeError(e);
      console.error('[Bargaining] loadCartHistory failed:', msg, e);
      runInAction(() => {
        this.cartHistoryError = msg;
        this.cartHistoryStatus = API_STATUS.ERROR;
      });
    }
  }

  async loadSessionHistory(sessionId: string): Promise<void> {
    this.sessionHistoryStatus = API_STATUS.FETCHING;
    this.sessionHistoryError = null;
    try {
      const history = await this.service.getSessionHistory(sessionId);
      runInAction(() => {
        this.sessionHistory = history;
        this.sessionHistoryStatus = API_STATUS.SUCCESS;
      });
    } catch (e) {
      runInAction(() => {
        this.sessionHistoryError = normalizeError(e);
        this.sessionHistoryStatus = API_STATUS.ERROR;
      });
    }
  }

  connectSocket(): void {
    if (!this.session) return;
    if (this.connectedSessionId === this.session.session_id) return;
    this.connectedSessionId = this.session.session_id;
    this.disconnect();
    console.log('[Bargaining] connectSocket → sessionId:', this.session.session_id);
    const socket = this.socketFactory.create();
    this.socket = socket;
    socket.connect(
      this.session.session_id,
      (event) => {
        console.log('[Bargaining] WS event:', event.type);
        this.handleEvent(event);
      },
      (status) => {
        console.log('[Bargaining] WS status:', status);
        runInAction(() => (this.connectionStatus = status));
      }
    );
  }

  disconnect(): void {
    this.connectedSessionId = null;
    this.socket?.disconnect();
    this.socket = null;
    this.connectionStatus = 'closed';
    this.typingUsers.clear();
  }

  sendOffer(cartItemId: string, offeredAmount: string, senderId?: string): void {
    console.log('[Bargaining] sendOffer → cartItemId:', cartItemId, 'amount:', offeredAmount);
    if (this.session) {
      const optimisticOfferId = `optimistic-offer-${Date.now()}`;
      const optimisticOffer: BargainOffer = {
        offer_id: optimisticOfferId,
        cart_item_id: cartItemId,
        parent_id: null,
        offered_by: 'CUSTOMER',
        offered_amount: offeredAmount,
        original_price: offeredAmount,
        accepted_amount: null,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };
      runInAction(() => {
        this.session!.offers[cartItemId] = optimisticOffer;
        this.session!.messages.push({
          message_id: optimisticOfferId,
          sender_id: senderId ?? '',
          sender_name: 'You',
          message: `Offered ₹${offeredAmount}`,
          message_type: 'OFFER',
          bargain_offer_id: optimisticOfferId,
          created_at: new Date().toISOString(),
          status: 'SENT',
        });
      });
    }
    this.socket?.send({ type: 'bargain_offer', cart_item_id: cartItemId, offered_amount: offeredAmount });
  }

  respondToOffer(offerId: string, action: BargainOfferAction, counterAmount?: string): void {
    console.log('[Bargaining] respondToOffer → offerId:', offerId, 'action:', action, 'counter:', counterAmount);
    this.socket?.send({ type: 'bargain_response', offer_id: offerId, action, counter_amount: counterAmount });
  }

  sendChatMessage(message: string, senderId?: string, senderName?: string): void {
    console.log('[Bargaining] sendChatMessage →', message);
    if (this.session) {
      runInAction(() => {
        this.session!.messages.push({
          message_id: `optimistic-${Date.now()}`,
          sender_id: senderId ?? '',
          sender_name: senderName ?? 'You',
          message,
          message_type: 'TEXT',
          bargain_offer_id: null,
          created_at: new Date().toISOString(),
          status: 'SENT',
        });
      });
    }
    this.socket?.send({ type: 'chat_message', message });
  }

  setTyping(isTyping: boolean): void {
    this.socket?.send({ type: 'typing', is_typing: isTyping });
  }

  markSeen(): void {
    this.socket?.send({ type: 'mark_seen' });
  }

  async endSession(): Promise<void> {
    if (!this.session) return;
    try {
      const updated = this.normalizeSession(await this.service.endSession(this.session.session_id));
      runInAction(() => {
        this.session = updated;
      });
    } catch (e) {
      runInAction(() => {
        this.sessionError = normalizeError(e);
      });
    } finally {
      this.disconnect();
    }
  }

  private handleEvent(event: BargainServerEvent): void {
    runInAction(() => {
      const session = this.session;
      switch (event.type) {
        case 'session_started':
          this.session = this.normalizeSession(event.payload);
          return;
        case 'new_offer': {
          if (!session) return;
          const realOffer = event.payload.offer;
          session.offers[realOffer.cart_item_id] = realOffer;
          const optimisticMsgIdx = session.messages.findIndex(
            m => m.message_type === 'OFFER' && m.message_id.startsWith('optimistic-offer-')
          );
          if (optimisticMsgIdx >= 0) {
            session.messages[optimisticMsgIdx] = {
              ...session.messages[optimisticMsgIdx],
              message_id: realOffer.offer_id,
              bargain_offer_id: realOffer.offer_id,
            };
          }
          return;
        }
        case 'offer_rejected':
        case 'counter_offer':
          if (!session) return;
          session.offers[event.payload.offer.cart_item_id] = event.payload.offer;
          return;
        case 'offer_accepted':
          if (!session) return;
          session.offers[event.payload.offer.cart_item_id] = event.payload.offer;
          this.applyCartUpdate(event.payload.cart);
          return;
        case 'chat_message': {
          if (!session) return;
          if (session.messages.some(m => m.message_id === event.payload.message_id)) return;
          const optimisticIdx = session.messages.findIndex(
            m => m.message_id.startsWith('optimistic-') && m.sender_id === event.payload.sender_id
          );
          if (optimisticIdx >= 0) {
            session.messages.splice(optimisticIdx, 1, event.payload);
          } else {
            session.messages.push(event.payload);
          }
          return;
        }
        case 'messages_seen':
          if (!session) return;
          session.seen_by = { ...session.seen_by, [event.payload.user_id]: event.payload.seen_at };
          return;
        case 'messages_delivered':
          if (!session) return;
          session.delivered_by = { ...session.delivered_by, [event.payload.user_id]: event.payload.delivered_at };
          return;
        case 'typing':
          this.typingUsers.set(event.payload.user_id, event.payload.is_typing);
          return;
        case 'cart_updated':
          this.applyCartUpdate(event.payload);
          return;
        case 'session_ended':
          if (!session) return;
          session.status = event.payload.status;
          session.ended_at = event.payload.ended_at;
          return;
        case 'session_expired':
          if (!session) return;
          session.status = event.payload.status;
          return;
        case 'error':
          this.sessionError = event.payload.message;
          return;
      }
    });
  }

  private applyCartUpdate(update: BargainCartUpdate): void {
    if (!this.session) return;
    this.session.cart = update;
  }

  /** Ensures optional/new fields the real API may omit are present so the rest of the store can rely on them. */
  private normalizeSession(session: BargainSession): BargainSession {
    return {
      ...session,
      seen_by: session.seen_by ?? {},
      delivered_by: session.delivered_by ?? {},
      messages: session.messages ?? [],
      offers: session.offers ?? {},
    };
  }
}
