import React, { useState } from 'react';
import { CartStore } from '../Store/CartStore';
import { cartService } from '../Services/index.api';
import { CartStoreContext } from './useCartStore';
import { useToast } from '../../../Common/components/ui/Toast/useToast';
interface CartProviderProps {
  children: React.ReactNode;
}
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { showToast } = useToast();
  const [store] = useState(() => new CartStore(cartService, (message) => showToast(message, 'error')));
  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  );
};
