import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing, typography } from '../../../theme';
import { obColors } from '../../Onboarding/theme';
import { ToggleRow } from '../../Onboarding/Components/ToggleRow';
import { useConfigStore } from '../Store/useConfigStore';

const SECTIONS: { route: string; icon: keyof typeof Ionicons.glyphMap; label: string; description: string }[] = [
  { route: 'CodSettings', icon: 'cash-outline', label: 'Cash on Delivery', description: 'COD limits per order and per day' },
  { route: 'ScheduleSettings', icon: 'calendar-outline', label: 'Weekly Schedule', description: 'Your availability for each day' },
  { route: 'WorkPrefsSettings', icon: 'briefcase-outline', label: 'Work Preferences', description: 'Load, distance and shift limits' },
];

export function ConfigRoute({ navigation }: any) {
  const config = useConfigStore((s) => s.config);
  const load = useConfigStore((s) => s.load);
  const toggleOnline = useConfigStore((s) => s.toggleOnline);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={obColors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Setup</Text>

        <ToggleRow
          label="Online"
          description="Go online to start receiving delivery requests"
          value={config?.is_online ?? false}
          onValueChange={toggleOnline}
        />

        <View style={styles.list}>
          {SECTIONS.map((section) => (
            <TouchableOpacity key={section.route} style={styles.row} onPress={() => navigation.navigate(section.route)} activeOpacity={0.85}>
              <View style={styles.rowIcon}>
                <Ionicons name={section.icon} size={20} color={obColors.accent} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{section.label}</Text>
                <Text style={styles.rowDesc}>{section.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={obColors.textFaint} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: obColors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: spacing.xl },
  back: { marginBottom: spacing.md },
  title: { ...typography.h1, color: obColors.text, marginBottom: spacing.lg },
  list: { marginTop: spacing.lg },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: obColors.border,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: obColors.accentMuted,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  rowText: { flex: 1 },
  rowLabel: { ...typography.body, color: obColors.text, fontWeight: '600' },
  rowDesc: { ...typography.small, color: obColors.textMuted, marginTop: 2 },
});
