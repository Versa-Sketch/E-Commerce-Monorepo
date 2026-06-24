import React from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { radius, spacing, typography } from '../../../theme';
import { obColors } from '../theme';
import { ScheduleDay } from '../types/domain';

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  days: ScheduleDay[];
  onChange: (days: ScheduleDay[]) => void;
}

export function DaySchedulePicker({ days, onChange }: Props) {
  const update = (index: number, patch: Partial<ScheduleDay>) => {
    const next = days.map((d, i) => (i === index ? { ...d, ...patch } : d));
    onChange(next);
  };

  return (
    <View style={styles.wrap}>
      {days.map((day, index) => (
        <View key={day.day} style={styles.row}>
          <View style={styles.rowTop}>
            <Text style={styles.dayLabel}>{DAY_LABELS[day.day] ?? `Day ${day.day}`}</Text>
            <Switch
              value={day.is_available}
              onValueChange={(val) => update(index, { is_available: val })}
              trackColor={{ true: obColors.accent, false: obColors.border }}
              thumbColor={obColors.white}
            />
          </View>
          {day.is_available ? (
            <View style={styles.timeRow}>
              <TextInput
                style={styles.timeInput}
                value={day.start_time}
                onChangeText={(t) => update(index, { start_time: t })}
                placeholder="09:00"
                placeholderTextColor={obColors.textFaint}
              />
              <Text style={styles.timeSep}>to</Text>
              <TextInput
                style={styles.timeInput}
                value={day.end_time}
                onChangeText={(t) => update(index, { end_time: t })}
                placeholder="18:00"
                placeholderTextColor={obColors.textFaint}
              />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export function defaultScheduleDays(): ScheduleDay[] {
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    is_available: true,
    start_time: '09:00',
    end_time: '18:00',
  }));
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: {
    borderWidth: 1, borderColor: obColors.border, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, backgroundColor: obColors.surfaceMuted,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayLabel: { ...typography.body, color: obColors.text, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  timeInput: {
    flex: 1, borderWidth: 1, borderColor: obColors.border, borderRadius: radius.sm,
    paddingHorizontal: 10, paddingVertical: 8, ...typography.small, color: obColors.text, textAlign: 'center',
  },
  timeSep: { ...typography.small, color: obColors.textMuted },
});
