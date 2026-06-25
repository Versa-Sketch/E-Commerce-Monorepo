import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useTheme } from "../../../../theme/ThemeContext";
import { useCartStore } from "../../Providers/useCartStore";
import { CartItem } from "../../types/domain";
import { CartItemRow } from "../CartItemRow";
import {
  deliveryBadgeStyle,
  headerBadgeRowStyle,
  itemCountBadgeStyle,
  rowStyle,
  storeGroupCardStyle,
  storeGroupHeaderStyle,
  storeTitleTextStyle,
} from "./styledcomponents";
interface StoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
}
interface StoreGroupCardProps {
  storeGroup: StoreGroup;
  onQtyChange: (item: CartItem, delta: number) => void;
  onRemove: (item: CartItem) => void;
}
export const StoreGroupCard: React.FC<StoreGroupCardProps> = observer(
  ({ storeGroup, onQtyChange, onRemove }) => {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const cartStore = useCartStore();

    const bargainableItems = storeGroup.items.filter(
      (item) => item.product.isBargainable,
    );
    const hasBargainableItems = bargainableItems.length > 0;

    const shopCart = cartStore.shopCarts.get(storeGroup.storeId);
    const activeBargainSessionId = shopCart?.active_bargain_session_id;
    const itemCount = storeGroup.items.reduce((acc, item) => acc + item.quantity, 0);

    const previewCart = cartStore.checkoutPreview?.carts.find(
      (c) => c.shop_id === storeGroup.storeId
    );
    const singlePreview = shopCart?.cart_id
      ? cartStore.cartCheckoutPreviews.get(shopCart.cart_id)
      : undefined;

    const deliveryChargeVal = singlePreview
      ? parseFloat(singlePreview.delivery_charge)
      : previewCart
      ? parseFloat(previewCart.delivery_charge)
      : cartStore.getShopTotals(storeGroup.storeId).deliveryFee;

    const isFreeDelivery = deliveryChargeVal === 0;

    const displayedTotal = singlePreview
      ? parseFloat(singlePreview.total_amount)
      : previewCart
      ? parseFloat(previewCart.subtotal) + parseFloat(previewCart.delivery_charge)
      : cartStore.getShopTotals(storeGroup.storeId).grandTotal;

    // TEMP: routed to the @monorepo/bargaining preview screen instead of the real
    // session flow while the new UI is being reviewed. Swap the body back to the
    // commented block below to return to the real flow.
    const handleBargainShop = async () => {
      router.push('/dev-preview/bargain-chat');
    };
    // const handleBargainShop = async () => {
    //   try {
    //     if (!cartStore.shopCarts.has(storeGroup.storeId)) {
    //       await cartStore.getShopCart(storeGroup.storeId);
    //     }
    //     const cart = cartStore.shopCarts.get(storeGroup.storeId);
    //     if (cart?.active_bargain_session_id) {
    //       router.push(`/customer/bargain/session/${cart.active_bargain_session_id}`);
    //       return;
    //     }
    //     const cartId = cart?.cart_id;
    //     if (!cartId) {
    //       Alert.alert(
    //         "Unable to open bargain history",
    //         "Please try again in a moment.",
    //       );
    //       return;
    //     }
    //     router.push({ pathname: '/customer/bargain/cart/[cartId]', params: { cartId } });
    //   } catch (e) {
    //     Alert.alert("Unable to open bargain", "Please try again in a moment.");
    //   }
    // };

    return (
      <View style={[storeGroupCardStyle, { backgroundColor: theme.colors.surface }]}>
        <View style={storeGroupHeaderStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="checkbox-sharp"
              size={20}
              color="#16A34A"
            />
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontFamily: 'Inter-Bold',
                fontSize: 18,
                fontWeight: '700',
                marginLeft: 8,
              }}
            >
              {storeGroup.storeName}
            </Text>
          </View>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: 'Inter-Medium',
              fontSize: 12,
              fontWeight: '500',
              marginLeft: 28,
            }}
          >
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </Text>
        </View>

        {storeGroup.items.map((item, index) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onQtyChange={onQtyChange}
            onRemove={onRemove}
            isLast={index === storeGroup.items.length - 1}
          />
        ))}

        <View
          style={{
            backgroundColor: isDark ? 'rgba(22, 163, 74, 0.08)' : '#F8FFFA',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(22, 163, 74, 0.25)' : '#D6F5DF',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter-Medium',
              fontWeight: '500',
              color: theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            🏷️ Bargaining available for items in this store
          </Text>
          <Pressable
            onPress={handleBargainShop}
            style={{
              backgroundColor: '#16A34A',
              borderRadius: 14,
              height: 44,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              alignSelf: 'stretch',
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>₹</Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Inter-SemiBold',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              Bargaining Store
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              fontFamily: 'Inter-Medium',
              color: theme.colors.textSecondary,
            }}
          >
            Store Total
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: theme.colors.textPrimary,
            }}
          >
            ₹{displayedTotal.toFixed(0)}
          </Text>
        </View>
      </View>
    );
  },
);
export default StoreGroupCard;
