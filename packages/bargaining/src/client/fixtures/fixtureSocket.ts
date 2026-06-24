import { BargainClientMessage, BargainServerEvent } from '../../types/events';
import { GatewayConnectionStatus, IBargainGateway } from '../BargainGatewaySocket';

type StatusListener = (status: GatewayConnectionStatus) => void;
type EventListener = (event: BargainServerEvent) => void;

const SIMULATED_LATENCY_MS = 350;

// Mirrors customer's existing BargainSocket.fixture.ts pattern — same public
// shape as the real gateway (IBargainGateway), so a screen can swap from
// fixture to real with a single constructor-argument change.
export class FixtureBargainGateway implements IBargainGateway {
  private status: GatewayConnectionStatus = 'offline';
  private statusListeners = new Set<StatusListener>();
  private sessionListeners = new Map<string, Set<EventListener>>();

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

  connect(): void {
    this.setStatus('connecting');
    setTimeout(() => this.setStatus('open'), SIMULATED_LATENCY_MS);
  }

  disconnect(): void {
    this.setStatus('offline');
  }

  send(message: BargainClientMessage): void {
    setTimeout(() => this.simulateResponse(message), SIMULATED_LATENCY_MS);
  }

  private simulateResponse(message: BargainClientMessage): void {
    if (message.type === 'bargain_response') {
      const event: BargainServerEvent =
        message.action === 'ACCEPT'
          ? { type: 'offer_accepted', cart_item_id: '', offer: { offer_id: message.offer_id, status: 'ACCEPTED' } }
          : message.action === 'REJECT'
            ? { type: 'offer_rejected', cart_item_id: '', offer: { offer_id: message.offer_id, status: 'REJECTED' } }
            : { type: 'counter_offer', cart_item_id: '', offer: { offer_id: message.offer_id, status: 'COUNTERED', offered_amount: message.counter_amount } };
      this.emit(message.session_id, event);
      return;
    }
    if (message.type === 'chat_message') {
      this.emit(message.session_id, {
        type: 'chat_message',
        message: {
          message_id: `fixture-msg-${Date.now()}`,
          sender_id: 'self',
          message: message.message,
          message_type: 'TEXT',
          created_at: new Date().toISOString(),
          status: 'DELIVERED',
        },
      });
    }
  }

  private emit(sessionId: string, event: BargainServerEvent): void {
    this.sessionListeners.get(sessionId)?.forEach((listener) => listener(event));
  }

  private setStatus(status: GatewayConnectionStatus): void {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }
}
