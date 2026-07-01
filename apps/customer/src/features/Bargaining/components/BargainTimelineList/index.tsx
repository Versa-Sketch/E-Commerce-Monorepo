import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { Badge } from '../../../../Common/components/ui/Badge';
import { useAuthStore } from '../../../Auth/Providers/useAuthStore';
import { BargainOfferEvent, BargainOfferStatus, BargainSessionHistory, BargainTimelineEvent } from '../../types/domain';
import { formatAmount } from '../../utils/bargainHelpers';
import { MessageTicks } from '../BargainChatBubble';
import {
  bubbleStyle,
  columnStyle,
  offerAmountStyle,
  offerCardStyle,
  offerFooterStyle,
  offerHeaderRowStyle,
  offerIconWrapStyle,
  offerOriginalPriceStyle,
  offerPriceRowStyle,
  rowStyle,
  senderNameStyle,
  systemPillIconStyle,
  systemPillStyle,
  systemRowStyle,
  timestampRowStyle,
  timestampStyle,
} from '../BargainChatBubble/styledcomponents';
import {
  dividerPillStyle,
  dividerRowStyle,
  listContainerStyle,
  listContentStyle,
  mutedEventWrapperStyle,
  pastSummaryCardStyle,
  pastSummaryIconWrapStyle,
  pastSummaryTextWrapStyle,
  pastSummaryWrapperStyle,
} from './styledcomponents';

interface BargainTimelineListProps {
  timeline: BargainTimelineEvent[];
  pastSessions?: BargainSessionHistory[];
  resolveItemName?: (cartItemId: string | null) => string;
  currentSessionStartId?: string;
  autoScrollToEnd?: boolean;
}

type TimelineRow =
  | { kind: 'past_summary'; session: BargainSessionHistory }
  | { kind: 'event'; key: string; event: BargainTimelineEvent; muted?: boolean };

const formatTime = (iso: string): string => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const getOfferStatusStyle = (
  status: BargainOfferStatus,
  theme: ReturnType<typeof useTheme>['theme']
): { backgroundColor: string; borderColor: string; borderWidth: number } => {
  const successSoft = theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.1)';
  const errorSoft = theme.dark ? 'rgba(236, 93, 98, 0.15)' : 'rgba(229, 72, 77, 0.1)';
  const warningSoft = theme.dark ? 'rgba(245, 185, 78, 0.15)' : 'rgba(242, 169, 59, 0.1)';
  switch (status) {
    case 'ACCEPTED':
      return { backgroundColor: successSoft, borderColor: theme.colors.success, borderWidth: 1.5 };
    case 'REJECTED':
      return { backgroundColor: errorSoft, borderColor: theme.colors.error, borderWidth: 1 };
    case 'COUNTERED':
      return { backgroundColor: warningSoft, borderColor: theme.colors.warning, borderWidth: 1 };
    case 'PENDING':
      return { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 };
    case 'EXPIRED':
    case 'CANCELLED':
    default:
      return { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border, borderWidth: 1 };
  }
};

const getOfferStatusIcon = (status: BargainOfferStatus): keyof typeof Ionicons.glyphMap => {
  switch (status) {
    case 'ACCEPTED':
      return 'checkmark-circle';
    case 'REJECTED':
      return 'close-circle';
    case 'COUNTERED':
      return 'swap-horizontal';
    case 'PENDING':
      return 'time-outline';
    case 'EXPIRED':
      return 'hourglass-outline';
    default:
      return 'ban-outline';
  }
};

export const BargainTimelineList: React.FC<BargainTimelineListProps> = ({
  timeline,
  pastSessions,
  resolveItemName,
  currentSessionStartId,
  autoScrollToEnd,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;
  const listRef = useRef<FlashListRef<TimelineRow>>(null);
  const [expandedSessionIds, setExpandedSessionIds] = useState<Record<string, boolean>>({});

  const hasPastSessions = (pastSessions?.length ?? 0) > 0;

  const offersById = useMemo(() => {
    const map: Record<string, BargainOfferEvent> = {};
    (pastSessions ?? []).forEach((past) => {
      past.timeline.forEach((event) => {
        if (event.type === 'bargain_offer') map[event.offer_id] = event;
      });
    });
    timeline.forEach((event) => {
      if (event.type === 'bargain_offer') map[event.offer_id] = event;
    });
    return map;
  }, [pastSessions, timeline]);

  const rows = useMemo((): TimelineRow[] => {
    const result: TimelineRow[] = [];
    (pastSessions ?? []).forEach((past) => {
      result.push({ kind: 'past_summary', session: past });
      if (expandedSessionIds[past.session_id]) {
        past.timeline
          .filter((event) => event.type !== 'bargain_offer' && event.type !== 'session_started')
          .forEach((event, index) => {
            const key =
              event.type === 'chat_message'
                ? `past-${past.session_id}-msg-${event.message_id}`
                : `past-${past.session_id}-${event.type}-${index}`;
            result.push({ kind: 'event', key, event, muted: true });
          });
      }
    });
    timeline
      .filter((event) => event.type !== 'bargain_offer')
      .forEach((event, index) => {
        const key = event.type === 'chat_message' ? `live-msg-${event.message_id}` : `live-${event.type}-${index}`;
        result.push({ kind: 'event', key, event });
      });
    return result;
  }, [pastSessions, timeline, expandedSessionIds]);

  useEffect(() => {
    if (autoScrollToEnd && rows.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [autoScrollToEnd, rows.length]);

  const highlightBg = theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.1)';

  const toggleSession = (sessionId: string) => {
    setExpandedSessionIds((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const renderDivider = (label: string, iconName: keyof typeof Ionicons.glyphMap, highlight?: boolean) => (
    <View style={dividerRowStyle}>
      <View
        style={[
          dividerPillStyle,
          {
            backgroundColor: highlight ? highlightBg : theme.colors.surfaceSecondary,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        <Ionicons name={iconName} size={12} color={highlight ? theme.colors.success : theme.colors.textSecondary} style={{ marginRight: 6 }} />
        <Text style={[theme.textPresets.caption, { color: highlight ? theme.colors.success : theme.colors.textSecondary, fontFamily: highlight ? theme.typography.fonts.semiBold : undefined }]}>
          {label}
        </Text>
      </View>
    </View>
  );

  const renderPastSummary = (past: BargainSessionHistory) => {
    const expanded = !!expandedSessionIds[past.session_id];
    const offerCount = past.timeline.filter((event) => event.type === 'bargain_offer').length;
    const messageCount = past.timeline.filter((event) => event.type === 'chat_message' && event.message_type !== 'SYSTEM').length;
    const firstOffer = past.timeline.find((event): event is BargainOfferEvent => event.type === 'bargain_offer');
    const itemLabel = firstOffer && resolveItemName ? resolveItemName(firstOffer.cart_item_id) : undefined;
    const statusLabel = past.status === 'EXPIRED' ? 'Expired' : 'Ended';
    const endLabel = past.ended_at ? formatTime(past.ended_at) : formatTime(past.expires_at);

    return (
      <View style={pastSummaryWrapperStyle}>
        <Pressable
          onPress={() => toggleSession(past.session_id)}
          style={[pastSummaryCardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={[pastSummaryIconWrapStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
          </View>
          <View style={pastSummaryTextWrapStyle}>
            <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]} numberOfLines={1}>
              {`Previous negotiation${itemLabel ? ` · ${itemLabel}` : ''}`}
            </Text>
            <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 2 }]} numberOfLines={1}>
              {`${offerCount} offer${offerCount === 1 ? '' : 's'} · ${messageCount} message${messageCount === 1 ? '' : 's'} · ${formatDateTime(past.started_at)}–${endLabel}`}
            </Text>
          </View>
          <Badge label={statusLabel} variant="secondary" size="sm" style={{ marginRight: 8 }} />
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textMuted} />
        </Pressable>
      </View>
    );
  };

  const renderEvent = (item: BargainTimelineEvent) => {
    if (item.type !== 'chat_message') {
      if (item.type === 'session_started') {
        const isCurrent = hasPastSessions && item.session_id === currentSessionStartId;
        return renderDivider(
          `${isCurrent ? 'New negotiation started' : 'Negotiation started'} · ${formatDateTime(item.created_at)}`,
          isCurrent ? 'sparkles-outline' : 'play-circle-outline',
          isCurrent
        );
      }
      if (item.type === 'session_ended' || item.type === 'session_expired') {
        return renderDivider(
          `${item.type === 'session_expired' ? 'Negotiation expired' : 'Negotiation ended'} · ${formatDateTime(item.created_at)}`,
          'stop-circle-outline'
        );
      }
      return null;
    }

    const message = item;
    const isOwn = message.sender_id === currentUserId;

    if (message.message_type === 'SYSTEM') {
      const offer = message.bargain_offer_id ? offersById[message.bargain_offer_id] : undefined;
      const isAccepted = offer?.status === 'ACCEPTED';
      const isRejected = offer?.status === 'REJECTED';
      const pillBgSoft = isAccepted
        ? theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.1)'
        : isRejected
        ? theme.dark ? 'rgba(236, 93, 98, 0.15)' : 'rgba(229, 72, 77, 0.1)'
        : theme.colors.surfaceSecondary;
      const textColor = isAccepted ? theme.colors.success : isRejected ? theme.colors.error : theme.colors.textSecondary;
      return (
        <View style={systemRowStyle}>
          <View style={[systemPillStyle, { backgroundColor: pillBgSoft }]}>
            {isAccepted && <Ionicons name="checkmark-circle" size={14} color={textColor} style={systemPillIconStyle} />}
            {isRejected && <Ionicons name="close-circle" size={14} color={textColor} style={systemPillIconStyle} />}
            <Text style={[theme.textPresets.caption, { color: textColor, textAlign: 'center' }]}>{message.message}</Text>
          </View>
        </View>
      );
    }

    if (message.message_type === 'OFFER' || message.message_type === 'COUNTER_OFFER') {
      const offer = message.bargain_offer_id ? offersById[message.bargain_offer_id] : undefined;
      if (!offer) {
        return (
          <View style={systemRowStyle}>
            <View style={[systemPillStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{message.message}</Text>
            </View>
          </View>
        );
      }

      const statusStyle = getOfferStatusStyle(offer.status, theme);
      const statusIcon = getOfferStatusIcon(offer.status);
      const label =
        message.message_type === 'COUNTER_OFFER'
          ? isOwn ? 'Your counter offer' : `${message.sender_name} countered`
          : isOwn ? 'Your offer' : `${message.sender_name} offered`;
      const showOriginalPrice = offer.original_price && offer.original_price !== offer.offered_amount;

      return (
        <View style={[rowStyle, { justifyContent: isOwn ? 'flex-end' : 'flex-start' }]}>
          <View style={[columnStyle, { alignItems: isOwn ? 'flex-end' : 'flex-start' }]}>
            <View style={[offerCardStyle, statusStyle]}>
              <View style={offerHeaderRowStyle}>
                <View style={[offerIconWrapStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name={statusIcon} size={14} color={statusStyle.borderColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[theme.textPresets.label, { color: theme.colors.textSecondary }]}>{label}</Text>
                  <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {resolveItemName ? resolveItemName(offer.cart_item_id) : 'Item'}
                  </Text>
                </View>
              </View>
              <View style={offerPriceRowStyle}>
                <Text style={[theme.textPresets.h3, offerAmountStyle, { color: theme.colors.textPrimary }]}>{formatAmount(offer.offered_amount)}</Text>
                {showOriginalPrice && (
                  <Text style={[theme.textPresets.caption, offerOriginalPriceStyle, { color: theme.colors.textMuted }]}>{formatAmount(offer.original_price)}</Text>
                )}
              </View>
              <View style={offerFooterStyle}>
                {offer.status === 'ACCEPTED' && <Badge label={`Accepted at ${formatAmount(offer.accepted_amount ?? offer.offered_amount)}`} variant="success" size="sm" />}
                {offer.status === 'REJECTED' && <Badge label="Rejected" variant="error" size="sm" />}
                {offer.status === 'COUNTERED' && <Badge label="Countered" variant="warning" size="sm" />}
                {offer.status === 'EXPIRED' && <Badge label="Expired" variant="secondary" size="sm" />}
                {offer.status === 'CANCELLED' && <Badge label="Cancelled" variant="secondary" size="sm" />}
                {offer.status === 'PENDING' && isOwn && (
                  <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted }]}>Waiting for response…</Text>
                )}
                {offer.status === 'PENDING' && !isOwn && <Badge label="Pending · respond above" variant="warning" size="sm" />}
              </View>
            </View>
            <View style={timestampRowStyle}>
              <Text style={[theme.textPresets.caption, timestampStyle, { color: theme.colors.textMuted, fontSize: 10 }]}>{formatTime(message.created_at)}</Text>
              {isOwn && <MessageTicks status={message.status} />}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[rowStyle, { justifyContent: isOwn ? 'flex-end' : 'flex-start' }]}>
        <View style={[columnStyle, { alignItems: isOwn ? 'flex-end' : 'flex-start' }]}>
          <View
            style={[
              bubbleStyle,
              {
                backgroundColor: isOwn ? theme.colors.primary : theme.colors.surface,
                borderWidth: isOwn ? 0 : 1,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {!isOwn && (
              <Text style={[theme.textPresets.caption, senderNameStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.semiBold }]}>
                {message.sender_name}
              </Text>
            )}
            <Text style={[theme.textPresets.bodyMedium, { color: isOwn ? theme.colors.surface : theme.colors.textPrimary, flexShrink: 1 }]}>
              {message.message}
            </Text>
          </View>
          <View style={timestampRowStyle}>
            <Text style={[theme.textPresets.caption, timestampStyle, { color: theme.colors.textMuted, fontSize: 10 }]}>{formatTime(message.created_at)}</Text>
            {isOwn && <MessageTicks status={message.status} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlashList
      ref={listRef}
      data={rows}
      keyExtractor={(row) => (row.kind === 'past_summary' ? `summary-${row.session.session_id}` : row.key)}
      style={[listContainerStyle, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={listContentStyle}
      onContentSizeChange={() => {
        if (autoScrollToEnd) listRef.current?.scrollToEnd({ animated: true });
      }}
      renderItem={({ item }) => {
        if (item.kind === 'past_summary') return renderPastSummary(item.session);
        const content = renderEvent(item.event);
        if (!item.muted) return content;
        return <View style={mutedEventWrapperStyle}>{content}</View>;
      }}
    />
  );
};

export default BargainTimelineList;
