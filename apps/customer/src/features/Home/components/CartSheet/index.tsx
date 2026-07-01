import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { MOCK_PRODUCTS } from '../../../../constants';
import { cartSheetStyles } from './styledcomponents';

interface CartGroup {
  storeId: string;
  storeName: string;
  items: any[];
}

interface CartRowItemProps {
  group: CartGroup;
  isDark: boolean;
  theme: any;
  hasActiveBargain: boolean;
  onDelete: (storeId: string) => void;
  onGoToCart: (storeId: string) => void;
  onGetShopItemCount: (storeId: string) => number;
  onGetShopTotal: (storeId: string) => number;
}

const CartRowItem: React.FC<CartRowItemProps> = ({
  group,
  isDark,
  theme,
  hasActiveBargain,
  onDelete,
  onGoToCart,
  onGetShopItemCount,
  onGetShopTotal,
}) => {
  const itemCount = onGetShopItemCount(group.storeId);
  const total = onGetShopTotal(group.storeId);
  const thumbnailUrl = group.items[0]?.product?.imageUrl || MOCK_PRODUCTS[0]?.imageUrl;

  const doDelete = useCallback(() => {
    onDelete(group.storeId);
  }, [group.storeId, onDelete]);

  const {
    panGesture,
    dismiss,
    onLayout,
    foregroundStyle,
    backgroundStyle,
    trashIconStyle,
    xBtnStyle,
    containerStyle,
  } = useSwipeGesture(doDelete);

  const cardContent = (
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
  );

  if (hasActiveBargain) {
    return (
      <Animated.View
        layout={LinearTransition.springify()}
        style={[
          { marginBottom: 8, borderRadius: 16, borderWidth: 1.5, borderColor: '#EF9F27', opacity: 0.85, overflow: 'hidden' },
        ]}
      >
        <View>{cardContent}</View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Ionicons name="warning-outline" size={12} color="#EF9F27" />
          <Text style={{ fontSize: 11, color: '#EF9F27', fontFamily: theme.typography.fonts.medium }}>
            Locked · active bargaining session
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 10,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            zIndex: 10,
          }}
          pointerEvents="none"
        >
          <Ionicons name="lock-closed" size={14} color="#EF9F27" />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={[containerStyle, { marginBottom: 8, borderRadius: 16 }]}
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
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
        <Pressable onPress={dismiss} style={{ height: '100%', justifyContent: 'center' }}>
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
          {cardContent}
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
          onPress={dismiss}
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
  hasActiveBargainForShop?: (storeId: string) => boolean;
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
  hasActiveBargainForShop = () => false,
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
                hasActiveBargain={hasActiveBargainForShop(group.storeId)}
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
