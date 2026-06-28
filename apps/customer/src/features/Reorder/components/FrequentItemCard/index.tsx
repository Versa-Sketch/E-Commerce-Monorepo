import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { FrequentItem } from '../../types';
import {
  addBtnStyle,
  cardStyle,
  disabledBtnStyle,
  footerRowStyle,
  imageContainerStyle,
  imageStyle,
  inCartBadgeStyle,
  infoContainerStyle,
  orderCountRowStyle,
  outOfStockBadgeStyle,
  stepperBtnStyle,
  stepperStyle,
} from './styledcomponents';

interface FrequentItemCardProps {
  item: FrequentItem;
  cartQuantity: number;
  onAdd: (item: FrequentItem) => void;
  onDecrease: (item: FrequentItem) => void;
}

export const FrequentItemCard: React.FC<FrequentItemCardProps> = ({ item, cartQuantity, onAdd, onDecrease }) => {
  const { theme } = useTheme();
  const price = parseFloat(item.selling_price);

  return (
    <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={imageContainerStyle}>
        {item.product_image ? (
          <Image source={{ uri: item.product_image }} style={imageStyle} resizeMode="cover" />
        ) : (
          <Ionicons name="leaf-outline" size={28} color="#16A34A" />
        )}
        {!item.is_in_stock && (
          <View style={outOfStockBadgeStyle}>
            <Text style={{ fontSize: 9, color: '#DC2626', fontFamily: theme.typography.fonts.semiBold }}>
              Out of stock
            </Text>
          </View>
        )}
        {cartQuantity > 0 && (
          <View style={inCartBadgeStyle}>
            <Text style={{ fontSize: 9, color: '#fff', fontFamily: theme.typography.fonts.semiBold }}>
              {cartQuantity} in cart
            </Text>
          </View>
        )}
      </View>

      <View style={infoContainerStyle}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 11,
            fontFamily: theme.typography.fonts.semiBold,
            color: theme.colors.textPrimary,
            lineHeight: 15,
            marginBottom: 2,
          }}
        >
          {item.product_name}
        </Text>
        <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular }}>
          {item.variant_name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: theme.typography.fonts.bold,
            color: item.is_in_stock ? '#16A34A' : theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          ₹{price.toFixed(0)}
        </Text>
      </View>

      <View style={footerRowStyle}>
        <View style={orderCountRowStyle}>
          <Ionicons name="repeat-outline" size={10} color={theme.colors.textSecondary} />
          <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }}>
            {item.order_count}×
          </Text>
        </View>

        {!item.is_in_stock ? (
          <View style={[disabledBtnStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
          </View>
        ) : cartQuantity > 0 ? (
          <View style={stepperStyle}>
            <Pressable onPress={() => onDecrease(item)} style={stepperBtnStyle}>
              <Text style={{ fontSize: 16, color: '#fff', lineHeight: 18 }}>−</Text>
            </Pressable>
            <Text style={{ fontSize: 12, color: '#fff', fontFamily: theme.typography.fonts.bold, minWidth: 14, textAlign: 'center' }}>
              {cartQuantity}
            </Text>
            <Pressable onPress={() => onAdd(item)} style={stepperBtnStyle}>
              <Text style={{ fontSize: 16, color: '#fff', lineHeight: 18 }}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => onAdd(item)} style={addBtnStyle}>
            <Text style={{ fontSize: 18, color: '#fff', lineHeight: 22, marginTop: -1 }}>+</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FrequentItemCard;
