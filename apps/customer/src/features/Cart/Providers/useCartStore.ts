import { createContext, useContext } from 'react';
import { CartStore } from '../Store/CartStore';
export const CartStoreContext = createContext<CartStore | null>(null);
export const useCartStore = (): CartStore => {
  const store = useContext(CartStoreContext);
  if (!store) {
    throw new Error('useCartStore must be used within CartProvider');
  }
  return store;
};
