import React from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  billRowStyle,
  billSummaryStyle,
  dividerStyle,
  grandTotalRowStyle,
} from './styledcomponents';
interface BillSummaryProps {
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  walletCreditsUsed?: number;
  isLoading?: boolean;
}
export const BillSummary: React.FC<BillSummaryProps> = observer(({
  subtotal,
  deliveryCharge,
  discountAmount,
  totalAmount,
  walletCreditsUsed = 0,
  isLoading,
}) => {
  const { theme } = useTheme();
  const payable = Math.max(0, totalAmount - walletCreditsUsed);
  return (
    <View style={[billSummaryStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Bill Summary
        </Text>
        {isLoading && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>
      <View style={billRowStyle}>
        <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Subtotal</Text>
        <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>₹{subtotal.toFixed(0)}</Text>
      </View>
      {discountAmount > 0 && (
        <View style={billRowStyle}>
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>Discount</Text>
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>-₹{discountAmount.toFixed(0)}</Text>
        </View>
      )}
      <View style={billRowStyle}>
        <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Delivery Charge</Text>
        {deliveryCharge === 0 ? (
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold }]}>FREE</Text>
        ) : (
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>₹{deliveryCharge.toFixed(0)}</Text>
        )}
      </View>
      {walletCreditsUsed > 0 && (
        <View style={billRowStyle}>
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>Wallet Credits Applied</Text>
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>-₹{walletCreditsUsed.toFixed(0)}</Text>
        </View>
      )}
      <View style={[dividerStyle, { backgroundColor: theme.colors.border }]} />
      <View style={grandTotalRowStyle}>
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>Grand Total</Text>
        <Text style={[theme.textPresets.h2, { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold }]}>
          ₹{payable.toFixed(0)}
        </Text>
      </View>
    </View>
  );
});
export default BillSummary;
