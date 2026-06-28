import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type OrderTrackingMode = 'customer' | 'merchant';
export type OrderStatus = 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered';

export interface OrderTrackingPanelProps {
  mode: OrderTrackingMode;
  orderId: string;
  partnerName: string;
  partnerRating?: number;
  partnerVehicleNumber?: string;
  storeName?: string;
  dropAddress?: string;
  orderValue?: string;
  itemCount?: number;
  orderStatus?: OrderStatus;
  etaText?: string | null;
  distanceText?: string | null;
  stepIndex?: number;
  totalSteps?: number;
  bottomInset?: number;
  onCallPartner?: () => void;
  onMessagePartner?: () => void;
  onSupportPress?: () => void;
  onOrderDetailPress?: () => void;
}

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'out_for_delivery', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  placed: 0,
  confirmed: 1,
  out_for_delivery: 2,
  delivered: 3,
};

export function OrderTrackingPanel({
  mode,
  orderId,
  partnerName,
  partnerRating = 4.9,
  partnerVehicleNumber,
  storeName = 'Store',
  dropAddress,
  orderValue,
  itemCount,
  orderStatus = 'out_for_delivery',
  etaText,
  distanceText,
  stepIndex = 0,
  totalSteps = 10,
  bottomInset = 0,
  onCallPartner,
  onMessagePartner,
  onSupportPress,
  onOrderDetailPress,
}: OrderTrackingPanelProps) {
  const activeStepIdx = STATUS_INDEX[orderStatus];
  const shortId = `#${orderId.slice(-6).toUpperCase()}`;
  const progressPct = totalSteps > 1 ? Math.round((stepIndex / (totalSteps - 1)) * 100) : 0;

  return (
    <View style={[styles.panel, { paddingBottom: bottomInset }]}>
      {/* Drag handle */}
      <View style={styles.handle} />

      {/* ── ETA hero row ── always at top, most prominent */}
      <View style={styles.etaHero}>
        <View style={styles.etaLeft}>
          <Text style={styles.etaBig}>{etaText ?? '—'}</Text>
          <Text style={styles.etaSub}>
            {distanceText ? `${distanceText} away` : 'Calculating…'}
          </Text>
        </View>
        <View style={styles.etaRight}>
          <View style={styles.onTimeBadge}>
            <View style={styles.onTimeDot} />
            <Text style={styles.onTimeText}>On time</Text>
          </View>
          <Text style={styles.orderIdText}>{shortId}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 8 }]}
        bounces={false}
      >
        {mode === 'customer' ? (
          <CustomerPanel
            shortId={shortId}
            partnerName={partnerName}
            partnerRating={partnerRating}
            storeName={storeName}
            orderStatus={orderStatus}
            activeStepIdx={activeStepIdx}
            onCallPartner={onCallPartner}
            onMessagePartner={onMessagePartner}
            onSupportPress={onSupportPress}
          />
        ) : (
          <MerchantPanel
            shortId={shortId}
            partnerName={partnerName}
            partnerRating={partnerRating}
            partnerVehicleNumber={partnerVehicleNumber}
            storeName={storeName}
            dropAddress={dropAddress}
            progressPct={progressPct}
            etaText={etaText}
            distanceText={distanceText}
            onCallPartner={onCallPartner}
            onSupportPress={onSupportPress}
            onOrderDetailPress={onOrderDetailPress}
          />
        )}
      </ScrollView>
    </View>
  );
}

function CustomerPanel({
  partnerName, partnerRating, storeName, activeStepIdx,
  onCallPartner, onMessagePartner, onSupportPress,
}: any) {
  return (
    <>
      {/* Partner card */}
      <View style={styles.partnerCard}>
        <View style={styles.partnerAvatar}>
          <Text style={styles.partnerAvatarText}>
            {partnerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{partnerName}</Text>
          <View style={styles.partnerMeta}>
            <Ionicons name="star" size={12} color="#F5A623" />
            <Text style={styles.partnerRatingText}>{partnerRating.toFixed(1)}</Text>
            <Text style={styles.partnerMetaDot}>·</Text>
            <Text style={styles.partnerMetaLabel}>Delivery partner</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onCallPartner} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={18} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onMessagePartner} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Step tracker */}
      <View style={styles.stepsRow}>
        {ORDER_STEPS.map((step, i) => {
          const done = i < activeStepIdx;
          const active = i === activeStepIdx;
          return (
            <React.Fragment key={step.key}>
              <View style={styles.stepItem}>
                <View style={[
                  styles.stepDot,
                  done && styles.stepDotDone,
                  active && styles.stepDotActive,
                  !done && !active && styles.stepDotPending,
                ]}>
                  {done
                    ? <Ionicons name="checkmark" size={9} color="#fff" />
                    : active
                      ? <View style={styles.stepActivePip} />
                      : null}
                </View>
                <Text style={[
                  styles.stepLabel,
                  done && styles.stepLabelDone,
                  active && styles.stepLabelActive,
                  !done && !active && styles.stepLabelPending,
                ]}>
                  {step.label}
                </Text>
              </View>
              {i < ORDER_STEPS.length - 1 && (
                <View style={[styles.stepLine, done && styles.stepLineFilled]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionSecondary} onPress={onSupportPress} activeOpacity={0.8}>
          <Ionicons name="headset-outline" size={17} color="#555" />
          <Text style={styles.actionSecondaryText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionPrimary} activeOpacity={0.85}>
          <Ionicons name="location" size={17} color="#fff" />
          <Text style={styles.actionPrimaryText}>Share live location</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function MerchantPanel({
  partnerName, partnerRating, partnerVehicleNumber,
  storeName, dropAddress, progressPct, etaText, distanceText,
  onCallPartner, onSupportPress, onOrderDetailPress,
}: any) {
  return (
    <>
      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Delivery in progress</Text>
          <Text style={styles.progressPct}>{progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={styles.routeIconCol}>
            <View style={[styles.routeDot, { backgroundColor: '#FF6B35' }]} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.routeContent}>
            <View style={styles.routeRowHeader}>
              <Text style={styles.routeTitle}>{storeName}</Text>
              <View style={styles.pickedTag}>
                <Ionicons name="checkmark" size={9} color="#1A6B35" />
                <Text style={styles.pickedTagText}>Picked up</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.routeRow}>
          <View style={styles.routeIconCol}>
            <View style={[styles.routeDot, { backgroundColor: '#1A1A1A' }]} />
          </View>
          <View style={styles.routeContent}>
            <View style={styles.routeRowHeader}>
              <Text style={styles.routeTitle}>Customer</Text>
              {etaText ? <Text style={styles.etaTagText}>{etaText} away</Text> : null}
            </View>
            {dropAddress
              ? <Text style={styles.routeSub} numberOfLines={1}>{dropAddress}</Text>
              : <Text style={styles.routeSub}>{distanceText ?? '—'} remaining</Text>}
          </View>
        </View>
      </View>

      {/* Partner card */}
      <View style={styles.partnerCard}>
        <View style={styles.partnerAvatar}>
          <Text style={styles.partnerAvatarText}>
            {partnerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{partnerName}</Text>
          <View style={styles.partnerMeta}>
            <Ionicons name="star" size={12} color="#F5A623" />
            <Text style={styles.partnerRatingText}>{partnerRating.toFixed(1)}</Text>
            {partnerVehicleNumber ? (
              <>
                <Text style={styles.partnerMetaDot}>·</Text>
                <Text style={styles.partnerMetaLabel}>{partnerVehicleNumber}</Text>
              </>
            ) : null}
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onCallPartner} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionSecondary} onPress={onOrderDetailPress} activeOpacity={0.8}>
          <Ionicons name="receipt-outline" size={17} color="#555" />
          <Text style={styles.actionSecondaryText}>Order detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionPrimary} onPress={onSupportPress} activeOpacity={0.85}>
          <Ionicons name="headset-outline" size={17} color="#fff" />
          <Text style={styles.actionPrimaryText}>Contact support</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#DDDDD8',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },

  /* ETA hero */
  etaHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  etaLeft: { gap: 1 },
  etaBig: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  etaSub: { fontSize: 13, color: '#999', fontWeight: '500' },
  etaRight: { alignItems: 'flex-end', gap: 5 },
  onTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF7EE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  onTimeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#27C56E' },
  onTimeText: { fontSize: 11, fontWeight: '700', color: '#1A7A45' },
  orderIdText: { fontSize: 11, color: '#CCC', fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#F0F0EE', marginHorizontal: 0 },

  scroll: { paddingHorizontal: 20, paddingTop: 14 },

  /* Partner card */
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F8F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  partnerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  partnerAvatarText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  partnerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  partnerRatingText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  partnerMetaDot: { fontSize: 12, color: '#DDD' },
  partnerMetaLabel: { fontSize: 12, color: '#AAA' },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EEEEED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Step tracker */
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: '#1A1A1A' },
  stepDotActive: { backgroundColor: '#FF6B35', borderWidth: 3, borderColor: '#FFE5D9' },
  stepDotPending: { backgroundColor: '#EBEBEB' },
  stepActivePip: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  stepLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center', maxWidth: 48 },
  stepLabelDone: { color: '#1A1A1A' },
  stepLabelActive: { color: '#FF6B35' },
  stepLabelPending: { color: '#BBBBB8' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#EBEBEB', marginTop: 9 },
  stepLineFilled: { backgroundColor: '#1A1A1A' },

  /* Action buttons */
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 13,
    backgroundColor: '#F0F0EE',
  },
  actionSecondaryText: { fontSize: 13, fontWeight: '700', color: '#555' },
  actionPrimary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 13,
    backgroundColor: '#1A1A1A',
  },
  actionPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  /* Merchant — progress */
  progressSection: { marginBottom: 12 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressLabel: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  progressPct: { fontSize: 13, fontWeight: '700', color: '#AAA' },
  progressTrack: { height: 5, backgroundColor: '#EBEBEB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FF6B35', borderRadius: 3 },

  /* Merchant — route card */
  routeCard: {
    backgroundColor: '#F8F8F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  routeRow: { flexDirection: 'row', gap: 12 },
  routeIconCol: { alignItems: 'center', width: 10, paddingTop: 4 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 2, flex: 1, backgroundColor: '#DDDDD8', marginTop: 4, marginBottom: 4, minHeight: 24 },
  routeContent: { flex: 1, paddingBottom: 10 },
  routeRowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  routeTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  routeSub: { fontSize: 11, color: '#AAA', marginTop: 2 },
  pickedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAF5EE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pickedTagText: { fontSize: 9, fontWeight: '700', color: '#1A6B35' },
  etaTagText: { fontSize: 11, fontWeight: '700', color: '#FF6B35' },
});
