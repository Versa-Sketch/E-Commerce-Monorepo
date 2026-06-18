import {
  CheckCircle2,
  ChevronLeft,
  Clock3,
  MessageSquare,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { Colors } from '../../theme/colors';
import { CountdownBadge, DealHealthTag, ProbabilityBar } from '../Components/DealVisuals';
import styles from './styles';

// ─── Fixture Data ─────────────────────────────────────────────────────────────

type BargainStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Countered' | 'Expired';
type DealHealth    = 'Hot' | 'Warm' | 'Cool';

interface FixtureBargain {
  id: string;
  status: BargainStatus;
  productName: string;
  productEmoji: string;
  customerName: string;
  currentPrice: number;
  customerOffer: number;
  merchantCost: number;
  expirationTime: number;   // seconds remaining
  dealProbability: number;  // 0-100
  dealHealth: DealHealth;
  isExpiringSoon: boolean;
}

const INITIAL_BARGAINS: FixtureBargain[] = [
  // Live / pending
  {
    id: 'b1',
    status: 'Pending',
    productName: 'Alphonso Mangoes (1 Dozen)',
    productEmoji: '🥭',
    customerName: 'Priya Sharma',
    currentPrice: 480,
    customerOffer: 380,
    merchantCost: 320,
    expirationTime: 720,
    dealProbability: 74,
    dealHealth: 'Hot',
    isExpiringSoon: false,
  },
  {
    id: 'b2',
    status: 'Pending',
    productName: 'Dragon Fruit Pack (2 pcs)',
    productEmoji: '🍈',
    customerName: 'Rahul Verma',
    currentPrice: 200,
    customerOffer: 140,
    merchantCost: 120,
    expirationTime: 95,
    dealProbability: 52,
    dealHealth: 'Warm',
    isExpiringSoon: true,
  },
  {
    id: 'b3',
    status: 'Pending',
    productName: 'Seasonal Fruit Box (2kg)',
    productEmoji: '🍎',
    customerName: 'Meera Iyer',
    currentPrice: 450,
    customerOffer: 290,
    merchantCost: 280,
    expirationTime: 340,
    dealProbability: 28,
    dealHealth: 'Cool',
    isExpiringSoon: false,
  },
  // Resolved
  {
    id: 'b4',
    status: 'Accepted',
    productName: 'Avocado (2 pcs)',
    productEmoji: '🥑',
    customerName: 'Deepa Nair',
    currentPrice: 280,
    customerOffer: 240,
    merchantCost: 180,
    expirationTime: 0,
    dealProbability: 100,
    dealHealth: 'Hot',
    isExpiringSoon: false,
  },
  {
    id: 'b5',
    status: 'Rejected',
    productName: 'Organic Tomatoes (500g)',
    productEmoji: '🍅',
    customerName: 'Karan Mehta',
    currentPrice: 60,
    customerOffer: 30,
    merchantCost: 40,
    expirationTime: 0,
    dealProbability: 0,
    dealHealth: 'Cool',
    isExpiringSoon: false,
  },
  {
    id: 'b6',
    status: 'Expired',
    productName: 'Baby Carrots (500g)',
    productEmoji: '🥕',
    customerName: 'Arjun Reddy',
    currentPrice: 75,
    customerOffer: 55,
    merchantCost: 45,
    expirationTime: 0,
    dealProbability: 0,
    dealHealth: 'Warm',
    isExpiringSoon: false,
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBox({ width, height, borderRadius = 8, style }: { width?: number | string; height: number; borderRadius?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
    ]));
    loop.start(); return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[{ width: width ?? '100%', height, borderRadius, backgroundColor: '#E2E8F0', opacity }, style]} />;
}

function BargainSkeleton({ insetTop }: { insetTop: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <View style={{ backgroundColor: Colors.primary, paddingTop: insetTop + 12, paddingHorizontal: 16, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={100} height={22} borderRadius={6}  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>
        {/* Hero stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {[0,1,2,3].map((i) => <SkeletonBox key={i} width={'48%' as any} height={60} borderRadius={12} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />)}
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 12 }}>
        <SkeletonBox height={18} width={120} borderRadius={6} />
        {[0,1,2].map((i) => <SkeletonBox key={i} height={160} borderRadius={18} />)}
      </View>
    </View>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealCard({
  bargain,
  onAccept,
  onCounter,
  onReject,
}: {
  bargain: FixtureBargain;
  onAccept: () => void;
  onCounter: () => void;
  onReject: () => void;
}) {
  const discountPct = Math.round(((bargain.currentPrice - bargain.customerOffer) / bargain.currentPrice) * 100);
  return (
    <View style={bStyles.dealCard}>
      {/* Top row */}
      <View style={bStyles.dealTopRow}>
        <View style={bStyles.dealEmoji}>
          <Text style={{ fontSize: 28 }}>{bargain.productEmoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={bStyles.dealProduct} numberOfLines={1}>{bargain.productName}</Text>
          <Text style={bStyles.dealCustomer}>{bargain.customerName}</Text>
        </View>
        <CountdownBadge seconds={bargain.expirationTime} size="sm" />
      </View>

      {/* Price row */}
      <View style={bStyles.priceRow}>
        <Text style={bStyles.originalPrice}>₹{bargain.currentPrice}</Text>
        <Text style={bStyles.offerPrice}>₹{bargain.customerOffer}</Text>
        <View style={bStyles.discountPill}>
          <Text style={bStyles.discountText}>-{discountPct}%</Text>
        </View>
      </View>

      {/* Probability bar */}
      <ProbabilityBar value={bargain.dealProbability} />

      {/* Health + expiry */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <DealHealthTag health={bargain.dealHealth} />
        {bargain.isExpiringSoon && (
          <View style={bStyles.expiringBadge}>
            <Text style={bStyles.expiringText}>⚡ Expiring soon</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={bStyles.actionsRow}>
        <TouchableOpacity style={[bStyles.actionBtn, bStyles.actionAccept]} activeOpacity={0.8} onPress={onAccept}>
          <Text style={[bStyles.actionBtnText, { color: Colors.success }]}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[bStyles.actionBtn, bStyles.actionCounter]} activeOpacity={0.8} onPress={onCounter}>
          <Text style={[bStyles.actionBtnText, { color: '#FFFFFF' }]}>Counter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[bStyles.actionBtn, bStyles.actionReject]} activeOpacity={0.8} onPress={onReject}>
          <Text style={[bStyles.actionBtnText, { color: Colors.error }]}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default observer(function BargainingScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading,    setIsLoading]    = useState(true);
  const [bargains,     setBargains]     = useState<FixtureBargain[]>(INITIAL_BARGAINS);
  const [counterId,    setCounterId]    = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const pending  = bargains.filter((b) => b.status === 'Pending');
  const resolved = bargains.filter((b) => b.status !== 'Pending');

  const activeDeals      = pending.length;
  const potentialRevenue = pending.reduce((s, b) => s + b.customerOffer, 0);
  const closingRate      = bargains.length > 0 ? Math.round((bargains.filter((b) => b.status === 'Accepted').length / bargains.length) * 100) : 0;
  const expiringSoon     = pending.filter((b) => b.isExpiringSoon).length;
  const avgDiscount      = pending.length > 0 ? Math.round(pending.reduce((s, b) => s + ((b.currentPrice - b.customerOffer) / b.currentPrice) * 100, 0) / pending.length) : 0;
  const revenueAtRisk    = pending.reduce((s, b) => s + (b.currentPrice - b.customerOffer), 0);

  const counterBargain   = bargains.find((b) => b.id === counterId) ?? null;
  const suggestions      = counterBargain
    ? [0.3, 0.5, 0.75].map((t) => Math.round(counterBargain.customerOffer + (counterBargain.currentPrice - counterBargain.customerOffer) * t))
    : [];
  const suggestionLabels = ['Quick win', 'Balanced', 'Hold firm'];
  const expectedMargin   = counterBargain ? counterPrice - counterBargain.merchantCost : 0;
  const acceptancePct    = counterBargain
    ? Math.max(5, Math.min(95, Math.round(100 - ((counterPrice - counterBargain.customerOffer) / Math.max(1, counterBargain.currentPrice - counterBargain.customerOffer)) * 60)))
    : 0;

  const handleAccept = (id: string) => {
    setBargains((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Accepted' as BargainStatus } : b));
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject offer', 'Reject this bargain request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () =>
        setBargains((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Rejected' as BargainStatus } : b)) },
    ]);
  };

  const openCounter = (bargain: FixtureBargain) => {
    setCounterId(bargain.id);
    setCounterPrice(Math.round(bargain.customerOffer + (bargain.currentPrice - bargain.customerOffer) * 0.5));
  };

  const sendCounter = () => {
    if (!counterBargain) return;
    setBargains((prev) => prev.map((b) => b.id === counterBargain.id ? { ...b, status: 'Countered' as BargainStatus } : b));
    setCounterId(null);
  };

  if (isLoading) return <BargainSkeleton insetTop={insets.top} />;

  return (
    <AnimatedScreen style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* ── Orange Header ── */}
      <View style={[bStyles.header, { paddingTop: insets.top + 12 }]}>
        <View style={bStyles.headerTopRow}>
          <TouchableOpacity style={bStyles.headerBtn} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={bStyles.headerTitle}>Bargains</Text>
            <Text style={bStyles.headerSubtitle}>Live deal room</Text>
          </View>
          <View style={[bStyles.headerBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Zap size={18} color="#FEF08A" />
          </View>
        </View>

        {/* Hero stats grid */}
        <View style={bStyles.heroGrid}>
          {[
            { label: 'Active deals',      value: String(activeDeals),         color: '#FFFFFF' },
            { label: 'Potential revenue', value: `₹${potentialRevenue}`,      color: '#BBF7D0' },
            { label: 'Closing rate',      value: `${closingRate}%`,           color: '#FFFFFF' },
            { label: 'Expiring soon',     value: String(expiringSoon),        color: expiringSoon > 0 ? '#FCA5A5' : '#FFFFFF' },
          ].map((stat) => (
            <View key={stat.label} style={bStyles.heroStat}>
              <Text style={[bStyles.heroStatValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={bStyles.heroStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── White body ── */}
      <View style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>

          {/* Secondary stats row */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={bStyles.secondaryCard}>
              <View style={bStyles.secondaryIconWrap}>
                <TrendingUp size={16} color={Colors.primary} />
              </View>
              <Text style={bStyles.secondaryValue}>{avgDiscount}%</Text>
              <Text style={bStyles.secondaryLabel}>Avg. discount asked</Text>
            </View>
            <View style={bStyles.secondaryCard}>
              <View style={[bStyles.secondaryIconWrap, { backgroundColor: Colors.errorBg }]}>
                <TrendingUp size={16} color={Colors.error} />
              </View>
              <Text style={[bStyles.secondaryValue, { color: Colors.error }]}>₹{revenueAtRisk}</Text>
              <Text style={bStyles.secondaryLabel}>Revenue at risk</Text>
            </View>
          </View>

          {/* Live negotiations */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={bStyles.sectionTitle}>Live negotiations</Text>
            <View style={bStyles.sectionBadge}>
              <Text style={bStyles.sectionBadgeText}>{pending.length} open</Text>
            </View>
          </View>

          {pending.length === 0 ? (
            <View style={bStyles.emptyCard}>
              <MessageSquare size={28} color={Colors.textSecondary} />
              <Text style={bStyles.emptyTitle}>No live deals right now</Text>
              <Text style={bStyles.emptyText}>New bargain requests will appear here the moment a customer makes an offer.</Text>
            </View>
          ) : (
            pending.map((bargain) => (
              <DealCard
                key={bargain.id}
                bargain={bargain}
                onAccept={() => handleAccept(bargain.id)}
                onCounter={() => openCounter(bargain)}
                onReject={() => handleReject(bargain.id)}
              />
            ))
          )}

          {/* Recent activity */}
          <Text style={bStyles.sectionTitle}>Recent activity</Text>

          {resolved.length === 0 ? (
            <View style={bStyles.emptyCard}>
              <Clock3 size={28} color={Colors.textSecondary} />
              <Text style={bStyles.emptyTitle}>Nothing closed yet</Text>
              <Text style={bStyles.emptyText}>Accepted, rejected, and expired deals show up here.</Text>
            </View>
          ) : (
            resolved.map((bargain) => {
              const tone =
                bargain.status === 'Accepted'  ? { bg: Colors.successBg, fg: Colors.success, Icon: CheckCircle2, label: 'Deal closed'  } :
                bargain.status === 'Rejected'  ? { bg: Colors.errorBg,   fg: Colors.error,   Icon: XCircle,      label: 'Rejected'     } :
                bargain.status === 'Countered' ? { bg: Colors.infoBg,    fg: Colors.info,    Icon: MessageSquare, label: 'Counter sent' } :
                                                 { bg: Colors.surfaceElevated, fg: Colors.textSecondary, Icon: Clock3, label: 'Expired' };
              return (
                <View key={bargain.id} style={bStyles.resolvedCard}>
                  <View style={[bStyles.resolvedIcon, { backgroundColor: tone.bg }]}>
                    <tone.Icon size={18} color={tone.fg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={bStyles.resolvedProduct} numberOfLines={1}>{bargain.productEmoji} {bargain.productName}</Text>
                    <Text style={bStyles.resolvedMeta}>{bargain.customerName} · {tone.label}</Text>
                  </View>
                  <Text style={bStyles.resolvedPrice}>₹{bargain.customerOffer}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* ── Counter offer sheet ── */}
      <BottomSheet isVisible={counterId !== null} onClose={() => setCounterId(null)} title="Counter offer" height={0.65}>
        {counterBargain ? (
          <View style={styles.sheet}>
            <Text style={styles.sheetProduct}>{counterBargain.productEmoji} {counterBargain.productName}</Text>
            <Text style={styles.sheetSubtitle}>
              {counterBargain.customerName} offered ₹{counterBargain.customerOffer} · List price ₹{counterBargain.currentPrice}
            </Text>

            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Your counter price</Text>
              <Text style={styles.counterPrice}>₹{counterPrice}</Text>
              <View style={styles.counterActions}>
                <TouchableOpacity style={styles.stepButton} onPress={() => setCounterPrice((v) => Math.max(counterBargain.customerOffer, v - 5))}>
                  <Text style={styles.stepText}>− ₹5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.stepButton, styles.stepButtonActive]} onPress={() => setCounterPrice((v) => Math.min(counterBargain.currentPrice, v + 5))}>
                  <Text style={[styles.stepText, styles.stepTextActive]}>+ ₹5</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.chipsLabel}>Smart suggestions</Text>
            <View style={styles.chipsRow}>
              {suggestions.map((amount, i) => {
                const active = amount === counterPrice;
                return (
                  <TouchableOpacity key={amount} style={[styles.chip, active && styles.chipActive]} onPress={() => setCounterPrice(amount)}>
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>₹{amount}</Text>
                    <Text style={[styles.chipSub,   active && styles.chipSubActive]}>{suggestionLabels[i]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.previewRow}>
              <View style={[styles.previewCard, { backgroundColor: Colors.primaryLight, borderRadius: 12 }]}>
                <Text style={styles.previewValue}>₹{counterPrice}</Text>
                <Text style={styles.previewLabel}>Your price</Text>
              </View>
              <View style={[styles.previewCard, { backgroundColor: expectedMargin >= 0 ? Colors.successBg : Colors.errorBg, borderRadius: 12 }]}>
                <Text style={[styles.previewValue, { color: expectedMargin >= 0 ? Colors.success : Colors.error }]}>₹{expectedMargin}</Text>
                <Text style={styles.previewLabel}>Expected margin</Text>
              </View>
              <View style={[styles.previewCard, { backgroundColor: Colors.infoBg, borderRadius: 12 }]}>
                <Text style={styles.previewValue}>{acceptancePct}%</Text>
                <Text style={styles.previewLabel}>Acceptance odds</Text>
              </View>
            </View>

            <TouchableOpacity style={bStyles.sendCounterBtn} activeOpacity={0.85} onPress={sendCounter}>
              <Text style={bStyles.sendCounterText}>Send Counter Offer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </BottomSheet>
    </AnimatedScreen>
  );
});

// ─── Local Styles ─────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';
import { Shadows } from '../../theme/shadows';

const bStyles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle:    { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  heroGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10,
  },
  heroStat: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    gap: 2, alignItems: 'center',
  },
  heroStatValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  heroStatLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.75)', textAlign: 'center' },

  secondaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: Colors.borderLight,
    gap: 6,
    ...Shadows.soft,
  },
  secondaryIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  secondaryLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  sectionBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  sectionBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  dealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    gap: 12,
    ...Shadows.card,
  },
  dealTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dealEmoji: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  dealProduct:  { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  dealCustomer: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary, marginTop: 2 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  originalPrice: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'line-through' },
  offerPrice:    { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  discountPill:  { backgroundColor: Colors.errorBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  discountText:  { fontSize: 11, fontWeight: '800', color: Colors.error },

  expiringBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  expiringText:  { fontSize: 11, fontWeight: '700', color: '#B45309' },

  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  actionAccept:  { backgroundColor: Colors.successBg, borderColor: Colors.success },
  actionCounter: { backgroundColor: '#0F172A',         borderColor: '#0F172A'      },
  actionReject:  { backgroundColor: Colors.errorBg,   borderColor: Colors.error   },
  actionBtnText: { fontSize: 12, fontWeight: '800' },

  emptyCard: {
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 28, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  emptyText:  { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },

  resolvedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
    ...Shadows.soft,
  },
  resolvedIcon:    { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resolvedProduct: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  resolvedMeta:    { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  resolvedPrice:   { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },

  sendCounterBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
    ...Shadows.soft,
  },
  sendCounterText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
