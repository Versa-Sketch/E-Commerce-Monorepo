import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography } from '../../../theme';
import { ChoicePills } from '../../Onboarding/Components/ChoicePills';
import { ContinueButton } from '../../Onboarding/Components/ContinueButton';
import { FormField } from '../../Onboarding/Components/FormField';
import { ToggleRow } from '../../Onboarding/Components/ToggleRow';
import { obColors, onboardingPaperTheme } from '../../Onboarding/theme';
import { MaxLoad } from '../../Onboarding/types/domain';
import { useConfigStore } from '../Store/useConfigStore';

export function WorkPrefsSettingsRoute({ navigation }: any) {
  const config = useConfigStore((s) => s.config);
  const status = useConfigStore((s) => s.status);
  const error = useConfigStore((s) => s.error);
  const save = useConfigStore((s) => s.save);

  const [maxLoad, setMaxLoad] = useState<MaxLoad>(config?.work_preference?.max_load ?? 'MEDIUM');
  const [willingLongDistance, setWillingLongDistance] = useState(config?.work_preference?.willing_long_distance ?? false);
  const [longDistanceKm, setLongDistanceKm] = useState(String(config?.work_preference?.long_distance_km ?? 10));
  const [maxOrdersPerShift, setMaxOrdersPerShift] = useState(String(config?.work_preference?.max_orders_per_shift ?? 10));

  useEffect(() => {
    if (!config?.work_preference) return;
    setMaxLoad(config.work_preference.max_load);
    setWillingLongDistance(config.work_preference.willing_long_distance);
    setLongDistanceKm(String(config.work_preference.long_distance_km));
    setMaxOrdersPerShift(String(config.work_preference.max_orders_per_shift));
  }, [config]);

  const handleSave = async () => {
    try {
      await save({
        max_load: maxLoad,
        willing_long_distance: willingLongDistance,
        long_distance_km: Number(longDistanceKm) || undefined,
        max_orders_per_shift: Number(maxOrdersPerShift) || undefined,
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
          <ChoicePills
            label="Preferred Load"
            options={[{ value: 'LIGHT', label: 'Light' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HEAVY', label: 'Heavy' }]}
            value={maxLoad}
            onChange={setMaxLoad}
          />
          <ToggleRow label="Willing to travel long distance" value={willingLongDistance} onValueChange={setWillingLongDistance} />
          {willingLongDistance && (
            <FormField label="Max Distance (km)" value={longDistanceKm} onChangeText={setLongDistanceKm} keyboardType="number-pad" />
          )}
          <FormField label="Max Orders Per Shift" value={maxOrdersPerShift} onChangeText={setMaxOrdersPerShift} keyboardType="number-pad" />
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
