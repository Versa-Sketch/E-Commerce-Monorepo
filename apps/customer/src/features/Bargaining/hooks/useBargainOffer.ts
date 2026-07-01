import { useCallback, useState } from 'react';
import { CartItemApi } from '../../../types/shared';

export function useBargainOffer(
  selectedItem: CartItemApi | undefined,
  onSendOffer: (cartItemId: string, amount: string) => void,
) {
  const [amount, setAmountState] = useState('');
  const [error, setError] = useState<string | null>(null);

  const original = selectedItem ? parseFloat(selectedItem.selling_price) : 0;
  const offered = parseFloat(amount);
  const discount =
    original > 0 && !Number.isNaN(offered) && offered > 0
      ? Math.round((1 - offered / original) * 100)
      : null;

  const setAmount = (text: string) => {
    setAmountState(text);
    setError(null);
  };

  const applyDiscount = (pct: number) => {
    if (!original) return;
    const value = original * (1 - pct / 100);
    setAmountState(value.toFixed(2).replace(/\.00$/, ''));
    setError(null);
  };

  const reset = useCallback(() => {
    setAmountState('');
    setError(null);
  }, []);

  const handleSubmit = (onSuccess: () => void) => {
    if (!selectedItem) return;
    if (Number.isNaN(offered) || offered <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    if (offered >= original) {
      setError(`Your offer must be less than ₹${selectedItem.selling_price}.`);
      return;
    }
    onSendOffer(selectedItem.cart_item_id, offered.toFixed(2));
    onSuccess();
  };

  return { amount, setAmount, error, discount, applyDiscount, reset, handleSubmit };
}
