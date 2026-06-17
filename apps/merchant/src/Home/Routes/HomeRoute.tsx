import { router } from 'expo-router';
import {
  ArrowUpRight,
  Award,
  Bell,
  Boxes,
  ChevronRight,
  Package,
  PackagePlus,
  ShoppingBag,
  Star,
  Tags,
  Truck,
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Polyline, Svg } from 'react-native-svg';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { useStores } from '../../Common/hooks/useStores';
import { Toast } from '../../components/ui/MerchantPrimitives';
import { Colors } from '../../theme/colors';
import styles from './styles';

const AvatarImg = require('../../../assets/images/avatar.png');
const TomatoImg = require('../../../assets/images/tomato.png');
const MilkImg = require('../../../assets/images/milk.png');
const BreadImg = require('../../../assets/images/bread.png');

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const REVENUE_DATA = [
  { label: 'Revenue', value: '₹86,430', trend: 16, data: [30, 40, 35, 55, 48, 65, 60, 80] },
  { label: 'Orders', value: '268', trend: 12, data: [40, 38, 50, 46, 58, 55, 68, 72] },
  { label: 'Customers', value: '142', trend: 18, data: [20, 28, 25, 38, 34, 48, 44, 60] },
  { label: 'Avg. order', value: '₹322', trend: 8, data: [50, 45, 55, 48, 60, 58, 65, 70] },
];

const STATIC_ORDERS = [
  { id: '1', customerName: 'Rahul Verma', amount: 694, itemsCount: 4, orderTime: '10 mins ago', paymentMethod: 'Online Payment', distance: '1.2 km' },
  { id: '2', customerName: 'Ananya Sen', amount: 1290, itemsCount: 5, orderTime: '25 mins ago', paymentMethod: 'COD', distance: '1.8 km' },
  { id: '3', customerName: 'Suresh Kumar', amount: 80, itemsCount: 1, orderTime: '45 mins ago', paymentMethod: 'Online Payment', distance: '0.6 km' },
];

const STATIC_BARGAINS = [
  { id: '1', customerName: 'Priya Sharma', items: 'Organic Vegetables · 3 items', customerOffer: 580, yourPrice: 700, status: 'waiting', expiresIn: '12 min' },
  { id: '2', customerName: 'Deepa Nair', items: 'Fruits · 5 items', customerOffer: 390, yourPrice: 480, status: 'urgent', expiresIn: '2 min' },
];

const STATIC_INVENTORY = [
  { id: '1', name: 'Tomatoes (1kg)', qty: '0 units left', alert: 'Out of stock', action: 'Restock', color: Colors.error, bg: Colors.errorBg, img: TomatoImg, prog: 1 },
  { id: '2', name: 'Milk (1L)', qty: '5 units · ~3 hrs left', alert: 'Low stock', action: 'Add stock', color: Colors.warning, bg: Colors.warningBg, img: MilkImg, prog: 10 },
  { id: '3', name: 'Bread', qty: '12 units · ~5 hrs left', alert: 'Low stock', action: 'Add stock', color: Colors.warning, bg: Colors.warningBg, img: BreadImg, prog: 20 },
];

const ACTIVITY_FEED = [
  { Icon: ShoppingBag, label: 'Order #2847 accepted', time: '10 mins ago', iconBg: Colors.primaryLight, iconColor: Colors.primary, connectorColor: Colors.primaryLight },
  { Icon: Award, label: 'Payment ₹420 received', time: '25 mins ago', iconBg: Colors.successBg, iconColor: Colors.success, connectorColor: Colors.successBg },
  { Icon: Package, label: 'Inventory updated', time: '1 hr ago', iconBg: Colors.infoBg, iconColor: Colors.info, connectorColor: Colors.infoBg },
  { Icon: Tags, label: 'Offer created · 10% OFF Fruits', time: '2 hrs ago', iconBg: '#F3E8FF', iconColor: '#8B5CF6', connectorColor: '#F3E8FF' },
  { Icon: Truck, label: 'Order #2846 delivered', time: '3 hrs ago', iconBg: Colors.successBg, iconColor: Colors.success, connectorColor: Colors.successBg },
];

// ── Sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 120, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(' ');
  const lastX = (data.length - 1) * step;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={lastX} cy={lastY} r={3.5} fill={color} />
    </Svg>
  );
}

// ── Skeleton box with pulse animation ────────────────────────────────────
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

  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

// ── Full skeleton layout ──────────────────────────────────────────────────
function HomeSkeleton({ insetTop }: { insetTop: number }) {
  return (
    <>
      {/* header skeleton */}
      <View style={[styles.header, { paddingTop: insetTop + 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 }}>
          <View style={{ gap: 6 }}>
            <SkeletonBox width={80} height={10} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <SkeletonBox width={160} height={18} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <SkeletonBox width={50} height={20} borderRadius={6} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SkeletonBox width={38} height={38} borderRadius={19} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <SkeletonBox width={38} height={38} borderRadius={19} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </View>
        </View>
        <SkeletonBox height={38} borderRadius={10} style={{ marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <SkeletonBox height={68} borderRadius={12} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </View>

      {/* quick actions skeleton */}
      <View style={[styles.quickActionsCard, { gap: 0 }]}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.quickActionItem, { gap: 8 }]}>
            <SkeletonBox width={52} height={52} borderRadius={16} />
            <SkeletonBox width={44} height={10} />
          </View>
        ))}
      </View>

      {/* orders skeleton */}
      <View style={{ paddingHorizontal: 16, marginTop: 22, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonBox width={140} height={16} />
        <SkeletonBox width={60} height={12} />
      </View>
      {[0, 1].map(i => (
        <View key={i} style={[styles.orderCard, { gap: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <SkeletonBox width={38} height={38} borderRadius={19} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBox width={120} height={13} />
              <SkeletonBox width={80} height={10} />
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <SkeletonBox width={50} height={14} />
              <SkeletonBox width={36} height={18} borderRadius={5} />
            </View>
          </View>
          <SkeletonBox height={1} style={{ backgroundColor: Colors.borderLight }} />
          <SkeletonBox width="70%" height={10} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SkeletonBox height={36} borderRadius={9} style={{ flex: 1 }} />
            <SkeletonBox height={36} borderRadius={9} style={{ flex: 1 }} />
          </View>
        </View>
      ))}

      {/* bargains skeleton */}
      <View style={{ paddingHorizontal: 16, marginTop: 22, marginBottom: 12 }}>
        <SkeletonBox width={160} height={16} />
      </View>
      <View style={[styles.bargainCard, { gap: 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <SkeletonBox width={34} height={34} borderRadius={17} />
          <View style={{ flex: 1, gap: 6 }}>
            <SkeletonBox width={110} height={13} />
            <SkeletonBox width={150} height={10} />
          </View>
          <SkeletonBox width={60} height={20} borderRadius={20} />
        </View>
        <SkeletonBox height={58} borderRadius={10} />
        <View style={{ flexDirection: 'row', gap: 7 }}>
          <SkeletonBox height={34} borderRadius={8} style={{ flex: 1 }} />
          <SkeletonBox height={34} borderRadius={8} style={{ flex: 1 }} />
          <SkeletonBox height={34} borderRadius={8} style={{ flex: 1 }} />
        </View>
      </View>

      {/* inventory skeleton */}
      <View style={{ paddingHorizontal: 16, marginTop: 22, marginBottom: 12 }}>
        <SkeletonBox width={140} height={16} />
      </View>
      <View style={[styles.inventoryCard]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.inventoryRow, i > 0 && styles.inventoryRowBorder]}>
            <SkeletonBox width={42} height={42} borderRadius={10} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBox width={130} height={13} />
              <SkeletonBox width={90} height={10} />
              <SkeletonBox height={4} borderRadius={2} />
            </View>
            <SkeletonBox width={64} height={30} borderRadius={8} />
          </View>
        ))}
      </View>

      {/* revenue skeleton */}
      <View style={{ paddingHorizontal: 16, marginTop: 22, marginBottom: 12 }}>
        <SkeletonBox width={150} height={16} />
      </View>
      <View style={[styles.revenueGrid]}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.revenueSnapCard, { gap: 6 }]}>
            <SkeletonBox width={60} height={10} />
            <SkeletonBox width={80} height={20} />
            <SkeletonBox width={90} height={10} />
            <SkeletonBox height={32} borderRadius={4} />
          </View>
        ))}
      </View>
    </>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────
export default observer(function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { authStore, dashboardStore, ordersStore, sessionStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'neutral' });

  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Skeleton load simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Blinking alert strip animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blinkAnim]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'neutral' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const handleAccept = (id: string) => {
    ordersStore.acceptOrder(id);
    showToast('Order accepted ✓');
  };

  const handleReject = (id: string) => {
    ordersStore.rejectOrder(id);
    showToast('Order rejected', 'neutral');
  };

  const storeName = authStore.storeName || 'FreshMart Hyperlocal';
  const ownerFirstName = sessionStore.user?.full_name?.trim().split(/\s+/)[0] || 'Yaswanth';

  const orders = ordersStore.newOrders.length > 0 ? ordersStore.newOrders : STATIC_ORDERS;

  const quickActions = [
    { label: 'Add Product', Icon: PackagePlus, route: '/(tabs)/products' },
    { label: 'Inventory', Icon: Boxes, route: '/(tabs)/inventory' },
    { label: 'Orders', Icon: ShoppingBag, route: '/(tabs)/orders' },
    { label: 'Delivery', Icon: Truck, route: '/delivery' },
  ];

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <HomeSkeleton insetTop={insets.top} />
        ) : (
          <>
            {/* ── Header ──────────────────────────────────────────────── */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
              <View style={styles.headerBlobLeft} />
              <View style={styles.headerBlobRight} />

              <View style={styles.headerTopRow}>
                <View style={styles.headerStoreInfo}>
                  <Text style={styles.headerGreeting}>{getGreeting()}, {ownerFirstName}</Text>
                  <Text style={styles.headerStoreName}>{storeName}</Text>
                  <View style={styles.openBadge}>
                    <View style={styles.openDot} />
                    <Text style={styles.openBadgeText}>Open</Text>
                  </View>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(tabs)/orders' as any)}
                  >
                    <Bell size={18} color={Colors.white} />
                    <View style={styles.notifBadge}>
                      <Text style={styles.notifBadgeText}>5</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerAvatarBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/profile' as any)}
                  >
                    <Image source={AvatarImg} style={styles.headerAvatar} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Alert strip */}
              <View style={styles.alertStrip}>
                <Animated.View style={[styles.alertDot, { opacity: blinkAnim }]} />
                <Text style={styles.alertText}>3 orders pending</Text>
                <View style={styles.alertDivider} />
                <Animated.View style={[styles.alertDotAmber, { opacity: blinkAnim }]} />
                <Text style={styles.alertTextAmber}>2 bargains waiting</Text>
              </View>

              {/* KPI row */}
              <View style={styles.kpiRow}>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiLabel}>Today's revenue</Text>
                  <Text style={styles.kpiValue}>
                    {formatCurrency(dashboardStore.todayRevenue || 12840)}
                  </Text>
                  <Text style={styles.kpiSubGreen}>+18% vs yday</Text>
                </View>
                <View style={styles.kpiDivider} />
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiLabel}>Orders</Text>
                  <Text style={styles.kpiValue}>{dashboardStore.todayOrders || 42}</Text>
                  <Text style={styles.kpiSub}>Active today</Text>
                </View>
                <View style={styles.kpiDivider} />
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiLabel}>Rating</Text>
                  <View style={styles.kpiRatingRow}>
                    <Text style={styles.kpiValue}>{dashboardStore.averageRating || 4.8}</Text>
                    <Star size={12} color="#FCD34D" fill="#FCD34D" />
                  </View>
                  <Text style={styles.kpiSub}>Excellent</Text>
                </View>
              </View>
            </View>

            {/* ── Quick Actions ───────────────────────────────────────── */}
            <View style={styles.quickActionsCard}>
              {quickActions.map(({ label, Icon, route }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.quickActionItem}
                  activeOpacity={0.8}
                  onPress={() => router.push(route as any)}
                >
                  <View style={styles.quickActionIconBg}>
                    <Icon size={22} color={Colors.primary} strokeWidth={2} />
                  </View>
                  <Text style={styles.quickActionLabel} numberOfLines={2}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── New Orders ──────────────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionLeft}>
                <Text style={styles.sectionTitle}>New Orders</Text>
                <Text style={[styles.sectionBadge, styles.sectionBadgeRed]}>
                  {orders.length} pending
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/(tabs)/orders' as any)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {orders.map((order: any, idx) => (
              <View key={order.id ?? idx} style={styles.orderCard}>
                <View style={styles.orderCardTop}>
                  <View style={styles.orderAvatar}>
                    <Text style={styles.orderAvatarText}>
                      {(order.customerName || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.orderMid}>
                    <Text style={styles.orderName}>{order.customerName}</Text>
                    <View style={styles.orderMetaRow}>
                      <Text style={[
                        styles.orderPayBadge,
                        order.paymentMethod === 'COD' ? styles.orderPayCod : styles.orderPayOnline,
                      ]}>
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online paid'}
                      </Text>
                      <Text style={styles.orderTime}>· {order.orderTime}</Text>
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>{formatCurrency(order.amount)}</Text>
                    <View style={styles.orderNewBadge}>
                      <Text style={styles.orderNewBadgeText}>New</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.orderMeta}>
                  <Text style={styles.orderMetaText}>{order.itemsCount} items</Text>
                  <Text style={styles.orderMetaDot}>·</Text>
                  <Text style={styles.orderMetaText}>{order.distance || '1.0 km'}</Text>
                </View>

                <View style={styles.orderBtnRow}>
                  <TouchableOpacity
                    style={styles.orderAcceptBtn}
                    activeOpacity={0.8}
                    onPress={() => handleAccept(order.id)}
                  >
                    <Text style={styles.orderAcceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.orderRejectBtn}
                    activeOpacity={0.8}
                    onPress={() => handleReject(order.id)}
                  >
                    <Text style={styles.orderRejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* ── Bargain Sessions ────────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionLeft}>
                <Text style={styles.sectionTitle}>Bargain Sessions</Text>
                <Text style={[styles.sectionBadge, styles.sectionBadgeAmber]}>
                  {STATIC_BARGAINS.length} waiting
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/(tabs)/bargaining' as any)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {STATIC_BARGAINS.map(b => (
              <View key={b.id} style={styles.bargainCard}>
                <View style={styles.bargainCardTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={styles.bargainAvatar}>
                      <Text style={styles.bargainAvatarText}>
                        {b.customerName.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bargainName}>{b.customerName}</Text>
                      <Text style={styles.bargainSub}>{b.items}</Text>
                    </View>
                  </View>
                  <Text style={b.status === 'urgent' ? styles.bargainStatusUrgent : styles.bargainStatusWaiting}>
                    {b.status === 'urgent' ? 'Urgent' : 'Waiting'}
                  </Text>
                </View>

                <View style={styles.bargainPricePanel}>
                  <View style={styles.bargainPriceSide}>
                    <Text style={styles.bargainPriceLabel}>Customer offer</Text>
                    <Text style={styles.bargainPriceCustomer}>{formatCurrency(b.customerOffer)}</Text>
                  </View>
                  <View style={styles.bargainPriceVsSep} />
                  <View style={[styles.bargainPriceSide, { alignItems: 'flex-end' }]}>
                    <Text style={styles.bargainPriceLabel}>Your price</Text>
                    <Text style={styles.bargainPriceMerchant}>{formatCurrency(b.yourPrice)}</Text>
                  </View>
                </View>

                <View style={styles.bargainExpiry}>
                  <View style={[styles.bargainExpiryDot, { backgroundColor: b.status === 'urgent' ? Colors.error : Colors.warning }]} />
                  <Text style={[styles.bargainExpiryText, { color: b.status === 'urgent' ? Colors.error : Colors.warning }]}>
                    Expires in {b.expiresIn}
                  </Text>
                  <Text style={styles.bargainGapText}>
                    Gap: {formatCurrency(b.yourPrice - b.customerOffer)}
                  </Text>
                </View>

                <View style={styles.bargainBtnRow}>
                  <TouchableOpacity style={styles.bargainAcceptBtn} activeOpacity={0.8}>
                    <Text style={styles.bargainAcceptText}>Accept {formatCurrency(b.customerOffer)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bargainCounterBtn} activeOpacity={0.8}>
                    <Text style={styles.bargainCounterText}>Counter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bargainDeclineBtn} activeOpacity={0.8}>
                    <Text style={styles.bargainDeclineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* ── Inventory Alerts ────────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionLeft}>
                <Text style={styles.sectionTitle}>Inventory Alerts</Text>
                <Text style={[styles.sectionBadge, styles.sectionBadgeRed]}>
                  {STATIC_INVENTORY.length} items
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/(tabs)/inventory' as any)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inventoryCard}>
              {STATIC_INVENTORY.map((item, i) => (
                <View
                  key={item.id}
                  style={[styles.inventoryRow, i > 0 && styles.inventoryRowBorder]}
                >
                  <View style={styles.inventoryImgBox}>
                    <Image source={item.img} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
                  </View>
                  <View style={styles.inventoryInfo}>
                    <Text style={styles.inventoryName}>{item.name}</Text>
                    <Text style={item.color === Colors.error ? styles.inventoryQtyRed : styles.inventoryQtyAmber}>
                      {item.qty}
                    </Text>
                    <View style={styles.inventoryProgBg}>
                      <View style={[styles.inventoryProg, { width: `${item.prog}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.inventoryActionBtn, { backgroundColor: item.bg }]}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(tabs)/inventory' as any)}
                  >
                    <Text style={[styles.inventoryActionText, { color: item.color }]}>{item.action}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* ── Revenue Snapshot ────────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Revenue Snapshot</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/analytics' as any)}
              >
                <Text style={styles.viewAllText}>Analytics</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.revenueGrid}>
              {REVENUE_DATA.map(snap => (
                <View key={snap.label} style={styles.revenueSnapCard}>
                  <Text style={styles.revenueSnapLabel}>{snap.label}</Text>
                  <Text style={styles.revenueSnapValue}>{snap.value}</Text>
                  <View style={styles.revenueSnapTrend}>
                    <ArrowUpRight size={12} color={Colors.success} />
                    <Text style={styles.revenueSnapTrendText}>{snap.trend}% vs last week</Text>
                  </View>
                  <View style={styles.revenueSparkWrap}>
                    <Sparkline data={snap.data} color={Colors.primary} width={((SCREEN_WIDTH - 42) / 2) - 28} height={32} />
                  </View>
                </View>
              ))}
            </View>

            {/* ── Activity Feed ────────────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/(tabs)/orders' as any)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.timelineWrap}>
              {ACTIVITY_FEED.map((activity, i) => {
                const { Icon } = activity;
                const isLast = i === ACTIVITY_FEED.length - 1;
                return (
                  <View key={i} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineIconCircle, { backgroundColor: activity.iconBg }]}>
                        <Icon size={13} color={activity.iconColor} />
                      </View>
                      {!isLast && (
                        <View style={[styles.timelineConnector, { backgroundColor: activity.connectorColor }]} />
                      )}
                    </View>
                    <View style={[styles.timelineRight, isLast && { paddingBottom: 0 }]}>
                      <Text style={styles.timelineLabel}>{activity.label}</Text>
                      <Text style={styles.timelineTime}>{activity.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </AnimatedScreen>
  );
});

