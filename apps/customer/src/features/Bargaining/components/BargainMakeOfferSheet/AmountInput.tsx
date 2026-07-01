import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { Input } from '../../../../Common/components/ui/Input';
import { Chip } from '../../../../Common/components/ui/Chip';
import { useOfferSheet } from './context';
import {
  amountInputWrapperStyle,
  amountRowStyle,
  chipsRowStyle,
  currencyPrefixStyle,
  discountHintStyle,
  errorTextStyle,
  sectionLabelStyle,
} from './styledcomponents';

const DISCOUNT_OPTIONS = [5, 10, 15, 20];

export function AmountInput() {
  const { theme } = useTheme();
  const { selectedItem, amount, setAmount, error, discount, applyDiscount } = useOfferSheet();

  if (!selectedItem) return null;

  return (
    <>
      <Text
        style={[theme.textPresets.label, sectionLabelStyle, { color: theme.colors.textSecondary }]}
      >
        Your offer for {selectedItem.product_name}
      </Text>
      <View style={amountRowStyle}>
        <View style={amountInputWrapperStyle}>
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            leftComponent={
              <Text
                style={[
                  theme.textPresets.bodyMedium,
                  currencyPrefixStyle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ₹
              </Text>
            }
          />
        </View>
        <Text
          style={[theme.textPresets.caption, discountHintStyle, { color: theme.colors.textMuted }]}
        >
          {discount !== null && discount > 0
            ? `${discount}% off ₹${selectedItem.selling_price}`
            : ' '}
        </Text>
      </View>
      <View style={chipsRowStyle}>
        {DISCOUNT_OPTIONS.map((pct) => (
          <Chip key={pct} label={`-${pct}%`} onPress={() => applyDiscount(pct)} />
        ))}
      </View>
      {error && (
        <Text
          style={[theme.textPresets.caption, errorTextStyle, { color: theme.colors.error }]}
        >
          {error}
        </Text>
      )}
    </>
  );
}
