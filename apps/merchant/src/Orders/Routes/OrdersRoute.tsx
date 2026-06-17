import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
  User,
  AlertTriangle,
  BarChart2
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
import { Button } from '../../components/ui/Button';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { ORDER_STATUSES } from '../Constants/statuses';
import styles from './styles';

function getUrgency(orderTime: string): { color: string; label: string; mins: number } {
  const now = new Date();
  const [time, meridiem] = orderTime.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hours = h;
  if (meridiem === 'PM' && h !== 12) hours += 12;
  if (meridiem === 'AM' && h === 12) hours = 0;
  const orderDate = new Date(now);
  orderDate.setHours(hours, m, 0, 0);
  const diffMs = now.getTime() - orderDate.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));

  if (mins < 5) return { color: Colors.success, label: 'Fresh', mins };
  if (mins < 15) return { color: Colors.warning, label: 'Attention', mins };
  return { color: Colors.error, label: 'Critical', mins };
}

function PulseDot() {
  const pulse = useRef(new Animated.Value(1)).current;
  const op = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 2, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(op, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(op, { toValue: 0.5, duration: 900, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }, []);
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: Colors.success,
          opacity: op,
          transform: [{ scale: pulse }],
        }}
      />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success }} />
    </View>
  );
}

export default observer(function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { ordersStore, deliveryStore, dashboardStore } = useStores();
  const [selectedStatus, setSelectedStatus] = useState('New Orders');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  useEffect(() => {
    void ordersStore.fetchOrders(selectedStatus);
    void dashboardStore.refreshMetrics();
  }, [ordersStore, dashboardStore, selectedStatus]);

  const activeOrder = ordersStore.orders.find((o) => o.id === selectedOrderId);

  const countFor = (key: string) => {
    if (key === 'New Orders') return ordersStore.newOrders.length;
    if (key === 'Accepted') return ordersStore.acceptedOrders.length;
    if (key === 'Packed') return ordersStore.packedOrders.length;
    if (key === 'Out For Delivery') return ordersStore.outForDeliveryOrders.length;
    if (key === 'Delivered') return ordersStore.deliveredOrders.length;
    return ordersStore.cancelledOrders.length;
  };

  const filteredOrders = (() => {
    if (selectedStatus === 'New Orders') return ordersStore.newOrders;
    if (selectedStatus === 'Accepted') return ordersStore.acceptedOrders;
    if (selectedStatus === 'Packed') return ordersStore.packedOrders;
    if (selectedStatus === 'Out For Delivery') return ordersStore.outForDeliveryOrders;
    if (selectedStatus === 'Delivered') return ordersStore.deliveredOrders;
    return ordersStore.cancelledOrders;
  })();

  const advance = (id: string, status: string) => {
    const order = ordersStore.orders.find((o) => o.id === id);
    if (!order) return;
    if (status === 'Accepted') {
      void ordersStore.advanceOrder(id, 'PACKING');
    }
    if (status === 'Packed') {
      if (!order.deliveryPartnerId) { setAssigningOrderId(id); return; }
      void ordersStore.advanceOrder(id, 'OUT_FOR_DELIVERY');
    }
    if (status === 'Out For Delivery') {
      void ordersStore.advanceOrder(id, 'DELIVERED');
    }
  };

  const newCount = ordersStore.newOrders.length;

  return (
    <AnimatedScreen style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* Header Panel */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitleText}>Orders</Text>
            <View style={styles.liveIndicatorRow}>
              <PulseDot />
              <Text style={styles.liveIndicatorText}>Store Live</Text>
            </View>
          </View>
          <View style={styles.headerActionGroup}>
            <TouchableOpacity style={styles.headerSquareBtn} activeOpacity={0.8}>
              <Search size={18} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerSquareBtn} activeOpacity={0.8}>
              <Bell size={18} color="#0F172A" />
              {newCount > 0 && <View style={styles.redBadgeDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* KPIs horizontal metrics scroll bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiCardsContent}
          style={styles.kpiCardsScroll}
        >
          <View style={styles.kpiCardItem}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#E7F8F0' }]}>
              <ShoppingBag size={14} color={Colors.primary} />
            </View>
            <Text style={styles.kpiLabelText}>New Orders</Text>
            <Text style={[styles.kpiValueText, { color: Colors.primary }]}>{newCount || '2'}</Text>
            <Text style={styles.kpiSubText}>Pending</Text>
          </View>

          <View style={styles.kpiCardItem}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0284C7' }}>₹</Text>
            </View>
            <Text style={styles.kpiLabelText}>Revenue Today</Text>
            <Text style={[styles.kpiValueText, { color: '#0F172A' }]}>₹12.8k</Text>
            <Text style={[styles.kpiSubText, { color: '#22C55E' }]}>vs yesterday +18%</Text>
          </View>

          <View style={styles.kpiCardItem}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
              <AlertTriangle size={13} color="#D97706" />
            </View>
            <Text style={styles.kpiLabelText}>Need Action</Text>
            <Text style={[styles.kpiValueText, { color: '#D97706' }]}>{newCount || '2'}</Text>
            <Text style={styles.kpiSubText}>Orders waiting</Text>
          </View>
        </ScrollView>
      </View>

      {/* Pill Selection Tabs */}
      <View style={styles.pillTabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillTabsScroll}>
          {ORDER_STATUSES.map(({ key, label }) => {
            const active = selectedStatus === key;
            const count = countFor(key);
            // Translate status names for short representation if needed
            let shortLabel = label;
            if (key === 'New Orders') shortLabel = 'New';
            if (key === 'Out For Delivery') shortLabel = 'On the way';

            return (
              <TouchableOpacity
                key={key}
                style={[styles.pillTabButton, active && styles.pillTabButtonActive]}
                onPress={() => setSelectedStatus(key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillTabText, active && styles.pillTabTextActive]}>{shortLabel}</Text>
                {count > 0 && (
                  <View style={[styles.pillTabCountBadge, active && styles.pillTabCountBadgeActive]}>
                    <Text style={[styles.pillTabCountText, active && styles.pillTabCountTextActive]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <EmptyState status={selectedStatus} />
        ) : (
          filteredOrders.map((order) => {
            const driver = deliveryStore.partners.find((p) => p.id === order.deliveryPartnerId);
            const urgency = getUrgency(order.orderTime);
            const showUrgency = order.status === 'New Orders' || order.status === 'Accepted';
            return (
              <OrderCard
                key={order.id}
                order={order}
                driver={driver}
                urgency={showUrgency ? urgency : null}
                onAccept={() => ordersStore.acceptOrder(order.id)}
                onReject={() =>
                  Alert.alert('Reject order', `Reject ${order.id}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reject', style: 'destructive', onPress: () => ordersStore.rejectOrder(order.id) },
                  ])
                }
                onAdvance={() => advance(order.id, order.status)}
                onAssign={() => setAssigningOrderId(order.id)}
                onView={() => setSelectedOrderId(order.id)}
              />
            );
          })
        )}

        {/* Bottom performance footer banner */}
        <View style={styles.footerPerformanceBanner}>
          <View style={styles.footerIconContainer}>
            <BarChart2 size={16} color={Colors.primary} />
          </View>
          <Text style={styles.footerPerformanceText}>
            Great job! You've completed 18 more orders than yesterday.
          </Text>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLinkText}>View Analytics</Text>
            <ChevronRight size={13} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sheet - Order Details */}
      <BottomSheet isVisible={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)} title="Order Details" height={0.72}>
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
                <MapPin size={12} color={Colors.textMuted} />
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

      {/* Bottom Sheet - Assign Driver */}
      <BottomSheet isVisible={assigningOrderId !== null} onClose={() => setAssigningOrderId(null)} title="Assign Driver" height={0.55}>
        <ScrollView contentContainerStyle={styles.sheet}>
          {deliveryStore.availablePartners.map((partner) => (
            <View key={partner.id} style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>{partner.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.driverName}>{partner.name}</Text>
                <Text style={styles.driverMeta}>{partner.phone} · ★ {partner.rating}</Text>
              </View>
              <Button
                label="Assign"
                size="sm"
                onPress={() => {
                  if (assigningOrderId) {
                    ordersStore.assignDeliveryPartner(assigningOrderId, partner.id);
                    deliveryStore.assignDriverToOrder(partner.id);
                  }
                  setAssigningOrderId(null);
                }}
              />
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </AnimatedScreen>
  );
});

function OrderCard({
  order, driver, urgency, onAccept, onReject, onAdvance, onAssign, onView,
}: {
  order: any;
  driver: any;
  urgency: { color: string; label: string; mins: number } | null;
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
  const isDone = order.status === 'Delivered' || order.status === 'Cancelled';

  return (
    <View style={styles.orderCard}>
      <View style={styles.newOrderTagContainer}>
        <Text style={styles.newOrderTagText}>NEW ORDER</Text>
      </View>

      <View style={styles.cardTopRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{order.customerName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.orderMeta}>{order.id || 'ORD-8492'} · {order.orderTime}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={styles.amount}>₹{order.amount}</Text>
          <View style={[
            styles.payPill,
            order.paymentMethod === 'COD' ? { backgroundColor: '#FEF3C7' } : { backgroundColor: '#DCFCE7' }
          ]}>
            <Text style={[
              styles.payPillText,
              { color: order.paymentMethod === 'COD' ? '#D97706' : Colors.primary }
            ]}>
              {order.paymentMethod === 'COD' ? 'Cash' : 'Online'}
            </Text>
          </View>
        </View>
      </View>

      {/* Badges/Chips Row */}
      <View style={styles.chipsRow}>
        <View style={styles.badgeChip}>
          <Package size={12} color="#64748B" />
          <Text style={styles.badgeChipText}>{order.itemsCount} Items</Text>
        </View>
        
        {driver && (
          <View style={styles.badgeChip}>
            <Truck size={12} color="#64748B" />
            <Text style={styles.badgeChipText}>{driver.name}</Text>
          </View>
        )}

        {urgency && (
          <View style={[styles.badgeChip, { backgroundColor: '#FEE2E2' }]}>
            <Clock size={12} color="#EF4444" />
            <Text style={[styles.badgeChipText, { color: '#EF4444', fontWeight: '700' }]}>
              Waiting {urgency.mins} mins
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Actions row at the bottom of the card */}
      <View style={styles.actionsRow}>
        {isNew && (
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={onAccept}>
              <CheckCircle2 size={15} color={Colors.white} />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={onReject}>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        {isAccepted && (
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={onAdvance}>
              <Text style={styles.acceptBtnText}>Mark Packed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={onAssign}>
              <Text style={styles.rejectBtnText}>Assign Driver</Text>
            </TouchableOpacity>
          </View>
        )}
        {isPacked && (
          <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={onAdvance}>
            <Text style={styles.acceptBtnText}>Send Out</Text>
          </TouchableOpacity>
        )}
        {isOFD && (
          <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={onAdvance}>
            <Text style={styles.acceptBtnText}>Mark Delivered</Text>
          </TouchableOpacity>
        )}
        {isDone && (
          <View style={[styles.donePill, order.status === 'Delivered' ? styles.donePillGreen : styles.donePillRed]}>
            <Text style={[styles.donePillText, order.status === 'Delivered' ? { color: Colors.success } : { color: Colors.error }]}>
              {order.status}
            </Text>
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

function EmptyState({ status }: { status: string }) {
  const isNew = status === 'New Orders';
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <ShoppingBag size={32} color={Colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>{isNew ? 'No New Orders' : `No ${status} Orders`}</Text>
      <Text style={styles.emptySubtitle}>
        {isNew ? "You're all caught up. New orders appear here instantly." : 'Orders in this stage will show up here.'}
      </Text>
    </View>
  );
}
