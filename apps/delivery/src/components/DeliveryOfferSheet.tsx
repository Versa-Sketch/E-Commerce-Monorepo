import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Modal, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appStore } from '../store/useAppStore';
import { DispatchService } from '../services/dispatch';
import { wsService } from '../services/websocket';
import { navigate } from '../services/navigationRef';
import { ApiError } from '../services/http';
import { OfferClosedPayload } from '../types/dispatch';
import { colors, typography } from '../theme';

const CLOSED_REASON_MESSAGES: Record<string, string> = {
  ASSIGNED_TO_ANOTHER_PARTNER: 'Another partner accepted this order.',
  ORDER_CANCELLED: 'The order was cancelled.',
  CAPACITY_EXCEEDED: "You've reached your concurrent order limit.",
};

const SHEET_HEIGHT = 380;

function secondsUntil(isoDate: string): number {
  return Math.max(0, Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000));
}

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const DeliveryOfferSheet = observer(function DeliveryOfferSheet() {
  const offer = appStore.pendingOffer;
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(-SHEET_HEIGHT)).current;
  const [secsLeft, setSecsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Slide in / out when offer appears or disappears.
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: offer ? 0 : -SHEET_HEIGHT,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [!!offer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer.
  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!offer) return;

    setSecsLeft(secondsUntil(offer.expires_at));

    timerRef.current = setInterval(() => {
      setSecsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          appStore.setPendingOffer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [offer?.offer_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onOfferClosed = useCallback(
    (payload: OfferClosedPayload) => {
      if (!offer || payload.offer_id !== offer.offer_id) return;
      appStore.setPendingOffer(null);
      const message = CLOSED_REASON_MESSAGES[payload.reason] ?? 'This offer is no longer available.';
      Alert.alert('Offer Closed', message);
    },
    [offer?.offer_id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    wsService.on('DELIVERY_OFFER_CLOSED', onOfferClosed);
    return () => wsService.off('DELIVERY_OFFER_CLOSED', onOfferClosed);
  }, [onOfferClosed]);

  async function handleAccept() {
    if (!offer || loading) return;

    if (__DEV__) {
      appStore.setPendingOffer(null);
      appStore.setActiveOrderDetail({
        order_id: offer.order_id,
        shop_name: offer.shop_name,
        shop_latitude: '12.9716',
        shop_longitude: '77.5946',
        drop_address: '42, 5th Main, Sector 2, HSR Layout, Bengaluru – 560102',
      });
      navigate('PickupNavigation');
      return;
    }

    setLoading(true);
    try {
      const res = await DispatchService.acceptOffer(offer.order_id);
      appStore.setPendingOffer(null);
      appStore.setActiveOrderDetail(res.data);
      navigate('PickupNavigation');
    } catch (err) {
      appStore.setPendingOffer(null);
      const message =
        err instanceof ApiError ? err.message : 'Could not accept the offer. Please try again.';
      Alert.alert('Not Available', message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecline() {
    if (!offer || loading) return;
    setLoading(true);
    try {
      await DispatchService.declineOffer(offer.order_id);
    } finally {
      appStore.setPendingOffer(null);
      setLoading(false);
    }
  }

  const isUrgent = secsLeft <= 10;

  return (
    <Modal visible={!!offer} transparent animationType="none" onRequestClose={handleDecline}>
      <Animated.View
        style={[
          styles.sheet,
          { paddingTop: insets.top + 12, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {offer && (
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.shopName} numberOfLines={1}>
                {offer.shop_name}
              </Text>
              <View style={[styles.timerBadge, isUrgent && styles.timerBadgeUrgent]}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isUrgent ? colors.red : colors.gray700}
                />
                <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
                  {formatCountdown(secsLeft)}
                </Text>
              </View>
            </View>

            {/* Distance */}
            <View style={styles.distanceRow}>
              <View style={styles.distanceItem}>
                <Ionicons name="navigate-outline" size={16} color={colors.gray700} />
                <Text style={styles.distanceLabel}>Pickup</Text>
                <Text style={styles.distanceValue}>{offer.pickup_distance_km} km</Text>
              </View>
              <View style={styles.distanceDivider} />
              <View style={styles.distanceItem}>
                <Ionicons name="location-outline" size={16} color={colors.gray700} />
                <Text style={styles.distanceLabel}>Drop</Text>
                <Text style={styles.distanceValue}>{offer.drop_distance_km} km</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order value</Text>
                <Text style={styles.detailValue}>₹{offer.order_value}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Items</Text>
                <Text style={styles.detailValue}>{offer.items_count}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Round</Text>
                <Text style={styles.detailValue}>#{offer.round_number}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={handleDecline}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.acceptBtn, loading && styles.btnDisabled]}
                onPress={handleAccept}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptBtnText}>{loading ? 'Accepting…' : 'Accept'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray100,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  content: { gap: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: { ...typography.h2, color: colors.black87, flex: 1, marginRight: 12 },
  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.gray50, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  timerBadgeUrgent: { backgroundColor: colors.redLight },
  timerText: { ...typography.body, fontWeight: '700', color: colors.gray700 },
  timerTextUrgent: { color: colors.red },
  distanceRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.gray50, borderRadius: 12, padding: 14,
  },
  distanceItem: { flex: 1, alignItems: 'center', gap: 4 },
  distanceDivider: { width: 1, height: 36, backgroundColor: colors.gray100 },
  distanceLabel: { ...typography.small, color: colors.gray700 },
  distanceValue: { ...typography.h3, color: colors.black87 },
  detailsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: colors.gray50, borderRadius: 12, padding: 14,
  },
  detailItem: { alignItems: 'center', gap: 4 },
  detailLabel: { ...typography.small, color: colors.gray700 },
  detailValue: { ...typography.h3, color: colors.black87 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  declineBtn: {
    flex: 1, borderWidth: 1.5, borderColor: colors.gray100,
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  declineBtnText: { ...typography.h3, color: colors.black87 },
  acceptBtn: {
    flex: 2, backgroundColor: colors.black87,
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  acceptBtnText: { ...typography.h3, color: colors.white },
  btnDisabled: { opacity: 0.5 },
});
