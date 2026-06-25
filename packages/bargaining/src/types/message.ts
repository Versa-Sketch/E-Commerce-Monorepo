import type { BargainParty } from './role';
import type { BargainProduct } from './product';

export type BargainOutcome = 'accepted' | 'declined' | 'expired';

interface BargainMessageBase {
  id: string;
  timestamp: number;
}

export interface DateDividerMessage extends BargainMessageBase {
  type: 'date';
  label: string;
}

export interface TextMessage extends BargainMessageBase {
  type: 'text';
  sender: BargainParty;
  text: string;
}

export interface ProductMessage extends BargainMessageBase {
  type: 'product';
  sender: BargainParty;
  product: BargainProduct;
}

export interface OfferMessage extends BargainMessageBase {
  type: 'offer';
  sender: BargainParty;
  /** Visual treatment only — an opening offer vs. a counter offer. */
  variant: 'offer' | 'counter';
  product: BargainProduct;
  price: number;
  /** 0-100. Supplied by the host; this package never computes negotiation odds itself. */
  probability: number;
  /** Set when the offer has already been resolved, to suppress the waiting/action state. */
  resolved?: BargainOutcome;
}

export interface TypingMessage extends BargainMessageBase {
  type: 'typing';
  name: string;
}

export interface ResolvedMessage extends BargainMessageBase {
  type: 'resolved';
  outcome: BargainOutcome;
  text: string;
}

export type BargainMessage =
  | DateDividerMessage
  | TextMessage
  | ProductMessage
  | OfferMessage
  | TypingMessage
  | ResolvedMessage;
