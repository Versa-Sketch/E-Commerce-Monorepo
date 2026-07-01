import { toJS } from 'mobx';
import { useCartStore } from '../Providers/useCartStore';

export function useCartSummary() {
  const cartStore = useCartStore();
  const cartGroups = toJS(cartStore.groupedByStore);
  const totalItems = cartStore.totalItemCount;
  const grandTotal = cartGroups.reduce(
    (sum, g) => sum + cartStore.getShopTotals(g.storeId).grandTotal,
    0
  );

  return {
    cartGroups,
    totalItems,
    grandTotal,
    isEmpty: cartStore.isEmpty,
    getShopItemCount: (storeId: string) => cartStore.getShopItemCount(storeId),
    getShopTotal: (storeId: string) => cartStore.getShopTotals(storeId).grandTotal,
  };
}
