import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography } from '../../../theme';
import { ContinueButton } from '../../Onboarding/Components/ContinueButton';
import { FormField } from '../../Onboarding/Components/FormField';
import { ToggleRow } from '../../Onboarding/Components/ToggleRow';
import { obColors, onboardingPaperTheme } from '../../Onboarding/theme';
import { useConfigStore } from '../Store/useConfigStore';

export function CodSettingsRoute({ navigation }: any) {
  const config = useConfigStore((s) => s.config);
  const status = useConfigStore((s) => s.status);
  const error = useConfigStore((s) => s.error);
  const save = useConfigStore((s) => s.save);

  const [enabled, setEnabled] = useState(config?.cod.cod_enabled ?? true);
  const [perOrder, setPerOrder] = useState(config?.cod.cod_limit_per_order ?? '500');
  const [perDay, setPerDay] = useState(config?.cod.cod_limit_per_day ?? '3000');

  useEffect(() => {
    if (!config) return;
    setEnabled(config.cod.cod_enabled);
    setPerOrder(config.cod.cod_limit_per_order);
    setPerDay(config.cod.cod_limit_per_day);
  }, [config]);

  const handleSave = async () => {
    try {
      await save({
        cod_enabled: enabled,
        cod_limit_per_order: enabled ? Number(perOrder) || undefined : undefined,
        cod_limit_per_day: enabled ? Number(perDay) || undefined : undefined,
      });
      navigation.goBack();
    } catch {
      // `error` below already reflects the failure.
    }
  };

  return (
    <PaperProvider theme={onboardingPaperTheme}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={obColors.text} />
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <ToggleRow label="Accept Cash on Delivery" value={enabled} onValueChange={setEnabled} />
          {enabled && (
            <>
              <FormField label="COD Limit Per Order (₹)" value={perOrder} onChangeText={setPerOrder} keyboardType="number-pad" />
              <FormField label="COD Limit Per Day (₹)" value={perDay} onChangeText={setPerDay} keyboardType="number-pad" />
            </>
          )}
        </ScrollView>
        <ContinueButton label="Save" onPress={handleSave} loading={status === 'saving'} />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 8 },
  back: { marginBottom: spacing.md },
  error: { ...typography.small, color: obColors.error, marginBottom: spacing.sm },
});
