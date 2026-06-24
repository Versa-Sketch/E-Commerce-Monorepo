import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../colors';
import { dealProbability } from '../../utils/bargainMath';
import { formatAmount } from '../../utils/format';

const QUICK_DISCOUNTS = [5, 10, 15, 20];

interface Props {
  productName: string;
  currentPrice: number;
  merchantCost?: number;
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

// Bottom-sheet content (the host screen owns the actual Modal/sheet
// container — this is just the form: price input, quick-discount chips, and
// a live acceptance-odds preview).
export function CounterOfferSheet({ productName, currentPrice, merchantCost, onSubmit, onCancel }: Props) {
  const [amountText, setAmountText] = useState(String(Math.round(currentPrice)));
  const amount = Number(amountText) || 0;

  const odds = useMemo(
    () =>
      dealProbability({
        status: 'PENDING',
        currentPrice,
        offeredAmount: amount,
        roundsSoFar: 0,
        merchantCost,
      }),
    [amount, currentPrice, merchantCost]
  );

  function applyDiscount(pct: number) {
    setAmountText(String(Math.round(currentPrice * (1 - pct / 100))));
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Counter offer</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{productName}</Text>

      <View style={styles.inputRow}>
        <Text style={styles.currency}>₹</Text>
        <TextInput
          style={styles.input}
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="numeric"
          placeholder="0"
        />
      </View>

      <View style={styles.chipRow}>
        {QUICK_DISCOUNTS.map((pct) => (
          <TouchableOpacity key={pct} style={styles.chip} onPress={() => applyDiscount(pct)}>
            <Text style={styles.chipText}>-{pct}%</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.oddsLabel}>Estimated acceptance odds: <Text style={styles.oddsValue}>{odds}%</Text></Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={() => onSubmit(amount)} disabled={amount <= 0}>
          <Text style={styles.submitText}>Send {formatAmount(amount)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, gap: 14 },
  title: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14 },
  currency: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginRight: 4 },
  input: { flex: 1, fontSize: 20, fontWeight: '700', color: Colors.textPrimary, paddingVertical: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { backgroundColor: Colors.surfaceElevated, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  oddsLabel: { fontSize: 13, color: Colors.textSecondary },
  oddsValue: { fontWeight: '800', color: Colors.primaryDark },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  cancelText: { fontWeight: '700', color: Colors.textSecondary },
  submitBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.primary },
  submitText: { fontWeight: '700', color: '#FFFFFF' },
});
