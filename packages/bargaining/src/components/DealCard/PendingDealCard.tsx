import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../colors';
import { BargainCardView } from '../../store/BargainingStore';
import { BargainRole } from '../../types/role';
import { formatAmount } from '../../utils/format';
import { CountdownBadge } from '../DealVisuals/CountdownBadge';
import { DealHealthTag } from '../DealVisuals/DealHealthTag';
import { ProbabilityBar } from '../DealVisuals/ProbabilityBar';

interface Props {
  deal: BargainCardView;
  viewerRole: BargainRole;
  onAccept: () => void;
  onCounter: () => void;
  onReject: () => void;
}

// Same card renders for both roles — only the action-button copy reflects
// whose offer is on the table (e.g. SHOP "accepts the customer's offer",
// CUSTOMER "accepts the shop's counter").
export function PendingDealCard({ deal, viewerRole, onAccept, onCounter, onReject }: Props) {
  const acceptLabel = viewerRole === 'SHOP' ? 'Accept' : 'Accept counter';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{deal.productImage}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.product} numberOfLines={1}>{deal.productName}</Text>
          <Text style={styles.counterparty}>{deal.counterpartyName}</Text>
        </View>
        <CountdownBadge seconds={deal.secondsLeft} size="sm" />
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.original}>{formatAmount(deal.originalPrice)}</Text>
        <Text style={styles.offer}>{formatAmount(deal.offeredAmount)}</Text>
        <View style={styles.discountPill}>
          <Text style={styles.discountText}>-{deal.discountPercent}%</Text>
        </View>
      </View>

      <ProbabilityBar value={deal.dealProbability} />

      <View style={styles.healthRow}>
        <DealHealthTag health={deal.dealHealth} />
        {deal.isExpiringSoon ? (
          <View style={styles.expiringBadge}>
            <Text style={styles.expiringText}>⚡ Expiring soon</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: Colors.success }]}>{acceptLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.counterBtn]} onPress={onCounter} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Counter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={onReject} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: Colors.error }]}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 28 },
  product: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  counterparty: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  original: { fontSize: 13, color: Colors.textSecondary, textDecorationLine: 'line-through' },
  offer: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  discountPill: { backgroundColor: Colors.errorBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  discountText: { fontSize: 11, fontWeight: '800', color: Colors.error },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expiringBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  expiringText: { fontSize: 11, fontWeight: '700', color: '#B45309' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  acceptBtn: { backgroundColor: Colors.successBg, borderColor: Colors.success },
  counterBtn: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  rejectBtn: { backgroundColor: Colors.errorBg, borderColor: Colors.error },
  actionText: { fontSize: 12, fontWeight: '800' },
});
