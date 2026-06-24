import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';
import { BargainCardView } from '../../store/BargainingStore';
import { formatAmount } from '../../utils/format';

const statusTone: Record<string, { bg: string; fg: string; label: string }> = {
  ACCEPTED: { bg: Colors.successBg, fg: Colors.success, label: 'Accepted' },
  REJECTED: { bg: Colors.errorBg, fg: Colors.error, label: 'Rejected' },
  EXPIRED: { bg: Colors.surfaceElevated, fg: Colors.textSecondary, label: 'Expired' },
  CANCELLED: { bg: Colors.surfaceElevated, fg: Colors.textSecondary, label: 'Cancelled' },
  COUNTERED: { bg: Colors.warningBg, fg: '#B45309', label: 'Countered' },
};

export function ResolvedDealCard({ deal }: { deal: BargainCardView }) {
  const tone = statusTone[deal.status] ?? statusTone.EXPIRED;
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{deal.productImage}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.product} numberOfLines={1}>{deal.productName}</Text>
        <Text style={styles.counterparty}>{deal.counterpartyName}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={styles.amount}>{formatAmount(deal.offeredAmount)}</Text>
        <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
          <Text style={[styles.statusText, { color: tone.fg }]}>{tone.label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  emoji: { fontSize: 22 },
  product: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  counterparty: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  statusText: { fontSize: 10, fontWeight: '700' },
});
