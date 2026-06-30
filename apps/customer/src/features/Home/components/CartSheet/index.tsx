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
  LinearTransition,
  useDerivedValue,
  interpolate,
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
import * as Haptics from 'expo-haptics';

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
  const cardWidth = SCREEN_WIDTH - 40;

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const containerHeight = useSharedValue(-1);
  const isDismissed = useSharedValue(false);
  const isDragging = useSharedValue(false);
  const hasTriggeredHaptic = useSharedValue(false);

  const activeScale = useSharedValue(1);
  const activeOpacity = useSharedValue(1);

  const itemCount = onGetShopItemCount(group.storeId);
  const total = onGetShopTotal(group.storeId);
  const thumbnailUrl = group.items[0]?.product?.imageUrl || MOCK_PRODUCTS[0]?.imageUrl;

  const doDelete = useCallback(() => {
    onDelete(group.storeId);
  }, [group.storeId, onDelete]);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const handleXPress = useCallback(() => {
    if (isDismissed.value) return;
    isDismissed.value = true;
    activeScale.value = withTiming(0.96, { duration: 240 });
    activeOpacity.value = withTiming(0, { duration: 240 });
    translateX.value = withTiming(-SCREEN_WIDTH - 50, { duration: 240 }, () => {
      containerHeight.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(doDelete)();
      });
    });
  }, [doDelete]);

  const handleRemovePress = useCallback(() => {
    if (isDismissed.value) return;
    isDismissed.value = true;
    activeScale.value = withTiming(0.96, { duration: 240 });
    activeOpacity.value = withTiming(0, { duration: 240 });
    translateX.value = withTiming(-SCREEN_WIDTH - 50, { duration: 240 }, () => {
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
      isDragging.value = true;
    })
    .onUpdate((e) => {
      if (isDismissed.value) return;

      // Clamp translation so it never moves right of 0 and clamps at -cardWidth on left
      const newX = Math.min(0, Math.max(-cardWidth, startX.value + e.translationX));
      translateX.value = newX;

      // Haptic Feedback: Trigger impactLight once when crossing 35% threshold
      const threshold = -cardWidth * 0.35;
      if (newX < threshold) {
        if (!hasTriggeredHaptic.value) {
          hasTriggeredHaptic.value = true;
          runOnJS(triggerHaptic)();
        }
      } else {
        hasTriggeredHaptic.value = false;
      }
    })
    .onEnd((e) => {
      isDragging.value = false;
      if (isDismissed.value) return;

      const threshold = -cardWidth * 0.35;
      const isFullDismiss = translateX.value < threshold || e.velocityX < -1000;

      if (isFullDismiss) {
        isDismissed.value = true;
        activeScale.value = withTiming(0.96, { duration: 240 });
        activeOpacity.value = withTiming(0, { duration: 240 });
        translateX.value = withTiming(-SCREEN_WIDTH - 50, { duration: 240 }, () => {
          containerHeight.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(doDelete)();
          });
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const dragScale = useDerivedValue(() => {
    return withSpring(isDragging.value ? 0.98 : 1, { damping: 15 });
  });

  const dragElevation = useDerivedValue(() => {
    return withSpring(isDragging.value ? 12 : 6, { damping: 15 });
  });

  const dragShadowOpacity = useDerivedValue(() => {
    return withSpring(isDragging.value ? 0.15 : 0.05, { damping: 15 });
  });

  const foregroundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: isDismissed.value ? activeScale.value : dragScale.value },
      ],
      opacity: activeOpacity.value,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: isDragging.value ? 8 : 3,
      },
      shadowOpacity: dragShadowOpacity.value,
      shadowRadius: isDragging.value ? 12 : 5,
      elevation: dragElevation.value,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const distance = Math.abs(translateX.value);
    const progress = Math.min(1, distance / (cardWidth * 0.35));
    return {
      opacity: progress,
    };
  });

  const trashIconStyle = useAnimatedStyle(() => {
    const distance = Math.abs(translateX.value);
    const progress = Math.min(1, distance / (cardWidth * 0.35));
    return {
      transform: [{ scale: 0.8 + 0.2 * progress }],
      opacity: progress,
    };
  });

  const xBtnStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value === -1 ? undefined : containerHeight.value,
  }));

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={[
        containerStyle,
        {
          marginBottom: 8,
          borderRadius: 16,
        },
      ]}
      onLayout={(e) => {
        if (containerHeight.value === -1) {
          containerHeight.value = e.nativeEvent.layout.height;
        }
      }}
    >
      {/* Background Layer */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#EF4444',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 24,
          },
          backgroundStyle,
        ]}
      >
        <Pressable onPress={handleRemovePress} style={{ height: '100%', justifyContent: 'center' }}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }, trashIconStyle]}>
            <Ionicons name="trash-outline" size={32} color="#FFFFFF" />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: theme.typography.fonts.semiBold,
              }}
            >
              Remove
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Sliding card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={foregroundStyle}>
          <View
            style={[
              cartSheetStyles.cartRow,
              {
                backgroundColor: theme.colors.surfaceSecondary,
                paddingRight: 40,
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

      {/* X button */}
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
            zIndex: 10,
          },
        ]}
      >
        <Pressable
          onPress={handleXPress}
          hitSlop={10}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 0.5,
            borderColor: isDark ? 'rgba(239,68,68,0.4)' : '#FECACA',
            backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FFF5F5',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="close" size={12} color="#EF4444" />
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
