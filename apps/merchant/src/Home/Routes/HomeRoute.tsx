import { router } from 'expo-router';
import {
  AlignLeft,
  ArrowUpRight, Award, Bell, Boxes, ChevronDown, ChevronRight,
  Heart,
  Package, PackagePlus, ShoppingBag, Sparkles, Star, Tags, Truck
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView, StatusBar, Text,
  TouchableOpacity, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Polyline, Svg } from 'react-native-svg';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { useStores } from '../../Common/hooks/useStores';
import { Toast } from '../../components/ui/MerchantPrimitives';
import { Colors } from '../../theme/colors';
import styles from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mockup Images
const TomatoImg = require('../../../assets/images/tomato.png');
const MilkImg = require('../../../assets/images/milk.png');
const BreadImg = require('../../../assets/images/bread.png');
const BananaImg = require('../../../assets/images/banana.png');
const AvatarImg = require('../../../assets/images/avatar.png');

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const REVENUE_TREND = [22, 35, 28, 48, 40, 60, 52, 78];

const REVENUE_SNAPSHOT = [
  { label: 'Revenue', value: '₹86,430', trend: 16, color: Colors.success, data: [30, 40, 35, 55, 48, 65, 60, 80] },
  { label: 'Orders', value: '268', trend: 12, color: Colors.success, data: [40, 38, 50, 46, 58, 55, 68, 72] },
  { label: 'Customers', value: '142', trend: 18, color: Colors.success, data: [20, 28, 25, 38, 34, 48, 44, 60] },
];

const PERIODS = ['Today', 'This Week', 'This Month'];

function Sparkline({ data, color, width = 110, height = 36 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(' ');
  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* End Dot */}
      {data.length > 0 && (
        <Circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r={4}
          fill={color}
        />
      )}
    </Svg>
  );
}

function CircularGauge({ score, size = 80, strokeWidth = 8, color, label }: { score: number; size?: number; strokeWidth?: number; color: string; label: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (score / 100);
  return (
    <View style={[styles.gaugeWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={Colors.borderLight} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress}, ${circumference}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.gaugeInner}>
        <Text style={styles.gaugeScore}>{score}</Text>
        <Text style={styles.gaugePercent}>/100</Text>
      </View>
    </View>
  );
}

export default observer(function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { authStore, dashboardStore, ordersStore, inventoryStore, sessionStore } = useStores();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'neutral' });
  const [revenuePeriod, setRevenuePeriod] = useState(0);
  const [snapshotPeriod, setSnapshotPeriod] = useState(1);

  useEffect(() => {
    if (inventoryStore.stock.length === 0 && inventoryStore.stockState === 'idle') {
      void inventoryStore.fetchStock();
    }
    void ordersStore.fetchOrders('New Orders');
    void dashboardStore.refreshMetrics();
  }, [inventoryStore, ordersStore, dashboardStore]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'neutral' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  const handleAccept = (id: string) => { ordersStore.acceptOrder(id); showToast('Order accepted ✓'); };
  const handleReject = (id: string) => { ordersStore.rejectOrder(id); showToast('Order rejected', 'neutral'); };

  const storeName = authStore.storeName || 'FreshMart Hyperlocal';
  const ownerFirstName = sessionStore.user?.full_name?.trim().split(/\s+/)[0] || 'Yaswanth';

  // Real orders count or fallback
  const newOrders = ordersStore.newOrders.length > 0 ? ordersStore.newOrders : [
    { id: '1', customerName: 'Rahul Verma', amount: 694, itemsCount: 4, orderTime: '10 mins ago', paymentMethod: 'Online Payment', distance: '1.2 km away' },
    { id: '2', customerName: 'Ananya Sen', amount: 1290, itemsCount: 5, orderTime: '25 mins ago', paymentMethod: 'COD', distance: '1.8 km away' },
    { id: '3', customerName: 'Suresh Kumar', amount: 80, itemsCount: 1, orderTime: '45 mins ago', paymentMethod: 'Online Payment', distance: '0.6 km away' },
  ];

  const avgOrderValue = dashboardStore.todayOrders > 0
    ? Math.round(dashboardStore.todayRevenue / dashboardStore.todayOrders)
    : 306;

  const quickActions = [
    { label: 'Add Product', icon: PackagePlus, route: '/(tabs)/products' },
    { label: 'Inventory', icon: Boxes, route: '/(tabs)/inventory' },
    { label: 'Orders', icon: ShoppingBag, route: '/(tabs)/orders' },
    { label: 'Delivery Partners', icon: Truck, route: '/delivery' },
  ];

  const staticInventoryAlerts = [
    { id: '1', name: 'Tomatoes (1kg)', qty: '0 left', alert: 'Out of Stock', action: 'Restock Now', color: Colors.error, bg: Colors.errorBg, img: TomatoImg },
    { id: '2', name: 'Milk (1L)', qty: '5 left', alert: 'Low Stock', action: 'Low stock', color: Colors.warning, bg: Colors.warningBg, img: MilkImg, subtitle: 'Depletes in 3 hrs' },
    { id: '3', name: 'Bread', qty: '12 left', alert: 'Low Stock', action: 'Low stock', color: Colors.warning, bg: Colors.warningBg, img: BreadImg, subtitle: 'Depletes in 5 hrs' },
    // { id: '4', name: 'Banana (1doz)', qty: '120 left', alert: 'Over Stock', action: 'View Insights', color: Colors.info, bg: Colors.infoBg, img: BananaImg, subtitle: 'Sales slowing down' },
  ];

  const activityFeed = [
    { icon: ShoppingBag, label: 'Order #2847 accepted', time: '10 mins ago', active: true },
    { icon: Award, label: 'Payment ₹420 received', time: '25 mins ago', active: true },
    { icon: Package, label: 'Inventory updated', time: '1 hr ago', active: true },
    { icon: Tags, label: 'Offer created 10% OFF Fruits', time: '2 hrs ago', active: true },
    { icon: Truck, label: 'Order #2846 delivered', time: '3 hrs ago', active: true },
  ];

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0B6B49" translucent />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>

        {/* ── Premium Gradient Hero Header ───────────────────────────────── */}
        <View style={[styles.heroContainer, { paddingTop: insets.top + 12 }]}>
          {/* Decorative radial gradients/blobs */}
          <View style={styles.radialBlobLeft} />
          <View style={styles.radialBlobRight} />

          {/* Top navigation row */}
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.navCircButton} activeOpacity={0.8}>
              <AlignLeft size={20} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.greetingText}>{getGreeting()}, {ownerFirstName} 👋</Text>
              <Text style={styles.storeNameText}>{storeName}</Text>
              <View style={styles.roleBadgeContainer}>
                <Text style={styles.roleBadgeText}>Shop Owner</Text>
              </View>
            </View>

            <View style={styles.navActionGroup}>
              <TouchableOpacity style={styles.navCircButton} activeOpacity={0.8} onPress={() => router.push('/(tabs)/orders' as any)}>
                <Bell size={20} color={Colors.white} />
                <View style={styles.notifAlertDot}><Text style={styles.notifAlertText}>3</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileAvatarButton} activeOpacity={0.8} onPress={() => router.push('/profile' as any)}>
                <Image source={AvatarImg} style={styles.profileAvatarImage} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Revenue Card (Dark Forest Green Container) */}
          <View style={styles.revenueHeroCard}>
            <View style={styles.revenueCardTop}>
              <Text style={styles.revenueLabel}>Today's Revenue</Text>
              <TouchableOpacity
                style={styles.periodSelectorPill}
                activeOpacity={0.8}
                onPress={() => setRevenuePeriod((p) => (p + 1) % PERIODS.length)}
              >
                <Text style={styles.periodSelectorText}>{PERIODS[revenuePeriod]}</Text>
                <ChevronDown size={14} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>

            <View style={styles.revenueMiddleRow}>
              <View>
                <Text style={styles.revenueValueText}>
                  {formatCurrency(dashboardStore.todayRevenue || 12840)}
                </Text>
                <View style={styles.growthIndicatorContainer}>
                  <ArrowUpRight size={14} color={Colors.success} />
                  <Text style={styles.growthIndicatorText}>18% vs yesterday</Text>
                </View>
              </View>

              <View style={styles.revenueChartWrap}>
                <Sparkline data={REVENUE_TREND} color={Colors.white} width={130} height={38} />
                <Text style={styles.chartTimeLabel}>6PM</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.analyticsActionRow} activeOpacity={0.7} onPress={() => router.push('/analytics' as any)}>
              <Text style={styles.analyticsActionText}>View Analytics</Text>
              <ChevronRight size={14} color={Colors.white} />
            </TouchableOpacity>

            {/* Bottom statistics bar (Merged inside the card) */}
            <View style={styles.innerStatsContainer}>
              <View style={styles.innerStatItem}>
                <Text style={styles.innerStatVal}>{dashboardStore.todayOrders || 42}</Text>
                <Text style={styles.innerStatLbl}>Orders</Text>
              </View>
              <View style={styles.innerStatDivider} />
              <View style={styles.innerStatItem}>
                <Text style={styles.innerStatVal}>{formatCurrency(avgOrderValue)}</Text>
                <Text style={styles.innerStatLbl}>Avg. Order Value</Text>
              </View>
              <View style={styles.innerStatDivider} />
              <View style={styles.innerStatItem}>
                <View style={styles.ratingInlineRow}>
                  <Text style={styles.innerStatVal}>{dashboardStore.averageRating || 4.8}</Text>
                  <Star size={13} color={Colors.accent} fill={Colors.accent} />
                </View>
                <Text style={styles.innerStatLbl}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Performance Banner Card ────────────────────────────────────── */}
        <View style={styles.performanceBannerWrapper}>
          <View style={styles.perfBannerIconCol}>
            <View style={styles.perfBagIconContainer}>
              <ShoppingBag size={22} color={Colors.primary} />
            </View>
          </View>
          <View style={styles.perfBannerMiddleCol}>
            <Text style={styles.perfBannerHeading}>Your shop is performing great! 🎉</Text>
            <Text style={styles.perfBannerSubheading}>
              Keep up the amazing work! You're doing better than 85% of similar stores.
            </Text>
          </View>
          <View style={styles.perfBannerRightCol}>
            <View style={styles.trendStatBadge}>
              <ArrowUpRight size={12} color={Colors.success} />
              <Text style={styles.trendStatText}>18%</Text>
            </View>
            <Text style={styles.trendSubLabel}>higher revenue</Text>
          </View>
        </View>

        {/* Banner carousel page dots */}
        <View style={styles.carouselDotsContainer}>
          <View style={[styles.carouselDot, styles.carouselDotActive]} />
          <View style={styles.carouselDot} />
          <View style={styles.carouselDot} />
          <View style={styles.carouselDot} />
        </View>

        {/* ── Quick Actions Grid ─────────────────────────────────────────── */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map(({ label, icon: Icon, route }) => (
            <TouchableOpacity key={label} style={styles.quickActionItem} activeOpacity={0.85} onPress={() => router.push(route as any)}>
              <View style={styles.quickActionIconBg}>
                <Icon size={22} color={Colors.white} strokeWidth={2.2} />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={2}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── New Orders Section ────────────────────────────────────────── */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeadingTitle}>New Orders ({newOrders.length})</Text>
          <TouchableOpacity style={styles.viewAllActionButton} onPress={() => router.push('/(tabs)/orders' as any)}>
            <Text style={styles.viewAllActionText}>View all</Text>
            <ChevronRight size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardListScroll}>
          {newOrders.map((order: any, idx) => (
            <View key={order.id || idx} style={styles.horizontalOrderCard}>
              {/* Card Header */}
              <View style={styles.orderCardHeaderRow}>
                <View style={styles.orderInitialsAvatar}>
                  <Text style={styles.orderInitialsText}>
                    {(order.customerName || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.orderCardHeaderMid}>
                  <Text style={styles.orderCardCustomerName}>{order.customerName}</Text>
                  <View style={styles.orderPaymentBadgeRow}>
                    <View style={[
                      styles.orderPayBadge,
                      { backgroundColor: order.paymentMethod === 'COD' ? '#FEF3C7' : '#DCFCE7' }
                    ]}>
                      <Text style={[
                        styles.orderPayBadgeText,
                        { color: order.paymentMethod === 'COD' ? '#D97706' : Colors.primary }
                      ]}>
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.orderCardHeaderRight}>
                  <Text style={styles.orderAmountValue}>{formatCurrency(order.amount)}</Text>
                  <View style={styles.newBadgePill}><Text style={styles.newBadgeText}>New</Text></View>
                </View>
              </View>

              {/* Card Details Row */}
              <View style={styles.orderCardMetaRow}>
                <Text style={styles.orderMetaTextItem}>{order.itemsCount} items</Text>
                <Text style={styles.orderMetaDot}>•</Text>
                <Text style={styles.orderMetaTextItem}>{order.orderTime}</Text>
                <Text style={styles.orderMetaDot}>•</Text>
                <Text style={styles.orderMetaTextItem}>{order.distance || '1.0 km away'}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.orderCardActionRow}>
                <TouchableOpacity style={styles.orderCardAcceptBtn} activeOpacity={0.8} onPress={() => handleAccept(order.id)}>
                  <Text style={styles.orderCardAcceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.orderCardRejectBtn} activeOpacity={0.8} onPress={() => handleReject(order.id)}>
                  <Text style={styles.orderCardRejectText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── Inventory Alerts Section ──────────────────────────────────── */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeadingTitle}>Inventory Alerts</Text>
          <TouchableOpacity style={styles.viewAllActionButton} onPress={() => router.push('/(tabs)/inventory' as any)}>
            <Text style={styles.viewAllActionText}>View all</Text>
            <ChevronRight size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardListScroll}>
          {staticInventoryAlerts.map((alert) => (
            <View key={alert.id} style={styles.inventoryAlertCard}>
              <View style={styles.inventoryCardTop}>
                {alert.img ? (
                  <Image source={alert.img} style={styles.inventoryItemImage} />
                ) : (
                  <View style={styles.inventoryImagePlaceholder} />
                )}
                <View style={styles.inventoryDetailsCol}>
                  <View style={[styles.stockStatusBadge, { backgroundColor: alert.bg }]}>
                    <Text style={[styles.stockStatusText, { color: alert.color }]}>{alert.alert}</Text>
                  </View>
                  <Text style={styles.inventoryItemName} numberOfLines={1}>{alert.name}</Text>
                  <Text style={[styles.inventoryItemQty, { color: alert.color }]}>{alert.qty}</Text>
                  {alert.subtitle && <Text style={styles.inventoryItemSubtext}>{alert.subtitle}</Text>}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.inventoryRestockBtn, { backgroundColor: alert.bg }]}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/inventory' as any)}
              >
                <Text style={[styles.inventoryRestockText, { color: alert.color }]}>{alert.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* ── AI Insights & Store Health (Side by side/grid layout) ──────────────────── */}
        {/* <View style={styles.sideBySideContainer}>
          <View style={styles.aiInsightsCard}>
            <View style={styles.cardHeaderWithIcon}>
              <Text style={styles.cardHeaderTitleText}>AI Insights</Text>
              <Sparkles size={16} color={Colors.primary} />
            </View>

            <View style={styles.aiInsightRowItem}>
              <View style={styles.aiInsightGreenIconContainer}>
                <ArrowUpRight size={14} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiInsightParagraphText}>
                  Sales likely to increase <Text style={styles.boldText}>between 6 PM - 9 PM today</Text>
                </Text>
                <Text style={styles.aiInsightRecommendationText}>
                  Recommended: Add 20 Milk, 15 Bread to handle demand
                </Text>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidencePillText}>Confidence 89%</Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.aiInsightRowItem}>
              <View style={styles.aiInsightPurpleIconContainer}>
                <Tags size={14} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiInsightParagraphText}>Offer Opportunity</Text>
                <Text style={styles.aiInsightRecommendationText}>
                  Create 10% OFF on Fruits & Vegetables. Expected boost: +12%
                </Text>
                <TouchableOpacity style={styles.inlineCreateOfferBtn} activeOpacity={0.8} onPress={() => router.push('/(tabs)/products' as any)}>
                  <Text style={styles.inlineCreateOfferText}>Create Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.storeHealthCard}>
            <View style={styles.cardHeaderWithIcon}>
              <Text style={styles.cardHeaderTitleText}>Store Health</Text>
              <TouchableOpacity onPress={() => router.push('/analytics' as any)}>
                <Text style={styles.storeHealthDetailsLink}>View details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.healthGaugeContainer}>
              <CircularGauge score={92} color={Colors.primary} label="Excellent" />
              <View style={styles.healthScoreTextCol}>
                <Text style={styles.healthNumberText}>92</Text>
                <Text style={styles.healthOutOfText}>/100</Text>
                <View style={styles.healthLevelBadge}>
                  <Text style={styles.healthLevelBadgeText}>Excellent</Text>
                </View>
              </View>
            </View>

            <View style={styles.healthBreakdownRows}>
              <View style={styles.healthBreakdownRowItem}>
                <Text style={styles.healthBreakdownLabel}>Acceptance Rate</Text>
                <Text style={styles.healthBreakdownValueText}>98%</Text>
              </View>
              <View style={styles.healthBreakdownRowItem}>
                <Text style={styles.healthBreakdownLabel}>Response Time</Text>
                <Text style={styles.healthBreakdownValueText}>48 sec</Text>
              </View>
              <View style={styles.healthBreakdownRowItem}>
                <Text style={styles.healthBreakdownLabel}>Customer Rating</Text>
                <Text style={styles.healthBreakdownValueText}>4.8 ★</Text>
              </View>
              <View style={styles.healthBreakdownRowItem}>
                <Text style={styles.healthBreakdownLabel}>Delivery Success</Text>
                <Text style={styles.healthBreakdownValueText}>96%</Text>
              </View>
            </View>

            <View style={styles.healthCardFooter}>
              <Heart size={14} color={Colors.error} fill={Colors.error} />
              <Text style={styles.healthFooterText}>You're doing better than 92% of stores!</Text>
            </View>
          </View>
        </View> */}

        {/* ── Revenue Snapshot Section ──────────────────────────────────── */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeadingTitle}>Revenue Snapshot</Text>
          <TouchableOpacity style={styles.periodSelectorPill} activeOpacity={0.8} onPress={() => setSnapshotPeriod((p) => (p + 1) % PERIODS.length)}>
            <Text style={styles.snapshotPeriodText}>{PERIODS[snapshotPeriod]}</Text>
            <ChevronDown size={12} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardListScroll}>
          {REVENUE_SNAPSHOT.map((snap) => (
            <View key={snap.label} style={styles.snapshotCard}>
              <Text style={styles.snapshotLabelText}>{snap.label}</Text>
              <Text style={styles.snapshotValueText}>{snap.value}</Text>
              <View style={styles.snapshotTrendRowItem}>
                <ArrowUpRight size={12} color={Colors.primary} />
                <Text style={styles.snapshotTrendPercentText}>{snap.trend}% vs last week</Text>
              </View>
              <View style={styles.snapshotSparklineWrap}>
                <Sparkline data={snap.data} color={Colors.primary} width={120} height={32} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── Your Activity Section ─────────────────────────────────────── */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeadingTitle}>Your Activity</Text>
          <TouchableOpacity style={styles.viewAllActionButton} onPress={() => router.push('/(tabs)/orders' as any)}>
            <Text style={styles.viewAllActionText}>View all</Text>
            <ChevronRight size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.timelineWrapper}>
          {activityFeed.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <View key={i} style={styles.timelineNodeItem}>
                <View style={styles.timelineLeftColumn}>
                  <View style={styles.timelineCircleBadge}>
                    <Icon size={14} color={Colors.primary} />
                  </View>
                  {i < activityFeed.length - 1 && <View style={styles.timelineConnectorLine} />}
                </View>
                <View style={styles.timelineRightColumn}>
                  <Text style={styles.timelineLabelTitle}>{activity.label}</Text>
                  <Text style={styles.timelineTimeText}>{activity.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
});
