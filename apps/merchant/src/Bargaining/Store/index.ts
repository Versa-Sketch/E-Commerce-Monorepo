import { makeAutoObservable, reaction, runInAction } from "mobx";
import type { SessionStore } from "../../Auth/Store";
import { decodeJwtPayload } from "../../Common/services/jwt";
import { Bargain, BargainMessage } from "../Models/Bargain";
import {
  BargainCartItem,
  BargainChatMessage,
  BargainOffer,
  BargainSession,
} from "../Models/BargainSession";
import {
  BargainGatewaySocket,
  BargainServerMessage,
  GatewayConnectionStatus,
} from "../Services/gateway";
import { BargainingApiService } from "../Services/index.api";

/** How long to wait for the gateway to echo back an offer-response result before
 * clearing the pending spinner and surfacing an error. */
const OFFER_RESPONSE_TIMEOUT_MS = 15000;

export class BargainingStore {
  sessions: BargainSession[] = [];
  connectionStatus: GatewayConnectionStatus = "offline";
  sessionsLoading = false;
  sessionsError: string | null = null;
  /** offerIds currently awaiting a respond-to-offer API result, so buttons can show a spinner. */
  pendingOfferActions = new Set<string>();
  /** Last action-level error (offer response, etc.) surfaced as a toast by the UI. */
  actionError: string | null = null;
  /** Bumped every second so `bargains`/`expirationTime` re-derive and countdowns tick live. */
  private nowTick = 0;

  private api: BargainingApiService;
  private gateway = new BargainGatewaySocket();
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private session: SessionStore) {
    this.api = new BargainingApiService(session);
    makeAutoObservable(this);

    this.gateway.onMessage((message) => this.handleServerMessage(message));
    this.gateway.onStatusChange((status) =>
      runInAction(() => {
        this.connectionStatus = status;
      }),
    );

    this.tickTimer = setInterval(
      () =>
        runInAction(() => {
          this.nowTick++;
        }),
      1000,
    );

    reaction(
      () => this.session.isAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated) this.connect();
        else this.disconnect();
      },
      { fireImmediately: true },
    );
  }

  async connect() {
    const token = this.session.accessToken;
    if (!token) return;
    // Load the shop's active bargain sessions before opening the gateway socket,
    // so the WS event handlers always have a session to apply deltas onto.
    await this.loadSessions();
    console.log("[Bargaining] connecting WS gateway");
    this.gateway.connect(token);
  }

  disconnect() {
    console.log("[Bargaining] disconnecting");
    this.gateway.disconnect();
    this.sessions = [];
  }

  async loadSessions() {
    console.log("[Bargaining] GET /logistics/bargain/sessions/active/");
    this.sessionsLoading = true;
    this.sessionsError = null;
    const result = await this.api.getActiveSessions();
    console.log("[Bargaining] active sessions response", result);
    runInAction(() => {
      this.sessionsLoading = false;
      if (result.ok) {
        const sessions = (result.data as any)?.sessions ?? [];
        this.sessions = sessions.map(
          (data: Record<string, any>) => new BargainSession(data),
        );
        console.log("[Bargaining] loaded sessions", this.sessions.length);
        console.log(
          "[STATE UPDATED] Active sessions list populated. Current sessions count:",
          this.sessions.length,
        );
      } else {
        this.sessionsError = result.message;
        console.warn("[Bargaining] failed to load sessions", result.message);
      }
    });
  }

  clearActionError() {
    this.actionError = null;
  }

  isOfferActionPending(offerId: string): boolean {
    return this.pendingOfferActions.has(offerId);
  }

  /** One `Bargain` view-model per cart item with an offer, across all active sessions. */
  get bargains(): Bargain[] {
    // Read nowTick so this computed re-derives every second, keeping countdowns/expiry live.
    void this.nowTick;
    const result: Bargain[] = [];
    for (const session of this.sessions) {
      for (const item of session.cart) {
        const offer = session.offers[item.cartItemId];
        if (!offer) continue;
        result.push(this.toBargain(session, item, offer));
      }
    }
    return result;
  }

  get pendingBargains() {
    return this.bargains.filter((b) => b.status === "Pending");
  }
  get acceptedBargains() {
    return this.bargains.filter((b) => b.status === "Accepted");
  }
  get rejectedBargains() {
    return this.bargains.filter((b) => b.status === "Rejected");
  }
  get expiredBargains() {
    return this.bargains.filter((b) => b.status === "Expired");
  }

  /** Live deals currently being negotiated. */
  get activeDeals() {
    const count = this.pendingBargains.length;
    console.log(`[METRICS RECALCULATED] activeDeals: ${count}`);
    return count;
  }

  /** Total ₹ on the table across every live negotiation, at the customer's current ask. */
  get potentialRevenue() {
    const sum = this.pendingBargains.reduce(
      (sum, b) => sum + b.customerOffer,
      0,
    );
    console.log(`[METRICS RECALCULATED] potentialRevenue: ₹${sum}`);
    return sum;
  }

  /** Share of resolved deals that ended in acceptance. */
  get closingRate() {
    const resolved =
      this.acceptedBargains.length + this.rejectedBargains.length;
    if (resolved === 0) return 0;
    return Math.round((this.acceptedBargains.length / resolved) * 100);
  }

  /** Live deals with less than 2 minutes on the clock. */
  get expiringSoonCount() {
    return this.pendingBargains.filter((b) => b.isExpiringSoon).length;
  }

  /** Average discount % being requested across live deals. */
  get averageDiscount() {
    const pending = this.pendingBargains;
    if (pending.length === 0) return 0;
    return Math.round(
      pending.reduce((sum, b) => sum + b.discountPercent, 0) / pending.length,
    );
  }

  /** ₹ margin being negotiated away across live deals (current price vs. customer ask). */
  get revenueAtRisk() {
    return this.pendingBargains.reduce((sum, b) => sum + b.gap, 0);
  }

  acceptBargain(offerId: string) {
    this.respondToOffer(offerId, "ACCEPT");
  }

  rejectBargain(offerId: string) {
    this.respondToOffer(offerId, "REJECT");
  }

  counterBargain(offerId: string, counterPrice: number) {
    this.respondToOffer(offerId, "COUNTER", counterPrice);
  }

  private respondToOffer(
    offerId: string,
    action: "ACCEPT" | "REJECT" | "COUNTER",
    counterPrice?: number,
  ) {
    if (this.pendingOfferActions.has(offerId)) return;
    const session = this.sessions.find((s) =>
      Object.values(s.offers).some((offer) => offer.offerId === offerId),
    );
    if (!session) return;

    runInAction(() => this.pendingOfferActions.add(offerId));
    console.log("[Bargaining] WS send bargain_response", action, offerId, counterPrice);
    this.gateway.send({
      type: "bargain_response",
      session_id: session.sessionId,
      offer_id: offerId,
      action,
      ...(action === "COUNTER" ? { counter_amount: counterPrice } : {}),
    });

    // Safety net: if the gateway never echoes back a result for this offer, clear the
    // pending spinner so the buttons don't get stuck disabled forever.
    setTimeout(() => {
      runInAction(() => {
        if (this.pendingOfferActions.delete(offerId)) {
          this.actionError = "No response from server. Please try again.";
        }
      });
    }, OFFER_RESPONSE_TIMEOUT_MS);
  }

  sendMerchantMessage(sessionId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    console.log("[Bargaining] WS send chat_message", sessionId, trimmed);
    this.gateway.send({
      type: "chat_message",
      session_id: sessionId,
      message: trimmed,
    });
  }

  markSeen(sessionId: string) {
    console.log("[Bargaining] WS send mark_seen", sessionId);
    this.gateway.send({ type: "mark_seen", session_id: sessionId });
  }

  sendTypingStatus(sessionId: string, isTyping: boolean) {
    console.log("[Bargaining] WS send typing", sessionId, isTyping);
    this.gateway.send({
      type: "typing",
      session_id: sessionId,
      is_typing: isTyping,
    });
  }

  private async handleServerMessage(message: BargainServerMessage) {
    console.log("[WS RECEIVED]", message.type, message);

    // Fallback: If we receive a session event but don't have this session locally, refetch sessions first
    if (
      message.session_id &&
      !this.sessions.some((s) => s.sessionId === message.session_id)
    ) {
      console.log(
        `[SESSION CREATED] Session ${message.session_id} not found in store state, loading active sessions...`,
      );
      await this.loadSessions();
      console.log("[STATE UPDATED] Session list refetched");
    }

    runInAction(() => {
      const session = this.sessions.find(
        (s) => s.sessionId === message.session_id,
      );
      const payload = message.payload ?? message;

      switch (message.type) {
        case "session_started": {
          const data = payload.session ?? payload;
          if (!this.sessions.some((s) => s.sessionId === data.session_id)) {
            this.sessions.unshift(new BargainSession(data));
            console.log(
              "[Bargaining] session_started -> added session",
              data.session_id,
            );
          }
          break;
        }
        case "new_offer":
        case "counter_offer":
        case "offer_accepted":
        case "offer_rejected": {
          const offerData = payload.offer ?? payload;
          const cartItemId = offerData.cart_item_id ?? payload.cart_item_id;
          if (session && cartItemId) {
            session.applyOffer(cartItemId, offerData);
            console.log(
              `[Bargaining] ${message.type} -> applied to session`,
              session.sessionId,
              "cartItem",
              cartItemId,
            );
          } else {
            console.warn(
              `[Bargaining] ${message.type} -> no matching session/cartItem`,
              message.session_id,
              cartItemId,
            );
          }
          // Clear the pending spinner for whichever offer this responds to - the
          // accepted/rejected offer itself, or its parent when a counter supersedes it.
          if (offerData.offer_id) this.pendingOfferActions.delete(offerData.offer_id);
          if (offerData.parent_id) this.pendingOfferActions.delete(offerData.parent_id);
          break;
        }
        case "chat_message": {
          if (session) {
            const msgObj = (payload.message && typeof payload.message === 'object' && payload.message.message_id)
              ? payload.message
              : payload;
            session.appendMessage(msgObj);
            console.log(
              "[Bargaining] chat_message -> appended to session",
              session.sessionId,
            );
          } else {
            console.warn(
              "[Bargaining] chat_message -> no matching session",
              message.session_id,
            );
          }
          break;
        }
        case "cart_updated": {
          if (session) {
            session.applyCartUpdate(payload.cart ?? payload);
            console.log(
              "[Bargaining] cart_updated -> applied to session",
              session.sessionId,
            );
          } else {
            console.warn(
              "[Bargaining] cart_updated -> no matching session",
              message.session_id,
            );
          }
          break;
        }
        case "session_ended": {
          if (session) {
            session.status = "ENDED";
            console.log("[Bargaining] session_ended", session.sessionId);
          }
          break;
        }
        case "session_expired": {
          if (session) {
            session.status = "EXPIRED";
            console.log("[Bargaining] session_expired", session.sessionId);
          }
          break;
        }
        case "messages_seen": {
          const userId = payload.user_id ?? message.user_id;
          if (session && userId) {
            session.markSeenBy(String(userId));
            const readerId = String(userId);
            session.messages.forEach((m) => {
              if (m.senderId !== readerId && m.status !== "READ") {
                m.status = "READ";
              }
            });
            console.log(
              "[Bargaining] messages_seen",
              session.sessionId,
              userId,
            );
          }
          break;
        }
        case "messages_delivered": {
          const userId = payload.user_id ?? message.user_id;
          if (session && userId) {
            const receiverId = String(userId);
            session.messages.forEach((m) => {
              if (m.senderId !== receiverId && m.status === "SENT") {
                m.status = "DELIVERED";
              }
            });
            console.log(
              "[Bargaining] messages_delivered",
              session.sessionId,
              userId,
            );
          }
          break;
        }
        case "typing": {
          if (session) {
            const senderId =
              payload.user_id ?? message.user_id ?? payload.sender_id ?? message.sender_id;
            // Ignore our own typing echoed back - "isTyping" should only reflect the customer.
            if (senderId != null && String(senderId) === this.currentUserId) break;
            session.isTyping = !!(payload.is_typing ?? message.is_typing);
            console.log("[Bargaining] typing", senderId, session.isTyping);
          }
          break;
        }
        case "error": {
          console.error("[Bargaining] WS error event", message);
          const offerId = payload.offer_id ?? message.offer_id;
          if (offerId) this.pendingOfferActions.delete(offerId);
          this.actionError =
            payload.message ?? payload.error ?? message.message ?? "Something went wrong";
          break;
        }
        default:
          console.log("[Bargaining] unhandled WS event type", message.type);
          break;
      }
    });
  }

  private toBargain(
    session: BargainSession,
    item: BargainCartItem,
    offer: BargainOffer,
  ): Bargain {
    const customerName = this.resolveCustomerName(session);
    return new Bargain({
      id: offer.offerId,
      sessionId: session.sessionId,
      cartItemId: item.cartItemId,
      customerName,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      originalPrice: item.originalPrice,
      currentPrice: item.effectivePrice,
      customerOffer: offer.offeredAmount,
      potentialProfit: offer.offeredAmount,
      merchantCost: 0,
      status: this.mapStatus(session, offer),
      expirationTime: this.computeExpiration(session.expiresAt),
      timeline: session.messages.map((m) => this.toBargainMessage(m, session)),
      history: offer.parentId
        ? [offer.originalPrice, offer.offeredAmount]
        : [offer.offeredAmount],
    });
  }

  private mapStatus(
    session: BargainSession,
    offer: BargainOffer,
  ): "Pending" | "Accepted" | "Rejected" | "Expired" {
    const sessionStatus = session.status?.toUpperCase();
    const offerStatus = offer.status?.toUpperCase();

    // Offer-level terminal states take priority: an accepted/rejected offer must be
    // reflected immediately, even while the session itself is still ACTIVE/PENDING
    // (e.g. other cart items are still being negotiated).
    if (offerStatus === "ACCEPTED") return "Accepted";
    if (offerStatus === "REJECTED" || offerStatus === "CANCELLED")
      return "Rejected";
    if (offerStatus === "EXPIRED" || sessionStatus === "EXPIRED")
      return "Expired";
    if (sessionStatus === "ENDED") return "Rejected";
    if (sessionStatus === "ACTIVE" || sessionStatus === "PENDING") {
      return "Pending";
    }
    return "Pending";
  }

  private computeExpiration(expiresAt: string | null): number {
    if (!expiresAt) return 0;
    const remainingMs = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  }

  private resolveCustomerName(session: BargainSession): string {
    const myId = this.currentUserId;
    const customerMessage = [...session.messages]
      .reverse()
      .find((m) => m.messageType !== "SYSTEM" && m.senderId !== myId);
    return customerMessage?.senderName ?? "Customer";
  }

  private parseISODate(isoString: string): Date {
    if (!isoString) return new Date();
    // Strip microseconds (e.g. .773808) to milliseconds (e.g. .773)
    // to ensure standard Date parsing works perfectly across all JS engines.
    const sanitized = isoString.replace(/\.(\d{3})\d+/, '.$1');
    const d = new Date(sanitized);
    return isNaN(d.getTime()) ? new Date(isoString) : d;
  }

  private toBargainMessage(
    message: BargainChatMessage,
    session: BargainSession,
  ): BargainMessage {
    let sender: "customer" | "merchant" | "system" = "customer";
    if (message.messageType === "SYSTEM") sender = "system";
    else if (message.senderId === this.currentUserId) sender = "merchant";

    let price: number | undefined;
    if (
      (message.messageType === "OFFER" ||
        message.messageType === "COUNTER_OFFER") &&
      message.bargainOfferId
    ) {
      const offer = Object.values(session.offers).find(
        (o) => o.offerId === message.bargainOfferId
      );
      price = offer?.offeredAmount;
      if (price === undefined) {
        const match = message.message.match(/₹\s*([0-9]+(?:\.[0-9]+)?)/);
        if (match) price = parseFloat(match[1]);
      }
    }

    return new BargainMessage({
      id: message.messageId,
      sender,
      message: message.message,
      time: this.formatTime(message.createdAt),
      dateLabel: this.formatDateLabel(message.createdAt),
      price,
      status: message.status,
      createdAt: message.createdAt,
      messageType: message.messageType,
      bargainOfferId: message.bargainOfferId,
    });
  }

  private formatTime(iso: string): string {
    const date = this.parseISODate(iso);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  /** Renders a WhatsApp-style date separator label: "Today", "Yesterday", or "12 Jun 2026". */
  private formatDateLabel(iso: string): string {
    const date = this.parseISODate(iso);
    if (Number.isNaN(date.getTime())) return "";

    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = startOfDay(new Date());
    const target = startOfDay(date);
    const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
  }

  private get currentUserId(): string | null {
    const payload = decodeJwtPayload(this.session.accessToken);
    if (!payload) return null;
    const id =
      (payload as Record<string, unknown>).user_id ??
      (payload as Record<string, unknown>).sub ??
      (payload as Record<string, unknown>).id;
    return id != null ? String(id) : null;
  }
}

export type BargainingStoreType = BargainingStore;
