import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../Common/components/ui/EmptyState';
import { useAuthStore } from '../../features/Auth/Providers/useAuthStore';
import { useCartStore } from '../../features/Cart/Providers/useCartStore';
import { CartItem } from '../../features/Cart/types/domain';
import { Badge } from '../../Common/components/ui/Badge';
import { Button } from '../../Common/components/ui/Button';
import { Modal } from '../../Common/components/ui/Modal';
import { useAddressStore } from '../../features/Addresses/Providers/useAddressStore';
import { mapOrderApiToOrder } from '../../features/Orders/Models/mapOrderApiToOrder';
import { useOrderStore } from '../../features/Orders/Providers/useOrderStore';
import { openRazorpayCheckout } from '../../services/payments/RazorpayService';
import { useTheme } from '../../theme/ThemeContext';
import { AddressApi, AddressType, OrderApi, PaymentMethod } from '../../types/shared';
import { API_STATUS } from '../../Common/Constants';

const ICON_BY_TYPE: Record<AddressType, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home-outline',
  WORK: 'briefcase-outline',
  SHOP: 'storefront-outline',
  OTHER: 'location-outline',
};

export default observer(function CheckoutScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { shopId } = useLocalSearchParams<{ shopId?: string }>();
  const cartStore = useCartStore();
  const addressStore = useAddressStore();
  const orderStore = useOrderStore();

  const authStore = useAuthStore();
  const groups = shopId
    ? cartStore.groupedByStore.filter((g) => g.storeId === shopId)
    : cartStore.groupedByStore;
  const totals = shopId ? cartStore.getShopTotals(shopId) : cartStore.totals;

  const cartId = shopId ? cartStore.shopCarts.get(shopId)?.cart_id : undefined;
  const singlePreview = cartId ? cartStore.cartCheckoutPreviews.get(cartId) : undefined;
  const allPreview = cartStore.checkoutPreview;
  const preview = shopId ? singlePreview : allPreview;

  const billSubtotal = preview ? parseFloat(shopId ? singlePreview!.subtotal : allPreview!.grand_subtotal) : totals.subtotal;
  const billDelivery = preview ? parseFloat(shopId ? singlePreview!.delivery_charge : allPreview!.grand_delivery_charge) : totals.deliveryFee;
  const billDiscount = preview ? parseFloat(shopId ? singlePreview!.discount_amount : allPreview!.grand_discount_amount) : totals.couponDiscount;
  const billTotal = preview ? parseFloat(shopId ? singlePreview!.total_amount : allPreview!.grand_total_amount) : totals.grandTotal;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isPlacing, setIsPlacing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: overlayMessage ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [overlayMessage, overlayOpacity]);

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
            const cid = cartStore.shopCarts.get(shopId)?.cart_id;
            if (cid) {
              await cartStore.fetchCartCheckoutPreview(cid);
            }
          } else {
            await cartStore.fetchCheckoutPreview();
          }
        } catch (err) {
          console.error('Failed loading checkout data:', err);
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

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const nextQuantity = item.quantity + delta;
    setOverlayMessage(nextQuantity <= 0 ? 'Removing item...' : 'Updating quantity...');
    try {
      const result = await cartStore.syncItemQuantity(item.product, nextQuantity);
      if (result.ok) {
        await cartStore.fetchCartSummaries();
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
        await cartStore.fetchCartSummaries();
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

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);

  useEffect(() => {
    addressStore.fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddressId && addressStore.addresses.some((a) => a.id === selectedAddressId)) return;
    const fallback = addressStore.defaultAddress ?? addressStore.addresses[0];
    setSelectedAddressId(fallback ? fallback.id : null);
  }, [addressStore.addresses.length]);

  const activeAddress: AddressApi | undefined = addressStore.addresses.find((a) => a.id === selectedAddressId);

  const handleSelectAddress = (address: AddressApi) => {
    setSelectedAddressId(address.id);
    setAddressPickerVisible(false);
  };

  const handleAddAddress = () => {
    setAddressPickerVisible(false);
    router.push('/customer/addresses/form');
  };



  const handlePlaceOrder = async () => {
    if (!activeAddress) {
      Alert.alert('Delivery Address Required', 'Please add a delivery address before placing an order.');
      return;
    }
    setIsPlacing(true);
    try {
      const result = shopId
        ? await cartStore.checkoutShop(shopId, { address_id: activeAddress.id, payment_method: paymentMethod })
        : await cartStore.checkoutAll({ address_id: activeAddress.id, payment_method: paymentMethod });
      if (!result) {
        Alert.alert('Order Failed', cartStore.checkoutError || 'Something went wrong. Please try again.');
        return;
      }
      const orders: OrderApi[] = 'orders' in result ? result.orders : [result.order];
      if (paymentMethod === 'RAZORPAY') {
        if (!result.razorpay_order_id || !result.key_id || !result.amount) {
          Alert.alert('Order Failed', 'Payment could not be initiated. Please try again.');
          return;
        }
        try {
          const paymentResult = await openRazorpayCheckout({
            key: result.key_id,
            orderId: result.razorpay_order_id,
            amount: result.amount,
            currency: result.currency,
            description: 'Localio order payment',
          });
          const verifyResult = await cartStore.verifyPayment(paymentResult);
          if (!verifyResult) {
            Alert.alert('Payment Verification Failed', cartStore.checkoutError || 'Please check your orders for status.');
            return;
          }
          verifyResult.orders.forEach((order) => orderStore.addOrder(mapOrderApiToOrder(order, activeAddress)));
          router.replace(`/customer/tracking/${verifyResult.orders[0].order_id}`);
        } catch (e) {
          Alert.alert('Payment Cancelled', 'Your order is pending payment. You can retry from your orders.');
        }
        return;
      }
      orders.forEach((order) => orderStore.addOrder(mapOrderApiToOrder(order, activeAddress)));
      router.replace(`/customer/tracking/${orders[0].order_id}`);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Place Order
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
            <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              Delivery Address
            </Text>
            {addressStore.addresses.length > 0 && (
              <Pressable onPress={() => setAddressPickerVisible(true)}>
                <Text style={[theme.textPresets.label, { color: theme.colors.primary, fontFamily: theme.typography.fonts.semiBold }]}>
                  Change
                </Text>
              </Pressable>
            )}
          </View>
          {activeAddress ? (
            <View style={styles.addressRow}>
              <View style={[styles.addressIconBox, { backgroundColor: 'rgba(0, 109, 119, 0.08)' }]}>
                <Ionicons
                  name={ICON_BY_TYPE[activeAddress.address_type] ?? 'location-outline'}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.addressTextCol}>
                <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                  <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, textTransform: 'capitalize' }]}>
                    {activeAddress.address_type.toLowerCase()}
                  </Text>
                  {activeAddress.is_default && (
                    <Badge label="Default" variant="success" size="sm" style={{ marginLeft: 8 }} />
                  )}
                </View>
                <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                  {activeAddress.address_line1}
                  {activeAddress.address_line2 ? `, ${activeAddress.address_line2}` : ''}
                </Text>
                <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  {activeAddress.state} - {activeAddress.pincode}
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={[theme.textPresets.caption, { color: theme.colors.error, marginBottom: 8 }]}>
                No delivery address found.
              </Text>
              <Button label="Add delivery address" onPress={handleAddAddress} size="sm" />
            </View>
          )}
        </View>
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            Select Payment Method
          </Text>
          <Pressable
            onPress={() => setPaymentMethod('COD')}
            style={[styles.paymentRow, { borderBottomColor: theme.colors.border }]}
          >
            <View style={styles.row}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={paymentMethod === 'COD' ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, marginLeft: 12 }]}>
                Cash on Delivery (COD)
              </Text>
            </View>
            <Ionicons
              name={paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'COD' ? theme.colors.primary : theme.colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={() => setPaymentMethod('RAZORPAY')}
            style={styles.paymentRow}
          >
            <View style={styles.row}>
              <Ionicons
                name="card-outline"
                size={20}
                color={paymentMethod === 'RAZORPAY' ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, marginLeft: 12 }]}>
                Pay Online (Razorpay)
              </Text>
            </View>
            <Ionicons
              name={paymentMethod === 'RAZORPAY' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'RAZORPAY' ? theme.colors.primary : theme.colors.textSecondary}
            />
          </Pressable>
        </View>
        {groups.map((group) => (
          <View key={group.storeId} style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
            <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              {group.storeName}
            </Text>
            {group.items.map((item) => {
              const priceVal = item.product.discountPrice || item.product.price;
              return (
                <View key={item.product.id} style={styles.itemSummaryRow}>
                  <Text numberOfLines={1} style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, flex: 1 }]}>
                    {item.product.name} (x{item.quantity})
                  </Text>
                  <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
                    ₹{priceVal * item.quantity}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            Bill Summary
          </Text>
          <View style={[styles.itemSummaryRow, { marginBottom: 8 }]}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Subtotal</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>₹{billSubtotal.toFixed(0)}</Text>
          </View>
          <View style={[styles.itemSummaryRow, { marginBottom: 8 }]}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Delivery Charge</Text>
            {billDelivery === 0 ? (
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold }]}>FREE</Text>
            ) : (
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>₹{billDelivery.toFixed(0)}</Text>
            )}
          </View>
          {billDiscount > 0 && (
            <View style={[styles.itemSummaryRow, { marginBottom: 8 }]}>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>Discount</Text>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>-₹{billDiscount.toFixed(0)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 8 }} />
          <View style={styles.totalSummaryRow}>
            <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>Grand Total</Text>
            <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              ₹{billTotal.toFixed(0)}
            </Text>
          </View>
        </View >
      </ScrollView >
      <View style={[styles.stickyFooter, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <Button
          label={isPlacing ? 'Placing Order...' : `Confirm & Place Order • ₹${billTotal.toFixed(0)}`}
          onPress={handlePlaceOrder}
          variant="solid"
          loading={isPlacing}
          disabled={isPlacing || groups.length === 0 || !activeAddress}
          style={styles.placeBtn}
        />
      </View>
      <Modal visible={addressPickerVisible} onClose={() => setAddressPickerVisible(false)} title="Select delivery address">

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
          {addressStore.addresses.map((address) => (
            <Pressable
              key={address.id}
              onPress={() => handleSelectAddress(address)}
              style={[
                styles.addressOption,
                {
                  borderColor: address.id === selectedAddressId ? theme.colors.primary : theme.colors.border,
                  backgroundColor: address.id === selectedAddressId ? 'rgba(0, 109, 119, 0.06)' : 'transparent',
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <View style={[styles.addressIconBox, { backgroundColor: 'rgba(0, 109, 119, 0.08)' }]}>
                <Ionicons name={ICON_BY_TYPE[address.address_type] ?? 'location-outline'} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.addressTextCol}>
                <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                  <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, textTransform: 'capitalize' }]}>
                    {address.address_type.toLowerCase()}
                  </Text>
                  {address.is_default && (
                    <Badge label="Default" variant="success" size="sm" style={{ marginLeft: 8 }} />
                  )}
                </View>
                <Text numberOfLines={1} style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                  {address.address_line1}
                  {address.address_line2 ? `, ${address.address_line2}` : ''}
                </Text>
              </View>
              <Ionicons
                name={address.id === selectedAddressId ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={address.id === selectedAddressId ? theme.colors.primary : theme.colors.textSecondary}
              />
            </Pressable>
          ))}
        </ScrollView>
        <Button label="Add new address" onPress={handleAddAddress} variant="outline" style={{ marginTop: 12 }} />
      </Modal>
    </View >
  );
});
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12, borderBottomWidth: 1.5 },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionCard: { borderWidth: 1.5, padding: 16, marginBottom: 16 },
  sectionTitle: { marginBottom: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addressTextCol: { flex: 1 },
  addressOption: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, padding: 12, marginBottom: 12 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  itemSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1.5, padding: 16 },
  placeBtn: { width: '100%' },
  shopBlock: {},
  shopHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  minOrderBanner: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, marginBottom: 10 },
  qtyStepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginHorizontal: 8 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 5 },
  removeBtn: { marginLeft: 8, padding: 2 },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayCard: {
    minWidth: 200,
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 18,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },
});
