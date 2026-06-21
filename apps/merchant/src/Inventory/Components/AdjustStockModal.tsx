import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Animated } from 'react-native';
import { AlertTriangle, Minus, Plus } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { useStores } from '../../Common/hooks/useStores';
import { TextField } from '../../Common/components/FormFields';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../theme/colors';

interface Props {
  visible: boolean;
  presetBatchId?: string | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

type Direction = 'add' | 'remove';

const REASONS = [
  'Damaged / Spoiled',
  'Stock Count Correction',
  'Theft / Loss',
  'Returned to Supplier',
  'Other',
];

function SkeletonBox({ width, height, borderRadius = 8, style }: { width?: number | string; height: number; borderRadius?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
    ]));
    loop.start(); return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[{ width: width ?? '100%', height, borderRadius, backgroundColor: '#E2E8F0', opacity }, style]} />;
}

export const AdjustStockModal = observer(function AdjustStockModal({
  visible,
  presetBatchId,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();
  const { inventoryStore } = useStores();

  useEffect(() => {
    if (!visible) return;
    // If presetBatchId is provided, navigate directly to adjustment page
    if (presetBatchId) {
      onClose();
      router.push(`/inventory/batch-adjustment/${presetBatchId}` as any);
    }
  }, [visible, presetBatchId, router, onClose]);

  const handleBatchSelect = (batchId: string) => {
    onClose();
    router.push(`/inventory/batch-adjustment/${batchId}` as any);
  };

  return (
    <BottomSheet isVisible={visible} onClose={onClose} title="Select Batch to Adjust" height={0.6}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.batchList}>
          {inventoryStore.batchesState === 'loading' ? (
            <>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.batchRow}>
                  <SkeletonBox width={20} height={20} borderRadius={10} />
                  <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
                    <SkeletonBox height={14} />
                    <SkeletonBox height={11} width="70%" />
                  </View>
                </View>
              ))}
            </>
          ) : inventoryStore.batchOptions.length === 0 ? (
            <Text style={styles.emptyText}>No batches found.</Text>
          ) : (
            inventoryStore.batchOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.batchRow, styles.batchRowSelectable]}
                onPress={() => handleBatchSelect(opt.id)}
                activeOpacity={0.6}
              >
                <View style={styles.radioOuter}>
                  <View style={styles.radioInner} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.batchName}>{opt.label}</Text>
                  <Text style={styles.batchSub}>{opt.sublabel}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  form: { paddingHorizontal: 20, paddingTop: 12 },
  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  errorBannerText: { color: Colors.error, fontSize: 12, fontWeight: '600' },
  currentStockText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14, marginTop: -4 },
  currentStockValue: { fontWeight: '800', color: Colors.textPrimary },

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
  summaryText: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark, marginBottom: 4 },
  summaryEquation: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  summaryNew: { color: Colors.primary },

  batchList: { gap: 2, marginBottom: 16 },
  batchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10 },
  batchRowSelectable: { backgroundColor: Colors.background },
  batchName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  batchSub: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingVertical: 16 },
});
