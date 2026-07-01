import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ThemeContext, useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { useAuthStore } from '../../../Auth/Providers/useAuthStore';
import { OfferSheetProvider } from './context';
import { ItemList } from './ItemList';
import { AmountInput } from './AmountInput';
import { SubmitButton } from './SubmitButton';
import {
  handleIndicatorStyle,
  headerWrapperStyle,
  scrollContentStyle,
  scrollViewStyle,
  titleStyle,
} from './styledcomponents';

interface BargainMakeOfferSheetProps {
  visible: boolean;
  onClose: () => void;
  initialCartItemId?: string;
}

export const BargainMakeOfferSheet: React.FC<BargainMakeOfferSheetProps> = observer(
  ({ visible, onClose, initialCartItemId }) => {
    const themeContext = useTheme();
    const { theme, isDark } = themeContext;
    const bargainingStore = useBargainingStore();
    const authStore = useAuthStore();
    const items = bargainingStore.session?.cart.items ?? [];
    const isActive = bargainingStore.isActive;
    const sendOffer = useCallback(
      (cartItemId: string, amount: string) => {
        bargainingStore.sendOffer(cartItemId, amount, authStore.currentUser?.id);
      },
      [bargainingStore, authStore],
    );

    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['75%'], []);
    const hasOpenedRef = useRef(false);

    React.useEffect(() => {
      if (!visible) {
        if (hasOpenedRef.current) {
          hasOpenedRef.current = false;
          sheetRef.current?.dismiss();
        }
        return;
      }
      hasOpenedRef.current = true;
      sheetRef.current?.present();
    }, [visible, initialCartItemId]);

    const handleSheetDismiss = useCallback(() => {
      hasOpenedRef.current = false;
      onClose();
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

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
        handleIndicatorStyle={[
          handleIndicatorStyle,
          { backgroundColor: isDark ? theme.colors.border : '#E5E7EB' },
        ]}
      >
        <ThemeContext.Provider value={themeContext}>
          <OfferSheetProvider
            items={items}
            initialCartItemId={initialCartItemId}
            visible={visible}
            onClose={onClose}
            onSendOffer={sendOffer}
            isActive={isActive}
          >
            <View style={[headerWrapperStyle, { borderBottomColor: theme.colors.border }]}>
              <Text
                style={[
                  theme.textPresets.bodyLarge,
                  titleStyle,
                  { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
                ]}
              >
                Make an offer
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <BottomSheetScrollView
                style={scrollViewStyle}
                contentContainerStyle={scrollContentStyle}
                showsVerticalScrollIndicator={false}
              >
                <ItemList />
                <AmountInput />
                <SubmitButton />
              </BottomSheetScrollView>
            </View>
          </OfferSheetProvider>
        </ThemeContext.Provider>
      </BottomSheetModal>
    );
  }
);

export default BargainMakeOfferSheet;
