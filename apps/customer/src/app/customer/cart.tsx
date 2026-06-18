import { EmptyState } from '@/Common/components/ui/EmptyState';
import { LoadingOverlay } from '@/Common/components/ui/LoadingOverlay';
import { API_STATUS } from '@/Common/Constants';
import { useAuthStore } from '@/features/Auth/Providers/useAuthStore';
import { useCartStore } from '@/features/Cart/Providers/useCartStore';
import { StoreGroupCard } from '@/features/Cart/components/StoreGroupCard';
import { CartSkeleton } from '@/features/Cart/components/CartSkeleton';
import { CartItem } from '@/features/Cart/types/domain';
import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
export default observer(function CartScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { shopId } = useLocalSearchParams<{ shopId?: string }>();
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const user = authStore.user;
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [useWallet, setUseWallet] = useState(cartStore.walletCreditsUsed > 0);
  const [isLoading, setIsLoading] = useState(true);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            cartStore.hydrateAllCarts(),
            authStore.fetchProfile()
          ]);
          if (!active) return;
          if (shopId) {
            const cartId = cartStore.shopCarts.get(shopId)?.cart_id;
            if (cartId) await cartStore.fetchCartCheckoutPreview(cartId);
          } else {
            await cartStore.fetchCheckoutPreview();
          }
        } catch (err) {
          console.error('Failed loading cart details:', err);
        } finally {
          if (active) setIsLoading(false);
        }
      };
      loadData();
      return () => {
        active = false;
      };
    }, [cartStore, authStore, shopId])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 18 }]}>
            Checkout
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <CartSkeleton />
        </ScrollView>
      </View>
    );
  }
  const displayGroups = shopId
    ? cartStore.groupedByStore.filter((group) => group.storeId === shopId)
    : cartStore.groupedByStore;
  const isEmpty = shopId ? displayGroups.length === 0 : cartStore.isEmpty;
  const totals = shopId ? cartStore.getShopTotals(shopId) : cartStore.totals;
  const walletCreditsUsedDisplay = shopId ? 0 : cartStore.walletCreditsUsed;
  const headerTitle = shopId ? displayGroups[0]?.storeName || 'Checkout' : 'Checkout';

  const cartId = shopId ? cartStore.shopCarts.get(shopId)?.cart_id : undefined;
  const singlePreview = cartId ? cartStore.cartCheckoutPreviews.get(cartId) : undefined;
  const allPreview = cartStore.checkoutPreview;
  const preview = shopId ? singlePreview : allPreview;
  const previewLoading = shopId
    ? !!cartId && cartStore.cartCheckoutPreviewStatus.get(cartId) === API_STATUS.FETCHING && !singlePreview
    : cartStore.checkoutPreviewStatus === API_STATUS.FETCHING && !allPreview;

  const billSubtotal = preview ? parseFloat(shopId ? singlePreview!.subtotal : allPreview!.grand_subtotal) : totals.subtotal;
  const billDelivery = preview ? parseFloat(shopId ? singlePreview!.delivery_charge : allPreview!.grand_delivery_charge) : totals.deliveryFee;
  const billDiscount = preview ? parseFloat(shopId ? singlePreview!.discount_amount : allPreview!.grand_discount_amount) : totals.couponDiscount;
  const billTotal = preview ? parseFloat(shopId ? singlePreview!.total_amount : allPreview!.grand_total_amount) : totals.grandTotal;
  const blockers = preview?.blockers ?? [];
  const canCheckout = preview?.can_checkout ?? true;

  const displayItems = displayGroups.flatMap((group) => group.items);
  const itemDiscountTotal = displayItems.reduce((acc, item) => {
    const original = item.product.price;
    const discounted = item.product.discountPrice ?? item.product.price;
    return acc + Math.max(0, original - discounted) * item.quantity;
  }, 0);
  const totalSaved = itemDiscountTotal + billDiscount + walletCreditsUsedDisplay;
  const isFreeDelivery = !isEmpty && billDelivery === 0;

  const refreshPreview = async () => {
    if (shopId) {
      const cid = cartStore.shopCarts.get(shopId)?.cart_id;
      if (cid) await cartStore.fetchCartCheckoutPreview(cid);
    } else {
      await cartStore.fetchCheckoutPreview();
    }
  };

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const nextQuantity = item.quantity + delta;
    setOverlayMessage(nextQuantity <= 0 ? 'Removing item...' : 'Updating quantity...');
    try {
      const result = await cartStore.syncItemQuantity(item.product, nextQuantity);
      if (result.ok) {
        await refreshPreview();
      } else {
        Alert.alert('Update Failed', result.error || 'Could not update this item. Please try again.');
      }
    } catch (err) {
      console.error('Failed updating cart item:', err);
      Alert.alert('Update Failed', 'Could not update this item. Please try again.');
    } finally {
      setOverlayMessage(null);
    }
  };
  const handleRemove = async (item: CartItem) => {
    setOverlayMessage('Removing item...');
    try {
      const result = await cartStore.syncItemQuantity(item.product, 0);
      if (result.ok) {
        await refreshPreview();
      } else {
        Alert.alert('Remove Failed', result.error || 'Could not remove this item. Please try again.');
      }
    } catch (err) {
      console.error('Failed removing cart item:', err);
      Alert.alert('Remove Failed', 'Could not remove this item. Please try again.');
    } finally {
      setOverlayMessage(null);
    }
  };
  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'LOCALIO10') {
      cartStore.applyCoupon('LOCALIO10', 10);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try LOCALIO10.');
    }
  };
  const handleRemoveCoupon = () => {
    cartStore.removeCoupon();
    setCouponInput('');
  };
  const handleWalletToggle = (val: boolean) => {
    setUseWallet(val);
    if (val && user) {
      const maxApplied = Math.min(
        user.walletBalance,
        cartStore.totals.subtotal + cartStore.totals.gstTotal + cartStore.totals.deliveryFee + cartStore.totals.platformFee - cartStore.totals.couponDiscount
      );
      cartStore.setWalletCreditsUsed(maxApplied);
    } else {
      cartStore.setWalletCreditsUsed(0);
    }
  };
  if (isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 18 }]}>
            {headerTitle}
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any products to your basket yet."
          iconName="cart-outline"
          actionLabel="Go Shop Essentials"
          onActionPress={() => router.push('/(tabs)')}
        />
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: 'Inter-Bold', fontWeight: '700', fontSize: 18 }}>
          {headerTitle}
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {displayGroups.map((storeGroup) => (
          <StoreGroupCard
            key={storeGroup.storeId}
            storeGroup={storeGroup}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
        ))}
      </ScrollView>

      {/* Sticky Bottom Checkout Bar */}
      <View style={styles.stickyFooterContainer}>
        <Pressable
          onPress={() => router.push('/customer/checkout')}
          disabled={!canCheckout}
          style={({ pressed }) => [
            styles.checkoutBtnPressed,
            { opacity: pressed ? 0.9 : 1 }
          ]}
        >
          <Text style={styles.checkoutBtnText}>
            Proceed to Checkout
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.checkoutBtnText}>
              ₹{Math.max(0, billTotal).toFixed(0)}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
      <LoadingOverlay message={overlayMessage} />
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16, shadowColor: 'rgba(0, 0, 0, 0.02)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2, zIndex: 10 },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 140 },
  stickyFooterContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#16A34A',
    borderRadius: 20,
    height: 58,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 8,
  },
  checkoutBtnPressed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: '100%',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
});
