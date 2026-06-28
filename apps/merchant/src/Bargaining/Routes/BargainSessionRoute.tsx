import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, ShoppingBag } from 'lucide-react-native';
import { BargainChatScreen, BargainThemeProvider, createBargainTheme } from '@monorepo/bargaining';
import type { OfferMessage } from '@monorepo/bargaining';
import { useStores } from '../../Common/hooks/useStores';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { Button } from '../../components/ui/Button';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import type { BargainCartItem, BargainOffer } from '../Models/BargainSession';
import { mapSessionToPackageMessages, mapPinnedConfig, getActionsForOffer } from '../utils/bargainPackageMapper';
import rawStyles from './styles';
const styles = rawStyles as any;

const MERCHANT_THEME = createBargainTheme({
  primary: '#F59E0B',
  primaryDark: '#B45309',
  primaryLight: '#FEF3C7',
});

export default observer(function BargainSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { bargainingStore } = useStores();

  const resolvedKeyRef = useRef<{ sessionId: string; cartItemId: string } | null>(null);

  let bargain = bargainingStore.bargains.find((b) => b.sessionId === String(sessionId));
  if (bargain) {
    resolvedKeyRef.current = { sessionId: bargain.sessionId, cartItemId: bargain.cartItemId };
  } else if (resolvedKeyRef.current) {
    bargain = bargainingStore.bargains.find(
      (b) => b.sessionId === resolvedKeyRef.current!.sessionId && b.cartItemId === resolvedKeyRef.current!.cartItemId,
    );
  }
  const session = bargain ? bargainingStore.sessions.find((s) => s.sessionId === bargain.sessionId) : undefined;

  const [counterOfferId, setCounterOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, error = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, error });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    if (bargainingStore.actionError) {
      showToast(bargainingStore.actionError, true);
      bargainingStore.clearActionError();
    }
  }, [bargainingStore.actionError]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    if (session) bargainingStore.markSeen(session.sessionId);
  }, [session, bargain?.timeline.length]);

  useEffect(() => {
    return () => {
      if (bargain) bargainingStore.sendTypingStatus(bargain.sessionId, false);
    };
  }, []);

  if (!bargain || !session) {
    return (
      <AnimatedScreen style={styles.container}>
        <View style={styles.notFoundBox}>
          <Text style={styles.emptyTitle}>Bargain not found</Text>
          <Text style={styles.emptyText}>This negotiation may have been removed.</Text>
        </View>
      </AnimatedScreen>
    );
  }

  const items: { item: BargainCartItem; offer: BargainOffer }[] = session.cart.flatMap((item) => {
    const offer = session.offers[item.cartItemId];
    return offer ? [{ item, offer }] : [];
  });

  const counterEntry = items.find((entry) => entry.offer.offerId === counterOfferId);

  const openCounter = (offerId: string, currentPrice: number, customerOffer: number) => {
    setCounterPrice(Math.round(customerOffer + (currentPrice - customerOffer) * 0.5));
    setCounterOfferId(offerId);
  };

  const handleAccept = (offerId: string) => {
    bargainingStore.acceptBargain(offerId);
    if (offerId === bargain.id) setShowSuccess(true);
  };

  const handleReject = (offerId: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reject this bargain request?')) bargainingStore.rejectBargain(offerId);
    } else {
      Alert.alert('Reject offer', 'Reject this bargain request?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => bargainingStore.rejectBargain(offerId) },
      ]);
    }
  };

  const applyPercentDiscount = (pct: number) => {
    if (!counterEntry) return;
    setCounterPrice(Math.round(counterEntry.item.effectivePrice * (1 - pct / 100)));
  };

  const currentDiscountPercent = counterEntry && counterEntry.item.effectivePrice > 0
    ? Math.round((1 - counterPrice / counterEntry.item.effectivePrice) * 100)
    : 0;

  const sessionActive = session.status !== 'ENDED' && session.status !== 'EXPIRED' && bargain.status === 'Pending';

  const messages = mapSessionToPackageMessages(bargain.timeline, session, bargain, session.isTyping);
  const pinned = mapPinnedConfig(session, bargain);

  const connectionBanner = bargainingStore.connectionStatus !== 'open' ? (
    <View style={styles.connectionBanner}>
      <Text style={styles.connectionBannerText}>
        {bargainingStore.connectionStatus === 'reconnecting'
          ? 'Connection lost. Trying to reconnect...'
          : 'Gateway is offline. Reconnecting...'}
      </Text>
    </View>
  ) : null;

  return (
    <AnimatedScreen style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      {connectionBanner}

      <BargainThemeProvider theme={MERCHANT_THEME}>
        <BargainChatScreen
          viewerParty="seller"
          header={{
            name: bargain.customerName,
            initials: bargain.customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            online: session.status === 'ACTIVE',
            onBack: () => router.back(),
          }}
          pinned={pinned}
          messages={messages}
          getActionsForOffer={(msg: OfferMessage) =>
            getActionsForOffer(msg, session, sessionActive, handleAccept, openCounter, handleReject)
          }
          getDealTagForOffer={() =>
            bargain.dealHealth === 'Hot' ? '🔥 Hot deal' : bargain.dealHealth === 'Warm' ? '👍 Warm deal' : undefined
          }
          onSendText={(text: string) => bargainingStore.sendMerchantMessage(bargain.sessionId, text)}
          onChangeInputText={(text: string) => bargainingStore.sendTypingStatus(bargain.sessionId, text.length > 0)}
          onAttachPress={() => openCounter(bargain.id, bargain.originalPrice, bargain.customerOffer)}
          inputDisabled={!sessionActive}
          inputPlaceholder={sessionActive ? 'Message customer…' : 'Session ended'}
        />
      </BargainThemeProvider>

      <BottomSheet isVisible={counterOfferId !== null} onClose={() => setCounterOfferId(null)} height={0.65}>
        {counterEntry ? (
          <View style={styles.sheet}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetHeaderTitle}>Make a counter offer</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setCounterOfferId(null)}>
                <X size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetLabel}>Select an item from your cart</Text>
            <View style={styles.cartItemsContainer}>
              {items.map(({ item, offer }) => {
                const selected = item.cartItemId === counterEntry.item.cartItemId;
                return (
                  <TouchableOpacity
                    key={item.cartItemId}
                    style={selected ? styles.cartItemCard : styles.cartItemCardUnselected}
                    onPress={() => openCounter(offer.offerId, item.effectivePrice, offer.offeredAmount)}
                  >
                    <View style={styles.cartItemIconContainer}>
                      <ShoppingBag size={18} color={selected ? '#3B82F6' : '#94A3B8'} />
                    </View>
                    <View style={styles.cartItemMiddle}>
                      <Text style={styles.cartItemName}>{item.productName}</Text>
                      <Text style={styles.cartItemPrice}>₹{item.effectivePrice} · qty {item.quantity}</Text>
                    </View>
                    {selected ? (
                      <View style={styles.cartItemCheck}>
                        <View style={styles.cartItemCheckInner} />
                      </View>
                    ) : (
                      <View style={styles.cartItemCheckUnselected} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sheetLabel}>Your offer for {counterEntry.item.productName}</Text>
            <View style={styles.offerInputContainer}>
              <Text style={styles.offerInputPrefix}>₹</Text>
              <TextInput
                style={styles.offerInputField}
                value={String(counterPrice)}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '');
                  setCounterPrice(clean ? Number(clean) : 0);
                }}
                keyboardType="number-pad"
              />
              {currentDiscountPercent > 0 && (
                <View style={styles.percentOffPill}>
                  <Text style={styles.percentOffPillText}>
                    {currentDiscountPercent}% off ₹{counterEntry.item.effectivePrice}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.quickPercentRow}>
              {[5, 10, 15, 20].map((pct) => {
                const targetVal = Math.round(counterEntry.item.effectivePrice * (1 - pct / 100));
                const active = counterPrice === targetVal;
                return (
                  <TouchableOpacity
                    key={pct}
                    style={[styles.quickPercentBtn, active && styles.quickPercentBtnActive]}
                    onPress={() => applyPercentDiscount(pct)}
                  >
                    <Text style={[styles.quickPercentBtnText, active && styles.quickPercentBtnTextActive]}>
                      -{pct}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.sendCounterBtn}
              onPress={() => {
                bargainingStore.counterBargain(counterEntry.offer.offerId, counterPrice);
                setCounterOfferId(null);
              }}
            >
              <Text style={styles.sendCounterBtnText}>Send offer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </BottomSheet>

      {showSuccess ? (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Deal closed!</Text>
            <Text style={styles.successSubtitle}>
              You and {bargain.customerName} agreed on ₹{bargain.customerOffer}. An order has been generated.
            </Text>
            <View style={styles.successStatsRow}>
              <View style={styles.successStat}>
                <Text style={styles.successStatValue}>₹{bargain.customerOffer}</Text>
                <Text style={styles.successStatLabel}>Final price</Text>
              </View>
              <View style={styles.successStat}>
                <Text style={styles.successStatValue}>{bargain.discountPercent}%</Text>
                <Text style={styles.successStatLabel}>Discount given</Text>
              </View>
              <View style={styles.successStat}>
                <Text style={styles.successStatValue}>₹{bargain.potentialProfit}</Text>
                <Text style={styles.successStatLabel}>Your margin</Text>
              </View>
            </View>
            <View style={styles.successActions}>
              <Button label="Back to deals" variant="outline" style={styles.successActionBtn} onPress={() => router.back()} />
              <Button label="Done" style={styles.successActionBtn} onPress={() => setShowSuccess(false)} />
            </View>
          </View>
        </View>
      ) : null}

      {toast ? (
        <View style={[styles.toastBanner, toast.error && styles.toastError]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}
    </AnimatedScreen>
  );
});
