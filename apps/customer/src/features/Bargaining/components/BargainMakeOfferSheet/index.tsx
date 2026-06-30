import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ThemeContext, useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { useAuthStore } from '../../../Auth/Providers/useAuthStore';
import { Button } from '../../../../Common/components/ui/Button';
import { Chip } from '../../../../Common/components/ui/Chip';
import { Input } from '../../../../Common/components/ui/Input';
import { CartItemApi } from '../../../../types/shared';
import {
  amountInputWrapperStyle,
  amountRowStyle,
  chipsRowStyle,
  currencyPrefixStyle,
  discountHintStyle,
  errorTextStyle,
  handleIndicatorStyle,
  headerWrapperStyle,
  itemDetailsStyle,
  itemImageStyle,
  itemListStyle,
  itemPriceStyle,
  itemRowStyle,
  lockedBadgeIconStyle,
  lockedBadgeStyle,
  lockedNoticeIconStyle,
  lockedNoticeStyle,
  scrollContentStyle,
  scrollViewStyle,
  sectionLabelStyle,
  titleStyle,
} from './styledcomponents';

interface BargainMakeOfferSheetProps {
  visible: boolean;
  onClose: () => void;
  initialCartItemId?: string;
}

const DISCOUNT_OPTIONS = [5, 10, 15, 20];

export const BargainMakeOfferSheet: React.FC<BargainMakeOfferSheetProps> = observer(({ visible, onClose, initialCartItemId }) => {
  const themeContext = useTheme();
  const { theme, isDark } = themeContext;
  const bargainingStore = useBargainingStore();
  const authStore = useAuthStore();
  const items = bargainingStore.session?.cart.items ?? [];

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const pickDefaultItemId = useCallback((): string | undefined => {
    if (initialCartItemId) {
      const initial = items.find((item) => item.cart_item_id === initialCartItemId);
      if (initial && !initial.is_locked) return initialCartItemId;
    }
    return items.find((item) => !item.is_locked)?.cart_item_id;
  }, [items, initialCartItemId]);

  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(pickDefaultItemId());
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      if (hasOpenedRef.current) {
        hasOpenedRef.current = false;
        sheetRef.current?.dismiss();
      }
      return;
    }
    hasOpenedRef.current = true;
    setSelectedItemId(pickDefaultItemId());
    setAmount('');
    setError(null);
    sheetRef.current?.present();
  }, [visible, initialCartItemId]);

  const handleSheetDismiss = useCallback(() => {
    hasOpenedRef.current = false;
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  const selectedItem = items.find((item) => item.cart_item_id === selectedItemId);
  const original = selectedItem ? parseFloat(selectedItem.selling_price) : 0;
  const offered = parseFloat(amount);
  const discount = original > 0 && !Number.isNaN(offered) && offered > 0 ? Math.round((1 - offered / original) * 100) : null;

  const handleSelectItem = (item: CartItemApi) => {
    if (item.is_locked) return;
    setSelectedItemId(item.cart_item_id);
    setAmount('');
    setError(null);
  };

  const applyDiscount = (pct: number) => {
    if (!original) return;
    const value = original * (1 - pct / 100);
    setAmount(value.toFixed(2).replace(/\.00$/, ''));
    setError(null);
  };

  const handleSubmit = () => {
    if (!selectedItem) return;
    if (Number.isNaN(offered) || offered <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    if (offered >= original) {
      setError(`Your offer must be less than ₹${selectedItem.selling_price}.`);
      return;
    }
    bargainingStore.sendOffer(selectedItem.cart_item_id, offered.toFixed(2), authStore.currentUser?.id);
    onClose();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={handleSheetDismiss}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={[handleIndicatorStyle, { backgroundColor: isDark ? theme.colors.border : '#E5E7EB' }]}
    >
      <ThemeContext.Provider value={themeContext}>
      <View style={[headerWrapperStyle, { borderBottomColor: theme.colors.border }]}>
        <Text style={[theme.textPresets.bodyLarge, titleStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Make an offer
        </Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
      <BottomSheetScrollView style={scrollViewStyle} contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
      <Text style={[theme.textPresets.label, sectionLabelStyle, { color: theme.colors.textSecondary }]}>Select an item from your cart</Text>
      <View style={itemListStyle}>
        {items.map((item) => {
          const selected = item.cart_item_id === selectedItemId;
          const locked = !!item.is_locked;
          return (
            <Pressable key={item.cart_item_id} onPress={() => handleSelectItem(item)} disabled={locked}>
              <View
                style={[
                  itemRowStyle,
                  {
                    borderRadius: theme.borderRadius.md,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: theme.colors.surface,
                    opacity: locked ? 0.55 : 1,
                  },
                ]}
              >
                {item.product_image ? (
                  <Image source={{ uri: item.product_image }} style={[itemImageStyle, { borderRadius: theme.borderRadius.sm }]} />
                ) : null}
                <View style={itemDetailsStyle}>
                  <Text numberOfLines={1} style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
                    {item.product_name}
                  </Text>
                  <Text style={[theme.textPresets.caption, itemPriceStyle, { color: theme.colors.textSecondary }]}>
                    ₹{item.selling_price} · qty {item.quantity}
                  </Text>
                  {locked && (
                    <View style={[lockedBadgeStyle, { backgroundColor: theme.dark ? 'rgba(250, 199, 117, 0.15)' : 'rgba(186, 117, 23, 0.1)' }]}>
                      <Ionicons name="lock-closed" size={11} color={theme.colors.warning} style={lockedBadgeIconStyle} />
                      <Text style={[theme.textPresets.caption, { color: theme.colors.warning, fontSize: 10 }]}>Already under negotiation</Text>
                    </View>
                  )}
                </View>
                {locked ? (
                  <Ionicons name="lock-closed" size={18} color={theme.colors.textMuted} />
                ) : (
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={selected ? theme.colors.primary : theme.colors.textMuted}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {selectedItem && (
        <>
          <Text style={[theme.textPresets.label, sectionLabelStyle, { color: theme.colors.textSecondary }]}>
            Your offer for {selectedItem.product_name}
          </Text>
          <View style={amountRowStyle}>
            <View style={amountInputWrapperStyle}>
              <Input
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setError(null);
                }}
                placeholder="Enter amount"
                keyboardType="numeric"
                leftComponent={
                  <Text style={[theme.textPresets.bodyMedium, currencyPrefixStyle, { color: theme.colors.textSecondary }]}>₹</Text>
                }
              />
            </View>
            <Text style={[theme.textPresets.caption, discountHintStyle, { color: theme.colors.textMuted }]}>
              {discount !== null && discount > 0 ? `${discount}% off ₹${selectedItem.selling_price}` : ' '}
            </Text>
          </View>

          <View style={chipsRowStyle}>
            {DISCOUNT_OPTIONS.map((pct) => (
              <Chip key={pct} label={`-${pct}%`} onPress={() => applyDiscount(pct)} />
            ))}
          </View>

          {error && <Text style={[theme.textPresets.caption, errorTextStyle, { color: theme.colors.error }]}>{error}</Text>}

          <Button label="Send offer" onPress={handleSubmit} size="lg" disabled={!bargainingStore.isActive} />
        </>
      )}

      {!selectedItem && items.length > 0 && (
        <View style={[lockedNoticeStyle, { backgroundColor: theme.dark ? 'rgba(250, 199, 117, 0.15)' : 'rgba(186, 117, 23, 0.1)' }]}>
          <Ionicons name="lock-closed" size={18} color={theme.colors.warning} style={lockedNoticeIconStyle} />
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.warning, flex: 1 }]}>
            All items in this cart already have an offer under negotiation. Wait for the shop's response before making a new offer.
          </Text>
        </View>
      )}
      </BottomSheetScrollView>
      </View>
      </ThemeContext.Provider>
    </BottomSheetModal>
  );
});
export default BargainMakeOfferSheet;
