import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { Badge } from '../../../../Common/components/ui/Badge';
import { BargainMessage } from '../../types/domain';
import { findLiveOfferForMessage, formatAmount, getCartItem, getMessageTickStatus } from '../../utils/bargainHelpers';
import {
  bubbleStyle,
  columnStyle,
  offerAmountStyle,
  offerCardStyle,
  offerFooterStyle,
  offerItemNameStyle,
  offerLabelStyle,
  rowStyle,
  senderNameStyle,
  systemPillIconStyle,
  systemPillStyle,
  systemRowStyle,
  timestampRowStyle,
  timestampStyle,
  tickIconStyle,
} from './styledcomponents';

interface BargainChatBubbleProps {
  message: BargainMessage;
  isOwn: boolean;
}

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export const BargainChatBubble: React.FC<BargainChatBubbleProps> = observer(({ message, isOwn }) => {
  const { theme } = useTheme();
  const bargainingStore = useBargainingStore();
  const session = bargainingStore.session;

  if (message.message_type === 'SYSTEM') {
    const liveOffer = findLiveOfferForMessage(session, message.bargain_offer_id);
    const isAccepted = liveOffer?.status === 'ACCEPTED';
    const isRejected = liveOffer?.status === 'REJECTED';
    const pillBg = isAccepted ? theme.colors.success : isRejected ? theme.colors.error : theme.colors.surfaceSecondary;
    const pillBgSoft = isAccepted
      ? theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.1)'
      : isRejected
      ? theme.dark ? 'rgba(236, 93, 98, 0.15)' : 'rgba(229, 72, 77, 0.1)'
      : theme.colors.surfaceSecondary;
    const textColor = isAccepted ? theme.colors.success : isRejected ? theme.colors.error : theme.colors.textSecondary;

    return (
      <View style={systemRowStyle}>
        <View style={[systemPillStyle, { backgroundColor: pillBgSoft }]}>
          {isAccepted && <Ionicons name="checkmark-circle" size={14} color={pillBg} style={systemPillIconStyle} />}
          {isRejected && <Ionicons name="close-circle" size={14} color={pillBg} style={systemPillIconStyle} />}
          <Text style={[theme.textPresets.caption, { color: textColor, textAlign: 'center' }]}>{message.message}</Text>
        </View>
      </View>
    );
  }

  if (message.message_type === 'OFFER' || message.message_type === 'COUNTER_OFFER') {
    const liveOffer = findLiveOfferForMessage(session, message.bargain_offer_id);

    if (!liveOffer) {
      return (
        <View style={systemRowStyle}>
          <View style={[systemPillStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{message.message}</Text>
          </View>
        </View>
      );
    }

    const cartItem = getCartItem(session, liveOffer.cart_item_id);
    const cardBg = isOwn
      ? theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.08)'
      : theme.colors.surface;
    const label =
      message.message_type === 'COUNTER_OFFER'
        ? isOwn ? 'Your counter offer' : `${message.sender_name} countered`
        : isOwn ? 'Your offer' : `${message.sender_name} offered`;

    return (
      <View style={[rowStyle, { justifyContent: isOwn ? 'flex-end' : 'flex-start' }]}>
        <View style={[columnStyle, { alignItems: isOwn ? 'flex-end' : 'flex-start' }]}>
          <View style={[offerCardStyle, { backgroundColor: cardBg, borderWidth: isOwn ? 0 : 1, borderColor: theme.colors.border }]}>
            <Text style={[theme.textPresets.label, offerLabelStyle, { color: theme.colors.textSecondary }]}>{label}</Text>
            <Text style={[theme.textPresets.h3, offerAmountStyle, { color: theme.colors.textPrimary }]}>{formatAmount(liveOffer.offered_amount)}</Text>
            <Text style={[theme.textPresets.caption, offerItemNameStyle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {cartItem?.product_name ?? 'item'}
            </Text>
            <View style={offerFooterStyle}>
              {liveOffer.status === 'PENDING' && liveOffer.offered_by === 'SHOP' && (
                <Badge label="Pending · respond above" variant="warning" size="sm" />
              )}
              {liveOffer.status === 'PENDING' && liveOffer.offered_by === 'CUSTOMER' && (
                <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted }]}>Waiting for shop&apos;s response…</Text>
              )}
              {liveOffer.status === 'ACCEPTED' && <Badge label={`Accepted at ${formatAmount(liveOffer.accepted_amount ?? liveOffer.offered_amount)}`} variant="success" size="sm" />}
              {liveOffer.status === 'REJECTED' && <Badge label="Rejected" variant="error" size="sm" />}
              {liveOffer.status === 'COUNTERED' && <Badge label="Countered" variant="secondary" size="sm" />}
            </View>
          </View>
          <Text style={[theme.textPresets.caption, timestampStyle, { color: theme.colors.textMuted, fontSize: 10 }]}>{formatTime(message.created_at)}</Text>
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
          <Text style={[theme.textPresets.bodyMedium, { color: isOwn ? theme.colors.surface : theme.colors.textPrimary, flexShrink: 1 }]}>{message.message}</Text>
        </View>
        <View style={timestampRowStyle}>
          <Text style={[theme.textPresets.caption, timestampStyle, { color: theme.colors.textMuted, fontSize: 10 }]}>{formatTime(message.created_at)}</Text>
          {isOwn && <MessageTicks status={getMessageTickStatus(session, message)} />}
        </View>
      </View>
    </View>
  );
});

export const MessageTicks: React.FC<{ status: 'SENT' | 'DELIVERED' | 'READ' }> = ({ status }) => {
  const { theme } = useTheme();
  const color = status === 'READ' ? theme.colors.primary : theme.colors.textMuted;
  if (status === 'SENT') {
    return <Ionicons name="checkmark" size={12} color={color} style={tickIconStyle} />;
  }
  return <Ionicons name="checkmark-done" size={12} color={color} style={tickIconStyle} />;
};
export default BargainChatBubble;
