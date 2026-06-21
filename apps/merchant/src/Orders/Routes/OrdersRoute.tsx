import { debounce } from 'lodash';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  User,
  XCircle
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { Order } from '../Models/Order';
import styles from './styles';

type FilterKey = 'All' | 'New' | 'Active' | 'Completed' | 'Cancelled';

const STATIC_DRIVERS = [
  { id: 'd1', name: 'Rajan Pillai', phone: '+91 98400 11234', rating: 4.8 },
  { id: 'd2', name: 'Suresh Babu', phone: '+91 98765 55678', rating: 4.6 },
  { id: 'd3', name: 'Anil Kumar', phone: '+91 97890 33456', rating: 4.9 },
];

type OrderStatus = 'New Orders' | 'Accepted' | 'Packed' | 'Out For Delivery' | 'Delivered' | 'Cancelled';

interface StaticOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  amount: number;
  itemsCount: number;
  orderTime: string;
  paymentMethod: 'Online' | 'COD';
  deliveryPartnerId: string | null;
  items: { id: string; name: string; quantity: number; price: number }[];
  timeline: { status: string; time: string }[];
}

const STATIC_ORDERS: StaticOrder[] = [
  {
    id: 'ORD-8492',
    customerName: 'Aravind Swamy',
    customerPhone: '+91 94440 56789',
    deliveryAddress: '12, 4th Cross, Indiranagar, Bengaluru 560038',
    amount: 694, itemsCount: 4, orderTime: '10:32 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Organic Tomatoes (500g)', quantity: 2, price: 60 },
      { id: 'i2', name: 'Fresh Spinach (250g)', quantity: 1, price: 45 },
      { id: 'i3', name: 'Basmati Rice (1kg)', quantity: 1, price: 120 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:32 AM' }],
  },
  {
    id: 'ORD-8488',
    customerName: 'Meera Nair',
    customerPhone: '+91 98840 12345',
    deliveryAddress: '45, 2nd Main, Koramangala 3rd Block, Bengaluru 560034',
    amount: 1290, itemsCount: 5, orderTime: '10:18 AM', paymentMethod: 'COD', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Alphonso Mangoes (1 dozen)', quantity: 1, price: 480 },
      { id: 'i2', name: 'Fresh Pomegranate (500g)', quantity: 2, price: 180 },
      { id: 'i3', name: 'Kiwi (4 pcs)', quantity: 1, price: 160 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:18 AM' }],
  },
  {
    id: 'ORD-8475',
    customerName: 'Rohan Das',
    customerPhone: '+91 97760 98765',
    deliveryAddress: '7, Brigade Road, Bengaluru 560001',
    amount: 340, itemsCount: 2, orderTime: '10:05 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Mixed Greens Box', quantity: 1, price: 200 },
      { id: 'i2', name: 'Coriander (100g)', quantity: 2, price: 20 },
    ],
    timeline: [{ status: 'Order Placed', time: '10:05 AM' }],
  },
  {
    id: 'ORD-8461',
    customerName: 'Sanjay Dutt',
    customerPhone: '+91 96650 45678',
    deliveryAddress: '22, 10th Main, Jayanagar 4th Block, Bengaluru 560011',
    amount: 870, itemsCount: 3, orderTime: '9:55 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [
      { id: 'i1', name: 'Mixed Vegetables Box', quantity: 1, price: 350 },
      { id: 'i2', name: 'Coconut (1 pc)', quantity: 2, price: 55 },
      { id: 'i3', name: 'Green Chillies (100g)', quantity: 1, price: 30 },
    ],
    timeline: [
      { status: 'Order Placed', time: '9:55 AM' },
      { status: 'Accepted', time: '10:00 AM' },
    ],
  },
  {
    id: 'ORD-8430',
    customerName: 'Kiran Rao',
    customerPhone: '+91 95540 23456',
    deliveryAddress: '34, JP Nagar 7th Phase, Bengaluru 560078',
    amount: 540, itemsCount: 2, orderTime: '9:20 AM', paymentMethod: 'Online', deliveryPartnerId: 'd1',
    items: [
      { id: 'i1', name: 'Dragon Fruit (2 pcs)', quantity: 2, price: 200 },
      { id: 'i2', name: 'Fresh Herbs Bundle', quantity: 1, price: 140 },
    ],
    timeline: [
      { status: 'Order Placed', time: '9:20 AM' },
      { status: 'Accepted', time: '9:25 AM' },
      { status: 'Packed', time: '9:40 AM' },
    ],
  },
  {
    id: 'ORD-8412',
    customerName: 'Anita Desai',
    customerPhone: '+91 93320 87654',
    deliveryAddress: '7, Whitefield Main Road, Bengaluru 560066',
    amount: 1150, itemsCount: 6, orderTime: '8:45 AM', paymentMethod: 'Online', deliveryPartnerId: 'd2',
    items: [
      { id: 'i1', name: 'Avocado (2 pcs)', quantity: 2, price: 280 },
      { id: 'i2', name: 'Cherry Tomatoes (250g)', quantity: 1, price: 90 },
      { id: 'i3', name: 'Baby Carrots (500g)', quantity: 1, price: 75 },
    ],
    timeline: [
      { status: 'Order Placed', time: '8:45 AM' },
      { status: 'Accepted', time: '8:50 AM' },
      { status: 'Packed', time: '9:05 AM' },
      { status: 'Out for Delivery', time: '9:15 AM' },
    ],
  },
  {
    id: 'ORD-8401',
    customerName: 'Vikram Seth',
    customerPhone: '+91 92210 54321',
    deliveryAddress: '88, MG Road, Bengaluru 560001',
    amount: 380, itemsCount: 2, orderTime: '7:30 AM', paymentMethod: 'COD', deliveryPartnerId: 'd3',
    items: [
      { id: 'i1', name: 'Watermelon (1 pc)', quantity: 1, price: 280 },
      { id: 'i2', name: 'Lime (6 pcs)', quantity: 1, price: 40 },
    ],
    timeline: [
      { status: 'Order Placed', time: '7:30 AM' },
      { status: 'Accepted', time: '7:35 AM' },
      { status: 'Packed', time: '7:50 AM' },
      { status: 'Out for Delivery', time: '8:00 AM' },
      { status: 'Delivered', time: '8:22 AM' },
    ],
  },
  {
    id: 'ORD-8395',
    customerName: 'Rahul Dravid',
    customerPhone: '+91 91100 98765',
    deliveryAddress: '15, Malleshwaram 11th Cross, Bengaluru 560003',
    amount: 730, itemsCount: 4, orderTime: '7:05 AM', paymentMethod: 'Online', deliveryPartnerId: 'd1',
    items: [
      { id: 'i1', name: 'Organic Banana (1 dozen)', quantity: 1, price: 80 },
      { id: 'i2', name: 'Papaya (1 kg)', quantity: 1, price: 90 },
    ],
    timeline: [
      { status: 'Order Placed', time: '7:05 AM' },
      { status: 'Accepted', time: '7:10 AM' },
      { status: 'Packed', time: '7:25 AM' },
      { status: 'Out for Delivery', time: '7:35 AM' },
      { status: 'Delivered', time: '7:55 AM' },
    ],
  },
  {
    id: 'ORD-8380',
    customerName: 'Shashi Tharoor',
    customerPhone: '+91 90090 12345',
    deliveryAddress: '9, Cunningham Road, Bengaluru 560052',
    amount: 450, itemsCount: 1, orderTime: '6:50 AM', paymentMethod: 'Online', deliveryPartnerId: null,
    items: [{ id: 'i1', name: 'Seasonal Fruit Box', quantity: 1, price: 450 }],
    timeline: [
      { status: 'Order Placed', time: '6:50 AM' },
      { status: 'Cancelled by Customer', time: '6:54 AM' },
    ],
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'New', label: 'New' },
  { key: 'Active', label: 'Active' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Cancelled', label: 'Cancelled' },
];

const FILTER_TO_STATUS: Record<FilterKey, string | undefined> = {
  All: undefined,
  New: 'New Orders',
  Active: 'Accepted',
  Completed: 'Delivered',
  Cancelled: 'Cancelled',
};

const SEARCH_DEBOUNCE_MS = 400;

function filterOrders(orders: Order[], filter: FilterKey): Order[] {
  switch (filter) {
    case 'New': return orders.filter((o) => o.status === 'New Orders');
    case 'Active': return orders.filter((o) => ['Accepted', 'Packed', 'Out For Delivery'].includes(o.status));
    case 'Completed': return orders.filter((o) => o.status === 'Delivered');
    case 'Cancelled': return orders.filter((o) => ['Cancelled', 'Rejected'].includes(o.status));
    default: return orders;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusTag(status: Order['status']): { label: string; bgColor: string; textColor: string } {
  switch (status) {
    case 'New Orders': return { label: 'NEW ORDER', bgColor: Colors.primaryLight, textColor: Colors.primary };
    case 'Accepted': return { label: 'ACCEPTED', bgColor: Colors.primary + '1A', textColor: Colors.primaryMid };
    case 'Packed': return { label: 'PACKED', bgColor: Colors.primary + '26', textColor: Colors.primary };
    case 'Out For Delivery': return { label: 'ON THE WAY', bgColor: Colors.primary + '33', textColor: Colors.primaryDark };
    case 'Delivered': return { label: 'DELIVERED', bgColor: Colors.successBg, textColor: Colors.success };
    default: return { label: 'CANCELLED', bgColor: Colors.errorBg, textColor: Colors.error };
  }
}

function getProgressConfig(status: Order['status']): { pct: number; label: string; color: string } | null {
  switch (status) {
    case 'Accepted': return { pct: 33, label: 'Accepted · Packing now', color: Colors.primaryMid };
    case 'Packed': return { pct: 66, label: 'Packed · Awaiting pickup', color: Colors.primary };
    case 'Out For Delivery': return { pct: 85, label: 'Out for delivery · En route', color: Colors.primaryDark };
    default: return null;
  }
}

function getCardBorderColor(status: Order['status']): string {
  switch (status) {
    case 'New Orders': return Colors.primary;
    case 'Accepted': return Colors.primaryMid;
    case 'Packed': return Colors.primary;
    case 'Out For Delivery': return Colors.primaryDark;
    case 'Delivered': return Colors.success;
    default: return Colors.error;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBox({ width, height, borderRadius = 8, style }: { width?: number | string; height: number; borderRadius?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[{ width: width ?? '100%', height, borderRadius, backgroundColor: '#E2E8F0', opacity }, style]} />;
}

function OrdersSkeleton({ insetTop }: { insetTop: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <View style={{ backgroundColor: Colors.primary, paddingTop: insetTop + 12, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={90} height={22} borderRadius={6} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <SkeletonBox width={36} height={36} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>
        <SkeletonBox height={44} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      </View>
      <View style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonBox key={i} width={75} height={34} borderRadius={20} />
          ))}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <SkeletonBox width={60} height={18} borderRadius={4} />
              <SkeletonBox width={50} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
        {[0, 1, 2].map((i) => (
          <SkeletonBox key={i} height={130} borderRadius={18} />
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default observer(function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { ordersStore } = useStores();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  useEffect(() => {
    void ordersStore.fetchOrders();
  }, []);

  // Debounced so typing doesn't fire an API call (and a loading-state re-render) on every keystroke.
  const debouncedSearch = useMemo(
    () => debounce((text: string, filter: FilterKey) => {
      void ordersStore.fetchOrders(FILTER_TO_STATUS[filter], text);
    }, SEARCH_DEBOUNCE_MS),
    [ordersStore],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    debouncedSearch(text, activeFilter);
  };

  const orders = ordersStore.orders;
  const isLoading = ordersStore.state === 'loading';

  const displayed = filterOrders(orders, activeFilter);
  const totalCount = orders.length;
  const newCount = orders.filter((o) => o.status === 'New Orders').length;
  const pendingCount = newCount;
  const totalRevenue = orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.amount, 0);
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const avgOrder = deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0;

  const countForFilter = (key: FilterKey) => filterOrders(orders, key).length;
  const activeOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleAccept = (id: string) => {
    void ordersStore.acceptOrder(id);
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: () => void ordersStore.rejectOrder(id),
      },
    ]);
  };

  const handleAdvance = (id: string, status: Order['status']) => {
    const order = orders.find((o) => o.id === id);
    if (status === 'Packed' && !order?.deliveryPartnerId) {
      setAssigningOrderId(id);
      return;
    }
    if (status === 'Accepted') {
      void ordersStore.advanceOrder(id, 'PACKING');
    } else if (status === 'Packed') {
      void ordersStore.advanceOrder(id, 'OUT_FOR_DELIVERY');
    } else if (status === 'Out For Delivery') {
      void ordersStore.advanceOrder(id, 'DELIVERED');
    }
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    ordersStore.assignDeliveryPartner(orderId, driverId);
    void ordersStore.advanceOrder(orderId, 'OUT_FOR_DELIVERY');
    setAssigningOrderId(null);
  };

  if (isLoading && orders.length === 0) return <OrdersSkeleton insetTop={insets.top} />;

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* ── Orange Header ── */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
        {/* Back · Title · Filter row */}
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitleText}>Orders</Text>
          <TouchableOpacity style={styles.headerFilterBtn} activeOpacity={0.8}>
            <SlidersHorizontal size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Search size={16} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
          <TextInput
            value={searchInput}
            onChangeText={handleSearchChange}
            placeholder="Search by name or order ID..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, paddingVertical: 0 }}
          />
        </View>
      </View>

      {/* ── White strip: pills + stats ── */}
      <View style={styles.pillsStatsContainer}>
        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillTabsScroll}>
          {FILTER_TABS.map(({ key, label }) => {
            const active = activeFilter === key;
            const count = countForFilter(key);
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
                onView={() => {
                  setSelectedOrderId(order.id);
                  void ordersStore.fetchOrderDetail(order.id);
                }}
              />
            );
          })
        )}
      </ScrollView>

      {/* ── Order Details Sheet ── */}
      <BottomSheet isVisible={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)} title="Order Details" height={0.78}>
        {ordersStore.orderDetailState === 'loading' ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : ordersStore.orderDetailError ? (
          <View style={{ paddingVertical: 48, alignItems: 'center', paddingHorizontal: 24, gap: 6 }}>
            <Text style={{ color: Colors.error, fontWeight: '700', fontSize: 14 }}>Couldn't load order</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
              {ordersStore.orderDetailError}
            </Text>
          </View>
        ) : ordersStore.orderDetail ? (
          <ScrollView contentContainerStyle={styles.sheet}>
            {(() => {
              const detail = ordersStore.orderDetail!;
              return (
                <>
                  <View style={styles.sheetSection}>
                    <View style={styles.sheetSectionHead}>
                      <User size={14} color={Colors.primary} />
                      <Text style={styles.sheetSectionTitle}>Customer</Text>
                    </View>
                    <Text style={styles.sheetName}>{detail.customerName}</Text>
                    <Text style={styles.sheetMeta}>{detail.customerPhone}</Text>
                    {detail.address && (
                      <>
                        <View style={styles.addressRow}>
                          <MapPin size={12} color="#94A3B8" />
                          <Text style={styles.addressText}>
                            {detail.address.addressLine1}
                            {detail.address.addressLine2 ? `, ${detail.address.addressLine2}` : ''}, {detail.address.state} - {detail.address.pincode}
                          </Text>
                        </View>
                        <View style={[styles.badgeChip, { alignSelf: 'flex-start', marginTop: 6 }]}>
                          <Text style={styles.badgeChipText}>{detail.address.addressType}</Text>
                        </View>
                      </>
                    )}
                  </View>

                  <View style={styles.sheetSection}>
                    <View style={styles.sheetSectionHead}>
                      <Package size={14} color={Colors.primary} />
                      <Text style={styles.sheetSectionTitle}>Items ({detail.items.length})</Text>
                    </View>
                    {detail.items.map((item: any) => (
                      <View key={item.variantId} style={[styles.itemRow, { alignItems: 'center' }]}>
                        {item.productImage ? (
                          <Image source={{ uri: item.productImage }} style={{ width: 36, height: 36, borderRadius: 8, marginRight: 10 }} />
                        ) : null}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemName}>{item.productName} ({item.variantName}) ×{item.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>₹{item.totalPrice}</Text>
                      </View>
                    ))}

                    <View style={[styles.itemRow, { marginTop: 8 }]}>
                      <Text style={styles.itemName}>Subtotal</Text>
                      <Text style={styles.itemPrice}>₹{detail.subtotal}</Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemName}>Delivery charge</Text>
                      <Text style={styles.itemPrice}>₹{detail.deliveryCharge}</Text>
                    </View>
                    {detail.discountAmount > 0 && (
                      <View style={styles.itemRow}>
                        <Text style={styles.itemName}>Discount</Text>
                        <Text style={[styles.itemPrice, { color: Colors.success }]}>-₹{detail.discountAmount}</Text>
                      </View>
                    )}
                    <View style={styles.itemTotal}>
                      <Text style={styles.itemTotalLabel}>Total</Text>
                      <Text style={styles.itemTotalValue}>₹{detail.totalAmount}</Text>
                    </View>
                  </View>

                  {detail.payment && (
                    <View style={styles.sheetSection}>
                      <View style={styles.sheetSectionHead}>
                        <CreditCard size={14} color={Colors.primary} />
                        <Text style={styles.sheetSectionTitle}>Payment</Text>
                      </View>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemName}>Method</Text>
                        <Text style={styles.itemPrice}>
                          {detail.payment.method === 'COD' ? 'Cash on Delivery' : detail.payment.method}
                        </Text>
                      </View>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemName}>Amount</Text>
                        <Text style={styles.itemPrice}>₹{detail.payment.amount}</Text>
                      </View>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemName}>Status</Text>
                        <Text style={[styles.itemPrice, { color: detail.payment.status === 'SUCCESS' ? Colors.success : Colors.warning }]}>
                          {detail.payment.status}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={[styles.sheetSection, { borderBottomWidth: 0 }]}>
                    <View style={styles.sheetSectionHead}>
                      <Clock size={14} color={Colors.primary} />
                      <Text style={styles.sheetSectionTitle}>Timeline</Text>
                    </View>
                    {(activeOrder?.timeline ?? []).map((event, i) => (
                      <View key={i} style={styles.timelineRow}>
                        <View style={styles.timelineDotWrap}>
                          <View style={styles.timelineDot} />
                          {i < (activeOrder?.timeline.length ?? 0) - 1 && <View style={styles.timelineLine} />}
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.timelineStatus}>{event.status}</Text>
                          <Text style={styles.timelineTime}>{event.time}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              );
            })()}
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
  order: Order;
  driver: typeof STATIC_DRIVERS[number] | null;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
  onView: () => void;
}) {
  const isNew = order.status === 'New Orders';
  const isAccepted = order.status === 'Accepted';
  const isPacked = order.status === 'Packed';
  const isOFD = order.status === 'Out For Delivery';
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled' || order.status === 'Rejected';

  const tag = getStatusTag(order.status as any);
  const progress = getProgressConfig(order.status as any);
  const border = getCardBorderColor(order.status as any);

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
          <View style={[styles.payPill, { backgroundColor: order.paymentMethod === 'COD' ? Colors.primary + '1A' : Colors.primaryLight }]}>
            <Text style={[styles.payPillText, { color: order.paymentMethod === 'COD' ? Colors.primaryDark : Colors.primary }]}>
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
          <View style={[styles.badgeChip, { backgroundColor: Colors.primary + '26' }]}>
            <Truck size={12} color={Colors.primaryDark} />
            <Text style={[styles.badgeChipText, { color: Colors.primaryDark }]}>{driver.name}</Text>
          </View>
        )}
        {isNew && (
          <View style={[styles.badgeChip, { backgroundColor: Colors.primary + '1A' }]}>
            <Clock size={12} color={Colors.primary} />
            <Text style={[styles.badgeChipText, { color: Colors.primary, fontWeight: '700' }]}>Needs response</Text>
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
            <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: Colors.primaryMid }]} activeOpacity={0.8} onPress={onAdvance}>
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
          <TouchableOpacity style={[styles.acceptBtn, { flex: 1, backgroundColor: Colors.primary }]} activeOpacity={0.8} onPress={onAdvance}>
            <Truck size={14} color="#FFFFFF" />
            <Text style={styles.acceptBtnText}>Send Out for Delivery</Text>
          </TouchableOpacity>
        )}
        {isOFD && (
          <TouchableOpacity style={[styles.acceptBtn, { flex: 1, backgroundColor: Colors.primaryDark }]} activeOpacity={0.8} onPress={onAdvance}>
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
    All: ['No Orders Yet', 'Orders will appear here as they come in.'],
    New: ['No New Orders', "You're all caught up. New orders appear here instantly."],
    Active: ['No Active Orders', 'Orders being prepared or on the way will show here.'],
    Completed: ['No Completed Orders', 'Delivered orders will appear here.'],
    Cancelled: ['No Cancelled Orders', 'Cancelled orders will appear here.'],
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
