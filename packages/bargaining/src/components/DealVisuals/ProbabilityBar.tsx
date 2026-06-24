import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';

export function ProbabilityBar({ value, label = 'Deal probability' }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const tone = pct >= 70 ? Colors.success : pct >= 40 ? Colors.warning : Colors.error;

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.pct, { color: tone }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: tone }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  pct: { fontSize: 13, fontWeight: '800' },
  track: { height: 8, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
