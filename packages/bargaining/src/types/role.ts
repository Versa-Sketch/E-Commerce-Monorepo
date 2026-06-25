export type BargainRole = 'customer' | 'merchant';

export type BargainParty = 'buyer' | 'seller';

export const partyForRole = (role: BargainRole): BargainParty =>
  role === 'customer' ? 'buyer' : 'seller';
