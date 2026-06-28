import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { useTheme } from '../../../../theme/ThemeContext';
import { API_STATUS } from '../../../../Common/Constants';
import { BargainTimelineEvent } from '../../types/domain';
import { BargainTimelineList } from '../BargainTimelineList';

export const BargainChatList: React.FC = observer(() => {
  const bargainingStore = useBargainingStore();
  const { theme } = useTheme();
  const session = bargainingStore.session;
  const cartHistory = bargainingStore.cartHistory;
  const cartHistoryError = bargainingStore.cartHistoryError;
  const cartHistoryStatus = bargainingStore.cartHistoryStatus;

  const pastSessions = useMemo(() => {
    if (!session) return [];
    return (cartHistory?.sessions ?? [])
      .filter((past) => past.session_id !== session.session_id)
      .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
  }, [session?.session_id, cartHistory]);

  const liveTimeline = useMemo((): BargainTimelineEvent[] => {
    if (!session) return [];

    return [
      { type: 'session_started', session_id: session.session_id, created_at: session.started_at },
      ...Object.values(session.offers).map((offer): BargainTimelineEvent => ({ ...offer, type: 'bargain_offer' })),
      ...session.messages.map((message): BargainTimelineEvent => ({
        ...message,
        type: 'chat_message',
        status: message.status ?? 'SENT',
      })),
    ];
  }, [session, session?.messages.length, session?.offers]);

  const itemNameByCartItemId = useMemo(() => {
    const map: Record<string, string> = {};
    (session?.cart.items ?? []).forEach((item) => {
      map[item.cart_item_id] = item.product_name;
    });
    return map;
  }, [session?.cart.items]);

  return (
    <>
      {cartHistoryStatus === API_STATUS.ERROR && !!cartHistoryError && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginHorizontal: 16,
          marginTop: 8,
          padding: 10,
          borderRadius: 8,
          backgroundColor: theme.dark ? 'rgba(229,72,77,0.12)' : 'rgba(229,72,77,0.08)',
          borderWidth: 1,
          borderColor: theme.colors.error,
        }}>
          <Ionicons name="warning-outline" size={14} color={theme.colors.error} />
          <Text style={[theme.textPresets.caption, { color: theme.colors.error, flex: 1 }]}>
            {`Could not load past negotiations: ${cartHistoryError}`}
          </Text>
        </View>
      )}
      <BargainTimelineList
        timeline={liveTimeline}
        pastSessions={pastSessions}
        resolveItemName={(cartItemId) => (cartItemId && itemNameByCartItemId[cartItemId]) || 'Item'}
        currentSessionStartId={session?.session_id}
        autoScrollToEnd
      />
    </>
  );
});
export default BargainChatList;
