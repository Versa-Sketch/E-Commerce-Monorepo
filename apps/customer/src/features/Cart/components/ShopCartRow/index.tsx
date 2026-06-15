import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme/theme';
import {
  avatarStyle,
  closeBtnStyle,
  detailsStyle,
  nameTextStyle,
  rowStyle,
  viewCartBtnStyle,
  viewCartTextStyle,
} from './styledcomponents';

interface ShopCartRowProps {
  storeId: string;
  storeName: string;
  itemCount: number;
  total: number;
  theme: AppTheme;
  onViewCart: () => void;
  onClear: () => void;
}

export const ShopCartRow: React.FC<ShopCartRowProps> = ({
  storeName,
  itemCount,
  total,
  theme,
  onViewCart,
  onClear,
}) => {
  return (
    <View style={[rowStyle, { borderBottomColor: theme.colors.border, borderBottomWidth: 0.5 }]}>
      <View style={[avatarStyle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
        <Ionicons name="storefront-outline" size={22} color={theme.colors.primary} />
      </View>
      <View style={detailsStyle}>
        <Text
          numberOfLines={1}
          style={[theme.textPresets.bodyMedium, nameTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}
        >
          {storeName}
        </Text>
        <Pressable
          onPress={onViewCart}
          style={[viewCartBtnStyle, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.round }]}
        >
          <Text style={[theme.textPresets.caption, viewCartTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>
            View Cart · {itemCount} item{itemCount === 1 ? '' : 's'}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
        </Pressable>
      </View>
      <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, marginHorizontal: 8 }]}>
        ₹{total.toFixed(0)}
      </Text>
      <Pressable onPress={onClear} style={[closeBtnStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
      </Pressable>
    </View>
  );
};

export default ShopCartRow;
