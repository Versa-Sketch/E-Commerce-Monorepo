import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing, typography } from '../../../theme';
import { ContinueButton } from '../Components/ContinueButton';
import { FilePickerField } from '../Components/FilePickerField';
import { obColors } from '../theme';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { OnboardingStep, PickedDoc } from '../types/domain';
import { DOC_TYPE_INFO, getRejectedDocuments } from '../utils/documents';

export function ReuploadDocumentsRoute({ navigation }: any) {
  const prefill = useOnboardingStore((s) => s.prefill);
  const stepError = useOnboardingStore((s) => s.stepError);
  const isSubmitting = useOnboardingStore((s) => s.stepState === 'submitting');
  const patchIdentityFiles = useOnboardingStore((s) => s.patchIdentityFiles);
  const patchKycFiles = useOnboardingStore((s) => s.patchKycFiles);
  const patchVehicleFiles = useOnboardingStore((s) => s.patchVehicleFiles);
  const submitForReview = useOnboardingStore((s) => s.submitForReview);
  const loadDetails = useOnboardingStore((s) => s.loadDetails);

  useEffect(() => {
    if (!prefill) loadDetails();
  }, [prefill, loadDetails]);

  const rejectedDocs = getRejectedDocuments(prefill?.documents);
  const [retaken, setRetaken] = useState<Record<string, PickedDoc | null>>({});

  const allRetaken = rejectedDocs.length > 0 && rejectedDocs.every((d) => !!retaken[d.doc_type]);

  const handleSubmit = async () => {
    if (!allRetaken) return;
    try {
      const byStep: Record<OnboardingStep, Record<string, PickedDoc | null>> = {} as any;
      for (const doc of rejectedDocs) {
        const info = DOC_TYPE_INFO[doc.doc_type];
        if (!info) continue;
        const file = retaken[doc.doc_type];
        if (!file) continue;
        byStep[info.step] = { ...(byStep[info.step] ?? {}), [info.formKey]: file };
      }
      if (byStep.IDENTITY) await patchIdentityFiles(byStep.IDENTITY as any);
      if (byStep.KYC) await patchKycFiles(byStep.KYC as any);
      if (byStep.VEHICLE) await patchVehicleFiles(byStep.VEHICLE as any);
      await submitForReview();
      navigation.goBack();
    } catch {
      // stepError below already reflects the failure.
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={obColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reupload documents</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {stepError ? <Text style={styles.error}>{stepError}</Text> : null}
        {rejectedDocs.length === 0 ? (
          <Text style={styles.empty}>No documents are currently flagged for reupload.</Text>
        ) : (
          rejectedDocs.map((doc) => {
            const info = DOC_TYPE_INFO[doc.doc_type];
            const label = info?.label ?? doc.doc_type;
            return (
              <View key={doc.doc_type} style={styles.docCard}>
                <View style={styles.docHeader}>
                  <Ionicons name="alert-circle" size={16} color={obColors.error} />
                  <Text style={styles.docLabel}>{label}</Text>
                </View>
                {doc.reject_reason ? <Text style={styles.docReason}>Rejected: {doc.reject_reason}</Text> : null}
                <FilePickerField
                  label="Retake photo"
                  value={retaken[doc.doc_type] ?? null}
                  onChange={(file) => setRetaken((prev) => ({ ...prev, [doc.doc_type]: file }))}
                />
              </View>
            );
          })
        )}
      </ScrollView>
      <ContinueButton label="Submit for re-review" onPress={handleSubmit} disabled={!allRetaken} loading={isSubmitting} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: obColors.border },
  back: { padding: 2 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: obColors.text },
  scroll: { padding: 16, paddingBottom: 100 },
  error: { ...typography.small, color: obColors.error, marginBottom: spacing.sm },
  empty: { ...typography.body, color: obColors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
  docCard: { borderWidth: 1, borderColor: obColors.error, borderRadius: radius.md, padding: spacing.md, backgroundColor: obColors.errorMuted, marginBottom: spacing.lg },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  docLabel: { ...typography.body, fontWeight: '700', color: obColors.text },
  docReason: { ...typography.small, color: obColors.error, marginBottom: spacing.sm },
});
