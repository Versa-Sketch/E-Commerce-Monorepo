import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';
import { GatewayConnectionStatus } from '../../client/BargainGatewaySocket';
import { PulseDot } from './PulseDot';

const connectionTone: Record<GatewayConnectionStatus, { bg: string; fg: string; label: string; pulse?: boolean }> = {
  open: { bg: Colors.successBg, fg: Colors.success, label: 'Live' },
  connecting: { bg: Colors.warningBg, fg: '#B45309', label: 'Connecting…', pulse: true },
  reconnecting: { bg: Colors.warningBg, fg: '#B45309', label: 'Reconnecting…', pulse: true },
  offline: { bg: Colors.errorBg, fg: Colors.error, label: 'Offline' },
};

export function ConnectionStatusPill({ status }: { status: GatewayConnectionStatus }) {
  const tone = connectionTone[status];
  return (
    <View style={[styles.wrap, { backgroundColor: tone.bg }]}>
      {tone.pulse ? <PulseDot color={tone.fg} /> : <View style={[styles.dot, { backgroundColor: tone.fg }]} />}
      <Text style={[styles.text, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 11, fontWeight: '700' },
});
