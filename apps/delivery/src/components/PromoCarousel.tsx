import React, { useRef, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 64;

const promos = [
  { id: '1', title: 'Personal Loans Up To ₹49,000!', cta: 'Apply Now', gradient: ['#111111', '#000000'] as const },
  { id: '2', title: 'Important Updates in Message Centre', cta: 'View Now', gradient: ['#2A2A2A', '#111111'] as const },
  { id: '3', title: 'Earn ₹500 bonus this week!', cta: 'Know More', gradient: ['#1A1A1A', '#000000'] as const },
];

export function PromoCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function handleScroll(e: any) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActive(Math.max(0, Math.min(idx, promos.length - 1)));
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onMomentumScrollEnd={handleScroll}
      >
        {promos.map((p) => (
          <LinearGradient
            key={p.id}
            colors={p.gradient}
            style={[styles.card, { width: CARD_W }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.title}>{p.title}</Text>
            <TouchableOpacity style={styles.ctaBtn}>
              <Text style={styles.ctaText}>{p.cta}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {promos.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, active === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  title: { ...typography.h3, color: colors.white, flex: 1 },
  ctaBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ctaText: { ...typography.small, color: colors.black, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gray100 },
  dotActive: { backgroundColor: colors.black87, width: 16 },
});
