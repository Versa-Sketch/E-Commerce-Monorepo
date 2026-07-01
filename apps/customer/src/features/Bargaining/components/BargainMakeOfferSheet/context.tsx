import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CartItemApi } from '../../../../types/shared';
import { useBargainOffer } from '../../hooks/useBargainOffer';

interface OfferSheetContextValue {
  items: CartItemApi[];
  selectedItemId: string | undefined;
  selectedItem: CartItemApi | undefined;
  amount: string;
  setAmount: (text: string) => void;
  error: string | null;
  discount: number | null;
  applyDiscount: (pct: number) => void;
  handleSelectItem: (item: CartItemApi) => void;
  handleSubmit: (onSuccess: () => void) => void;
  onClose: () => void;
  isActive: boolean;
}

const OfferSheetContext = createContext<OfferSheetContextValue | null>(null);

export function useOfferSheet(): OfferSheetContextValue {
  const ctx = useContext(OfferSheetContext);
  if (!ctx) throw new Error('useOfferSheet must be used inside OfferSheetProvider');
  return ctx;
}

interface OfferSheetProviderProps {
  items: CartItemApi[];
  initialCartItemId?: string;
  visible: boolean;
  onClose: () => void;
  onSendOffer: (cartItemId: string, amount: string) => void;
  isActive: boolean;
  children: React.ReactNode;
}

export function OfferSheetProvider({
  items,
  initialCartItemId,
  visible,
  onClose,
  onSendOffer,
  isActive,
  children,
}: OfferSheetProviderProps) {
  const pickDefaultItemId = useCallback((): string | undefined => {
    if (initialCartItemId) {
      const initial = items.find((item) => item.cart_item_id === initialCartItemId);
      if (initial && !initial.is_locked) return initialCartItemId;
    }
    return items.find((item) => !item.is_locked)?.cart_item_id;
  }, [items, initialCartItemId]);

  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(pickDefaultItemId);
  const selectedItem = items.find((item) => item.cart_item_id === selectedItemId);

  const { amount, setAmount, error, discount, applyDiscount, reset, handleSubmit } =
    useBargainOffer(selectedItem, onSendOffer);

  useEffect(() => {
    if (visible) {
      setSelectedItemId(pickDefaultItemId());
      reset();
    }
  }, [visible, initialCartItemId, reset]);

  const handleSelectItem = useCallback(
    (item: CartItemApi) => {
      if (item.is_locked) return;
      setSelectedItemId(item.cart_item_id);
      reset();
    },
    [reset]
  );

  return (
    <OfferSheetContext.Provider
      value={{
        items,
        selectedItemId,
        selectedItem,
        amount,
        setAmount,
        error,
        discount,
        applyDiscount,
        handleSelectItem,
        handleSubmit,
        onClose,
        isActive,
      }}
    >
      {children}
    </OfferSheetContext.Provider>
  );
}
