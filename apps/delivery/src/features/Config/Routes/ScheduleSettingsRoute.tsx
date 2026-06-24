import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography } from '../../../theme';
import { ContinueButton } from '../../Onboarding/Components/ContinueButton';
import { DaySchedulePicker, defaultScheduleDays } from '../../Onboarding/Components/DaySchedulePicker';
import { obColors } from '../../Onboarding/theme';
import { useConfigStore } from '../Store/useConfigStore';

export function ScheduleSettingsRoute({ navigation }: any) {
  const config = useConfigStore((s) => s.config);
  const status = useConfigStore((s) => s.status);
  const error = useConfigStore((s) => s.error);
  const save = useConfigStore((s) => s.save);

  const [days, setDays] = useState(config?.schedule?.length ? config.schedule : defaultScheduleDays());

  useEffect(() => {
    if (config?.schedule?.length) setDays(config.schedule);
  }, [config]);

  const handleSave = async () => {
    try {
      await save({ schedule: days });
      navigation.goBack();
    } catch {
      // `error` below already reflects the failure.
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={obColors.text} />
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <DaySchedulePicker days={days} onChange={setDays} />
      </ScrollView>
      <ContinueButton label="Save" onPress={handleSave} loading={status === 'saving'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 8 },
  back: { marginBottom: spacing.md },
  error: { ...typography.small, color: obColors.error, marginBottom: spacing.sm },
});
