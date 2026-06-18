import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  User,
  BarChart2,
  XCircle,
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
import { BottomSheet } from '../../Common/components/BottomSheet';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { Colors } from '../../theme/colors';
import styles from './styles';

// ─── Fixture Data ─────────────────────────────────────────────────────────────

const STATIC_DRIVERS = [
  { id: 'd1', name: 'Rajan Pillai',  phone: '+91 98400 11234', rating: 4.8 },
  { id: 'd2', name: 'Suresh Babu',   phone: '+91 98765 55678', rating: 4.6 },
  { id: 'd3', name: 'Anil Kumar',    phone: '+91 97890 33456', rating: 4.9 },
];

type OrderStatus = 'New Orders' | 'Accepted' | 'Packed' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
type FilterKey  = 'All' | 'New' | 'Active' | 'Completed' | 'Cancelled';

interface StaticOrder {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  amount: number;
  itemsCount: number;
  orderTime: string;
  paymentMethod: 'COD' | 'Online';
  deliveryPartnerId: string | null;
  items: { id: string; name: string; quantity: number; price: number }[];
  timeline: { status: string; time: string }[];
}

const STATIC_ORDERS: StaticOrder[] = [
  {
    id: 'ORD-8492', status: 'New Orders',
    customerName: 'Rahul Verma', customerPhone: '+91 98201 44321',
    deliveryAddress: '12A, MG Road, Koramangala, Bengaluru 560034',
    amount: 694, itemsCount: 4, orderTime: '10:32 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Organic Tomatoes (500g)', quantity: 2, price: 60 },
      { id: 'i2', name: 'Fresh Spinach (250g)',    quantity: 1, price: 45 },
      { id: 'i3', name: 'Basmati Rice (1kg)',       quantity: 1, price: 120 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:32 AM' }],
  },
  {
    id: 'ORD-8491', status: 'New Orders',
    customerName: 'Ananya Sen', customerPhone: '+91 77201 88765',
    deliveryAddress: '5, 1st Cross, HSR Layout Sector 3, Bengaluru 560102',
    amount: 1290, itemsCount: 5, orderTime: '10:18 AM', paymentMethod: 'COD', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Alphonso Mangoes (1 dozen)', quantity: 1, price: 480 },
      { id: 'i2', name: 'Fresh Pomegranate (500g)',   quantity: 2, price: 180 },
      { id: 'i3', name: 'Kiwi (4 pcs)',               quantity: 1, price: 160 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:18 AM' }],
  },
  {
    id: 'ORD-8490', status: 'New Orders',
    customerName: 'Karan Mehta', customerPhone: '+91 90123 45678',
    deliveryAddress: '7, Brigade Road, Bengaluru 560001',
    amount: 340, itemsCount: 2, orderTime: '10:05 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Mixed Greens Box',  quantity: 1, price: 200 },
      { id: 'i2', name: 'Coriander (100g)',  quantity: 2, price: 20 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:05 AM' }],
  },
  {
    id: 'ORD-8487', status: 'Accepted',
    customerName: 'Deepa Nair', customerPhone: '+91 90201 77654',
    deliveryAddress: '88, Indiranagar 100ft Road, Bengaluru 560038',
    amount: 870, itemsCount: 3, orderTime: '9:55 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Mixed Vegetables Box', quantity: 1, price: 350 },
      { id: 'i2', name: 'Coconut (1 pc)',        quantity: 2, price: 55 },
      { id: 'i3', name: 'Green Chillies (100g)', quantity: 1, price: 30 },
    ],
    timeline: [
      { status: 'Order Placed', time: '9:55 AM' },
      { status: 'Accepted by Store', time: '9:58 AM' },
    ],
  },
  {
    id: 'ORD-8480', status: 'Packed',
    customerName: 'Vikram Shetty', customerPhone: '+91 88201 22543',
    deliveryAddress: '34, JP Nagar 7th Phase, Bengaluru 560078',
    amount: 540, itemsCount: 2, orderTime: '9:20 AM', paymentMethod: 'Online', deliveryPartnerId: 'd1',
    items: [
      { id: 'i1', name: 'Dragon Fruit (2 pcs)',  quantity: 2, price: 200 },
      { id: 'i2', name: 'Fresh Herbs Bundle',    quantity: 1, price: 140 },
    ],
    timeline: [
      { status: 'Order Placed', time: '9:20 AM' },
      { status: 'Accepted by Store', time: '9:23 AM' },
      { status: 'Packed & Ready', time: '9:38 AM' },
    ],
  },
  {
    id: 'ORD-8473', status: 'Out For Delivery',
    customerName: 'Priya Sharma', customerPhone: '+91 96501 33210',
    deliveryAddress: '7, Whitefield Main Road, Bengaluru 560066',
    amount: 1150, itemsCount: 6, orderTime: '8:45 AM', paymentMethod: 'Online', deliveryPartnerId: 'd2',
    items: [
      { id: 'i1', name: 'Avocado (2 pcs)',      quantity: 2, price: 280 },
      { id: 'i2', name: 'Cherry Tomatoes (250g)', quantity: 1, price: 90 },
      { id: 'i3', name: 'Baby Carrots (500g)',  quantity: 1, price: 75 },
    ],
    timeline: [
      { status: 'Order Placed', time: '8:45 AM' },
      { status: 'Accepted by Store', time: '8:48 AM' },
      { status: 'Packed & Ready', time: '9:05 AM' },
      { status: 'Picked up by Suresh', time: '9:18 AM' },
    ],
  },
  {
    id: 'ORD-8462', status: 'Delivered',
    customerName: 'Suresh Kumar', customerPhone: '+91 91201 66543',
    deliveryAddress: '22, Marathahalli Bridge, Bengaluru 560037',
    amount: 380, itemsCount: 2, orderTime: '7:30 AM', paymentMethod: 'COD', deliveryPartnerId: 'd3',
    items: [
      { id: 'i1', name: 'Watermelon (1 pc)', quantity: 1, price: 280 },
      { id: 'i2', name: 'Lime (6 pcs)',       quantity: 1, price: 40 },
    ],
    timeline: [
      { status: 'Order Placed', time: '7:30 AM' },
      { status: 'Accepted by Store', time: '7:33 AM' },
      { status: 'Packed & Ready', time: '7:48 AM' },
      { status: 'Out for Delivery', time: '8:02 AM' },
      { status: 'Delivered ✓', time: '8:29 AM' },
    ],
  },
  {
    id: 'ORD-8455', status: 'Delivered',
    customerName: 'Meera Iyer', customerPhone: '+91 87601 99321',
    deliveryAddress: '10, Jayanagar 4th Block, Bengaluru 560011',
    amount: 730, itemsCount: 4, orderTime: '7:05 AM', paymentMethod: 'Online', deliveryPartnerId: 'd1',
    items: [
      { id: 'i1', name: 'Organic Banana (1 dozen)', quantity: 1, price: 80 },
      { id: 'i2', name: 'Papaya (1 kg)',            quantity: 1, price: 90 },
    ],
    timeline: [
      { status: 'Order Placed', time: '7:05 AM' },
      { status: 'Accepted by Store', time: '7:08 AM' },
      { status: 'Packed & Ready', time: '7:22 AM' },
      { status: 'Out for Delivery', time: '7:35 AM' },
      { status: 'Delivered ✓', time: '8:01 AM' },
    ],
  },
  {
    id: 'ORD-8449', status: 'Cancelled',
    customerName: 'Arjun Reddy', customerPhone: '+91 99801 55432',
    deliveryAddress: '3, Bannerghatta Road, Bengaluru 560076',
    amount: 450, itemsCount: 3, orderTime: '6:50 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [{ id: 'i1', name: 'Seasonal Fruit Box', quantity: 1, price: 450 }],
    timeline: [
      { status: 'Order Placed', time: '6:50 AM' },
      { status: 'Cancelled by Customer', time: '6:54 AM' },
    ],
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'All',       label: 'All' },
  { key: 'New',       label: 'New' },
  { key: 'Active',    label: 'Active' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Cancelled', label: 'Cancelled' },
];

function filterOrders(orders: StaticOrder[], filter: FilterKey): StaticOrder[] {
  switch (filter) {
    case 'New':       return orders.filter((o) => o.status === 'New Orders');
    case 'Active':    return orders.filter((o) => ['Accepted', 'Packed', 'Out For Delivery'].includes(o.status));
    case 'Completed': return orders.filter((o) => o.status === 'Delivered');
    case 'Cancelled': return orders.filter((o) => o.status === 'Cancelled');
    default:          return orders;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusTag(status: OrderStatus): { label: string; bgColor: string; textColor: string } {
  switch (status) {
    case 'New Orders':       return { label: 'NEW ORDER',  bgColor: Colors.primaryLight, textColor: Colors.primary };
    case 'Accepted':         return { label: 'ACCEPTED',   bgColor: '#DBEAFE',           textColor: '#1D4ED8' };
    case 'Packed':           return { label: 'PACKED',     bgColor: '#EDE9FE',           textColor: '#6D28D9' };
    case 'Out For Delivery': return { label: 'ON THE WAY', bgColor: '#FEF3C7',           textColor: '#B45309' };
    case 'Delivered':        return { label: 'DELIVERED',  bgColor: '#DCFCE7',           textColor: '#15803D' };
    default:                 return { label: 'CANCELLED',  bgColor: '#FEE2E2',           textColor: '#B91C1C' };
  }
}

function getProgressConfig(status: OrderStatus): { pct: number; label: string; color: string } | null {
  switch (status) {
    case 'Accepted':         return { pct: 33, label: 'Accepted · Packing now',      color: '#3B82F6' };
    case 'Packed':           return { pct: 66, label: 'Packed · Awaiting pickup',    color: '#8B5CF6' };
    case 'Out For Delivery': return { pct: 85, label: 'Out for delivery · En route', color: '#F59E0B' };
    default:                 return null;
  }
}

function getCardBorderColor(status: OrderStatus): string {
  switch (status) {
    case 'New Orders':       return Colors.primary;
    case 'Accepted':         return '#3B82F6';
    case 'Packed':           return '#8B5CF6';
    case 'Out For Delivery': return '#F59E0B';
    case 'Delivered':        return '#22C55E';
    default:                 return Colors.error;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBox({ width, height, borderRadius = 8, style }: {
  width?: number | string; height: number; borderRadius?: number; style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View style={[{ width: width ?? '100%', height, borderRadius, backgroundColor: '#E2E8F0', opacity }, style]} />
  );
}

function OrdersSkeleton({ insetTop }: { insetTop: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, paddingTop: insetTop + 12, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={90} height={22} borderRadius={6}  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>
        <SkeletonBox height={44} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      </View>
      {/* Pills + stats */}
      <View style={{ backgroundColor: '#FFF', paddingTop: 14, paddingBottom: 4, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {[64, 80, 76, 100, 85].map((w, i) => (
            <SkeletonBox key={i} width={w} height={34} borderRadius={20} />
          ))}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {[0,1,2,3].map((i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <SkeletonBox width={60} height={18} borderRadius={4} />
              <SkeletonBox width={50} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
      {/* Cards */}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderLeftColor: '#E2E8F0', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            <SkeletonBox width={80} height={18} borderRadius={6} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <SkeletonBox width={44} height={44} borderRadius={14} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBox width={140} height={14} borderRadius={4} />
                <SkeletonBox width={100} height={10} borderRadius={4} />
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <SkeletonBox width={60} height={16} borderRadius={4} />
                <SkeletonBox width={50} height={18} borderRadius={6} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <SkeletonBox width={80} height={28} borderRadius={12} />
              <SkeletonBox width={100} height={28} borderRadius={12} />
            </View>
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 }} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <SkeletonBox height={38} borderRadius={12} style={{ flex: 1 }} />
              <SkeletonBox height={38} borderRadius={12} style={{ flex: 1 }} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default observer(function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading,        setIsLoading]        = useState(true);
  const [activeFilter,     setActiveFilter]     = useState<FilterKey>('All');
  const [selectedOrderId,  setSelectedOrderId]  = useState<string | null>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [orders,           setOrders]           = useState<StaticOrder[]>(STATIC_ORDERS);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const displayed    = filterOrders(orders, activeFilter);
  const totalCount   = orders.length;
  const newCount     = orders.filter((o) => o.status === 'New Orders').length;
  const pendingCount = newCount;
  const totalRevenue = orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.amount, 0);
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const avgOrder     = deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0;

  const countForFilter = (key: FilterKey) => filterOrders(orders, key).length;
  const activeOrder    = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== id ? o : {
          ...o,
          status: 'Accepted' as OrderStatus,
          timeline: [...o.timeline, { status: 'Accepted by Store', time: nowTime() }],
        },
      ),
    );
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: () =>
          setOrders((prev) =>
            prev.map((o) => o.id !== id ? o : { ...o, status: 'Cancelled' as OrderStatus }),
          ),
      },
    ]);
  };

  const handleAdvance = (id: string, status: OrderStatus) => {
    const order = orders.find((o) => o.id === id);
    if (status === 'Packed' && !order?.deliveryPartnerId) {
      setAssigningOrderId(id);
      return;
    }
    const nextMap: Partial<Record<OrderStatus, OrderStatus>> = {
      'Accepted': 'Packed',
      'Packed': 'Out For Delivery',
      'Out For Delivery': 'Delivered',
    };
    const labelMap: Partial<Record<OrderStatus, string>> = {
      'Accepted': 'Packed & Ready',
      'Packed': 'Out for Delivery',
      'Out For Delivery': 'Delivered ✓',
    };
    const next = nextMap[status];
    if (!next) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== id ? o : {
          ...o,
          status: next,
          timeline: [...o.timeline, { status: labelMap[status]!, time: nowTime() }],
        },
      ),
    );
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId ? o : {
          ...o,
          deliveryPartnerId: driverId,
          status: 'Out For Delivery' as OrderStatus,
          timeline: [...o.timeline, { status: 'Out for Delivery', time: nowTime() }],
        },
      ),
    );
    setAssigningOrderId(null);
  };

  if (isLoading) return <OrdersSkeleton insetTop={insets.top} />;

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* ── Orange Header ── */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
        {/* Back · Title · Filter row */}
        <View style={styles.headerTopRow}>
          {/* <TouchableOpacity style={styles.headerBackBtn} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitleText}>Orders</Text>
          <TouchableOpacity style={styles.headerFilterBtn} activeOpacity={0.8}>
            <SlidersHorizontal size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.searchText}>Search by name or order ID...</Text>
        </View>
      </View>

      {/* ── White strip: pills + stats ── */}
      <View style={styles.pillsStatsContainer}>
        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillTabsScroll}>
          {FILTER_TABS.map(({ key, label }) => {
            const active = activeFilter === key;
            const count  = countForFilter(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.pillTabButton, active && styles.pillTabButtonActive]}
                onPress={() => setActiveFilter(key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillTabText, active && styles.pillTabTextActive]}>{label}</Text>
                {count > 0 && (
                  <View style={[styles.pillTabCountBadge, active && styles.pillTabCountBadgeActive]}>
                    <Text style={[styles.pillTabCountText, active && styles.pillTabCountTextActive]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stats row: ₹12,840 | 24 | 3 | ₹536 */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Today's sales</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: '#22C55E' }]}>₹{avgOrder}</Text>
            <Text style={styles.statLabel}>Avg. order</Text>
          </View>
        </View>
      </View>

      {/* ── Orders List ── */}
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {displayed.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          displayed.map((order) => {
            const driver = STATIC_DRIVERS.find((d) => d.id === order.deliveryPartnerId) ?? null;
            return (
              <OrderCard
                key={order.id}
                order={order}
                driver={driver}
                onAccept={() => handleAccept(order.id)}
                onReject={() => handleReject(order.id)}
                onAdvance={() => handleAdvance(order.id, order.status)}
                onAssign={() => setAssigningOrderId(order.id)}
                onView={() => setSelectedOrderId(order.id)}
              />
            );
          })
        )}

        {/* Footer banner */}
        <View style={styles.footerPerformanceBanner}>
          <View style={styles.footerIconContainer}>
            <BarChart2 size={16} color={Colors.primary} />
          </View>
          <Text style={styles.footerPerformanceText}>
            Great job! You've completed {deliveredCount} orders today.
          </Text>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLinkText}>Analytics</Text>
            <ChevronRight size={13} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Order Details Sheet ── */}
      <BottomSheet isVisible={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)} title="Order Details" height={0.75}>
        {activeOrder ? (
          <ScrollView contentContainerStyle={styles.sheet}>
            <View style={styles.sheetSection}>
              <View style={styles.sheetSectionHead}>
                <User size={14} color={Colors.primary} />
                <Text style={styles.sheetSectionTitle}>Customer</Text>
              </View>
              <Text style={styles.sheetName}>{activeOrder.customerName}</Text>
              <Text style={styles.sheetMeta}>{activeOrder.customerPhone}</Text>
              <View style={styles.addressRow}>
                <MapPin size={12} color="#94A3B8" />
                <Text style={styles.addressText}>{activeOrder.deliveryAddress}</Text>
              </View>
            </View>

            <View style={styles.sheetSection}>
              <View style={styles.sheetSectionHead}>
                <Package size={14} color={Colors.primary} />
                <Text style={styles.sheetSectionTitle}>Items ({activeOrder.itemsCount})</Text>
              </View>
              {activeOrder.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name} ×{item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalLabel}>Total</Text>
                <Text style={styles.itemTotalValue}>₹{activeOrder.amount}</Text>
              </View>
            </View>

            <View style={[styles.sheetSection, { borderBottomWidth: 0 }]}>
              <View style={styles.sheetSectionHead}>
                <Clock size={14} color={Colors.primary} />
                <Text style={styles.sheetSectionTitle}>Timeline</Text>
              </View>
              {activeOrder.timeline.map((event, i) => (
                <View key={i} style={styles.timelineRow}>
                  <View style={styles.timelineDotWrap}>
                    <View style={styles.timelineDot} />
                    {i < activeOrder.timeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.timelineStatus}>{event.status}</Text>
                    <Text style={styles.timelineTime}>{event.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : null}
      </BottomSheet>

      {/* ── Assign Driver Sheet ── */}
      <BottomSheet isVisible={assigningOrderId !== null} onClose={() => setAssigningOrderId(null)} title="Assign Driver" height={0.5}>
        <ScrollView contentContainerStyle={styles.sheet}>
          {STATIC_DRIVERS.map((driver) => (
            <View key={driver.id} style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>{driver.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverMeta}>{driver.phone} · ★ {driver.rating}</Text>
              </View>
              <TouchableOpacity
                style={[styles.acceptBtn, { flex: 0, paddingHorizontal: 16 }]}
                activeOpacity={0.8}
                onPress={() => assigningOrderId && handleAssignDriver(assigningOrderId, driver.id)}
              >
                <Text style={styles.acceptBtnText}>Assign</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </AnimatedScreen>
  );
});

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, driver, onAccept, onReject, onAdvance, onAssign, onView }: {
  order: StaticOrder;
  driver: typeof STATIC_DRIVERS[number] | null;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
  onView: () => void;
}) {
  const isNew       = order.status === 'New Orders';
  const isAccepted  = order.status === 'Accepted';
  const isPacked    = order.status === 'Packed';
  const isOFD       = order.status === 'Out For Delivery';
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';

  const tag      = getStatusTag(order.status);
  const progress = getProgressConfig(order.status);
  const border   = getCardBorderColor(order.status);

  return (
    <View style={[
      styles.orderCard,
      { borderLeftColor: border },
      (isDelivered || isCancelled) && { opacity: isDelivered ? 0.85 : 0.7 },
    ]}>
      {/* Status badge */}
      <View style={[styles.statusTag, { backgroundColor: tag.bgColor }]}>
        <Text style={[styles.statusTagText, { color: tag.textColor }]}>{tag.label}</Text>
      </View>

      {/* Customer + amount */}
      <View style={styles.cardTopRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{order.customerName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.orderMeta}>{order.id} · {order.orderTime}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={styles.amount}>₹{order.amount}</Text>
          <View style={[styles.payPill, { backgroundColor: order.paymentMethod === 'COD' ? '#FEF3C7' : Colors.primaryLight }]}>
            <Text style={[styles.payPillText, { color: order.paymentMethod === 'COD' ? '#D97706' : Colors.primary }]}>
              {order.paymentMethod === 'COD' ? 'Cash' : 'Online'}
            </Text>
          </View>
        </View>
      </View>

      {/* Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.badgeChip}>
          <Package size={12} color="#64748B" />
          <Text style={styles.badgeChipText}>{order.itemsCount} items</Text>
        </View>
        {driver && (
          <View style={[styles.badgeChip, { backgroundColor: '#EDE9FE' }]}>
            <Truck size={12} color="#6D28D9" />
            <Text style={[styles.badgeChipText, { color: '#6D28D9' }]}>{driver.name}</Text>
          </View>
        )}
        {isNew && (
          <View style={[styles.badgeChip, { backgroundColor: '#FEE2E2' }]}>
            <Clock size={12} color="#EF4444" />
            <Text style={[styles.badgeChipText, { color: '#EF4444', fontWeight: '700' }]}>Needs response</Text>
          </View>
        )}
      </View>

      {/* Progress bar for active statuses */}
      {progress && (
        <View style={styles.progressWrap}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>{progress.label}</Text>
            <Text style={[styles.progressPct, { color: progress.color }]}>{progress.pct}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressBar, { width: `${progress.pct}%` as any, backgroundColor: progress.color }]} />
          </View>
        </View>
      )}

      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        {isNew && (
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={onAccept}>
              <CheckCircle2 size={15} color="#FFFFFF" />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={onReject}>
              <XCircle size={14} color="#94A3B8" />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        {isAccepted && (
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: '#3B82F6' }]} activeOpacity={0.8} onPress={onAdvance}>
              <Package size={14} color="#FFFFFF" />
              <Text style={styles.acceptBtnText}>Mark Packed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={onAssign}>
              <Truck size={14} color="#64748B" />
              <Text style={styles.rejectBtnText}>Assign Driver</Text>
            </TouchableOpacity>
          </View>
        )}
        {isPacked && (
          <TouchableOpacity style={[styles.acceptBtn, { flex: 1, backgroundColor: '#8B5CF6' }]} activeOpacity={0.8} onPress={onAdvance}>
            <Truck size={14} color="#FFFFFF" />
            <Text style={styles.acceptBtnText}>Send Out for Delivery</Text>
          </TouchableOpacity>
        )}
        {isOFD && (
          <TouchableOpacity style={[styles.acceptBtn, { flex: 1, backgroundColor: '#F59E0B' }]} activeOpacity={0.8} onPress={onAdvance}>
            <CheckCircle2 size={14} color="#FFFFFF" />
            <Text style={styles.acceptBtnText}>Mark Delivered</Text>
          </TouchableOpacity>
        )}
        {isDelivered && (
          <View style={[styles.donePill, styles.donePillGreen, { flex: 1 }]}>
            <Text style={[styles.donePillText, { color: '#15803D' }]}>Delivered successfully</Text>
          </View>
        )}
        {isCancelled && (
          <View style={[styles.donePill, styles.donePillRed, { flex: 1 }]}>
            <Text style={[styles.donePillText, { color: '#B91C1C' }]}>Order Cancelled</Text>
          </View>
        )}
        <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8} onPress={onView}>
          <Text style={styles.viewBtnText}>Details</Text>
          <ChevronRight size={13} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: FilterKey }) {
  const messages: Record<FilterKey, [string, string]> = {
    All:       ['No Orders Yet',      'Orders will appear here as they come in.'],
    New:       ['No New Orders',      "You're all caught up. New orders appear here instantly."],
    Active:    ['No Active Orders',   'Orders being prepared or on the way will show here.'],
    Completed: ['No Completed Orders','Delivered orders will appear here.'],
    Cancelled: ['No Cancelled Orders','Cancelled orders will appear here.'],
  };
  const [title, sub] = messages[filter];
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <ShoppingBag size={32} color={Colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{sub}</Text>
    </View>
  );
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
