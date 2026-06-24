import { BargainClientMessage, BargainServerEvent } from '../types/events';

export type GatewayConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'offline';

type ServerMessage = BargainServerEvent & { session_id?: string };
type StatusListener = (status: GatewayConnectionStatus) => void;
type EventListener = (event: BargainServerEvent) => void;

const CONNECT_TIMEOUT_MS = 10_000;
const BACKOFF_INITIAL_MS = 1_000;
const BACKOFF_MAX_MS = 30_000;
const MAX_QUEUED_MESSAGES = 50;

// Implemented by both the real socket and the fixture gateway so the store
// can swap between them without any change to its own code.
export interface IBargainGateway {
  getStatus(): GatewayConnectionStatus;
  onStatusChange(listener: StatusListener): () => void;
  subscribe(sessionId: string, listener: EventListener): () => void;
  connect(token: string): void;
  disconnect(): void;
  send(message: BargainClientMessage): void;
}

// One socket connection, multiplexed by session_id (customer's pattern),
// with exponential-backoff reconnection and a bounded send queue so chat
// messages aren't lost across a reconnect (merchant's pattern). Both apps
// share this single class — there's no "customer socket" / "merchant socket".
export class BargainGatewaySocket implements IBargainGateway {
  private socket: WebSocket | null = null;
  private status: GatewayConnectionStatus = 'offline';
  private wsUrl: string;
  private token: string | null = null;
  private reconnectDelay = BACKOFF_INITIAL_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyDisconnected = false;
  private sendQueue: BargainClientMessage[] = [];
  private statusListeners = new Set<StatusListener>();
  private sessionListeners = new Map<string, Set<EventListener>>();

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  getStatus(): GatewayConnectionStatus {
    return this.status;
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  subscribe(sessionId: string, listener: EventListener): () => void {
    const set = this.sessionListeners.get(sessionId) ?? new Set();
    set.add(listener);
    this.sessionListeners.set(sessionId, set);
    return () => set.delete(listener);
  }

  connect(token: string): void {
    this.token = token;
    this.manuallyDisconnected = false;
    this.open();
  }

  disconnect(): void {
    this.manuallyDisconnected = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.connectTimer) clearTimeout(this.connectTimer);
    this.socket?.close();
    this.socket = null;
    this.setStatus('offline');
  }

  send(message: BargainClientMessage): void {
    if (this.status === 'open' && this.socket) {
      this.socket.send(JSON.stringify(message));
      return;
    }
    // Only queue messages worth replaying — typing/mark_seen are fine to drop.
    if (message.type === 'chat_message' || message.type === 'bargain_offer' || message.type === 'bargain_response') {
      this.sendQueue.push(message);
      if (this.sendQueue.length > MAX_QUEUED_MESSAGES) this.sendQueue.shift();
    }
  }

  private open(): void {
    this.setStatus(this.reconnectDelay > BACKOFF_INITIAL_MS ? 'reconnecting' : 'connecting');

    const socket = new WebSocket(`${this.wsUrl}?token=${encodeURIComponent(this.token ?? '')}`);
    this.socket = socket;

    this.connectTimer = setTimeout(() => socket.close(), CONNECT_TIMEOUT_MS);

    socket.onopen = () => {
      if (this.connectTimer) clearTimeout(this.connectTimer);
      this.reconnectDelay = BACKOFF_INITIAL_MS;
      this.setStatus('open');
      this.flushQueue();
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);
        this.routeEvent(data);
      } catch {
        // malformed payload — ignore rather than crash the connection
      }
    };

    socket.onerror = () => {
      // onclose fires right after; reconnection is handled there
    };

    socket.onclose = () => {
      if (this.connectTimer) clearTimeout(this.connectTimer);
      this.socket = null;
      if (this.manuallyDisconnected) {
        this.setStatus('offline');
        return;
      }
      this.setStatus('reconnecting');
      this.reconnectTimer = setTimeout(() => this.open(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, BACKOFF_MAX_MS);
    };
  }

  private flushQueue(): void {
    const queued = this.sendQueue;
    this.sendQueue = [];
    queued.forEach((message) => this.send(message));
  }

  private routeEvent(data: ServerMessage): void {
    const { session_id, ...event } = data;
    if (session_id) {
      this.sessionListeners.get(session_id)?.forEach((listener) => listener(event as BargainServerEvent));
    }
  }

  private setStatus(status: GatewayConnectionStatus): void {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }
}
