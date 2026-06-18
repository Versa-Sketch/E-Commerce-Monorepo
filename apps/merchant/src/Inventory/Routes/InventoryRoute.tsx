import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Layers,
  Plus,
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { Colors } from '../../theme/colors';
import styles from './styles';

// ─── Fixture Data ─────────────────────────────────────────────────────────────

type BatchStatus = 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'RECALLED';
type ActivityType = 'RECEIVE' | 'SALE' | 'ADJUSTMENT';
type Segment = 'stock' | 'batches' | 'activity';
type StockFilter = 'all' | 'low' | 'out';

interface FixtureBatch {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  batchNumber: string;
  receivedQty: number;
  availableQty: number;
  reservedQty: number;
  purchasePrice: number;
  sellingPrice: number;
  receivedAt: string;
  expiryAt: string | null;
  manufacturedAt: string | null;
  status: BatchStatus;
}

interface FixtureStock {
  variantId: string;
  productName: string;
  variantName: string;
  unit: string;
  available: number;
  reserved: number;
}

interface FixtureActivity {
  id: string;
  batchId: string;
  productName: string;
  type: ActivityType;
  quantity: number;
  note: string | null;
  createdAt: string;
}

const FIXTURE_STOCK: FixtureStock[] = [
  { variantId: 'v1', productName: 'Organic Tomatoes',    variantName: '500g Pack',     unit: 'pcs', available: 142, reserved: 18 },
  { variantId: 'v2', productName: 'Alphonso Mangoes',    variantName: '1 Dozen',       unit: 'box', available: 4,   reserved: 2  },
  { variantId: 'v3', productName: 'Fresh Spinach',       variantName: '250g Bundle',   unit: 'pcs', available: 0,   reserved: 0  },
  { variantId: 'v4', productName: 'Basmati Rice',        variantName: '1kg Bag',       unit: 'kg',  available: 88,  reserved: 10 },
  { variantId: 'v5', productName: 'Dragon Fruit',        variantName: '2 pcs Pack',    unit: 'pcs', available: 3,   reserved: 1  },
  { variantId: 'v6', productName: 'Avocado',             variantName: '2 pcs',         unit: 'pcs', available: 22,  reserved: 4  },
  { variantId: 'v7', productName: 'Baby Carrots',        variantName: '500g',          unit: 'kg',  available: 0,   reserved: 0  },
  { variantId: 'v8', productName: 'Seasonal Fruit Box',  variantName: 'Assorted 2kg',  unit: 'box', available: 55,  reserved: 6  },
];

const FIXTURE_BATCHES: FixtureBatch[] = [
  { id: 'b1', variantId: 'v1', productName: 'Organic Tomatoes',   variantName: '500g Pack',   batchNumber: 'BT-0241', receivedQty: 200, availableQty: 142, reservedQty: 18, purchasePrice: 35,  sellingPrice: 60,  receivedAt: '2026-06-14', expiryAt: '2026-06-22', manufacturedAt: '2026-06-12', status: 'ACTIVE'   },
  { id: 'b2', variantId: 'v2', productName: 'Alphonso Mangoes',   variantName: '1 Dozen',     batchNumber: 'BT-0238', receivedQty: 30,  availableQty: 4,   reservedQty: 2,  purchasePrice: 350, sellingPrice: 480, receivedAt: '2026-06-12', expiryAt: '2026-06-19', manufacturedAt: null,         status: 'ACTIVE'   },
  { id: 'b3', variantId: 'v3', productName: 'Fresh Spinach',      variantName: '250g Bundle', batchNumber: 'BT-0229', receivedQty: 80,  availableQty: 0,   reservedQty: 0,  purchasePrice: 20,  sellingPrice: 45,  receivedAt: '2026-06-10', expiryAt: '2026-06-17', manufacturedAt: null,         status: 'EXHAUSTED'},
  { id: 'b4', variantId: 'v4', productName: 'Basmati Rice',       variantName: '1kg Bag',     batchNumber: 'BT-0225', receivedQty: 100, availableQty: 88,  reservedQty: 10, purchasePrice: 90,  sellingPrice: 120, receivedAt: '2026-06-08', expiryAt: null,          manufacturedAt: '2026-05-01', status: 'ACTIVE'   },
  { id: 'b5', variantId: 'v5', productName: 'Dragon Fruit',       variantName: '2 pcs Pack',  batchNumber: 'BT-0218', receivedQty: 40,  availableQty: 3,   reservedQty: 1,  purchasePrice: 150, sellingPrice: 200, receivedAt: '2026-06-05', expiryAt: '2026-06-20', manufacturedAt: null,         status: 'ACTIVE'   },
  { id: 'b6', variantId: 'v6', productName: 'Avocado',            variantName: '2 pcs',       batchNumber: 'BT-0210', receivedQty: 50,  availableQty: 22,  reservedQty: 4,  purchasePrice: 200, sellingPrice: 280, receivedAt: '2026-06-01', expiryAt: '2026-06-24', manufacturedAt: null,         status: 'ACTIVE'   },
  { id: 'b7', variantId: 'v7', productName: 'Baby Carrots',       variantName: '500g',        batchNumber: 'BT-0205', receivedQty: 60,  availableQty: 0,   reservedQty: 0,  purchasePrice: 50,  sellingPrice: 75,  receivedAt: '2026-06-01', expiryAt: '2026-06-16', manufacturedAt: null,         status: 'EXPIRED'  },
  { id: 'b8', variantId: 'v8', productName: 'Seasonal Fruit Box', variantName: 'Assorted 2kg',batchNumber: 'BT-0198', receivedQty: 80,  availableQty: 55,  reservedQty: 6,  purchasePrice: 300, sellingPrice: 450, receivedAt: '2026-05-28', expiryAt: null,          manufacturedAt: null,         status: 'ACTIVE'   },
];

const FIXTURE_ACTIVITY: FixtureActivity[] = [
  { id: 'a1', batchId: 'b1', productName: 'Organic Tomatoes · BT-0241',   type: 'SALE',       quantity: -4,  note: null,                  createdAt: '2026-06-17T10:32:00' },
  { id: 'a2', batchId: 'b2', productName: 'Alphonso Mangoes · BT-0238',   type: 'SALE',       quantity: -1,  note: null,                  createdAt: '2026-06-17T10:18:00' },
  { id: 'a3', batchId: 'b4', productName: 'Basmati Rice · BT-0225',       type: 'ADJUSTMENT', quantity: +5,  note: 'Stock count recheck', createdAt: '2026-06-17T09:45:00' },
  { id: 'a4', batchId: 'b6', productName: 'Avocado · BT-0210',            type: 'SALE',       quantity: -2,  note: null,                  createdAt: '2026-06-17T08:50:00' },
  { id: 'a5', batchId: 'b8', productName: 'Seasonal Fruit Box · BT-0198', type: 'RECEIVE',    quantity: +80, note: 'New stock arrival',    createdAt: '2026-06-16T16:20:00' },
  { id: 'a6', batchId: 'b1', productName: 'Organic Tomatoes · BT-0241',   type: 'RECEIVE',    quantity: +200,note: 'Fresh batch received', createdAt: '2026-06-16T14:00:00' },
  { id: 'a7', batchId: 'b5', productName: 'Dragon Fruit · BT-0218',       type: 'ADJUSTMENT', quantity: -2,  note: 'Spoilage removed',    createdAt: '2026-06-16T11:30:00' },
  { id: 'a8', batchId: 'b3', productName: 'Fresh Spinach · BT-0229',      type: 'SALE',       quantity: -10, note: null,                  createdAt: '2026-06-15T17:05:00' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stockHealth(available: number) {
  if (available <= 0)  return { color: Colors.error,   bg: Colors.errorBg,   label: 'Out of stock',  dot: Colors.error,   tone: 'out'  as const };
  if (available <= 5)  return { color: Colors.warning, bg: Colors.warningBg, label: 'Reorder soon',  dot: Colors.warning, tone: 'low'  as const };
  return               { color: Colors.success,        bg: Colors.successBg, label: 'Healthy stock', dot: Colors.success, tone: 'ok'   as const };
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const exp   = new Date(dateStr); exp.setHours(0,0,0,0);
  return Math.round((exp.getTime() - today.getTime()) / 86400000);
}

function expiryChip(days: number): { label: string; bg: string; color: string } {
  if (days < 0)  return { label: 'Expired',          bg: Colors.errorBg,   color: Colors.error   };
  if (days === 0) return { label: 'Expires today',    bg: Colors.errorBg,   color: Colors.error   };
  if (days <= 3)  return { label: `Expires in ${days}d`, bg: Colors.errorBg,   color: Colors.error   };
  if (days <= 7)  return { label: `Expires in ${days}d`, bg: Colors.warningBg, color: '#B45309'     };
  return                 { label: `Expires in ${days}d`, bg: Colors.successBg, color: Colors.success };
}

function activityMeta(type: ActivityType) {
  switch (type) {
    case 'RECEIVE':    return { Icon: ArrowUpCircle,   color: Colors.success, bg: Colors.successBg, label: 'Stock Received'    };
    case 'SALE':       return { Icon: ArrowDownCircle, color: Colors.info,    bg: Colors.infoBg,    label: 'Sale'              };
    case 'ADJUSTMENT': return { Icon: SlidersHorizontal,color: Colors.warning, bg: Colors.warningBg, label: 'Manual Adjustment' };
  }
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const STATUS_COLOR: Record<BatchStatus, { color: string; bg: string }> = {
  ACTIVE:    { color: Colors.success,       bg: Colors.successBg },
  EXPIRED:   { color: Colors.error,         bg: Colors.errorBg   },
  EXHAUSTED: { color: Colors.textSecondary, bg: Colors.background },
  RECALLED:  { color: Colors.warning,       bg: Colors.warningBg },
};

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

function InventorySkeleton({ insetTop }: { insetTop: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <View style={{ backgroundColor: Colors.primary, paddingTop: insetTop + 12, paddingHorizontal: 16, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={110} height={22} borderRadius={6} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[0,1,2,3].map((i) => <SkeletonBox key={i} width={90} height={72} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />)}
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 12 }}>
        <SkeletonBox height={44} borderRadius={14} />
        {[0,1,2,3].map((i) => <SkeletonBox key={i} height={90} borderRadius={16} />)}
      </View>
    </View>
  );
}

// ─── Stock Card ───────────────────────────────────────────────────────────────

function StockCard({ item, expanded, onToggle }: { item: FixtureStock; expanded: boolean; onToggle: () => void }) {
  const h = stockHealth(item.available);
  const ratio = Math.min(100, item.available > 0 ? Math.round((item.available / (item.available + item.reserved + 10)) * 100) : 0);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={invStyles.stockCard}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={[invStyles.healthDot, { backgroundColor: h.dot, marginTop: 5 }]} />
        <View style={{ flex: 1 }}>
          <Text style={invStyles.stockProduct}>{item.productName}</Text>
          <Text style={invStyles.stockVariant}>{item.variantName} · {item.unit}</Text>
        </View>
        {expanded ? <ChevronUp size={18} color={Colors.textMuted} /> : <ChevronDown size={18} color={Colors.textMuted} />}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={invStyles.metaChip}>
          <Text style={invStyles.metaChipLabel}>AVAILABLE</Text>
          <Text style={[invStyles.metaChipValue, { color: h.color }]}>{item.available}</Text>
        </View>
        <View style={invStyles.metaChip}>
          <Text style={invStyles.metaChipLabel}>RESERVED</Text>
          <Text style={invStyles.metaChipValue}>{item.reserved}</Text>
        </View>
        <View style={[invStyles.metaChip, { flex: 1, backgroundColor: Colors.primaryLight }]}>
          <Text style={invStyles.metaChipLabel}>ACTION</Text>
          <Text style={[invStyles.metaChipValue, { color: Colors.primary, fontSize: 11 }]}>
            {item.available <= 0 ? 'Create batch now' : item.available <= 5 ? 'Plan reorder today' : 'Maintain stock'}
          </Text>
        </View>
      </View>

      <View style={invStyles.barTrack}>
        <View style={[invStyles.barFill, { width: `${ratio}%` as any, backgroundColor: h.color }]} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={invStyles.barLabel}>{item.available} available{item.reserved > 0 ? ` · ${item.reserved} reserved` : ''}</Text>
        {h.tone !== 'ok' && (
          <View style={[invStyles.healthBadge, { backgroundColor: h.bg }]}>
            <Text style={[invStyles.healthBadgeText, { color: h.color }]}>{h.label}</Text>
          </View>
        )}
      </View>

      {expanded && (
        <View style={invStyles.expandedBlock}>
          <Text style={invStyles.expandedLabel}>STOCK DETAILS</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={[invStyles.metaChip, { flex: 1 }]}>
              <Text style={invStyles.metaChipLabel}>UNIT</Text>
              <Text style={invStyles.metaChipValue}>{item.unit}</Text>
            </View>
            <View style={[invStyles.metaChip, { flex: 1 }]}>
              <Text style={invStyles.metaChipLabel}>TOTAL</Text>
              <Text style={invStyles.metaChipValue}>{item.available + item.reserved}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Batch Card ───────────────────────────────────────────────────────────────

function BatchCard({ batch, expanded, onToggle }: { batch: FixtureBatch; expanded: boolean; onToggle: () => void }) {
  const tone  = STATUS_COLOR[batch.status];
  const ratio = batch.receivedQty > 0 ? Math.round((batch.availableQty / batch.receivedQty) * 100) : 0;
  const days  = daysUntil(batch.expiryAt);
  const exp   = days !== null ? expiryChip(days) : null;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={invStyles.batchCard}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={[invStyles.statusBadge, { backgroundColor: tone.bg }]}>
          <Text style={[invStyles.statusBadgeText, { color: tone.color }]}>{batch.status}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={invStyles.batchProduct}>{batch.productName}</Text>
          <Text style={invStyles.batchNumber}>Batch {batch.batchNumber} · {batch.variantName}</Text>
        </View>
        {expanded ? <ChevronUp size={18} color={Colors.textMuted} /> : <ChevronDown size={18} color={Colors.textMuted} />}
      </View>

      <View style={invStyles.barTrack}>
        <View style={[invStyles.barFill, { width: `${ratio}%` as any, backgroundColor: tone.color }]} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <Text style={invStyles.barLabel}>{batch.availableQty} / {batch.receivedQty} available</Text>
        {exp && (
          <View style={[invStyles.healthBadge, { backgroundColor: exp.bg }]}>
            <Text style={[invStyles.healthBadgeText, { color: exp.color }]}>{exp.label}</Text>
          </View>
        )}
      </View>

      {expanded && (
        <View style={invStyles.expandedBlock}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
            {[
              ['RESERVED', String(batch.reservedQty)],
              ['PURCHASE PRICE', `₹${batch.purchasePrice}`],
              ['SELLING PRICE', `₹${batch.sellingPrice}`],
              ['RECEIVED', batch.receivedAt],
              ['EXPIRY', batch.expiryAt ?? '—'],
              ['MANUFACTURED', batch.manufacturedAt ?? '—'],
            ].map(([label, value]) => (
              <View key={label} style={{ width: '50%' }}>
                <Text style={invStyles.metaChipLabel}>{label}</Text>
                <Text style={invStyles.metaChipValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({ item }: { item: FixtureActivity }) {
  const meta = activityMeta(item.type);
  const time = new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  return (
    <View style={invStyles.activityCard}>
      <View style={[invStyles.activityIcon, { backgroundColor: meta.bg }]}>
        <meta.Icon size={18} color={meta.color} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={invStyles.activityTitle}>{meta.label}</Text>
        <Text style={invStyles.activityMeta} numberOfLines={1}>{item.productName}</Text>
        {item.note && <Text style={invStyles.activityNote}>{item.note}</Text>}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[invStyles.activityQty, { color: item.quantity > 0 ? Colors.success : Colors.error }]}>
          {item.quantity > 0 ? '+' : ''}{item.quantity}
        </Text>
        <Text style={invStyles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: 'stock',    label: 'Overview'  },
  { key: 'batches',  label: 'Batches'   },
  { key: 'activity', label: 'Activity'  },
];

export default observer(function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading,      setIsLoading]      = useState(true);
  const [segment,        setSegment]        = useState<Segment>('stock');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [stockFilter,    setStockFilter]    = useState<StockFilter>('all');
  const [statusFilter,   setStatusFilter]   = useState<BatchStatus | 'all'>('all');
  const [activityFilter, setActivityFilter] = useState<ActivityType | 'all'>('all');
  const [expandedId,     setExpandedId]     = useState<string | null>(null);
  const [dialOpen,       setDialOpen]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Derived lists
  const filteredStock = FIXTURE_STOCK.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || s.productName.toLowerCase().includes(q) || s.variantName.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (stockFilter === 'low') return s.available > 0 && s.available <= 5;
    if (stockFilter === 'out') return s.available <= 0;
    return true;
  });

  const filteredBatches = FIXTURE_BATCHES.filter((b) =>
    statusFilter === 'all' || b.status === statusFilter,
  );

  const filteredActivity = FIXTURE_ACTIVITY.filter((a) =>
    activityFilter === 'all' || a.type === activityFilter,
  );

  const groupedActivity = filteredActivity.reduce<{ label: string; items: FixtureActivity[] }[]>((acc, txn) => {
    const label = dayLabel(txn.createdAt);
    const last  = acc[acc.length - 1];
    if (last && last.label === label) { last.items.push(txn); } else { acc.push({ label, items: [txn] }); }
    return acc;
  }, []);

  const lowCount      = FIXTURE_STOCK.filter((s) => s.available > 0 && s.available <= 5).length;
  const outCount      = FIXTURE_STOCK.filter((s) => s.available <= 0).length;
  const expiringCount = FIXTURE_BATCHES.filter((b) => { const d = daysUntil(b.expiryAt); return b.status === 'ACTIVE' && d !== null && d <= 3; }).length;

  if (isLoading) return <InventorySkeleton insetTop={insets.top} />;

  return (
    <AnimatedScreen style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* ── Orange Header ── */}
      <View style={[invStyles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          {/* <TouchableOpacity style={invStyles.headerBtn} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity> */}
          <Text style={invStyles.headerTitle}>Inventory</Text>
          <TouchableOpacity style={invStyles.headerBtn} activeOpacity={0.8}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* KPI strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
          {[
            { label: 'Total SKUs',     value: String(FIXTURE_STOCK.length), color: '#FFFFFF' },
            { label: 'Low Stock',      value: String(lowCount),             color: '#FEF08A' },
            { label: 'Out of Stock',   value: String(outCount),             color: '#FCA5A5' },
            { label: 'Expiring ≤3d',   value: String(expiringCount),        color: '#FED7AA' },
          ].map((kpi) => (
            <View key={kpi.label} style={invStyles.kpiCard}>
              <Text style={[invStyles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              <Text style={invStyles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── White body ── */}
      <View style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -1 }}>
        {/* Segment tabs */}
        <View style={invStyles.segmentRow}>
          {SEGMENTS.map((seg) => (
            <TouchableOpacity
              key={seg.key}
              style={[invStyles.segment, segment === seg.key && invStyles.segmentActive]}
              onPress={() => { setSegment(seg.key); setExpandedId(null); }}
              activeOpacity={0.8}
            >
              <Text style={[invStyles.segmentText, segment === seg.key && invStyles.segmentTextActive]}>{seg.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── STOCK OVERVIEW ── */}
        {segment === 'stock' && (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>
            {/* Filter pills */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([['all','All'], ['low','Low Stock'], ['out','Out of Stock']] as const).map(([k, l]) => (
                <TouchableOpacity key={k} onPress={() => setStockFilter(k)} activeOpacity={0.8}
                  style={[invStyles.filterPill, stockFilter === k && invStyles.filterPillActive]}>
                  <Text style={[invStyles.filterPillText, stockFilter === k && invStyles.filterPillTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search */}
            <View style={invStyles.searchBox}>
              <Search size={15} color={Colors.textMuted} />
              <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search products, variants…"
                placeholderTextColor={Colors.textMuted} style={{ flex: 1, fontSize: 13, color: Colors.textPrimary, paddingVertical: 0 }} />
              {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><X size={14} color={Colors.textMuted} /></TouchableOpacity> : null}
            </View>

            {filteredStock.length === 0 ? (
              <View style={invStyles.emptyWrap}>
                <Boxes size={32} color={Colors.primary} strokeWidth={1.5} />
                <Text style={invStyles.emptyTitle}>No matching variants</Text>
                <Text style={invStyles.emptySubtitle}>Try a different search or filter.</Text>
              </View>
            ) : filteredStock.map((s) => (
              <StockCard key={s.variantId} item={s} expanded={expandedId === s.variantId} onToggle={() => setExpandedId(expandedId === s.variantId ? null : s.variantId)} />
            ))}
          </ScrollView>
        )}

        {/* ── BATCHES ── */}
        {segment === 'batches' && (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {(['all', 'ACTIVE', 'EXPIRED', 'EXHAUSTED', 'RECALLED'] as const).map((s) => (
                <TouchableOpacity key={s} onPress={() => setStatusFilter(s)} activeOpacity={0.8}
                  style={[invStyles.filterPill, statusFilter === s && invStyles.filterPillActive]}>
                  <Text style={[invStyles.filterPillText, statusFilter === s && invStyles.filterPillTextActive]}>{s === 'all' ? 'All' : s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {filteredBatches.map((b) => (
              <BatchCard key={b.id} batch={b} expanded={expandedId === b.id} onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)} />
            ))}
          </ScrollView>
        )}

        {/* ── ACTIVITY ── */}
        {segment === 'activity' && (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {([['all','All'], ['RECEIVE','Receipts'], ['SALE','Sales'], ['ADJUSTMENT','Adjustments']] as const).map(([k, l]) => (
                <TouchableOpacity key={k} onPress={() => setActivityFilter(k)} activeOpacity={0.8}
                  style={[invStyles.filterPill, activityFilter === k && invStyles.filterPillActive]}>
                  <Text style={[invStyles.filterPillText, activityFilter === k && invStyles.filterPillTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {groupedActivity.length === 0 ? (
              <View style={invStyles.emptyWrap}>
                <Layers size={32} color={Colors.primary} strokeWidth={1.5} />
                <Text style={invStyles.emptyTitle}>No activity</Text>
                <Text style={invStyles.emptySubtitle}>Stock movements will appear here.</Text>
              </View>
            ) : groupedActivity.map((group) => (
              <View key={group.label} style={{ gap: 10 }}>
                <Text style={invStyles.dayHeader}>{group.label}</Text>
                {group.items.map((txn) => <ActivityRow key={txn.id} item={txn} />)}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* ── FAB speed dial ── */}
      {dialOpen && (
        <TouchableOpacity style={styles.speedDialOverlay} activeOpacity={1} onPress={() => setDialOpen(false)}>
          <View style={{ position: 'absolute', right: 20, bottom: Math.max(insets.bottom, 8) + 160, gap: 10, alignItems: 'flex-end' }}>
            {[
              { label: 'Adjust Stock', Icon: SlidersHorizontal },
              { label: 'New Batch',    Icon: PlusCircle        },
            ].map(({ label, Icon }) => (
              <TouchableOpacity key={label} style={styles.speedDialItem} activeOpacity={0.85} onPress={() => setDialOpen(false)}>
                <Text style={styles.speedDialLabel}>{label}</Text>
                <View style={styles.speedDialIcon}><Icon size={16} color={Colors.primary} /></View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.fab, { right: 20, bottom: Math.max(insets.bottom, 8) + 88 }]}
        activeOpacity={0.85}
        onPress={() => setDialOpen((v) => !v)}
      >
        {dialOpen ? <X size={24} color={Colors.white} /> : <Plus size={24} color={Colors.white} />}
      </TouchableOpacity>
    </AnimatedScreen>
  );
});

// ─── Local Styles ─────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';
import { Shadows } from '../../theme/shadows';

const invStyles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  kpiCard: {
    minWidth: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14, padding: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  kpiValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 2 },
  kpiLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },

  segmentRow: {
    flexDirection: 'row',
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: Colors.borderLight,
    gap: 4,
  },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  segmentActive: { backgroundColor: Colors.primaryLight },
  segmentText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  segmentTextActive: { color: Colors.primary },

  filterPill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
  },
  filterPillActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  filterPillText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  filterPillTextActive: { color: Colors.primary },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingHorizontal: 12, height: 46, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.soft,
  },

  stockCard: {
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  stockProduct: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  stockVariant: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  healthDot: { width: 10, height: 10, borderRadius: 5 },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, overflow: 'hidden', marginTop: 12 },
  barFill:  { height: 4, borderRadius: 2 },
  barLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  healthBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  healthBadgeText: { fontSize: 10, fontWeight: '700' },

  metaChip: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 10, minWidth: 80,
  },
  metaChipLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.4 },
  metaChipValue: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },

  expandedBlock: {
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, gap: 8,
  },
  expandedLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.6 },

  batchCard: {
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: Colors.borderLight,
    ...Shadows.soft,
  },
  batchProduct: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  batchNumber:  { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  statusBadge:  { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },

  activityCard: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
    gap: 12, alignItems: 'flex-start',
    ...Shadows.soft,
  },
  activityIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  activityMeta:  { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  activityNote:  { fontSize: 11, color: Colors.textSecondary, marginTop: 3, fontStyle: 'italic' },
  activityQty:   { fontSize: 15, fontWeight: '800' },
  activityTime:  { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  dayHeader: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2,
  },

  emptyWrap: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
