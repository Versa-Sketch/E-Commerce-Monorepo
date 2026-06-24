// Which side of the negotiation the current app/user is viewing from. Every
// shared component/store takes this as a parameter instead of being forked
// per app — it only ever changes filtering/copy, never the component tree.
export type BargainRole = 'CUSTOMER' | 'SHOP';

export function otherRole(role: BargainRole): BargainRole {
  return role === 'CUSTOMER' ? 'SHOP' : 'CUSTOMER';
}
