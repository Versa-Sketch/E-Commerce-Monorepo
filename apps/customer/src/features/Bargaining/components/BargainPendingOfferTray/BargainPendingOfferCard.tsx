import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { Button } from '../../../../Common/components/ui/Button';
import { Input } from '../../../../Common/components/ui/Input';
import { BargainOffer } from '../../types/domain';
import { discountPercent, formatAmount, getCartItem } from '../../utils/bargainHelpers';
import {
  actionButtonStyle,
  actionsRowStyle,
  cardHeaderRowStyle,
  cardStyle,
  counterErrorTextStyle,
  counterInputWrapperStyle,
  counterRowStyle,
  imageStyle,
  itemDetailsStyle,
  mrpTextStyle,
  offerAmountTextStyle,
  priceRowStyle,
} from './styledcomponents';

interface BargainPendingOfferCardProps {
  offer: BargainOffer;
}

export const BargainPendingOfferCard: React.FC<BargainPendingOfferCardProps> = observer(({ offer }) => {
  const { theme } = useTheme();
  const bargainingStore = useBargainingStore();
  const [showCounter, setShowCounter] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cartItem = getCartItem(bargainingStore.session, offer.cart_item_id);
  const disabled = !bargainingStore.isActive;
  const discount = discountPercent(offer.offered_amount, offer.original_price);

  const handleAccept = () => bargainingStore.respondToOffer(offer.offer_id, 'ACCEPT');
  const handleReject = () => bargainingStore.respondToOffer(offer.offer_id, 'REJECT');

  const handleCounterSubmit = () => {
    const value = parseFloat(counterAmount);
    if (Number.isNaN(value) || value <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setError(null);
    bargainingStore.respondToOffer(offer.offer_id, 'COUNTER', value.toFixed(2));
    setShowCounter(false);
    setCounterAmount('');
  };

  return (
    <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, borderColor: theme.colors.border }]}>
      <View style={cardHeaderRowStyle}>
        {cartItem?.product_image ? (
          <Image source={{ uri: cartItem.product_image }} style={[imageStyle, { borderRadius: theme.borderRadius.sm }]} />
        ) : null}
        <View style={itemDetailsStyle}>
          <Text numberOfLines={1} style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
            {cartItem?.product_name ?? 'Item'}
          </Text>
          <View style={priceRowStyle}>
            <Text style={[theme.textPresets.caption, mrpTextStyle, { color: theme.colors.textMuted }]}>
              {formatAmount(offer.original_price)}
            </Text>
            <Text style={[theme.textPresets.bodySmall, offerAmountTextStyle, { color: theme.colors.success, fontFamily: theme.typography.fonts.semiBold }]}>
              {formatAmount(offer.offered_amount)}
              {discount > 0 ? ` (${discount}% off)` : ''}
            </Text>
          </View>
        </View>
      </View>

      {!showCounter ? (
        <View style={actionsRowStyle}>
          <Button
            label="Accept"
            onPress={handleAccept}
            size="sm"
            disabled={disabled}
            style={{ ...actionButtonStyle, backgroundColor: theme.colors.success }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Button label="Counter" onPress={() => setShowCounter(true)} size="sm" variant="outline" disabled={disabled} style={actionButtonStyle} />
          <Button
            label="Reject"
            onPress={handleReject}
            size="sm"
            disabled={disabled}
            style={{ ...actionButtonStyle, backgroundColor: theme.colors.error }}
            labelStyle={{ color: '#FFFFFF' }}
          />
        </View>
      ) : (
        <View>
          <View style={counterRowStyle}>
            <View style={counterInputWrapperStyle}>
              <Input value={counterAmount} onChangeText={setCounterAmount} placeholder="Your counter" keyboardType="numeric" />
            </View>
            <Button label="Send" onPress={handleCounterSubmit} size="sm" disabled={disabled} />
            <Button label="Cancel" onPress={() => setShowCounter(false)} size="sm" variant="ghost" />
          </View>
          {error && <Text style={[theme.textPresets.caption, counterErrorTextStyle, { color: theme.colors.error }]}>{error}</Text>}
        </View>
      )}
    </View>
  );
});
export default BargainPendingOfferCard;
