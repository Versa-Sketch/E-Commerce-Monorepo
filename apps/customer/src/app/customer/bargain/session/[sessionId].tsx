import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { useBargainingStore } from '@/features/Bargaining/Providers/useBargainingStore';
import { BargainSessionHeader } from '@/features/Bargaining/components/BargainSessionHeader';
import { BargainPendingOfferTray } from '@/features/Bargaining/components/BargainPendingOfferTray';
import { BargainChatList } from '@/features/Bargaining/components/BargainChatList';
import { BargainMessageInput } from '@/features/Bargaining/components/BargainMessageInput';
import { BargainMakeOfferSheet } from '@/features/Bargaining/components/BargainMakeOfferSheet';
import { EmptyState } from '@/Common/components/ui/EmptyState';
import { API_STATUS } from '@/Common/Constants';

export default observer(function BargainSessionScreen() {
  const { theme } = useTheme();
  const { sessionId, focusCartItemId } = useLocalSearchParams<{ sessionId: string; focusCartItemId?: string }>();
  const bargainingStore = useBargainingStore();
  const [offerSheetVisible, setOfferSheetVisible] = useState(false);
  const [offerSheetItemId, setOfferSheetItemId] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('[BargainSessionScreen] sessionId:', sessionId);
    if (sessionId) bargainingStore.loadSession(sessionId);
    return () => bargainingStore.disconnect();
  }, [sessionId]);

  const cartId = bargainingStore.session?.cart_id;
  useEffect(() => {
    if (cartId) bargainingStore.loadCartHistory(cartId);
  }, [cartId]);

  useFocusEffect(
    React.useCallback(() => {
      bargainingStore.markSeen();
    }, [])
  );

  useEffect(() => {
    if (focusCartItemId) {
      setOfferSheetItemId(focusCartItemId);
      setOfferSheetVisible(true);
    }
  }, [focusCartItemId]);

  const handleMakeOffer = () => {
    setOfferSheetItemId(undefined);
    setOfferSheetVisible(true);
  };

  if (bargainingStore.sessionStatus === API_STATUS.FETCHING || bargainingStore.sessionStatus === API_STATUS.IDLE) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (bargainingStore.sessionStatus === API_STATUS.ERROR || !bargainingStore.session) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <EmptyState
          title="Unable to load session"
          description={bargainingStore.sessionError ?? 'This bargaining session could not be found.'}
          iconName="chatbubbles-outline"
          style={{ flex: 1, justifyContent: 'center' }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BargainSessionHeader />
      <BargainPendingOfferTray />
      <BargainChatList />
      <BargainMessageInput onMakeOffer={handleMakeOffer} />
      <BargainMakeOfferSheet
        visible={offerSheetVisible}
        onClose={() => setOfferSheetVisible(false)}
        initialCartItemId={offerSheetItemId}
      />
    </KeyboardAvoidingView>
  );
});
