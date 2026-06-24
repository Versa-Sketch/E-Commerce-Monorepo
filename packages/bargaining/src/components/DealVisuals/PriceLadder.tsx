import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';

export function PriceLadder({ offer, current, currency = '₹' }: { offer: number; current: number; currency?: string }) {
  const max = Math.max(current, offer, 1);
  const ratio = Math.max(0.04, Math.min(0.96, offer / max));

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        <View style={[styles.marker, { left: `${ratio * 100}%` }]} />
      </View>
      <View style={styles.labels}>
        <View>
          <Text style={styles.value}>{currency}{Math.round(offer)}</Text>
          <Text style={styles.caption}>Current offer</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.value}>{currency}{Math.round(current)}</Text>
          <Text style={styles.caption}>List price</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  track: { height: 6, borderRadius: 3, backgroundColor: Colors.border, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, backgroundColor: Colors.primary },
  marker: {
    position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.primary, marginLeft: -8,
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  value: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  caption: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary, marginTop: 2 },
});
