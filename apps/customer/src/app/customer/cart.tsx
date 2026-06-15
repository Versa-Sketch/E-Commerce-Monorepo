import { Button } from '@/Common/components/ui/Button';
import { EmptyState } from '@/Common/components/ui/EmptyState';
import { LoadingOverlay } from '@/Common/components/ui/LoadingOverlay';
import { API_STATUS } from '@/Common/Constants';
import { useAuthStore } from '@/features/Auth/Providers/useAuthStore';
import { useCartStore } from '@/features/Cart/Providers/useCartStore';
import { StoreGroupCard } from '@/features/Cart/components/StoreGroupCard';
import { BillSummary } from '@/features/Cart/components/BillSummary';
import { SavingsSummary } from '@/features/Cart/components/SavingsSummary';
import { CartSkeleton } from '@/features/Cart/components/CartSkeleton';
import { CartItem } from '@/features/Cart/types/domain';
import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
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
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 18 }]}>
          {headerTitle}
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isFreeDelivery && (
          <View style={[styles.freeDeliveryBanner, { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md }]}>
            <Ionicons name="gift-outline" size={18} color={theme.colors.success} />
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success, fontFamily: theme.typography.fonts.bold, marginLeft: 8 }]}>
              Yay! You&apos;ve unlocked FREE delivery
            </Text>
          </View>
        )}
        {displayGroups.map((storeGroup) => (
          <StoreGroupCard
            key={storeGroup.storeId}
            storeGroup={storeGroup}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
        ))}
        {!shopId && (
          <View style={[styles.savingsCard, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
            <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginBottom: 12 }]}>
              Savings &amp; Offers
            </Text>
            {user && user.walletBalance > 0 && (
              <View style={styles.walletSection}>
                <View style={styles.walletHeader}>
                  <View style={styles.row}>
                    <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} />
                    <View style={styles.walletText}>
                      <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
                        Apply Wallet Balance
                      </Text>
                      <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]}>
                        Available: ₹{user.walletBalance}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={useWallet}
                    onValueChange={handleWalletToggle}
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                    thumbColor="#ffffff"
                  />
                </View>
                {useWallet && (
                  <Text style={[theme.textPresets.caption, { color: theme.colors.success, marginTop: 8, fontStyle: 'italic' }]}>
                    Applied ₹{cartStore.walletCreditsUsed.toFixed(0)} from wallet credits.
                  </Text>
                )}
                <View style={[styles.savingsDivider, { backgroundColor: theme.colors.border }]} />
              </View>
            )}
            {cartStore.coupon.code ? (
              <View style={[styles.couponAppliedRow, { backgroundColor: 'rgba(34, 181, 115, 0.08)', borderRadius: theme.borderRadius.xs }]}>
                <View style={styles.row}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                  <Text style={[theme.textPresets.label, { color: theme.colors.success, marginLeft: 8, fontFamily: theme.typography.fonts.bold }]}>
                    {cartStore.coupon.code} Applied ({cartStore.coupon.discount}% OFF)
                  </Text>
                </View>
                <Pressable onPress={handleRemoveCoupon} style={styles.removeCouponBtn}>
                  <Text style={[theme.textPresets.caption, { color: theme.colors.error, fontFamily: theme.typography.fonts.bold }]}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.couponForm}>
                <TextInput
                  placeholder="Enter coupon (e.g. LOCALIO10)"
                  placeholderTextColor={theme.colors.textMuted}
                  value={couponInput}
                  onChangeText={setCouponInput}
                  autoCapitalize="characters"
                  style={[styles.couponInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}
                />
                <Button
                  label="Apply"
                  onPress={handleApplyCoupon}
                  variant="outline"
                  size="sm"
                  disabled={!couponInput}
                  style={styles.couponBtn}
                />
              </View>
            )}
            {couponError ? (
              <Text style={[theme.textPresets.caption, { color: theme.colors.error, marginTop: 6 }]}>
                {couponError}
              </Text>
            ) : null}
          </View>
        )}
        {blockers.length > 0 && (
          <View style={[styles.blockerBanner, { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: theme.borderRadius.sm }]}>
            {blockers.map((blocker, index) => (
              <View key={index} style={styles.blockerRow}>
                <Ionicons name="alert-circle-outline" size={15} color={theme.colors.error} />
                <Text style={[theme.textPresets.caption, { color: theme.colors.error, marginLeft: 6, flex: 1 }]}>
                  {blocker}
                </Text>
              </View>
            ))}
          </View>
        )}
        <SavingsSummary
          itemDiscount={itemDiscountTotal}
          couponDiscount={billDiscount}
          couponCode={cartStore.coupon.code}
          walletCredits={walletCreditsUsedDisplay}
          totalSaved={totalSaved}
        />
        <BillSummary
          subtotal={billSubtotal}
          deliveryCharge={billDelivery}
          discountAmount={billDiscount}
          totalAmount={billTotal}
          walletCreditsUsed={walletCreditsUsedDisplay}
          isLoading={previewLoading}
        />
      </ScrollView>
      <View style={[styles.stickyFooter, { backgroundColor: theme.colors.surface }]}>
        {totalSaved > 0 && (
          <Text style={[theme.textPresets.caption, { color: theme.colors.success, fontFamily: theme.typography.fonts.bold, textAlign: 'center', marginBottom: 8 }]}>
            You&apos;re saving ₹{totalSaved.toFixed(0)} on this order
          </Text>
        )}
        <Button
          label={`Proceed to Checkout  •  ₹${Math.max(0, billTotal - walletCreditsUsedDisplay).toFixed(0)}`}
          onPress={() => router.push('/customer/checkout')}
          variant="accent"
          disabled={!canCheckout}
          style={styles.checkoutBtnFull}
          rightIcon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
        />
      </View>
      <LoadingOverlay message={overlayMessage} />
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16, shadowColor: 'rgba(0, 60, 70, 0.03)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2, zIndex: 10 },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 140 },
  freeDeliveryBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, marginBottom: 16 },
  savingsCard: { padding: 16, marginBottom: 16, shadowColor: 'rgba(0, 60, 70, 0.04)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10, elevation: 3 },
  walletSection: {},
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savingsDivider: { height: 1, marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  walletText: { marginLeft: 12 },
  couponAppliedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  removeCouponBtn: { padding: 4 },
  couponForm: { flexDirection: 'row', alignItems: 'center' },
  couponInput: { flex: 1, height: 38, borderWidth: 1, paddingHorizontal: 12, fontSize: 12, marginRight: 8 },
  couponBtn: { height: 38, paddingVertical: 0, paddingHorizontal: 16 },
  blockerBanner: { padding: 10, marginBottom: 16 },
  blockerRow: { flexDirection: 'row', alignItems: 'center' },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28, shadowColor: 'rgba(0, 60, 70, 0.08)', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  checkoutBtnFull: { width: '100%', borderRadius: 16, height: 52 },
});
