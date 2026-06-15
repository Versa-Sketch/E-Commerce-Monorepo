import { useRouter } from 'expo-router';
import { CheckCircle2, Clock3, MessageSquare, XCircle } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { useStores } from '../../Common/hooks/useStores';
import { Button } from '../../components/ui/Button';
import { Badge, Card, ScreenHeader } from '../../components/ui/MerchantPrimitives';
import { Colors } from '../../theme/colors';
import { ConnectionStatusPill, CountdownBadge, DealHealthTag, GradientCard, ProbabilityBar } from '../Components/DealVisuals';
import type { Bargain } from '../Models/Bargain';
import styles from './styles';

export default observer(function BargainingScreen() {
  const { bargainingStore } = useStores();
  const router = useRouter();
  const [counterId, setCounterId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const counterBargain = bargainingStore.bargains.find((item) => item.id === counterId);

  const pending = bargainingStore.pendingBargains;
  const resolved = [
    ...bargainingStore.acceptedBargains,
    ...bargainingStore.rejectedBargains,
    ...bargainingStore.expiredBargains,
  ];

  const showToast = (message: string, error = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, error });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    if (bargainingStore.sessionsError) {
      showToast(bargainingStore.sessionsError, true);
    }
  }, [bargainingStore.sessionsError]);

  useEffect(() => {
    if (bargainingStore.actionError) {
      showToast(bargainingStore.actionError, true);
      bargainingStore.clearActionError();
    }
  }, [bargainingStore.actionError]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const openCounter = (bargain: Bargain) => {
    setCounterId(bargain.id);
    setCounterPrice(Math.round(bargain.customerOffer + (bargain.currentPrice - bargain.customerOffer) * 0.5));
  };

  const confirmReject = (id: string) => {
    Alert.alert('Reject offer', 'Reject this bargain request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => bargainingStore.rejectBargain(id) },
    ]);
  };

  const suggestions = counterBargain
    ? [0.3, 0.5, 0.75].map((t) =>
      Math.round(counterBargain.customerOffer + (counterBargain.currentPrice - counterBargain.customerOffer) * t),
    )
    : [];
  const suggestionLabels = ['Quick win', 'Balanced', 'Hold firm'];

  const expectedMargin = counterBargain ? counterPrice - counterBargain.merchantCost : 0;
  const acceptanceProbability = counterBargain
    ? Math.max(
      5,
      Math.min(
        95,
        Math.round(
          100 -
          ((counterPrice - counterBargain.customerOffer) /
            Math.max(1, counterBargain.currentPrice - counterBargain.customerOffer)) *
          60,
        ),
      ),
    )
    : 0;

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader title="Bargains" subtitle="Your live deal room" />
      <GradientCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.heroEyebrow}>Live deal room</Text>
            <Text style={styles.heroTitle} numberOfLines={1}>Negotiation desk</Text>
          </View>
          <ConnectionStatusPill status={bargainingStore.connectionStatus} />
        </View>

        <View style={styles.heroStatsGrid}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{bargainingStore.activeDeals}</Text>
            <Text style={styles.heroStatLabel}>Active deals</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>₹{bargainingStore.potentialRevenue}</Text>
            <Text style={styles.heroStatLabel}>Potential revenue</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{bargainingStore.closingRate}%</Text>
            <Text style={styles.heroStatLabel}>Closing rate</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{bargainingStore.expiringSoonCount}</Text>
            <Text style={styles.heroStatLabel}>Expiring soon</Text>
          </View>
        </View>
      </GradientCard>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.secondaryRow}>
          <Card style={styles.secondaryCard}>
            <Text style={styles.secondaryValue}>{bargainingStore.averageDiscount}%</Text>
            <Text style={styles.secondaryLabel}>Avg. discount asked</Text>
          </Card>
          <Card style={styles.secondaryCard}>
            <Text style={styles.secondaryValue}>₹{bargainingStore.revenueAtRisk}</Text>
            <Text style={styles.secondaryLabel}>Revenue at risk</Text>
          </Card>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Live negotiations</Text>
          <Text style={styles.sectionCount}>{pending.length} open</Text>
        </View>

        {bargainingStore.sessionsLoading && bargainingStore.sessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.emptyTitle}>Loading live deals…</Text>
          </Card>
        ) : pending.length === 0 ? (
          <Card style={styles.emptyCard}>
            <MessageSquare size={22} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No live deals right now</Text>
            <Text style={styles.emptyText}>New bargain requests will land here the moment a customer makes an offer.</Text>
          </Card>
        ) : (
          <View style={styles.sectionList}>
            {pending.map((bargain) => {
              const isPending = bargainingStore.isOfferActionPending(bargain.id);
              return (
              <TouchableOpacity
                key={bargain.id}
                activeOpacity={0.85}
                onPress={() => router.push(`/bargaining/${bargain.id}` as never)}
              >
                <Card style={styles.dealCard}>
                  <View style={styles.dealCardTopRow}>
                    <Image source={{ uri: bargain.productImage }} style={styles.dealImage} />
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealProduct} numberOfLines={1}>{bargain.productName}</Text>
                      <View style={styles.dealCustomerRow}>
                        <Text style={styles.dealCustomer}>{bargain.customerName}</Text>
                      </View>
                    </View>
                    <CountdownBadge seconds={bargain.expirationTime} size="sm" />
                  </View>

                  <View style={styles.dealPricesRow}>
                    <Text style={styles.dealOriginal}>₹{bargain.currentPrice}</Text>
                    <Text style={styles.dealOffer}>₹{bargain.customerOffer}</Text>
                    <View style={styles.discountPill}>
                      <Text style={styles.discountPillText}>-{bargain.discountPercent}%</Text>
                    </View>
                  </View>

                  <ProbabilityBar value={bargain.dealProbability} />

                  <View style={styles.dealMetaRow}>
                    <DealHealthTag health={bargain.dealHealth} />
                    {bargain.isExpiringSoon ? <Badge label="Expiring soon" tone="error" /> : null}
                  </View>

                  <View style={styles.dealActionsRow}>
                    <TouchableOpacity
                      style={[styles.miniBtn, styles.miniBtnAccept, styles.dealActionBtn, isPending && styles.miniBtnDisabled]}
                      onPress={() => bargainingStore.acceptBargain(bargain.id)}
                      disabled={isPending}
                    >
                      {isPending ? <ActivityIndicator size="small" color={Colors.success} /> : (
                        <Text style={[styles.miniBtnText, styles.miniBtnTextAccept]}>Accept</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.miniBtn, styles.dealActionBtn, isPending && styles.miniBtnDisabled]}
                      onPress={() => openCounter(bargain)}
                      disabled={isPending}
                    >
                      <Text style={styles.miniBtnText}>Counter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.miniBtn, styles.miniBtnReject, styles.dealActionBtn, isPending && styles.miniBtnDisabled]}
                      onPress={() => confirmReject(bargain.id)}
                      disabled={isPending}
                    >
                      {isPending ? <ActivityIndicator size="small" color={Colors.error} /> : (
                        <Text style={[styles.miniBtnText, styles.miniBtnTextReject]}>Reject</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </Card>
              </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
        </View>

        {resolved.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Clock3 size={22} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nothing closed yet</Text>
            <Text style={styles.emptyText}>Accepted, rejected, and expired deals will show up here.</Text>
          </Card>
        ) : (
          <View style={styles.sectionList}>
            {resolved.map((bargain) => {
              const tone =
                bargain.status === 'Accepted'
                  ? { bg: Colors.successBg, fg: Colors.success, Icon: CheckCircle2, label: 'Deal closed' }
                  : bargain.status === 'Rejected'
                    ? { bg: Colors.errorBg, fg: Colors.error, Icon: XCircle, label: 'Rejected' }
                    : { bg: Colors.surfaceElevated, fg: Colors.textSecondary, Icon: Clock3, label: 'Expired' };

              return (
                <TouchableOpacity
                  key={bargain.id}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/bargaining/${bargain.id}` as never)}
                >
                  <Card style={styles.resolvedCard}>
                    <View style={[styles.resolvedIconWrap, { backgroundColor: tone.bg }]}>
                      <tone.Icon size={18} color={tone.fg} />
                    </View>
                    <View style={styles.resolvedInfo}>
                      <Text style={styles.resolvedTitle} numberOfLines={1}>{bargain.productName}</Text>
                      <Text style={styles.resolvedSub} numberOfLines={1}>{bargain.customerName} · {tone.label}</Text>
                    </View>
                    <Text style={styles.resolvedPrice}>₹{bargain.customerOffer}</Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BottomSheet isVisible={counterId !== null} onClose={() => setCounterId(null)} title="Counter offer" height={0.62}>
        {counterBargain ? (
          <View style={styles.sheet}>
            <Text style={styles.sheetProduct}>{counterBargain.productName}</Text>
            <Text style={styles.sheetSubtitle}>
              {counterBargain.customerName} offered ₹{counterBargain.customerOffer} · List price ₹{counterBargain.currentPrice}
            </Text>

            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Your counter price</Text>
              <Text style={styles.counterPrice}>₹{counterPrice}</Text>
              <View style={styles.counterActions}>
                <TouchableOpacity
                  style={styles.stepButton}
                  onPress={() => setCounterPrice((v) => Math.max(counterBargain.customerOffer, v - 5))}
                >
                  <Text style={styles.stepText}>− ₹5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stepButton, styles.stepButtonActive]}
                  onPress={() => setCounterPrice((v) => Math.min(counterBargain.currentPrice, v + 5))}
                >
                  <Text style={[styles.stepText, styles.stepTextActive]}>+ ₹5</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.chipsLabel}>Smart suggestions</Text>
            <View style={styles.chipsRow}>
              {suggestions.map((amount, i) => {
                const active = amount === counterPrice;
                return (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCounterPrice(amount)}
                  >
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>₹{amount}</Text>
                    <Text style={[styles.chipSub, active && styles.chipSubActive]}>{suggestionLabels[i]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.previewRow}>
              <Card style={styles.previewCard}>
                <Text style={styles.previewValue}>₹{counterPrice}</Text>
                <Text style={styles.previewLabel}>Your price</Text>
              </Card>
              <Card style={styles.previewCard}>
                <Text style={[styles.previewValue, { color: expectedMargin >= 0 ? Colors.success : Colors.error }]}>
                  ₹{expectedMargin}
                </Text>
                <Text style={styles.previewLabel}>Expected margin</Text>
              </Card>
              <Card style={styles.previewCard}>
                <Text style={styles.previewValue}>{acceptanceProbability}%</Text>
                <Text style={styles.previewLabel}>Acceptance odds</Text>
              </Card>
            </View>

            <Button
              label="Send counter"
              onPress={() => {
                bargainingStore.counterBargain(counterBargain.id, counterPrice);
                setCounterId(null);
              }}
            />
          </View>
        ) : null}
      </BottomSheet>

      {toast ? (
        <View style={[styles.toastBanner, toast.error && styles.toastError]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}
    </AnimatedScreen>
  );
});
