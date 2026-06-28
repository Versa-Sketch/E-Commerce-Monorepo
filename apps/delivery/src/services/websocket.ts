import { WsMessage, WsEventType, DeliveryOffer } from '../types/dispatch';
import { appStore } from '../store/useAppStore';

// WS base is derived from the REST base URL — swap http(s) scheme for ws(s).
const WS_BASE =
  (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://local-ecommerce-backend-production.up.railway.app/api')
    .replace(/^https/, 'wss')
    .replace(/^http/, 'ws')
    .replace(/\/api$/, '');

const INITIAL_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

type EventCallback<T = unknown> = (payload: T) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private intentionallyClosed = false;
  private backoffMs = INITIAL_BACKOFF_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Map<string, Set<EventCallback>>();

  connect(token: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    this.token = token;
    this.intentionallyClosed = false;
    this.backoffMs = INITIAL_BACKOFF_MS;
    this.openSocket();
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    this.clearReconnectTimer();
    this.ws?.close();
    this.ws = null;
  }

  on<T = unknown>(eventType: WsEventType, cb: EventCallback<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(cb as EventCallback);
  }

  off<T = unknown>(eventType: WsEventType, cb: EventCallback<T>): void {
    this.listeners.get(eventType)?.delete(cb as EventCallback);
  }

  private openSocket(): void {
    if (!this.token) return;
    const url = `${WS_BASE}/ws/user/?token=${encodeURIComponent(this.token)}`;
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.handleMessage;
    this.ws.onclose = this.handleClose;
    this.ws.onerror = () => {
      // onclose fires right after onerror; reconnect is handled there.
    };
  }

  private handleMessage = (event: MessageEvent): void => {
    try {
      const msg = JSON.parse(event.data as string) as WsMessage;

      if (msg.event_type === 'DELIVERY_OFFER') {
        appStore.setPendingOffer(msg.payload as DeliveryOffer);
      }

      const cbs = this.listeners.get(msg.event_type);
      cbs?.forEach((cb) => cb(msg.payload));
    } catch {
      // Malformed frame — ignore.
    }
  };

  private handleClose = (): void => {
    if (this.intentionallyClosed) return;
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.backoffMs = Math.min(this.backoffMs * 2, MAX_BACKOFF_MS);
      this.openSocket();
    }, this.backoffMs);
  };

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export const wsService = new WebSocketService();
