import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../colors';
import { formatCountdown } from '../../utils/format';

export type Urgency = 'normal' | 'warning' | 'critical';

export function urgencyOf(seconds: number): Urgency {
  if (seconds <= 60) return 'critical';
  if (seconds <= 180) return 'warning';
  return 'normal';
}

const urgencyTone: Record<Urgency, { bg: string; fg: string }> = {
  normal: { bg: Colors.primaryLight, fg: Colors.primaryDark },
  warning: { bg: Colors.warningBg, fg: '#B45309' },
  critical: { bg: Colors.errorBg, fg: Colors.error },
};

export function CountdownBadge({ seconds, size = 'md' }: { seconds: number; size?: 'sm' | 'md' | 'lg' }) {
  const urgency = urgencyOf(seconds);
  const tone = urgencyTone[urgency];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (urgency === 'critical' && seconds > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 480, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 480, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
  }, [urgency, seconds]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        size === 'sm' && styles.wrapSm,
        size === 'lg' && styles.wrapLg,
        { backgroundColor: tone.bg, transform: [{ scale: pulse }] },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: tone.fg }]} />
      <Text style={[styles.text, size === 'lg' && styles.textLg, { color: tone.fg }]}>{formatCountdown(seconds)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  wrapSm: { paddingHorizontal: 8, paddingVertical: 3 },
  wrapLg: { paddingHorizontal: 14, paddingVertical: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  textLg: { fontSize: 18 },
});
