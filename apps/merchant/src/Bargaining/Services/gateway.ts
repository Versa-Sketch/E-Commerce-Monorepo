import { bargainWsUrl } from '../Constants/api';

export type BargainClientMessage =
  | { type: 'chat_message'; session_id: string; message: string }
  | { type: 'bargain_offer'; session_id: string; cart_item_id: string; offered_amount: number }
  | { type: 'bargain_response'; session_id: string; offer_id: string; action: 'ACCEPT' | 'REJECT' | 'COUNTER'; counter_amount?: number }
  | { type: 'mark_seen'; session_id: string }
  | { type: 'typing'; session_id: string; is_typing: boolean }
  | { type: 'end_session'; session_id: string };

export type BargainServerMessageType =
  | 'session_started'
  | 'new_offer'
  | 'counter_offer'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'chat_message'
  | 'cart_updated'
  | 'session_ended'
  | 'session_expired'
  | 'typing'
  | 'messages_seen'
  | 'messages_delivered'
  | 'error';

export interface BargainServerMessage {
  type: BargainServerMessageType;
  session_id?: string;
  [key: string]: any;
}

export type BargainMessageHandler = (message: BargainServerMessage) => void;

/** Connection lifecycle as seen by the UI: `connecting`/`reconnecting` should show a transient
 * banner, `open` is the steady state, and `offline` means the gateway has given up retrying
 * automatically (only reachable via explicit `disconnect()`). */
export type GatewayConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'offline';

export type GatewayStatusHandler = (status: GatewayConnectionStatus) => void;

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
/** If the socket doesn't reach `onopen` within this window, treat it as failed and retry. */
const CONNECT_TIMEOUT_MS = 10000;
/** Chat messages sent while offline are queued and replayed once the socket reopens. */
const MAX_QUEUED_MESSAGES = 50;

/** Wraps the `/ws/bargain/` gateway socket: one connection multiplexes all of a shop's active sessions. */
export class BargainGatewaySocket {
  private socket: WebSocket | null = null;
  private handler: BargainMessageHandler | null = null;
  private statusHandler: GatewayStatusHandler | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private backoffMs = INITIAL_BACKOFF_MS;
  private shouldReconnect = false;
  private token: string | null = null;
  private status: GatewayConnectionStatus = 'offline';
  /** Chat messages queued while the socket was down; replayed in order on reconnect. */
  private queue: BargainClientMessage[] = [];

  onMessage(handler: BargainMessageHandler) {
    this.handler = handler;
  }

  onStatusChange(handler: GatewayStatusHandler) {
    this.statusHandler = handler;
    handler(this.status);
  }

  getStatus(): GatewayConnectionStatus {
    return this.status;
  }

  connect(token: string) {
    this.token = token;
    this.shouldReconnect = true;
    this.backoffMs = INITIAL_BACKOFF_MS;
    this.open();
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.clearConnectTimeout();
    this.queue = [];
    this.socket?.close();
    this.socket = null;
    this.token = null;
    this.setStatus('offline');
  }

  send(message: BargainClientMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('[BargainGateway] -> send', message);
      this.socket.send(JSON.stringify(message));
      return;
    }

    if (message.type === 'chat_message') {
      console.warn('[BargainGateway] -> send queued, socket not open', message);
      this.queue.push(message);
      if (this.queue.length > MAX_QUEUED_MESSAGES) this.queue.shift();
    } else {
      console.warn('[BargainGateway] -> send dropped, socket not open', message);
    }
  }

  private open() {
    if (!this.token) return;

    const url = bargainWsUrl(this.token);
    console.log('[BargainGateway] connecting', url);
    this.setStatus(this.backoffMs > INITIAL_BACKOFF_MS ? 'reconnecting' : 'connecting');
    const socket = new WebSocket(url);
    this.socket = socket;

    this.clearConnectTimeout();
    this.connectTimeoutTimer = setTimeout(() => {
      console.warn('[BargainGateway] connect timed out, retrying');
      socket.close();
    }, CONNECT_TIMEOUT_MS);

    socket.onopen = () => {
      console.log('[BargainGateway] connected');
      this.clearConnectTimeout();
      this.backoffMs = INITIAL_BACKOFF_MS;
      this.setStatus('open');
      this.flushQueue();
    };

    socket.onmessage = (event) => {
      console.log('[BargainGateway] <- raw message', event.data);
      try {
        const data = JSON.parse(event.data) as BargainServerMessage;
        this.handler?.(data);
      } catch (err) {
        console.warn('[BargainGateway] failed to parse message', err);
      }
    };

    socket.onclose = (event) => {
      console.log('[BargainGateway] closed', event.code, event.reason);
      this.clearConnectTimeout();
      if (this.socket === socket) this.socket = null;
      if (this.shouldReconnect) this.scheduleReconnect();
      else this.setStatus('offline');
    };

    socket.onerror = (event) => {
      console.warn('[BargainGateway] error', event);
      socket.close();
    };
  }

  private flushQueue() {
    if (this.queue.length === 0) return;
    console.log(`[BargainGateway] flushing ${this.queue.length} queued message(s)`);
    const pending = this.queue;
    this.queue = [];
    pending.forEach((message) => this.send(message));
  }

  private clearConnectTimeout() {
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }
  }

  private scheduleReconnect() {
    this.setStatus('reconnecting');
    if (this.reconnectTimer) return;
    console.log(`[BargainGateway] reconnecting in ${this.backoffMs}ms`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.backoffMs = Math.min(this.backoffMs * 2, MAX_BACKOFF_MS);
      this.open();
    }, this.backoffMs);
  }

  private setStatus(status: GatewayConnectionStatus) {
    if (this.status === status) return;
    this.status = status;
    this.statusHandler?.(status);
  }
}
