export type SocketStatus = 'connecting' | 'open' | 'closed' | 'error';
export type SocketMessageHandler = (data: unknown) => void;
export type SocketStatusHandler = (status: SocketStatus) => void;

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;

export class SocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers = new Set<SocketMessageHandler>();
  private statusHandlers = new Set<SocketStatusHandler>();
  private reconnectDelayMs = INITIAL_RECONNECT_DELAY_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;

  constructor(private getUrl: () => string | Promise<string>) { }

  async connect(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    this.manuallyClosed = false;
    this.clearReconnectTimer();
    this.setStatus('connecting');

    const url = await this.getUrl();
    if (this.manuallyClosed) return;

    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectDelayMs = INITIAL_RECONNECT_DELAY_MS;
      this.setStatus('open');
    };
    ws.onmessage = (event) => {
      let data: unknown = event.data;
      try {
        data = JSON.parse(event.data as string);
      } catch {
        // not JSON, deliver raw
      }
      this.messageHandlers.forEach((handler) => handler(data));
    };
    ws.onerror = () => {
      this.setStatus('error');
    };
    ws.onclose = () => {
      this.setStatus('closed');
      if (!this.manuallyClosed) this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.manuallyClosed = true;
    this.clearReconnectTimer();
    this.ws?.close();
    this.ws = null;
    this.setStatus('closed');
  }

  send(data: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
  }

  onMessage(handler: SocketMessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onStatusChange(handler: SocketStatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  private setStatus(status: SocketStatus): void {
    this.statusHandlers.forEach((handler) => handler(status));
  }

  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, MAX_RECONNECT_DELAY_MS);
      this.connect();
    }, this.reconnectDelayMs);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
