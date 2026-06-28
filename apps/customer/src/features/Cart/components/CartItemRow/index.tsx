import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { CartItem } from '../../types/domain';
import { RollingNumber } from '../../../../Common/components/ui/RollingNumber';
import { useCartStore } from '../../Providers/useCartStore';
import { useRouter } from 'expo-router';
import {
  actionBlockStyle,
  bargainChipStyle,
  cartItemRowStyle,
  deleteBtnStyle,
  itemDetailsStyle,
  itemImageStyle,
  priceRowStyle,
  qtyBtnStyle,
  qtyTextStyle,
  quantityBoxStyle,
  strikethroughPriceStyle,
} from './styledcomponents';
interface CartItemRowProps {
  item: CartItem;
  onQtyChange: (item: CartItem, delta: number) => void;
  onRemove: (item: CartItem) => void;
  isLast?: boolean;
}
export const CartItemRow: React.FC<CartItemRowProps> = observer(({ item, onQtyChange, onRemove, isLast }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const cartStore = useCartStore();
  const syncing = cartStore.isSyncing(item.product.variantId);
  const originalPrice = item.product.price;
  const discountedPrice = item.product.discountPrice ?? item.product.price;
  const hasDiscount = discountedPrice < originalPrice;

  // TEMP: routed to the @monorepo/bargaining preview screen instead of the real
  // session flow while the new UI is being reviewed. Swap the body back to the
  // commented block below to return to the real flow.
  const handleBargainPrice = async () => {
    router.push('/dev-preview/bargain-chat');
  };
  // const handleBargainPrice = async () => {
  //   try {
  //     if (!cartStore.shopCarts.has(item.product.storeId)) {
  //       await cartStore.getShopCart(item.product.storeId);
  //     }
  //     const shopCart = cartStore.shopCarts.get(item.product.storeId);
  //     const cartItemId = shopCart?.items.find((i) => i.variant_id === item.product.variantId)?.cart_item_id;
  //     const query = cartItemId ? `?focusCartItemId=${cartItemId}` : '';
  //     if (shopCart?.active_bargain_session_id) {
  //       router.push(`/customer/bargain/session/${shopCart.active_bargain_session_id}${query}`);
  //       return;
  //     }
  //     const cartId = shopCart?.cart_id;
  //     if (!cartId) {
  //       Alert.alert('Unable to open bargain history', 'Please try again in a moment.');
  //       return;
  //     }
  //     router.push({
  //       pathname: '/customer/bargain/cart/[cartId]',
  //       params: cartItemId ? { cartId, focusCartItemId: cartItemId } : { cartId },
  //     });
  //   } catch (e) {
  //     Alert.alert('Unable to open bargain', 'Please try again in a moment.');
  //   }
  // };
  return (
    <View
      style={[
        cartItemRowStyle,
        !isLast && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
      ]}
    >
      <Image
        source={{ uri: item.product.imageUrl }}
        style={[itemImageStyle, { borderRadius: 12, backgroundColor: theme.colors.surfaceSecondary }]}
      />
      <View style={itemDetailsStyle}>
        <View style={{ gap: 2 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: theme.colors.textPrimary,
              lineHeight: 18,
            }}
          >
            {item.product.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontWeight: '500',
              fontFamily: 'Inter-Medium',
              color: theme.colors.textSecondary,
            }}
          >
            {item.product.variantName || item.product.category}
          </Text>
        </View>

        <View style={priceRowStyle}>
          {hasDiscount && (
            <Text style={[strikethroughPriceStyle, { color: theme.colors.textMuted, fontSize: 11 }]}>
              ₹{originalPrice.toFixed(0)}
            </Text>
          )}
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: theme.colors.textPrimary,
            }}
          >
            ₹{discountedPrice.toFixed(0)}
          </Text>
        </View>

        <View style={actionBlockStyle}>
          <View
            style={[
              quantityBoxStyle,
              {
                borderColor: isDark ? 'rgba(22, 163, 74, 0.3)' : '#D6F5DF',
                backgroundColor: isDark ? 'rgba(22, 163, 74, 0.12)' : '#F0FDF4',
                opacity: syncing ? 0.6 : 1,
              },
            ]}
          >
            <Pressable onPress={() => onQtyChange(item, -1)} style={qtyBtnStyle} disabled={syncing}>
              <Ionicons
                name={item.quantity <= 1 ? 'trash-outline' : 'remove'}
                size={16}
                color="#16A34A"
              />
            </Pressable>
            <RollingNumber
              value={item.quantity}
              style={[
                qtyTextStyle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: 'Inter-Bold',
                  fontWeight: '700',
                  fontSize: 14,
                },
              ] as any}
            />
            <Pressable onPress={() => onQtyChange(item, 1)} style={qtyBtnStyle} disabled={syncing}>
              <Ionicons name="add" size={16} color="#16A34A" />
            </Pressable>
          </View>
          <Pressable onPress={() => onRemove(item)} style={deleteBtnStyle} disabled={syncing}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});
export default CartItemRow;
