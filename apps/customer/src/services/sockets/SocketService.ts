type SocketCallback = (data: any) => void;
class SocketServiceManager {
  private socket: any = null;
  private listeners = new Map<string, Set<SocketCallback>>();
  connect(token: string) {
    console.log('SocketService: Connecting with auth token credentials...', token);
    setTimeout(() => {
      this.triggerEvent('connect', { status: 'connected', socketId: 'mock_sock_777' });
    }, 500);
  }
  disconnect() {
    console.log('SocketService: Disconnecting active streams.');
    this.socket = null;
    this.triggerEvent('disconnect', { status: 'disconnected' });
    this.listeners.clear();
  }
  on(event: string, callback: SocketCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    return () => this.off(event, callback); 
  }
  off(event: string, callback: SocketCallback) {
    this.listeners.get(event)?.delete(callback);
  }
  emit(event: string, data: any) {
    console.log(`SocketService: Emitted [${event}]`, data);
    // In production:
    // this.socket?.emit(event, data);
  }
  // Trigger local callbacks (for simulation testing)
  private triggerEvent(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(`SocketService: Error in listener callback for event "${event}"`, err);
      }
    });
  }
}
export const SocketService = new SocketServiceManager();
export default SocketService;
