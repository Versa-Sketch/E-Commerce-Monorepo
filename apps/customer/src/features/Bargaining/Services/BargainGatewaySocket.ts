import { SocketClient } from '../../../infrastructure/SocketClient';
import { StorageService } from '../../../services/storage';
import { API_CONFIG, STORAGE_KEYS } from '../../../Common/Constants';
import { BargainConnectionStatus } from './index';
import { BargainClientMessage, BargainServerEvent } from '../types/domain';

type GatewayEvent = BargainServerEvent & { session_id?: string };

interface Subscriber {
  onMessage: (event: BargainServerEvent) => void;
  onStatusChange?: (status: BargainConnectionStatus) => void;
}

/**
 * Single shared `/ws/bargain/` connection for the whole app, multiplexed by
 * `session_id`. Built on the generic SocketClient. Each bargain session
 * "subscribes" for its own events and sends messages tagged with its
 * session_id; the underlying connection is created on first subscribe and
 * kept alive for reuse by later sessions.
 */
class BargainGatewaySocket {
  private socket = new SocketClient(() => this.buildUrl());
  private subscribers = new Map<string, Subscriber>();

  constructor() {
    this.socket.onMessage((data) => this.routeMessage(data as GatewayEvent));
    this.socket.onStatusChange((status) => {
      this.subscribers.forEach((subscriber) => subscriber.onStatusChange?.(status));
    });
  }

  subscribe(sessionId: string, onMessage: (event: BargainServerEvent) => void, onStatusChange?: (status: BargainConnectionStatus) => void): () => void {
    console.log('[BargainGateway] subscribe → sessionId:', sessionId);
    this.subscribers.set(sessionId, { onMessage, onStatusChange });
    this.socket.connect();
    return () => {
      console.log('[BargainGateway] unsubscribe → sessionId:', sessionId);
      if (this.subscribers.get(sessionId)?.onMessage === onMessage) {
        this.subscribers.delete(sessionId);
      }
    };
  }

  send(sessionId: string, message: BargainClientMessage): void {
    this.socket.send({ ...message, session_id: sessionId });
  }

  private routeMessage(event: GatewayEvent): void {
    const sessionId = event.session_id ?? event.payload?.session_id;
    if (!sessionId) return;
    this.subscribers.get(sessionId)?.onMessage(event);
  }

  private buildUrl(): string {
    const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN) ?? '';
    const base = API_CONFIG.BASE_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '');
    return `${base}/ws/bargain/?token=${token}`;
  }
}

export const bargainGatewaySocket = new BargainGatewaySocket();
