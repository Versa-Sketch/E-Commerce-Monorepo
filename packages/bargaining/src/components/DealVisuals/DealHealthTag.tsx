import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';
import { DealHealth } from '../../utils/bargainMath';

const healthTone: Record<DealHealth, { bg: string; fg: string; label: string }> = {
  Hot: { bg: Colors.successBg, fg: '#1B5E20', label: '🔥 Hot deal' },
  Warm: { bg: Colors.warningBg, fg: '#B45309', label: '☀️ Warming up' },
  Cool: { bg: Colors.infoBg, fg: '#1565C0', label: '❄️ Needs work' },
};

export function DealHealthTag({ health }: { health: DealHealth }) {
  const tone = healthTone[health];
  return (
    <View style={[styles.wrap, { backgroundColor: tone.bg }]}>
      <Text style={[styles.text, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700' },
});
