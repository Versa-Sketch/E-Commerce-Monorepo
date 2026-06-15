import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  addMoneyBtnStyle,
  walletCardStyle,
  walletLeftStyle,
} from './styledcomponents';
interface WalletCardProps {
  balance?: number;
}
export const WalletCard: React.FC<WalletCardProps> = ({ balance }) => {
  const { theme } = useTheme();
  return (
    <View style={[walletCardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}>
      <View style={walletLeftStyle}>
        <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
          Wallet Balance
        </Text>
        <Text style={[theme.textPresets.h2, { color: theme.colors.textPrimary, marginTop: 4, fontFamily: theme.typography.fonts.bold }]}>
          ₹{balance !== undefined ? balance.toFixed(2) : '0.00'}
        </Text>
      </View>
      <Pressable style={[addMoneyBtnStyle, { borderColor: theme.colors.accent, borderWidth: 1.5 }]}>
        <Text style={[theme.textPresets.caption, { color: theme.colors.accent, fontFamily: theme.typography.fonts.bold }]}>
          Add Money
        </Text>
      </Pressable>
    </View>
  );
};
export default WalletCard;
