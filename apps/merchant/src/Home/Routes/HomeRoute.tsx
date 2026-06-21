import { router, useFocusEffect } from 'expo-router';
import {
  Award,
  BarChart2,
  Bell,
  Boxes,
  ChevronRight,
  Clock,
  MessageSquare,
  Package,
  PackagePlus,
  ShoppingBag,
  Star,
  Tags,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { useStores } from '../../Common/hooks/useStores';
import { Toast } from '../../components/ui/MerchantPrimitives';
import { Colors } from '../../theme/colors';
import styles from './styles';

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatExpiry(seconds: number): string {
  if (seconds <= 0) return 'Expired';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}


const STATIC_ORDERS = [
  { id: '1', customerName: 'Rahul Verma', amount: 694, itemsCount: 4, orderTime: '10 mins ago', paymentMethod: 'Online Payment', distance: '1.2 km' },
  { id: '2', customerName: 'Ananya Sen', amount: 1290, itemsCount: 5, orderTime: '25 mins ago', paymentMethod: 'COD', distance: '1.8 km' },
  { id: '3', customerName: 'Suresh Kumar', amount: 80, itemsCount: 1, orderTime: '45 mins ago', paymentMethod: 'Online Payment', distance: '0.6 km' },
];



function getActivityVisuals(eventType: string) {
  switch (eventType) {
    case 'ORDER_ACCEPTED':
      return {
        Icon: ShoppingBag,
        iconColor: Colors.primary,
        iconBg: Colors.primaryLight,
        connectorColor: Colors.primaryLight,
      };
    case 'BARGAIN_OFFER_ACCEPTED':
    case 'BARGAIN_OFFER_REJECTED':
      return {
        Icon: Tags,
        iconColor: '#8B5CF6',
        iconBg: '#F3E8FF',
        connectorColor: '#F3E8FF',
      };
    case 'BATCH_ADDED':
      return {
        Icon: Package,
        iconColor: Colors.info,
        iconBg: Colors.infoBg,
        connectorColor: Colors.infoBg,
      };
    case 'ORDER_CANCELLED':
      return {
        Icon: X,
        iconColor: Colors.error,
        iconBg: Colors.errorBg,
        connectorColor: Colors.errorBg,
      };
    case 'ORDER_STATUS_CHANGED':
    default:
      return {
        Icon: Award,
        iconColor: Colors.success,
        iconBg: Colors.successBg,
        connectorColor: Colors.successBg,
      };
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
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
          <View key={i} style={[styles.revenueSnapCard, { gap: 8 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonBox width={32} height={32} borderRadius={16} />
              <SkeletonBox width={40} height={18} borderRadius={9} />
            </View>
            <SkeletonBox width={60} height={10} />
            <SkeletonBox width={80} height={22} />
          </View>
        ))}
      </View>
    </>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────
export default observer(function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { authStore, dashboardStore, ordersStore, sessionStore, bargainingStore, inventoryStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'neutral' });

  const blinkAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        dashboardStore.refreshMetrics(),
        ordersStore.fetchOrders('New Orders'),
        inventoryStore.fetchStockAlerts(),
        bargainingStore.loadSessions(),
      ]).finally(() => setIsLoading(false));
    }, [dashboardStore, ordersStore, inventoryStore, bargainingStore]),
  );

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

  const orders = ordersStore.newOrders;

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
                </View>
              </View>

              {/* Alert strip */}
              <View style={styles.alertStrip}>
                <Animated.View style={[styles.alertDot, { opacity: blinkAnim }]} />
                <Text style={styles.alertText}>{dashboardStore.pendingOrders} orders pending</Text>
                <View style={styles.alertDivider} />
                <Animated.View style={[styles.alertDotAmber, { opacity: blinkAnim }]} />
                <Text style={styles.alertTextAmber}>{bargainingStore.pendingBargains.length} bargains waiting</Text>
              </View>

              {/* KPI row */}
              <View style={styles.kpiRow}>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiLabel}>Today&apos;s revenue</Text>
                  <Text style={styles.kpiValue}>
                    {formatCurrency(dashboardStore.todayRevenue)}
                  </Text>
                  <Text style={styles.kpiSubGreen}>+18% vs yday</Text>
                </View>
                <View style={styles.kpiDivider} />
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiLabel}>Orders</Text>
                  <Text style={styles.kpiValue}>{dashboardStore.todayOrders}</Text>
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

            {orders.length === 0 && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: Colors.textMuted, fontSize: 14 }}>No new orders right now</Text>
              </View>
            )}

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
                {(bargainingStore.activeDeals + bargainingStore.chatAlerts.length) > 0 && (
                  <Text style={[styles.sectionBadge, styles.sectionBadgeAmber]}>
                    {bargainingStore.activeDeals + bargainingStore.chatAlerts.length} waiting
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/(tabs)/bargaining' as any)}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={13} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* WS notification cards — new offers and customer messages */}
            {bargainingStore.chatAlerts.map(alert => (
              <View
                key={alert.id}
                style={[styles.bargainCard, { borderLeftWidth: 3, borderLeftColor: alert.type === 'offer' ? Colors.primary : Colors.warning }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.bargainAvatar, { backgroundColor: alert.type === 'offer' ? Colors.primaryLight : '#FEF3C7' }]}>
                    {alert.type === 'offer'
                      ? <Tags size={16} color={Colors.primary} />
                      : <MessageSquare size={16} color={Colors.warning} />
                    }
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.bargainName}>{alert.customerName}</Text>
                    <Text style={styles.bargainSub} numberOfLines={2}>{alert.message}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => bargainingStore.dismissChatAlert(alert.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <TouchableOpacity
                    style={[styles.bargainAcceptBtn, { flex: 1 }]}
                    activeOpacity={0.8}
                    onPress={() => {
                      bargainingStore.dismissChatAlert(alert.id);
                      router.push(`/bargaining/${alert.sessionId}` as any);
                    }}
                  >
                    <Text style={styles.bargainAcceptText}>View Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bargainDeclineBtn, { paddingHorizontal: 16 }]}
                    activeOpacity={0.8}
                    onPress={() => bargainingStore.dismissChatAlert(alert.id)}
                  >
                    <Text style={styles.bargainDeclineText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Live pending bargain sessions from API */}
            {bargainingStore.pendingBargains.map(b => (
              <View key={b.id} style={styles.bargainCard}>
                <View style={styles.bargainCardTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={styles.bargainAvatar}>
                      <Text style={styles.bargainAvatarText}>
                        {b.customerName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bargainName}>{b.customerName}</Text>
                      <Text style={styles.bargainSub}>{b.productName}</Text>
                    </View>
                  </View>
                  <Text style={b.isExpiringSoon ? styles.bargainStatusUrgent : styles.bargainStatusWaiting}>
                    {b.isExpiringSoon ? 'Urgent' : 'Waiting'}
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
                    <Text style={styles.bargainPriceMerchant}>{formatCurrency(b.originalPrice)}</Text>
                  </View>
                </View>

                <View style={styles.bargainExpiry}>
                  <View style={[styles.bargainExpiryDot, { backgroundColor: b.isExpiringSoon ? Colors.error : Colors.warning }]} />
                  <Text style={[styles.bargainExpiryText, { color: b.isExpiringSoon ? Colors.error : Colors.warning }]}>
                    {b.expirationTime > 0 ? `Expires in ${formatExpiry(b.expirationTime)}` : 'Expiring soon'}
                  </Text>
                  <Text style={styles.bargainGapText}>
                    Gap: {formatCurrency(Math.max(0, b.originalPrice - b.customerOffer))}
                  </Text>
                </View>

                <View style={styles.bargainBtnRow}>
                  <TouchableOpacity
                    style={styles.bargainAcceptBtn}
                    activeOpacity={0.8}
                    onPress={() => bargainingStore.acceptBargain(b.id)}
                  >
                    <Text style={styles.bargainAcceptText}>Accept {formatCurrency(b.customerOffer)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bargainCounterBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/bargaining/${b.id}` as any)}
                  >
                    <Text style={styles.bargainCounterText}>Counter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bargainDeclineBtn}
                    activeOpacity={0.8}
                    onPress={() => bargainingStore.rejectBargain(b.id)}
                  >
                    <Text style={styles.bargainDeclineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {bargainingStore.pendingBargains.length === 0 && bargainingStore.chatAlerts.length === 0 && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center' }}>
                <Text style={{ color: Colors.textMuted, fontSize: 14 }}>No active bargain sessions</Text>
              </View>
            )}

            {/* ── Inventory Alerts ────────────────────────────────────── */}
            {(() => {
              const outOfStock = inventoryStore.outOfStockItems;
              const lowStock = inventoryStore.lowStockItems;
              const alertItems = [...outOfStock, ...lowStock].slice(0, 3);
              if (inventoryStore.alertStockState === 'loading' || alertItems.length === 0) return null;
              return (
                <>
                  <View style={styles.sectionRow}>
                    <View style={styles.sectionLeft}>
                      <Text style={styles.sectionTitle}>Inventory Alerts</Text>
                      <Text style={[styles.sectionBadge, styles.sectionBadgeRed]}>
                        {alertItems.length} items
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
                    {alertItems.map((item, i) => {
                      const qty = Number(item.available_stock);
                      const isOut = qty <= 0;
                      const color = isOut ? Colors.error : Colors.warning;
                      const bg = isOut ? Colors.errorBg : Colors.warningBg;
                      const prog = isOut ? 1 : Math.min(Math.round((qty / 5) * 20), 20);
                      return (
                        <View key={item.variant_id} style={[styles.inventoryRow, i > 0 && styles.inventoryRowBorder]}>
                          <View style={[styles.inventoryImgBox, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.primary }}>
                              {item.product_name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.inventoryInfo}>
                            <Text style={styles.inventoryName}>{item.product_name} ({item.variant_name})</Text>
                            <Text style={isOut ? styles.inventoryQtyRed : styles.inventoryQtyAmber}>
                              {isOut ? 'Out of stock' : `${qty} ${item.unit_symbol} · Low stock`}
                            </Text>
                            <View style={styles.inventoryProgBg}>
                              <View style={[styles.inventoryProg, { width: `${prog}%`, backgroundColor: color }]} />
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.inventoryActionBtn, { backgroundColor: bg }]}
                            activeOpacity={0.8}
                            onPress={() => router.push('/(tabs)/inventory' as any)}
                          >
                            <Text style={[styles.inventoryActionText, { color }]}>
                              {isOut ? 'Restock' : 'Add stock'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </>
              );
            })()}

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
              {/* Revenue Today */}
              <View style={styles.revenueSnapCard}>
                <View style={styles.revenueCardHeader}>
                  <View style={[styles.revenueIconCircle, { backgroundColor: Colors.success + '20' }]}>
                    <TrendingUp size={16} color={Colors.success} />
                  </View>
                  <View style={styles.revenuePeriodPill}>
                    <Text style={styles.revenuePeriodText}>Today</Text>
                  </View>
                </View>
                <Text style={styles.revenueSnapLabel}>Revenue</Text>
                <Text style={styles.revenueSnapValue}>{formatCurrency(dashboardStore.todayRevenue)}</Text>
              </View>

              {/* Orders Today */}
              <View style={styles.revenueSnapCard}>
                <View style={styles.revenueCardHeader}>
                  <View style={[styles.revenueIconCircle, { backgroundColor: Colors.primary + '20' }]}>
                    <ShoppingBag size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.revenuePeriodPill}>
                    <Text style={styles.revenuePeriodText}>Today</Text>
                  </View>
                </View>
                <Text style={styles.revenueSnapLabel}>Orders</Text>
                <Text style={styles.revenueSnapValue}>{dashboardStore.todayOrders}</Text>
              </View>

              {/* Pending Orders */}
              <View style={styles.revenueSnapCard}>
                <View style={styles.revenueCardHeader}>
                  <View style={[styles.revenueIconCircle, { backgroundColor: Colors.warning + '20' }]}>
                    <Clock size={16} color={Colors.warning} />
                  </View>
                  <View style={[styles.revenuePeriodPill, { backgroundColor: Colors.warning + '20' }]}>
                    <Text style={[styles.revenuePeriodText, { color: Colors.warning }]}>Action</Text>
                  </View>
                </View>
                <Text style={styles.revenueSnapLabel}>Pending</Text>
                <Text style={styles.revenueSnapValue}>{dashboardStore.pendingOrders}</Text>
              </View>

              {/* Avg. Order Value */}
              <View style={styles.revenueSnapCard}>
                <View style={styles.revenueCardHeader}>
                  <View style={[styles.revenueIconCircle, { backgroundColor: '#3B82F620' }]}>
                    <BarChart2 size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.revenuePeriodPill}>
                    <Text style={styles.revenuePeriodText}>Today</Text>
                  </View>
                </View>
                <Text style={styles.revenueSnapLabel}>Avg. Order</Text>
                <Text style={styles.revenueSnapValue}>
                  {dashboardStore.todayOrders > 0
                    ? formatCurrency(dashboardStore.todayRevenue / dashboardStore.todayOrders)
                    : '—'}
                </Text>
              </View>
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
              {dashboardStore.activityLog.length === 0 ? (
                <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ color: Colors.textMuted, fontSize: 13 }}>No recent activity</Text>
                </View>
              ) : (
                dashboardStore.activityLog.map((activity, i) => {
                  const visuals = getActivityVisuals(activity.event_type);
                  const { Icon } = visuals;
                  const isLast = i === dashboardStore.activityLog.length - 1;
                  return (
                    <View key={activity.id ?? i} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineIconCircle, { backgroundColor: visuals.iconBg }]}>
                          <Icon size={13} color={visuals.iconColor} />
                        </View>
                        {!isLast && (
                          <View style={[styles.timelineConnector, { backgroundColor: visuals.connectorColor }]} />
                        )}
                      </View>
                      <View style={[styles.timelineRight, isLast && { paddingBottom: 0 }]}>
                        <Text style={styles.timelineLabel}>{activity.description}</Text>
                        <Text style={styles.timelineTime}>{formatRelativeTime(activity.created_at)}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </AnimatedScreen>
  );
});

