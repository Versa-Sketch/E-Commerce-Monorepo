import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { useCartStore } from '../../Providers/useCartStore';
import { ShopCartRow } from '../ShopCartRow';
import {
  checkoutBtnStyle,
  checkoutTextStyle,
  clearAllTextStyle,
  emptyStateStyle,
  handleIndicatorStyle,
  headerWrapperStyle,
  scrollContentStyle,
  scrollViewStyle,
  titleStyle,
} from './styledcomponents';

interface MultiCartBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const MultiCartBottomSheet: React.FC<MultiCartBottomSheetProps> = observer(({ visible, onClose }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartStore = useCartStore();
  const groups = cartStore.groupedByStore;

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  useEffect(() => {
    if (visible && groups.length > 0) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible, groups.length]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  const goToCart = () => {
    sheetRef.current?.dismiss();
    router.push('/customer/cart');
  };

  const handleClearAll = () => {
    cartStore.clearAllCarts();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={[handleIndicatorStyle, { backgroundColor: isDark ? theme.colors.border : '#E5E7EB' }]}
    >
      <View style={[headerWrapperStyle, { borderBottomColor: theme.colors.border }]}>
        <Text style={[titleStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Your Carts ({groups.length})
        </Text>
        {groups.length > 0 && (
          <Pressable onPress={handleClearAll}>
            <Text style={[theme.textPresets.caption, clearAllTextStyle, { color: theme.colors.error, fontFamily: theme.typography.fonts.bold }]}>
              Clear all
            </Text>
          </Pressable>
        )}
      </View>

      {groups.length === 0 ? (
        <View style={emptyStateStyle}>
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary }]}>Your carts are empty</Text>
        </View>
      ) : (
        <>
          <BottomSheetScrollView style={scrollViewStyle} contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
            {groups.map((group) => (
              <ShopCartRow
                key={group.storeId}
                storeId={group.storeId}
                storeName={group.storeName}
                theme={theme}
                itemCount={cartStore.getShopItemCount(group.storeId)}
                total={cartStore.getShopTotals(group.storeId).grandTotal}
                onViewCart={goToCart}
                onClear={() => cartStore.clearShopCart(group.storeId)}
              />
            ))}
          </BottomSheetScrollView>
          <Pressable
            onPress={goToCart}
            style={[checkoutBtnStyle, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.round, marginBottom: insets.bottom + 12 }]}
          >
            <Text style={[theme.textPresets.bodyMedium, checkoutTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>
              Checkout all
            </Text>
          </Pressable>
        </>
      )}
    </BottomSheetModal>
  );
});

export default MultiCartBottomSheet;
