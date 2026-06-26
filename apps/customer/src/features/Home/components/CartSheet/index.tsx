import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Animated as RNAnimated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { MOCK_PRODUCTS } from '../../../../constants';
import { CART_DELETE_ACTION_WIDTH } from '../../Constants';
import { cartSheetStyles } from './styledcomponents';

interface CartGroup {
  storeId: string;
  storeName: string;
  items: any[];
}

interface CartSheetProps {
  cartSheetRef: React.RefObject<BottomSheetModal>;
  isCartCloseBtnVisible: boolean;
  cartSnapPoints: number[];
  cartGroups: CartGroup[];
  totalItems: number;
  grandTotal: number;
  onClose: () => void;
  onGoToCart: (storeId?: string) => void;
  onClearAll: () => void;
  onGetShopItemCount: (storeId: string) => number;
  onGetShopTotal: (storeId: string) => number;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  cartSheetRef,
  isCartCloseBtnVisible,
  cartSnapPoints,
  cartGroups,
  totalItems,
  grandTotal,
  onClose,
  onGoToCart,
  onClearAll,
  onGetShopItemCount,
  onGetShopTotal,
}) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Swipeable refs
  const cartSwipeableRefs = useRef<Map<string, Swipeable | null>>(new Map());
  const cartProgrammaticOpen = useRef<Set<string>>(new Set());

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  return (
    <BottomSheetModal
      ref={cartSheetRef}
      index={0}
      snapPoints={cartSnapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onChange={(index) => {
        if (index === -1) {
          onClose();
        }
      }}
      onAnimate={(fromIndex, toIndex) => {
        if (toIndex === -1) {
          onClose();
        }
      }}
      enableContentPanningGesture
      enableOverDrag={false}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleComponent={() => (
        <View style={cartSheetStyles.customHandleContainer}>
          {isCartCloseBtnVisible && (
            <Pressable
              onPress={() => {
                onClose();
                cartSheetRef.current?.dismiss();
              }}
              style={cartSheetStyles.floatingCloseBtn}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          )}
          <View style={cartSheetStyles.grabHandle} />
        </View>
      )}
    >
      {/* Header */}
      <View
        style={[
          cartSheetStyles.sheetHeaderWrapper,
          { borderBottomColor: '#F3F4F6' },
        ]}
      >
        <View>
          <Text
            style={[
              cartSheetStyles.sheetTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Your carts
          </Text>
          {cartGroups.length > 0 && (
            <Text
              style={[
                cartSheetStyles.sheetSubtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                },
              ]}
            >
              {cartGroups.length} store{cartGroups.length !== 1 ? 's' : ''} ·{' '}
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {cartGroups.length > 0 && (
          <Pressable onPress={onClearAll} style={cartSheetStyles.clearAllBtn}>
            <Ionicons
              name="trash-outline"
              size={13}
              color={theme.colors.error}
            />
            <Text
              style={{
                color: theme.colors.error,
                fontFamily: theme.typography.fonts.bold,
                fontSize: 11,
              }}
            >
              Clear all
            </Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      {cartGroups.length === 0 ? (
        // Empty State
        <View style={cartSheetStyles.emptyCartContainer}>
          <View
            style={[
              cartSheetStyles.emptyCartIconBg,
              {
                backgroundColor: isDark
                  ? 'rgba(239, 68, 68, 0.1)'
                  : '#FFF5F5',
              },
            ]}
          >
            <Ionicons
              name="cart-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>
          <Text
            style={[
              cartSheetStyles.emptyCartTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Your carts are empty
          </Text>
          <Text
            style={[
              cartSheetStyles.emptyCartSub,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.medium,
              },
            ]}
          >
            Add items from shops near you to start shopping.
          </Text>
        </View>
      ) : (
        // Cart Items
        <View style={{ flex: 1 }}>
          <BottomSheetScrollView
            style={cartSheetStyles.bottomSheetScrollView}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 40 + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
          >
            {cartGroups.map((group) => {
              const itemCount = onGetShopItemCount(group.storeId);
              const total = onGetShopTotal(group.storeId);
              const thumbnailUrl =
                group.items[0]?.product?.imageUrl ||
                MOCK_PRODUCTS[0]?.imageUrl;

              return (
                <Swipeable
                  key={group.storeId}
                  ref={(ref) => {
                    cartSwipeableRefs.current.set(group.storeId, ref);
                  }}
                  containerStyle={cartSheetStyles.cartRowSwipeContainer}
                  overshootRight={false}
                  friction={2.5}
                  rightThreshold={CART_DELETE_ACTION_WIDTH * 0.8}
                  activeOffsetX={[-10, 10]}
                  failOffsetY={[-10, 10]}
                  onSwipeableOpen={(direction) => {
                    if (direction !== 'right') return;
                    if (cartProgrammaticOpen.current.has(group.storeId)) {
                      cartProgrammaticOpen.current.delete(group.storeId);
                      return;
                    }
                    // Call onDeleteCart callback here if provided
                  }}
                  renderRightActions={(_progress, dragX) => {
                    const scaleX = dragX.interpolate({
                      inputRange: [-CART_DELETE_ACTION_WIDTH, 0],
                      outputRange: [1, 0],
                      extrapolate: 'clamp',
                    });
                    const textOpacity = dragX.interpolate({
                      inputRange: [
                        -CART_DELETE_ACTION_WIDTH,
                        -CART_DELETE_ACTION_WIDTH * 0.6,
                        0,
                      ],
                      outputRange: [1, 0, 0],
                      extrapolate: 'clamp',
                    });

                    return (
                      <View style={cartSheetStyles.cartRowDeleteAction}>
                        <RNAnimated.View
                          style={[
                            cartSheetStyles.cartRowDeleteBg,
                            {
                              backgroundColor: isDark
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(239, 68, 68, 0.05)',
                              transform: [{ scaleX }],
                            },
                          ]}
                        />
                        <Pressable
                          onPress={() => {
                            // Call onDeleteCart callback
                          }}
                          style={cartSheetStyles.cartRowDeleteInner}
                        >
                          <RNAnimated.Text
                            style={[
                              cartSheetStyles.cartRowDeleteText,
                              {
                                color: theme.colors.error,
                                fontFamily: theme.typography.fonts.bold,
                                opacity: textOpacity,
                              },
                            ]}
                          >
                            Remove
                          </RNAnimated.Text>
                        </Pressable>
                      </View>
                    );
                  }}
                >
                  <View
                    style={[
                      cartSheetStyles.cartRow,
                      { backgroundColor: theme.colors.surfaceSecondary },
                    ]}
                  >
                    <View
                      style={[
                        cartSheetStyles.cartThumbnail,
                        { backgroundColor: theme.colors.surface },
                      ]}
                    >
                      <Image
                        source={{ uri: thumbnailUrl }}
                        style={cartSheetStyles.cartThumbnailImage}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={cartSheetStyles.cartRowInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          cartSheetStyles.cartCardShopName,
                          {
                            color: theme.colors.textPrimary,
                            fontFamily: theme.typography.fonts.bold,
                          },
                        ]}
                      >
                        {group.storeName}
                      </Text>
                      <Text
                        style={[
                          cartSheetStyles.cartItemCount,
                          {
                            color: theme.colors.textSecondary,
                            fontFamily: theme.typography.fonts.medium,
                          },
                        ]}
                      >
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </Text>
                    </View>

                    <View style={cartSheetStyles.cartPriceCol}>
                      <Text
                        style={[
                          cartSheetStyles.cartPriceVal,
                          {
                            color: theme.colors.textPrimary,
                            fontFamily: theme.typography.fonts.bold,
                          },
                        ]}
                      >
                        ₹{total.toFixed(0)}
                      </Text>
                      <Pressable
                        onPress={() => onGoToCart(group.storeId)}
                        style={[
                          cartSheetStyles.cartViewBtn,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <Text
                          style={[
                            cartSheetStyles.cartViewBtnText,
                            {
                              fontFamily: theme.typography.fonts.bold,
                            },
                          ]}
                        >
                          View Cart
                        </Text>
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => {
                        cartProgrammaticOpen.current.add(group.storeId);
                        cartSwipeableRefs.current.get(group.storeId)?.openRight();
                      }}
                      style={cartSheetStyles.cartRowDeleteToggle}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.error}
                      />
                    </Pressable>
                  </View>
                </Swipeable>
              );
            })}
            <Text
              style={[
                cartSheetStyles.swipeHint,
                {
                  color: theme.colors.textMuted,
                  fontFamily: theme.typography.fonts.medium,
                },
              ]}
            >
              Swipe left on a cart to remove it
            </Text>
          </BottomSheetScrollView>

          {/* Footer */}
          <View
            style={[
              cartSheetStyles.cartSheetFooter,
              { paddingBottom: insets.bottom + 12 },
            ]}
          >
            <Pressable
              onPress={() => onGoToCart()}
              style={[
                cartSheetStyles.checkoutAllBtn,
                {
                  backgroundColor: theme.colors.primary,
                  borderRadius: 14,
                },
              ]}
            >
              <View style={cartSheetStyles.checkoutAllLeft}>
                <Text
                  style={[
                    cartSheetStyles.checkoutAllSub,
                    { fontFamily: theme.typography.fonts.medium },
                  ]}
                >
                  {totalItems} item{totalItems !== 1 ? 's' : ''} from{' '}
                  {cartGroups.length} store
                  {cartGroups.length !== 1 ? 's' : ''}
                </Text>
                <Text
                  style={[
                    cartSheetStyles.checkoutAllText,
                    { fontFamily: theme.typography.fonts.bold },
                  ]}
                >
                  Checkout all
                </Text>
              </View>
              <View style={cartSheetStyles.checkoutAllRight}>
                <Text
                  style={[
                    cartSheetStyles.checkoutAllPrice,
                    { fontFamily: theme.typography.fonts.bold },
                  ]}
                >
                  ₹{grandTotal.toFixed(0)}
                </Text>
                <View style={cartSheetStyles.checkoutAllCircle}>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </BottomSheetModal>
  );
};

export default CartSheet;
