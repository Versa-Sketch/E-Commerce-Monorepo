import { bargainGatewaySocket } from './BargainGatewaySocket';
import { BargainConnectionStatus, IBargainSocket, IBargainSocketFactory } from './index';
import { BargainClientMessage, BargainServerEvent } from '../types/domain';

/**
 * Per-session adapter over the shared BargainGatewaySocket, so
 * BargainingStore's "one socket per session" contract keeps working
 * unchanged on top of the real single-connection gateway.
 */
class ApiBargainSocket implements IBargainSocket {
  private sessionId: string | null = null;
  private unsubscribe: (() => void) | null = null;

  connect(
    sessionId: string,
    onMessage: (event: BargainServerEvent) => void,
    onStatusChange?: (status: BargainConnectionStatus) => void
  ): void {
    this.sessionId = sessionId;
    this.unsubscribe = bargainGatewaySocket.subscribe(sessionId, onMessage, onStatusChange);
  }

  send(message: BargainClientMessage): void {
    if (!this.sessionId) return;
    bargainGatewaySocket.send(this.sessionId, message);
  }

  disconnect(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.sessionId = null;
  }
}

export const bargainSocketFactory: IBargainSocketFactory = {
  create: () => new ApiBargainSocket(),
};
