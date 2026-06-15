import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Image, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useCartStore } from '../../../Cart/Providers/useCartStore';
import { useTheme } from '../../../../theme/ThemeContext';
import { Product } from '../../../../types/shared';
import { RollingNumber } from '../../../../Common/components/ui/RollingNumber';
import {
  containerStyle,
  imageFrameStyle,
  productImageStyle,
  discountTagStyle,
  discountTextStyle,
  infoFrameStyle,
  bargainBadgeStyle,
  bargainBadgeTextStyle,
  priceContainerStyle,
  strikethroughPriceStyle,
  actionRowStyle,
  actionBargainBtnStyle,
  actionBargainTextStyle,
  addButtonStyle,
  quantitySelectorStyle,
  qtyBtnStyle,
  qtyTextStyle,
} from './styledcomponents';
interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onBargainPress?: () => void;
  style?: ViewStyle;
  showAddButton?: boolean;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const ProductCard: React.FC<ProductCardProps> = observer(({
  product,
  onPress,
  onBargainPress,
  style,
  showAddButton = true,
}) => {
  const { theme, isDark } = useTheme();
  const cartStore = useCartStore();
  const scale = useSharedValue(1);
  const quantityInCart = cartStore.getQuantityForProduct(product.id);
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const handleAdd = (e: any) => {
    e.stopPropagation();
    cartStore.setQuantity(product, quantityInCart + 1);
  };
  const handleIncrement = (e: any) => {
    e.stopPropagation();
    cartStore.setQuantity(product, quantityInCart + 1);
  };
  const handleDecrement = (e: any) => {
    e.stopPropagation();
    cartStore.setQuantity(product, quantityInCart - 1);
  };
  const basePrice = product.price;
  const displayPrice = product.discountPrice || basePrice;
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : 0;
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          shadowColor: 'rgba(0, 60, 70, 0.06)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
        },
        animatedStyle,
        style,
      ]}
    >
      {}
      <View style={[imageFrameStyle, { borderTopLeftRadius: theme.borderRadius.lg, borderTopRightRadius: theme.borderRadius.lg }]}>
        <Image source={{ uri: product.imageUrl }} style={productImageStyle} resizeMode="cover" />
        {}
        {hasDiscount && (
          <View style={[discountTagStyle, { backgroundColor: theme.colors.success, borderRadius: theme.borderRadius.xs }]}>
            <Text style={discountTextStyle}>{discountPercent}% OFF</Text>
          </View>
        )}
      </View>
      {}
      <View style={[infoFrameStyle, { padding: theme.spacing.md }]}>
        <Text
          numberOfLines={1}
          style={[
            theme.textPresets.caption,
            { color: theme.colors.textSecondary, marginBottom: 2, fontSize: 11 },
          ]}
        >
          {product.storeName}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            theme.textPresets.bodyMedium,
            { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginBottom: 4, fontSize: 15 },
          ]}
        >
          {product.name}
        </Text>
        <Text
          style={[
            theme.textPresets.caption,
            { color: theme.colors.textMuted, marginBottom: 8, fontSize: 11 },
          ]}
        >
          {product.validityDate || 'Fresh Stock'}
        </Text>
        {}
        {product.isBargainable && (
          <View style={[bargainBadgeStyle, { backgroundColor: '#FBEBE4', borderRadius: theme.borderRadius.xs }]}>
            <Text style={[bargainBadgeTextStyle, { color: theme.colors.accent, fontFamily: theme.typography.fonts.bold }]}>
              💰 Bargain Available • Save ₹50
            </Text>
          </View>
        )}
        {}
        <View style={priceContainerStyle}>
          <Text
            style={[
              theme.textPresets.bodyLarge,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 16 },
            ]}
          >
            ₹{displayPrice}
          </Text>
          {hasDiscount && (
            <Text
              style={[
                theme.textPresets.caption,
                strikethroughPriceStyle,
                { color: theme.colors.textMuted, marginLeft: 6, marginTop: 1 },
              ]}
            >
              ₹{basePrice}
            </Text>
          )}
        </View>
        {}
        <View style={actionRowStyle}>
          {product.isBargainable && onBargainPress && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onBargainPress();
              }}
              style={[actionBargainBtnStyle, { borderColor: theme.colors.accent }]}
            >
              <Text style={[actionBargainTextStyle, { color: theme.colors.accent, fontFamily: theme.typography.fonts.bold }]}>
                Bargain
              </Text>
            </Pressable>
          )}
          {showAddButton && (
            <View style={{ flex: 1 }}>
              {quantityInCart > 0 ? (
                <View
                  style={[
                    quantitySelectorStyle,
                    {
                      backgroundColor: theme.colors.primary,
                      borderRadius: theme.borderRadius.round,
                    },
                  ]}
                >
                  <Pressable onPress={handleDecrement} style={qtyBtnStyle}>
                    <Ionicons name="remove" size={14} color="#FFFFFF" />
                  </Pressable>
                  <RollingNumber
                    value={quantityInCart}
                    style={[qtyTextStyle, { fontFamily: theme.typography.fonts.semiBold }] as any}
                  />
                  <Pressable onPress={handleIncrement} style={qtyBtnStyle}>
                    <Ionicons name="add" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={handleAdd}
                  style={[
                    addButtonStyle,
                    {
                      borderColor: theme.colors.primary,
                      borderWidth: 1.5,
                      borderRadius: theme.borderRadius.round,
                    },
                  ]}
                >
                  <Text
                    style={[
                      theme.textPresets.caption,
                      { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold, fontSize: 12 },
                    ]}
                  >
                    ADD
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
});
export default ProductCard;
