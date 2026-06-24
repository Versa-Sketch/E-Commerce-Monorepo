// Each app already has its own HTTP setup (customer: axios + interceptors,
// merchant: a fetch-based wrapper) — rather than picking one or adding a new
// HTTP dependency to this package, callers inject a thin adapter around
// whichever client they already have.
export interface BargainHttpAdapter {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body?: unknown): Promise<T>;
}

export class BargainRestClient {
  constructor(private http: BargainHttpAdapter, private basePath = '/bargaining') {}

  startSession(cartId: string) {
    return this.http.post(`${this.basePath}/sessions/`, { cart_id: cartId });
  }

  getSession(sessionId: string) {
    return this.http.get(`${this.basePath}/sessions/${sessionId}/`);
  }

  endSession(sessionId: string) {
    return this.http.post(`${this.basePath}/sessions/${sessionId}/end/`);
  }

  createOffer(sessionId: string, cartItemId: string, offeredAmount: number) {
    return this.http.post(`${this.basePath}/sessions/${sessionId}/offers/`, {
      cart_item_id: cartItemId,
      offered_amount: offeredAmount,
    });
  }

  respondToOffer(offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterAmount?: number) {
    return this.http.post(`${this.basePath}/offers/${offerId}/respond/`, {
      action,
      counter_amount: counterAmount,
    });
  }

  getMessages(sessionId: string) {
    return this.http.get(`${this.basePath}/sessions/${sessionId}/messages/`);
  }

  getSessionHistory(sessionId: string) {
    return this.http.get(`${this.basePath}/sessions/${sessionId}/history/`);
  }

  getCartHistory(cartId: string) {
    return this.http.get(`${this.basePath}/carts/${cartId}/sessions/`);
  }
}
