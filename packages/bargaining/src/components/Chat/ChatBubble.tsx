import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';
import { BargainMessage } from '../../types/domain';
import { formatAmount } from '../../utils/format';

const tickGlyph: Record<BargainMessage['status'], string> = {
  SENT: '✓',
  DELIVERED: '✓✓',
  READ: '✓✓',
};

export function ChatBubble({ message, isOwn }: { message: BargainMessage; isOwn: boolean }) {
  const isOffer = message.messageType === 'OFFER' || message.messageType === 'COUNTER_OFFER';
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther, isOffer && styles.bubbleOffer]}>
        {isOffer ? <Text style={styles.offerTag}>💰 {message.messageType === 'COUNTER_OFFER' ? 'Counter offer' : 'Offer'}</Text> : null}
        <Text style={[styles.text, isOwn && styles.textOwn]}>{message.message}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.time, isOwn && styles.timeOwn]}>{time}</Text>
          {isOwn ? (
            <Text style={[styles.tick, message.status === 'READ' && styles.tickRead]}>{tickGlyph[message.status]}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function offerAmountLabel(amount?: number): string {
  return amount != null ? formatAmount(amount) : '';
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, marginVertical: 3 },
  rowOwn: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  bubbleOwn: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: Colors.surfaceElevated, borderBottomLeftRadius: 4 },
  bubbleOffer: { borderWidth: 1, borderColor: Colors.primaryDark },
  offerTag: { fontSize: 11, fontWeight: '700', color: Colors.primaryDark, marginBottom: 2 },
  text: { fontSize: 14, color: Colors.textPrimary },
  textOwn: { color: '#FFFFFF' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, alignSelf: 'flex-end' },
  time: { fontSize: 10, color: Colors.textSecondary },
  timeOwn: { color: 'rgba(255,255,255,0.75)' },
  tick: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  tickRead: { color: '#93C5FD' },
});
