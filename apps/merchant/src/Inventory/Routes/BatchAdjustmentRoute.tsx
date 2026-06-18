import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertTriangle, ChevronLeft, Minus, Plus } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../../stores/RootStore';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { TextField } from '../../Common/components/FormFields';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';
import { Shadows } from '../../theme/shadows';

const REASONS = [
  'Damaged / Spoiled',
  'Stock Count Correction',
  'Theft / Loss',
  'Returned to Supplier',
  'Other',
];

type Direction = 'add' | 'remove';

export default observer(function BatchAdjustmentRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { inventoryStore } = useStores();

  const batchId = typeof params.batchId === 'string' ? params.batchId : undefined;

  const [direction, setDirection] = useState<Direction>('add');
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState<string | null>(null);
  const [otherNote, setOtherNote] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const batch = batchId ? inventoryStore.batchById(batchId) : undefined;
  const currentStock = batch ? Number(batch.available_quantity) : 0;
  const delta = direction === 'add' ? amount : -amount;
  const newStock = currentStock + delta;

  const exceedsAvailable = direction === 'remove' && amount > currentStock;
  const canConfirm = amount > 0 && !exceedsAvailable && !!reason && (reason !== 'Other' || otherNote.trim().length > 0);

  const adjustAmount = (step: number) => {
    setAmount((a) => Math.max(1, a + step));
  };

  const handleConfirm = async () => {
    if (!canConfirm || !batch) return;
    setSubmitError(null);
    const note = reason === 'Other' ? otherNote.trim() : reason ?? undefined;
    const result = await inventoryStore.adjustStock({
      batch_id: batch.id,
      delta,
      ...(note ? { note } : {}),
    });
    if (result.ok) {
      router.back();
    } else {
      setSubmitError(result.message);
    }
  };

  if (!batch) {
    return (
      <AnimatedScreen style={styles.root}>
        <Text style={styles.errorText}>Batch not found</Text>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adjust Stock</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Batch Summary Card */}
        <View style={styles.batchCard}>
          <Text style={styles.productName} numberOfLines={1}>
            {inventoryStore.productLabelForVariant(batch.variant_id)}
          </Text>
          <Text style={styles.batchNumber}>Batch {batch.batch_number || '—'}</Text>
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Current stock:</Text>
            <Text style={styles.stockValue}>{batch.available_quantity}</Text>
          </View>
        </View>

        {submitError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{submitError}</Text>
          </View>
        ) : null}

        {/* Direction Toggle */}
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segment, direction === 'add' && styles.segmentAdd]}
            activeOpacity={0.85}
            onPress={() => setDirection('add')}
          >
            <Plus size={15} color={direction === 'add' ? Colors.white : Colors.success} />
            <Text style={[styles.segmentText, direction === 'add' && styles.segmentTextActive]}>
              Add Stock
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, direction === 'remove' && styles.segmentRemove]}
            activeOpacity={0.85}
            onPress={() => setDirection('remove')}
          >
            <Minus size={15} color={direction === 'remove' ? Colors.white : Colors.error} />
            <Text style={[styles.segmentText, direction === 'remove' && styles.segmentTextActive]}>
              Remove Stock
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stepper */}
        <View style={styles.stepperRow}>
          <TouchableOpacity style={styles.stepperBtn} activeOpacity={0.7} onPress={() => adjustAmount(-1)}>
            <Minus size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{amount}</Text>
          <TouchableOpacity style={styles.stepperBtn} activeOpacity={0.7} onPress={() => adjustAmount(1)}>
            <Plus size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Live Preview */}
        <View style={styles.previewRow}>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Current</Text>
            <Text style={styles.previewValue}>{currentStock}</Text>
          </View>
          <Text style={styles.previewArrow}>→</Text>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Adjustment</Text>
            <Text style={[styles.previewValue, direction === 'add' ? styles.previewAdd : styles.previewRemove]}>
              {direction === 'add' ? '+' : '-'}
              {amount}
            </Text>
          </View>
          <Text style={styles.previewArrow}>→</Text>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>New Stock</Text>
            <Text style={[styles.previewValue, styles.previewNew]}>{newStock}</Text>
          </View>
        </View>

        {exceedsAvailable ? (
          <View style={styles.warningBox}>
            <AlertTriangle size={16} color={Colors.error} />
            <Text style={[styles.warningText, { color: Colors.error }]}>
              Cannot remove more than {currentStock} units (current stock).
            </Text>
          </View>
        ) : null}

        {/* Reason */}
        <Text style={styles.reasonLabel}>Reason for adjustment *</Text>
        <View style={styles.reasonList}>
          {REASONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={styles.reasonRow}
              activeOpacity={0.7}
              onPress={() => setReason(r)}
            >
              <View style={[styles.radioOuter, reason === r && styles.radioOuterActive]}>
                {reason === r ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.reasonText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {reason === 'Other' ? (
          <TextField
            label="Specify reason *"
            value={otherNote}
            onChangeText={setOtherNote}
            placeholder="Describe the reason for this adjustment"
            multiline
          />
        ) : null}

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryEquation}>
            {currentStock} → {direction === 'add' ? '+' : '-'}
            {amount} → <Text style={styles.summaryNew}>{newStock}</Text>
          </Text>
        </View>

        <Button
          label="Confirm Adjustment"
          variant={direction === 'remove' ? 'danger' : 'primary'}
          loading={inventoryStore.saving}
          disabled={!canConfirm}
          onPress={() => void handleConfirm()}
        />

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </AnimatedScreen>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  batchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.soft,
  },
  productName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  batchNumber: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  stockLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  stockValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },

  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  errorBannerText: { color: Colors.error, fontSize: 12, fontWeight: '600' },
  errorText: { fontSize: 16, color: Colors.error, textAlign: 'center', marginTop: 40 },

  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  segmentAdd: { backgroundColor: Colors.success, borderColor: Colors.success },
  segmentRemove: { backgroundColor: Colors.error, borderColor: Colors.error },
  segmentText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  segmentTextActive: { color: Colors.white },

  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, minWidth: 64, textAlign: 'center' },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  previewItem: { alignItems: 'center', flex: 1 },
  previewLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  previewValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  previewAdd: { color: Colors.success },
  previewRemove: { color: Colors.error },
  previewNew: { color: Colors.primary, fontSize: 22 },
  previewArrow: { fontSize: 16, color: Colors.textMuted, marginHorizontal: 2 },

  warningBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.errorBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '500' },

  reasonLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  reasonList: { gap: 2, marginBottom: 4 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  reasonText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },

  summaryBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    marginBottom: 16,
  },
  summaryEquation: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  summaryNew: { color: Colors.primary },
});
