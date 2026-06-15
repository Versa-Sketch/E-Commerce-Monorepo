import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { BargainTimelineEvent } from '../../types/domain';
import { BargainTimelineList } from '../BargainTimelineList';

export const BargainChatList: React.FC = observer(() => {
  const bargainingStore = useBargainingStore();
  const session = bargainingStore.session;
  const cartHistory = bargainingStore.cartHistory;

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
    <BargainTimelineList
      timeline={liveTimeline}
      pastSessions={pastSessions}
      resolveItemName={(cartItemId) => (cartItemId && itemNameByCartItemId[cartItemId]) || 'Item'}
      currentSessionStartId={session?.session_id}
      autoScrollToEnd
    />
  );
});
export default BargainChatList;
