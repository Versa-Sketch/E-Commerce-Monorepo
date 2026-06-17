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

    const handleBargainShop = async () => {
      try {
        if (!cartStore.shopCarts.has(storeGroup.storeId)) {
          await cartStore.getShopCart(storeGroup.storeId);
        }
        const cart = cartStore.shopCarts.get(storeGroup.storeId);
        if (cart?.active_bargain_session_id) {
          router.push(`/customer/bargain/session/${cart.active_bargain_session_id}`);
          return;
        }
        const cartId = cart?.cart_id;
        if (!cartId) {
          Alert.alert(
            "Unable to open bargain history",
            "Please try again in a moment.",
          );
          return;
        }
        router.push({ pathname: '/customer/bargain/cart/[cartId]', params: { cartId } });
      } catch (e) {
        Alert.alert("Unable to open bargain", "Please try again in a moment.");
      }
    };

    return (
      <View
        style={[
          storeGroupCardStyle,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            overflow: "hidden",
          },
        ]}
      >
        <View
          style={[
            storeGroupHeaderStyle,
            { borderBottomColor: theme.colors.border, borderBottomWidth: 0.5 },
          ]}
        >
          <View style={rowStyle}>
            <Ionicons
              name="checkbox-sharp"
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={[
                theme.textPresets.bodyLarge,
                storeTitleTextStyle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  marginLeft: 8,
                },
              ]}
            >
              {storeGroup.storeName}
            </Text>
          </View>
          <View style={headerBadgeRowStyle}>
            <View
              style={[
                itemCountBadgeStyle,
                {
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderRadius: theme.borderRadius.round,
                },
              ]}
            >
              <Text
                style={[
                  theme.textPresets.caption,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: 11,
                  },
                ]}
              >
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Text>
            </View>
            <View
              style={[
                deliveryBadgeStyle,
                {
                  backgroundColor: isFreeDelivery ? "rgba(0, 109, 119, 0.08)" : "rgba(107, 114, 128, 0.08)",
                  borderRadius: theme.borderRadius.round,
                },
              ]}
            >
              <Text
                style={[
                  theme.textPresets.caption,
                  {
                    color: isFreeDelivery ? theme.colors.primary : theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: 11,
                  },
                ]}
              >
                {isFreeDelivery ? "Free Delivery" : `Delivery: ₹${deliveryChargeVal.toFixed(0)}`}
              </Text>
            </View>
          </View>
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

        {true && (
          <View
            style={{
              padding: 12,
              borderTopWidth: 0.5,
              borderTopColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: isDark
                ? theme.colors.surfaceSecondary
                : "#FAFDFD",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginRight: 12,
              }}
            >
              <Ionicons
                name={activeBargainSessionId ? "chatbubble-ellipses-outline" : "pricetags-outline"}
                size={16}
                color={theme.colors.accent}
                style={{ marginRight: 6 }}
              />
              <Text
                numberOfLines={1}
                style={[
                  theme.textPresets.caption,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    flex: 1,
                  },
                ]}
              >
                {activeBargainSessionId
                  ? "You have an active bargain session for this shop"
                  : "Bargain available for items in this shop"}
              </Text>
            </View>
            <Pressable
              onPress={handleBargainShop}
              style={{
                backgroundColor: theme.colors.accent,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={activeBargainSessionId ? "open-outline" : "chatbubbles-outline"}
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: 12,
                }}
              >
                {activeBargainSessionId ? "View Session" : "Bargain Shop"}
              </Text>
            </Pressable>
          </View>
        )}
        <View
          style={{
            padding: 12,
            borderTopWidth: 0.5,
            borderTopColor: theme.colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              theme.textPresets.bodyMedium,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            ₹{displayedTotal.toFixed(0)}
          </Text>
          <Pressable
            onPress={() => router.push(`/customer/checkout?shopId=${storeGroup.storeId}`)}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: theme.borderRadius.round,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: theme.typography.fonts.bold,
                fontSize: 13,
              }}
            >
              Checkout this store
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>
      </View>
    );
  },
);
export default StoreGroupCard;
