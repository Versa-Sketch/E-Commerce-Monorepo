import { makeAutoObservable } from 'mobx';

export class BargainMessage {
  id: string;
  sender: 'customer' | 'merchant' | 'system';
  message: string;
  time: string;
  dateLabel: string;
  price?: number;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  messageType?: 'TEXT' | 'IMAGE' | 'SYSTEM' | 'OFFER' | 'COUNTER_OFFER';
  bargainOfferId?: string | null;

  constructor(data: {
    id: string;
    sender: 'customer' | 'merchant' | 'system';
    message: string;
    time: string;
    dateLabel: string;
    price?: number;
    status?: 'SENT' | 'DELIVERED' | 'READ';
    createdAt: string;
    messageType?: 'TEXT' | 'IMAGE' | 'SYSTEM' | 'OFFER' | 'COUNTER_OFFER';
    bargainOfferId?: string | null;
  }) {
    this.id = data.id;
    this.sender = data.sender;
    this.message = data.message;
    this.time = data.time;
    this.dateLabel = data.dateLabel;
    this.price = data.price;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.messageType = data.messageType ?? 'TEXT';
    this.bargainOfferId = data.bargainOfferId ?? null;
    makeAutoObservable(this);
  }
}

/** Read-only per-cart-item view of a bargain negotiation, derived from a `BargainSession` + `BargainOffer`. */
export class Bargain {
  id: string;
  sessionId: string;
  cartItemId: string;
  customerName: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  currentPrice: number;
  customerOffer: number;
  potentialProfit: number;
  merchantCost: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  expirationTime: number;
  timeline: BargainMessage[] = [];
  history: number[] = [];

  constructor(data: {
    id: string; sessionId: string; cartItemId: string; customerName: string; productId: string; productName: string; productImage: string;
    originalPrice: number; currentPrice: number; customerOffer: number; potentialProfit: number;
    merchantCost: number; status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
    expirationTime: number; timeline: any[]; history: number[];
  }) {
    this.id = data.id;
    this.sessionId = data.sessionId;
    this.cartItemId = data.cartItemId;
    this.customerName = data.customerName;
    this.productId = data.productId;
    this.productName = data.productName;
    this.productImage = data.productImage;
    this.originalPrice = data.originalPrice;
    this.currentPrice = data.currentPrice;
    this.customerOffer = data.customerOffer;
    this.potentialProfit = data.potentialProfit;
    this.merchantCost = data.merchantCost;
    this.status = data.status;
    this.expirationTime = data.expirationTime;
    this.timeline = data.timeline.map((t) => new BargainMessage(t));
    this.history = [...data.history];
    makeAutoObservable(this);
  }

  /** How much discount the customer is asking for, relative to the current price. */
  get discountPercent() {
    if (this.currentPrice <= 0) return 0;
    return Math.max(0, Math.round((1 - this.customerOffer / this.currentPrice) * 100));
  }

  /** ₹ distance between the customer's offer and the current price. */
  get gap() {
    return Math.max(0, this.currentPrice - this.customerOffer);
  }

  /** Heuristic 0-100 likelihood this deal closes — based on how aggressive the ask is and negotiation momentum. */
  get dealProbability() {
    if (this.status === 'Accepted') return 100;
    if (this.status === 'Rejected' || this.status === 'Expired') return 0;

    let score = 100 - this.discountPercent * 1.8;
    score += this.history.length * 4;
    if (this.merchantCost > 0 && this.customerOffer >= this.merchantCost) score += 8;

    return Math.max(4, Math.min(96, Math.round(score)));
  }

  /** At-a-glance temperature of the deal, driven by the probability score. */
  get dealHealth(): 'Hot' | 'Warm' | 'Cool' {
    const p = this.dealProbability;
    if (p >= 70) return 'Hot';
    if (p >= 40) return 'Warm';
    return 'Cool';
  }

  /** True once a pending deal has less than 2 minutes left on the clock. */
  get isExpiringSoon() {
    return this.status === 'Pending' && this.expirationTime > 0 && this.expirationTime <= 120;
  }
}
