import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import type { GatewayConnectionStatus } from '../Services/gateway';

// ── Gradient surface ─────────────────────────────────────────────────────────

export function GradientCard({
  colors,
  style,
  children,
}: {
  colors?: readonly [string, string];
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const [from] = colors ?? (Colors.gradientPrimary as [string, string]);
  return (
    <View style={[{ backgroundColor: from || '#0F8F5F', borderRadius: 24, overflow: 'hidden', margin: 20 }, style]}>
      {children}
    </View>
  );
}

const gv = StyleSheet.create({
  wrap: { borderRadius: 24, margin: 20 },
});

// ── Price ladder ──────────────────────────────────────────────────────────────

export function PriceLadder({ offer, current, currency = '₹' }: { offer: number; current: number; currency?: string }) {
  const max = Math.max(current, offer, 1);
  const ratio = Math.max(0.04, Math.min(0.96, offer / max));

  return (
    <View style={pl.wrap}>
      <View style={pl.track}>
        <View style={[pl.fill, { width: `${ratio * 100}%` }]} />
        <View style={[pl.marker, { left: `${ratio * 100}%` }]} />
      </View>
      <View style={pl.labels}>
        <View>
          <Text style={pl.value}>{currency}{Math.round(offer)}</Text>
          <Text style={pl.caption}>Current offer</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={pl.value}>{currency}{Math.round(current)}</Text>
          <Text style={pl.caption}>List price</Text>
        </View>
      </View>
    </View>
  );
}

const pl = StyleSheet.create({
  wrap: { gap: 10 },
  track: { height: 6, borderRadius: 3, backgroundColor: Colors.border, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, backgroundColor: Colors.primary },
  marker: {
    position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.primary,
    marginLeft: -8,
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  value: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  caption: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary, marginTop: 2 },
});

// ── Deal probability gauge ───────────────────────────────────────────────────

export function ProbabilityBar({ value, label = 'Deal probability' }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const tone = pct >= 70 ? Colors.success : pct >= 40 ? Colors.warning : Colors.error;

  return (
    <View style={pb.wrap}>
      <View style={pb.headRow}>
        <Text style={pb.label}>{label}</Text>
        <Text style={[pb.pct, { color: tone }]}>{pct}%</Text>
      </View>
      <View style={pb.track}>
        <View style={[pb.fill, { width: `${pct}%`, backgroundColor: tone }]} />
      </View>
    </View>
  );
}

const pb = StyleSheet.create({
  wrap: { gap: 6 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  pct: { fontSize: 13, fontWeight: '800' },
  track: { height: 8, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});

// ── Countdown ─────────────────────────────────────────────────────────────────

export type Urgency = 'normal' | 'warning' | 'critical';

export function urgencyOf(seconds: number): Urgency {
  if (seconds <= 60) return 'critical';
  if (seconds <= 180) return 'warning';
  return 'normal';
}

function formatCountdown(seconds: number) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
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
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
  }, [urgency, seconds]);

  return (
    <Animated.View
      style={[
        cb.wrap,
        size === 'sm' && cb.wrapSm,
        size === 'lg' && cb.wrapLg,
        { backgroundColor: tone.bg, transform: [{ scale: pulse }] },
      ]}
    >
      <View style={[cb.dot, { backgroundColor: tone.fg }]} />
      <Text style={[cb.text, size === 'lg' && cb.textLg, { color: tone.fg }]}>{formatCountdown(seconds)}</Text>
    </Animated.View>
  );
}

const cb = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  wrapSm: { paddingHorizontal: 8, paddingVertical: 3 },
  wrapLg: { paddingHorizontal: 14, paddingVertical: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  textLg: { fontSize: 18 },
});

// ── Deal health tag ───────────────────────────────────────────────────────────

const healthTone: Record<'Hot' | 'Warm' | 'Cool', { bg: string; fg: string; label: string }> = {
  Hot: { bg: Colors.successBg, fg: '#1B5E20', label: '🔥 Hot deal' },
  Warm: { bg: Colors.warningBg, fg: '#B45309', label: '☀️ Warming up' },
  Cool: { bg: Colors.infoBg, fg: '#1565C0', label: '❄️ Needs work' },
};

export function DealHealthTag({ health }: { health: 'Hot' | 'Warm' | 'Cool' }) {
  const tone = healthTone[health];
  return (
    <View style={[ht.wrap, { backgroundColor: tone.bg }]}>
      <Text style={[ht.text, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

const ht = StyleSheet.create({
  wrap: { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700' },
});

// ── Connection status pill ───────────────────────────────────────────────────

const connectionTone: Record<GatewayConnectionStatus, { bg: string; fg: string; label: string; pulse?: boolean }> = {
  open: { bg: Colors.successBg, fg: Colors.success, label: 'Live' },
  connecting: { bg: Colors.warningBg, fg: '#B45309', label: 'Connecting…', pulse: true },
  reconnecting: { bg: Colors.warningBg, fg: '#B45309', label: 'Reconnecting…', pulse: true },
  offline: { bg: Colors.errorBg, fg: Colors.error, label: 'Offline' },
};

export function ConnectionStatusPill({ status }: { status: GatewayConnectionStatus }) {
  const tone = connectionTone[status];
  return (
    <View style={[cs.wrap, { backgroundColor: tone.bg }]}>
      {tone.pulse ? <PulseDot color={tone.fg} /> : <View style={[cs.dot, { backgroundColor: tone.fg }]} />}
      <Text style={[cs.text, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

const cs = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 11, fontWeight: '700' },
});

// ── Misc small svg accents ───────────────────────────────────────────────────

export function SparkDivider() {
  return (
    <Svg width="100%" height={2}>
      <Line x1="0" y1="1" x2="100%" y2="1" stroke={Colors.border} strokeWidth={1} strokeDasharray="4,4" />
    </Svg>
  );
}

export function PulseDot({ color = Colors.success }: { color?: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.8, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={pd.wrap}>
      <Animated.View style={[pd.ring, { backgroundColor: color, opacity, transform: [{ scale }] }]} />
      <View style={[pd.core, { backgroundColor: color }]} />
    </View>
  );
}

const pd = StyleSheet.create({
  wrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  core: { width: 8, height: 8, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
});
