import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  dividerStyle,
  headerRowStyle,
  savingsRowStyle,
  savingsSummaryStyle,
  totalRowStyle,
} from './styledcomponents';
interface SavingsSummaryProps {
  itemDiscount: number;
  couponDiscount: number;
  couponCode?: string | null;
  walletCredits: number;
  totalSaved: number;
}
export const SavingsSummary: React.FC<SavingsSummaryProps> = observer(
  ({ itemDiscount, couponDiscount, couponCode, walletCredits, totalSaved }) => {
    const { theme } = useTheme();
    if (totalSaved <= 0) return null;
    return (
      <View style={[savingsSummaryStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
        <View style={headerRowStyle}>
          <Ionicons name="pricetag-outline" size={16} color={theme.colors.success} />
          <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, marginLeft: 8 }]}>
            Your Savings
          </Text>
        </View>
        {itemDiscount > 0 && (
          <View style={savingsRowStyle}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Item discounts</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success, fontFamily: theme.typography.fonts.semiBold }]}>
              -₹{itemDiscount.toFixed(0)}
            </Text>
          </View>
        )}
        {couponDiscount > 0 && (
          <View style={savingsRowStyle}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>
              {couponCode ? `Coupon ${couponCode}` : 'Coupon discount'}
            </Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success, fontFamily: theme.typography.fonts.semiBold }]}>
              -₹{couponDiscount.toFixed(0)}
            </Text>
          </View>
        )}
        {walletCredits > 0 && (
          <View style={savingsRowStyle}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Wallet credits applied</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success, fontFamily: theme.typography.fonts.semiBold }]}>
              -₹{walletCredits.toFixed(0)}
            </Text>
          </View>
        )}
        <View style={[dividerStyle, { backgroundColor: theme.colors.border }]} />
        <View style={totalRowStyle}>
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.success, fontFamily: theme.typography.fonts.bold }]}>
            Total saved
          </Text>
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.success, fontFamily: theme.typography.fonts.bold }]}>
            ₹{totalSaved.toFixed(0)}
          </Text>
        </View>
      </View>
    );
  }
);
export default SavingsSummary;
