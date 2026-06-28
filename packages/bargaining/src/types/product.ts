export type BargainProductIcon = 'headphones' | 'watch' | 'footwear' | 'speaker' | 'generic';

export interface BargainProduct {
  id: string;
  name: string;
  listedPrice: number;
  /** Real product photo. Falls back to a tinted icon tile when omitted. */
  imageUrl?: string;
  icon?: BargainProductIcon;
  /** Floor price the negotiation should not be allowed to go below, if known. */
  minPrice?: number;
}
