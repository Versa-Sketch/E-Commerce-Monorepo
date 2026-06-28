import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { MOCK_PRODUCTS } from '../../../../constants';
import { cartSheetStyles } from './styledcomponents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REVEAL_WIDTH = 110;
const DISMISS_THRESHOLD = SCREEN_WIDTH * 0.45;
const DISMISS_VELOCITY = 900;

interface CartGroup {
  storeId: string;
  storeName: string;
  items: any[];
}

interface CartRowItemProps {
  group: CartGroup;
  isDark: boolean;
  theme: any;
  onDelete: (storeId: string) => void;
  onGoToCart: (storeId: string) => void;
  onGetShopItemCount: (storeId: string) => number;
  onGetShopTotal: (storeId: string) => number;
}

const CartRowItem: React.FC<CartRowItemProps> = ({
  group,
  isDark,
  theme,
  onDelete,
  onGoToCart,
  onGetShopItemCount,
  onGetShopTotal,
}) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const containerHeight = useSharedValue(-1);
  const isDismissed = useSharedValue(false);

  const itemCount = onGetShopItemCount(group.storeId);
  const total = onGetShopTotal(group.storeId);
  const thumbnailUrl = group.items[0]?.product?.imageUrl || MOCK_PRODUCTS[0]?.imageUrl;

  const doDelete = useCallback(() => {
    onDelete(group.storeId);
  }, [group.storeId, onDelete]);

  const handleXPress = useCallback(() => {
    if (isDismissed.value) return;
    if (translateX.value < -REVEAL_WIDTH / 2) {
      translateX.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
    } else {
      translateX.value = withTiming(-REVEAL_WIDTH, { duration: 220, easing: Easing.out(Easing.cubic) });
    }
  }, []);

  const handleRemovePress = useCallback(() => {
    if (isDismissed.value) return;
    isDismissed.value = true;
    translateX.value = withTiming(-SCREEN_WIDTH - 60, { duration: 230 }, () => {
      containerHeight.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(doDelete)();
      });
    });
  }, [doDelete]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-15, 15])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      if (isDismissed.value) return;
      translateX.value = Math.min(0, Math.max(-SCREEN_WIDTH, startX.value + e.translationX));
    })
    .onEnd((e) => {
      if (isDismissed.value) return;

      const cur = translateX.value;
      const isFullDismiss =
        cur < -DISMISS_THRESHOLD ||
        (e.velocityX < -DISMISS_VELOCITY && cur < -REVEAL_WIDTH * 1.4);

      if (isFullDismiss) {
        isDismissed.value = true;
        translateX.value = withTiming(-SCREEN_WIDTH - 60, { duration: 230 }, () => {
          containerHeight.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(doDelete)();
          });
        });
        return;
      }

      if (cur < -REVEAL_WIDTH / 2) {
        translateX.value = withSpring(-REVEAL_WIDTH, { damping: 20, stiffness: 220 });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // X button follows the card but is outside GestureDetector to avoid gesture conflict
  const xBtnStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value === -1 ? undefined : containerHeight.value,
  }));

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          marginBottom: 10,
          borderRadius: 14,
          overflow: 'hidden',
        },
      ]}
      onLayout={(e) => {
        if (containerHeight.value === -1) {
          containerHeight.value = e.nativeEvent.layout.height;
        }
      }}
    >
      {/* Remove panel — right-aligned, revealed as card slides left */}
      <Pressable
        onPress={handleRemovePress}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: REVEAL_WIDTH,
          backgroundColor: isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#A32D2D',
            fontSize: 13,
            fontFamily: theme.typography.fonts.bold,
          }}
        >
          Remove
        </Text>
      </Pressable>

      {/* Sliding card — no border radius (outer container clips it) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={rowStyle}>
          <View
            style={[
              cartSheetStyles.cartRow,
              {
                backgroundColor: theme.colors.surfaceSecondary,
                // right padding leaves room for the X button overlay
                paddingRight: 46,
              },
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
                    { fontFamily: theme.typography.fonts.bold },
                  ]}
                >
                  View Cart
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      {/* X button — outside GestureDetector so it doesn't conflict with pan */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          xBtnStyle,
          {
            position: 'absolute',
            right: 10,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          },
        ]}
      >
        <Pressable
          onPress={handleXPress}
          hitSlop={10}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: isDark ? 'rgba(239,68,68,0.4)' : '#FECACA',
            backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FFF5F5',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="close" size={14} color="#EF4444" />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

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
  onDeleteCart: (storeId: string) => void;
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
  onDeleteCart,
  onGetShopItemCount,
  onGetShopTotal,
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
        if (index === -1) onClose();
      }}
      onAnimate={(fromIndex, toIndex) => {
        if (toIndex === -1) onClose();
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
      <View
        style={[cartSheetStyles.sheetHeaderWrapper, { borderBottomColor: '#F3F4F6' }]}
      >
        <View>
          <Text
            style={[
              cartSheetStyles.sheetTitle,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
            ]}
          >
            Your carts
          </Text>
          {cartGroups.length > 0 && (
            <Text
              style={[
                cartSheetStyles.sheetSubtitle,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium },
              ]}
            >
              {cartGroups.length} store{cartGroups.length !== 1 ? 's' : ''} ·{' '}
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {cartGroups.length > 0 && (
          <Pressable onPress={onClearAll} style={cartSheetStyles.clearAllBtn}>
            <Ionicons name="trash-outline" size={13} color={theme.colors.error} />
            <Text
              style={{ color: theme.colors.error, fontFamily: theme.typography.fonts.bold, fontSize: 11 }}
            >
              Clear all
            </Text>
          </Pressable>
        )}
      </View>

      {cartGroups.length === 0 ? (
        <View style={cartSheetStyles.emptyCartContainer}>
          <View
            style={[
              cartSheetStyles.emptyCartIconBg,
              { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FFF5F5' },
            ]}
          >
            <Ionicons name="cart-outline" size={48} color={theme.colors.primary} />
          </View>
          <Text
            style={[
              cartSheetStyles.emptyCartTitle,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
            ]}
          >
            Your carts are empty
          </Text>
          <Text
            style={[
              cartSheetStyles.emptyCartSub,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium },
            ]}
          >
            Add items from shops near you to start shopping.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <BottomSheetScrollView
            style={cartSheetStyles.bottomSheetScrollView}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 + insets.bottom }}
            showsVerticalScrollIndicator={false}
          >
            {cartGroups.map((group) => (
              <CartRowItem
                key={group.storeId}
                group={group}
                isDark={isDark}
                theme={theme}
                onDelete={onDeleteCart}
                onGoToCart={onGoToCart}
                onGetShopItemCount={onGetShopItemCount}
                onGetShopTotal={onGetShopTotal}
              />
            ))}
            <Text
              style={[
                cartSheetStyles.swipeHint,
                { color: theme.colors.textMuted, fontFamily: theme.typography.fonts.medium },
              ]}
            >
              Swipe left to remove a cart
            </Text>
          </BottomSheetScrollView>

          <View
            style={[cartSheetStyles.cartSheetFooter, { paddingBottom: insets.bottom + 12 }]}
          >
            <Pressable
              onPress={() => onGoToCart()}
              style={[
                cartSheetStyles.checkoutAllBtn,
                { backgroundColor: theme.colors.primary, borderRadius: 14 },
              ]}
            >
              <View style={cartSheetStyles.checkoutAllLeft}>
                <Text
                  style={[cartSheetStyles.checkoutAllSub, { fontFamily: theme.typography.fonts.medium }]}
                >
                  {totalItems} item{totalItems !== 1 ? 's' : ''} from{' '}
                  {cartGroups.length} store{cartGroups.length !== 1 ? 's' : ''}
                </Text>
                <Text
                  style={[cartSheetStyles.checkoutAllText, { fontFamily: theme.typography.fonts.bold }]}
                >
                  Checkout all
                </Text>
              </View>
              <View style={cartSheetStyles.checkoutAllRight}>
                <Text
                  style={[cartSheetStyles.checkoutAllPrice, { fontFamily: theme.typography.fonts.bold }]}
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
