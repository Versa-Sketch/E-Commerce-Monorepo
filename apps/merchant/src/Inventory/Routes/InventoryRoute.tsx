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
import { useStores } from '../../stores/RootStore';
import type { BatchStatus, StockSummaryItem, InventoryBatch, InventoryTransaction } from '../types/domain';
import { AddBatchModal } from '../Components/AddBatchModal';
import { AdjustStockModal } from '../Components/AdjustStockModal';
import styles from './styles';

type Segment = 'stock' | 'batches' | 'activity';
type StockFilter = 'all' | 'low' | 'out';

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

function activityMeta(type: string) {
  switch (type) {
    case 'RECEIVE':    return { Icon: ArrowUpCircle,   color: Colors.success, bg: Colors.successBg, label: 'Stock Received'    };
    case 'SALE':       return { Icon: ArrowDownCircle, color: Colors.info,    bg: Colors.infoBg,    label: 'Sale'              };
    case 'ADJUSTMENT': return { Icon: SlidersHorizontal,color: Colors.warning, bg: Colors.warningBg, label: 'Manual Adjustment' };
    default:           return { Icon: ArrowUpCircle,   color: Colors.info,    bg: Colors.infoBg,    label: type                };
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

function StockCard({ item, expanded, onToggle }: { item: StockSummaryItem; expanded: boolean; onToggle: () => void }) {
  const available = Number(item.available_stock) || 0;
  const reserved = Number(item.reserved_stock) || 0;
  const h = stockHealth(available);
  const ratio = Math.min(100, available > 0 ? Math.round((available / (available + reserved + 10)) * 100) : 0);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={invStyles.stockCard}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={[invStyles.healthDot, { backgroundColor: h.dot, marginTop: 5 }]} />
        <View style={{ flex: 1 }}>
          <Text style={invStyles.stockProduct}>{item.product_name}</Text>
          <Text style={invStyles.stockVariant}>{item.variant_name} · {item.unit_symbol}</Text>
        </View>
        {expanded ? <ChevronUp size={18} color={Colors.textMuted} /> : <ChevronDown size={18} color={Colors.textMuted} />}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={invStyles.metaChip}>
          <Text style={invStyles.metaChipLabel}>AVAILABLE</Text>
          <Text style={[invStyles.metaChipValue, { color: h.color }]}>{available}</Text>
        </View>
        <View style={invStyles.metaChip}>
          <Text style={invStyles.metaChipLabel}>RESERVED</Text>
          <Text style={invStyles.metaChipValue}>{reserved}</Text>
        </View>
        <View style={[invStyles.metaChip, { flex: 1, backgroundColor: Colors.primaryLight }]}>
          <Text style={invStyles.metaChipLabel}>ACTION</Text>
          <Text style={[invStyles.metaChipValue, { color: Colors.primary, fontSize: 11 }]}>
            {available <= 0 ? 'Create batch now' : available <= 5 ? 'Plan reorder today' : 'Maintain stock'}
          </Text>
        </View>
      </View>

      <View style={invStyles.barTrack}>
        <View style={[invStyles.barFill, { width: `${ratio}%` as any, backgroundColor: h.color }]} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={invStyles.barLabel}>{available} available{reserved > 0 ? ` · ${reserved} reserved` : ''}</Text>
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
              <Text style={invStyles.metaChipValue}>{item.unit_symbol}</Text>
            </View>
            <View style={[invStyles.metaChip, { flex: 1 }]}>
              <Text style={invStyles.metaChipLabel}>TOTAL</Text>
              <Text style={invStyles.metaChipValue}>{available + reserved}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Batch Card ───────────────────────────────────────────────────────────────

function BatchCard({ batch, expanded, onToggle }: { batch: InventoryBatch; expanded: boolean; onToggle: () => void }) {
  const tone  = STATUS_COLOR[batch.status];
  const received = Number(batch.received_quantity) || 0;
  const available = Number(batch.available_quantity) || 0;
  const reserved = Number(batch.reserved_quantity) || 0;
  const ratio = received > 0 ? Math.round((available / received) * 100) : 0;
  const days  = daysUntil(batch.expiry_at);
  const exp   = days !== null ? expiryChip(days) : null;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={invStyles.batchCard}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={[invStyles.statusBadge, { backgroundColor: tone.bg }]}>
          <Text style={[invStyles.statusBadgeText, { color: tone.color }]}>{batch.status}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={invStyles.batchProduct} numberOfLines={1}>{batch.variant_name}</Text>
          <Text style={invStyles.batchNumber}>Batch {batch.batch_number ?? '—'}</Text>
        </View>
        {expanded ? <ChevronUp size={18} color={Colors.textMuted} /> : <ChevronDown size={18} color={Colors.textMuted} />}
      </View>

      <View style={invStyles.barTrack}>
        <View style={[invStyles.barFill, { width: `${ratio}%` as any, backgroundColor: tone.color }]} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <Text style={invStyles.barLabel}>{available} / {received} available</Text>
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
              ['RESERVED', String(reserved)],
              ['PURCHASE PRICE', `₹${batch.purchase_price}`],
              ['SELLING PRICE', batch.selling_price ? `₹${batch.selling_price}` : '—'],
              ['RECEIVED', batch.received_at],
              ['EXPIRY', batch.expiry_at ?? '—'],
              ['MANUFACTURED', batch.manufactured_at ?? '—'],
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

function ActivityRow({ item }: { item: InventoryTransaction }) {
  const meta = activityMeta(item.transaction_type);
  const time = new Date(item.created_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const qty = Number(item.quantity) || 0;
  return (
    <View style={invStyles.activityCard}>
      <View style={[invStyles.activityIcon, { backgroundColor: meta.bg }]}>
        <meta.Icon size={18} color={meta.color} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={invStyles.activityTitle}>{meta.label}</Text>
        <Text style={invStyles.activityMeta} numberOfLines={1}>{item.reference_id ?? 'Transaction'}</Text>
        {item.note && <Text style={invStyles.activityNote}>"{item.note}"</Text>}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[invStyles.activityQty, { color: qty > 0 ? Colors.success : Colors.error }]}>
          {qty > 0 ? '+' : ''}{qty}
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
  const { inventoryStore } = useStores();

  const [segment,            setSegment]            = useState<Segment>('stock');
  const [searchQuery,        setSearchQuery]        = useState('');
  const [stockFilter,        setStockFilter]        = useState<StockFilter>('all');
  const [statusFilter,       setStatusFilter]       = useState<BatchStatus | 'all'>('all');
  const [activityFilter,     setActivityFilter]     = useState<string>('all');
  const [expandedId,         setExpandedId]         = useState<string | null>(null);
  const [dialOpen,           setDialOpen]           = useState(false);
  const [showAddBatchModal,  setShowAddBatchModal]  = useState(false);
  const [showAdjustModal,    setShowAdjustModal]    = useState(false);

  useEffect(() => {
    inventoryStore.fetchStock();
    inventoryStore.fetchBatches();
    inventoryStore.fetchTransactions();
  }, []);

  // Derived lists
  const filteredStock = inventoryStore.stock.filter((s: StockSummaryItem) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || s.product_name.toLowerCase().includes(q) || s.variant_name.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    const avail = Number(s.available_stock) || 0;
    if (stockFilter === 'low') return avail > 0 && avail <= 5;
    if (stockFilter === 'out') return avail <= 0;
    return true;
  });

  const filteredBatches = inventoryStore.batches.filter((b: InventoryBatch) =>
    statusFilter === 'all' || b.status === statusFilter,
  );

  const filteredActivity = inventoryStore.sortedTransactions.filter((a: InventoryTransaction) =>
    activityFilter === 'all' || a.transaction_type === activityFilter,
  );

  const groupedActivity = filteredActivity.reduce<{ label: string; items: InventoryTransaction[] }[]>((acc: { label: string; items: InventoryTransaction[] }[], txn: InventoryTransaction) => {
    const label = dayLabel(txn.created_at);
    const last  = acc[acc.length - 1];
    if (last && last.label === label) { last.items.push(txn); } else { acc.push({ label, items: [txn] }); }
    return acc;
  }, []);

  const lowCount      = inventoryStore.lowStockItems.length;
  const outCount      = inventoryStore.outOfStockItems.length;
  const expiringCount = inventoryStore.batches.filter((b: InventoryBatch) => { const d = daysUntil(b.expiry_at); return b.status === 'ACTIVE' && d !== null && d <= 3; }).length;

  const isLoading = inventoryStore.stockState === 'loading' || inventoryStore.batchesState === 'loading' || inventoryStore.transactionsState === 'loading';

  if (isLoading) return <InventorySkeleton insetTop={insets.top} />;

  return (
    <AnimatedScreen style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* ── Orange Header ── */}
      <View style={[invStyles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ width: 36 }} />
          <Text style={invStyles.headerTitle}>Inventory</Text>
          <TouchableOpacity style={invStyles.headerBtn} activeOpacity={0.8} onPress={() => setShowAddBatchModal(true)}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* KPI strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
          {[
            { label: 'Total SKUs',     value: String(inventoryStore.stock.length), color: '#FFFFFF' },
            { label: 'Low Stock',      value: String(lowCount),                    color: '#FEF08A' },
            { label: 'Out of Stock',   value: String(outCount),                    color: '#FCA5A5' },
            { label: 'Expiring ≤3d',   value: String(expiringCount),               color: '#FED7AA' },
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
            ) : filteredStock.map((s: StockSummaryItem) => (
              <StockCard key={s.variant_id} item={s} expanded={expandedId === s.variant_id} onToggle={() => setExpandedId(expandedId === s.variant_id ? null : s.variant_id)} />
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
            {filteredBatches.map((b: InventoryBatch) => (
              <BatchCard key={b.id} batch={b} expanded={expandedId === b.id} onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)} />
            ))}
          </ScrollView>
        )}

        {/* ── ACTIVITY ── */}
        {segment === 'activity' && (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {([['all','All'], ['RECEIVE','Receipts'], ['SALE','Sales'], ['ADJUSTMENT','Adjustments']]).map(([k, l]) => (
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
            ) : groupedActivity.map((group: { label: string; items: InventoryTransaction[] }) => (
              <View key={group.label} style={{ gap: 10 }}>
                <Text style={invStyles.dayHeader}>{group.label}</Text>
                {group.items.map((txn: InventoryTransaction) => <ActivityRow key={txn.id} item={txn} />)}
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
              { label: 'Adjust Stock', action: () => { setShowAdjustModal(true); setDialOpen(false); }, Icon: SlidersHorizontal },
              { label: 'New Batch',    action: () => { setShowAddBatchModal(true); setDialOpen(false); }, Icon: PlusCircle        },
            ].map(({ label, action, Icon }) => (
              <TouchableOpacity key={label} style={styles.speedDialItem} activeOpacity={0.85} onPress={action}>
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

      <AddBatchModal
        visible={showAddBatchModal}
        onClose={() => setShowAddBatchModal(false)}
        onSuccess={(msg) => {
          setShowAddBatchModal(false);
          // Could add toast notification here
        }}
      />

      <AdjustStockModal
        visible={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSuccess={(msg) => {
          setShowAdjustModal(false);
          // Could add toast notification here
        }}
      />
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
