import { makeAutoObservable, runInAction } from 'mobx';
import { BargainHttpAdapter, BargainRestClient } from '../client/BargainRestClient';
import { GatewayConnectionStatus, IBargainGateway } from '../client/BargainGatewaySocket';
import { BargainMessage, BargainOffer, BargainSession } from '../types/domain';
import { BargainServerEvent } from '../types/events';
import { BargainRole, otherRole } from '../types/role';
import { dealHealth, dealProbability, discountPercent, secondsRemaining } from '../utils/bargainMath';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// A flattened, dashboard-ready view of one cart item's negotiation —
// equivalent to merchant's old `Bargain` derived view-model, but computed
// fresh from plain BargainSession/BargainOffer/BargainCartItem data instead
// of living as a separate class.
export interface BargainCardView {
  sessionId: string;
  cartItemId: string;
  counterpartyName: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  currentPrice: number;
  offeredAmount: number;
  status: BargainOffer['status'];
  secondsLeft: number;
  discountPercent: number;
  dealProbability: number;
  dealHealth: ReturnType<typeof dealHealth>;
  isExpiringSoon: boolean;
}

export interface BargainingStoreOptions {
  role: BargainRole;
  getToken: () => string | null;
  http: BargainHttpAdapter;
  gateway: IBargainGateway;
  wsBaseUrl?: string;
}

export class BargainingStore {
  role: BargainRole;
  sessions: Record<string, BargainSession> = {};
  activeSessionId: string | null = null;
  connectionStatus: GatewayConnectionStatus = 'offline';
  sessionStatus: ApiStatus = 'idle';
  sessionError: string | null = null;
  actionStatus: ApiStatus = 'idle';
  actionError: string | null = null;
  private nowTick = 0; // bumped every second so countdown-derived getters re-evaluate

  private getToken: () => string | null;
  private api: BargainRestClient;
  private gateway: IBargainGateway;
  private unsubscribeStatus: (() => void) | null = null;
  private sessionUnsubscribes: Record<string, () => void> = {};
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: BargainingStoreOptions) {
    this.role = options.role;
    this.getToken = options.getToken;
    this.api = new BargainRestClient(options.http);
    this.gateway = options.gateway;
    makeAutoObservable(this, { sessions: true } as any);

    this.unsubscribeStatus = this.gateway.onStatusChange((status) => {
      runInAction(() => {
        this.connectionStatus = status;
      });
    });
  }

  get currentSession(): BargainSession | null {
    return this.activeSessionId ? this.sessions[this.activeSessionId] ?? null : null;
  }

  // Offers the *other* party made that THIS role needs to respond to.
  get pendingOffersForViewer(): BargainOffer[] {
    const session = this.currentSession;
    if (!session) return [];
    return Object.values(session.offers).filter(
      (offer) => offer.status === 'PENDING' && offer.offeredBy === otherRole(this.role)
    );
  }

  // Flattened dashboard list across every loaded session — the merchant-style view.
  get bargains(): BargainCardView[] {
    void this.nowTick; // re-derive every tick for live countdowns
    const cards: BargainCardView[] = [];
    for (const session of Object.values(this.sessions)) {
      for (const item of session.cart) {
        const offer = session.offers[item.cartItemId];
        if (!offer) continue;
        const secondsLeft = secondsRemaining(session.expiresAt);
        cards.push({
          sessionId: session.sessionId,
          cartItemId: item.cartItemId,
          counterpartyName: session.counterpartyName ?? 'Customer',
          productName: item.productName,
          productImage: item.productImage,
          originalPrice: item.originalPrice,
          currentPrice: item.effectivePrice,
          offeredAmount: offer.offeredAmount,
          status: offer.status,
          secondsLeft,
          discountPercent: discountPercent(item.effectivePrice, offer.offeredAmount),
          dealProbability: dealProbability({
            status: offer.status,
            currentPrice: item.effectivePrice,
            offeredAmount: offer.offeredAmount,
            roundsSoFar: offer.parentId ? 1 : 0,
            merchantCost: item.merchantCost,
          }),
          dealHealth: dealHealth(
            dealProbability({
              status: offer.status,
              currentPrice: item.effectivePrice,
              offeredAmount: offer.offeredAmount,
              roundsSoFar: offer.parentId ? 1 : 0,
              merchantCost: item.merchantCost,
            })
          ),
          isExpiringSoon: offer.status === 'PENDING' && secondsLeft > 0 && secondsLeft <= 120,
        });
      }
    }
    return cards;
  }

  get pendingBargains(): BargainCardView[] {
    return this.bargains.filter((b) => b.status === 'PENDING');
  }

  get resolvedBargains(): BargainCardView[] {
    return this.bargains.filter((b) => b.status !== 'PENDING');
  }

  // ── Connection lifecycle ───────────────────────────────────────────────────

  connect(): void {
    const token = this.getToken();
    if (token) this.gateway.connect(token);
  }

  disconnect(): void {
    this.gateway.disconnect();
    Object.values(this.sessionUnsubscribes).forEach((unsub) => unsub());
    this.sessionUnsubscribes = {};
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.unsubscribeStatus?.();
  }

  startCountdownTick(): () => void {
    if (!this.tickTimer) {
      this.tickTimer = setInterval(() => runInAction(() => { this.nowTick += 1; }), 1000);
    }
    return () => {
      if (this.tickTimer) clearInterval(this.tickTimer);
      this.tickTimer = null;
    };
  }

  // ── Session loading ────────────────────────────────────────────────────────

  async startSession(cartId: string): Promise<void> {
    this.sessionStatus = 'loading';
    this.sessionError = null;
    try {
      const session = (await this.api.startSession(cartId)) as unknown as BargainSession;
      this.applySession(session);
    } catch (e) {
      runInAction(() => {
        this.sessionStatus = 'error';
        this.sessionError = e instanceof Error ? e.message : 'Could not start session';
      });
      throw e;
    }
  }

  async loadSession(sessionId: string): Promise<void> {
    this.sessionStatus = 'loading';
    this.sessionError = null;
    try {
      const session = (await this.api.getSession(sessionId)) as unknown as BargainSession;
      this.applySession(session);
    } catch (e) {
      runInAction(() => {
        this.sessionStatus = 'error';
        this.sessionError = e instanceof Error ? e.message : 'Could not load session';
      });
      throw e;
    }
  }

  private applySession(session: BargainSession): void {
    runInAction(() => {
      this.sessions[session.sessionId] = session;
      this.activeSessionId = session.sessionId;
      this.sessionStatus = 'success';
    });
    if (!this.sessionUnsubscribes[session.sessionId]) {
      this.sessionUnsubscribes[session.sessionId] = this.gateway.subscribe(session.sessionId, (event) =>
        this.handleServerEvent(session.sessionId, event)
      );
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async sendOffer(cartItemId: string, offeredAmount: number): Promise<void> {
    const session = this.currentSession;
    if (!session) return;
    this.actionStatus = 'loading';
    this.actionError = null;
    try {
      const offer = (await this.api.createOffer(session.sessionId, cartItemId, offeredAmount)) as unknown as BargainOffer;
      runInAction(() => this.applyOffer(session.sessionId, cartItemId, offer));
    } catch (e) {
      runInAction(() => {
        this.actionStatus = 'error';
        this.actionError = e instanceof Error ? e.message : 'Could not send offer';
      });
      throw e;
    }
  }

  async respondToOffer(offer: BargainOffer, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterAmount?: number): Promise<void> {
    this.actionStatus = 'loading';
    this.actionError = null;
    try {
      const updated = (await this.api.respondToOffer(offer.offerId, action, counterAmount)) as unknown as BargainOffer;
      const session = this.currentSession;
      if (session) runInAction(() => this.applyOffer(session.sessionId, offer.cartItemId, updated));
    } catch (e) {
      runInAction(() => {
        this.actionStatus = 'error';
        this.actionError = e instanceof Error ? e.message : 'Could not respond to offer';
      });
      throw e;
    }
  }

  sendChatMessage(message: string): void {
    const session = this.currentSession;
    if (!session) return;
    this.gateway.send({ type: 'chat_message', session_id: session.sessionId, message });
  }

  setTyping(isTyping: boolean): void {
    const session = this.currentSession;
    if (!session) return;
    this.gateway.send({ type: 'typing', session_id: session.sessionId, is_typing: isTyping });
  }

  markSeen(): void {
    const session = this.currentSession;
    if (!session) return;
    this.gateway.send({ type: 'mark_seen', session_id: session.sessionId });
  }

  endSession(): void {
    const session = this.currentSession;
    if (!session) return;
    this.gateway.send({ type: 'end_session', session_id: session.sessionId });
    session.status = 'ENDED';
  }

  // ── Server event handling ──────────────────────────────────────────────────

  private handleServerEvent(sessionId: string, event: BargainServerEvent): void {
    const session = this.sessions[sessionId];
    if (!session) return;
    runInAction(() => {
      switch (event.type) {
        case 'new_offer':
        case 'counter_offer':
        case 'offer_accepted':
        case 'offer_rejected':
          this.applyOffer(sessionId, event.cart_item_id, event.offer as unknown as BargainOffer);
          break;
        case 'chat_message':
          this.appendMessage(sessionId, event.message as unknown as BargainMessage);
          break;
        case 'cart_updated':
          // shallow-merge by cartItemId — items not present in the payload are left as-is
          (event.cart as unknown as BargainSession['cart']).forEach((incoming) => {
            const idx = session.cart.findIndex((i) => i.cartItemId === incoming.cartItemId);
            if (idx >= 0) session.cart[idx] = { ...session.cart[idx], ...incoming };
          });
          break;
        case 'typing':
          session.isTyping = event.is_typing;
          break;
        case 'messages_seen':
          if (!session.seenBy.includes(event.user_id)) session.seenBy.push(event.user_id);
          break;
        case 'session_ended':
          session.status = 'ENDED';
          break;
        case 'session_expired':
          session.status = 'EXPIRED';
          break;
        case 'error':
          this.actionError = event.message;
          break;
      }
    });
  }

  private applyOffer(sessionId: string, cartItemId: string, offer: BargainOffer): void {
    const session = this.sessions[sessionId];
    if (!session) return;
    const existing = session.offers[cartItemId];
    // Idempotent: a REST response and its socket echo can both arrive for
    // the same change — only the first one actually mutates state.
    if (existing && existing.offerId === offer.offerId && existing.status === offer.status) return;
    session.offers[cartItemId] = offer;
  }

  private appendMessage(sessionId: string, message: BargainMessage): void {
    const session = this.sessions[sessionId];
    if (!session) return;
    if (message.messageId && session.messages.some((m) => m.messageId === message.messageId)) return;
    session.messages.push(message);
  }
}
