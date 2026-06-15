import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, ArrowLeft, AlertCircle, Clock3, X, ShoppingBag, Check, CheckCheck, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react-native';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/MerchantPrimitives';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import type { BargainCartItem, BargainOffer, BargainChatMessage } from '../Models/BargainSession';
import rawStyles from './styles';
const styles = rawStyles as any;

const ACTIVE_OFFER_STATUSES = new Set(['PENDING', 'COUNTERED']);

export default observer(function BargainSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { bargainingStore } = useStores();

  // `sessionId` is actually a bargain.id (= the live offer's id for a cart item), which can
  // change when the customer/shop sends a new counter-offer. Remember the underlying
  // session+cart-item once resolved so the screen can re-resolve to the new offer instead
  // of showing "Bargain not found" when its id changes from under us.
  const resolvedKeyRef = useRef<{ sessionId: string; cartItemId: string } | null>(null);

  let bargain = bargainingStore.bargains.find((b) => b.id === String(sessionId));
  if (bargain) {
    resolvedKeyRef.current = { sessionId: bargain.sessionId, cartItemId: bargain.cartItemId };
  } else if (resolvedKeyRef.current) {
    bargain = bargainingStore.bargains.find(
      (b) => b.sessionId === resolvedKeyRef.current!.sessionId && b.cartItemId === resolvedKeyRef.current!.cartItemId,
    );
  }
  const session = bargain ? bargainingStore.sessions.find((s) => s.sessionId === bargain.sessionId) : undefined;

  const [chatInput, setChatInput] = useState('');
  const [counterOfferId, setCounterOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMerchantTyping, setIsMerchantTyping] = useState(false);

  const showToast = (message: string, error = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, error });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  // Surface WS-level errors (e.g. invalid offer/accept/reject responses from the server) as a toast
  useEffect(() => {
    if (bargainingStore.actionError) {
      showToast(bargainingStore.actionError, true);
      bargainingStore.clearActionError();
    }
  }, [bargainingStore.actionError]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Auto-scroll to bottom on mount or when a new message arrives (if already at bottom)
  useEffect(() => {
    if (isNearBottom) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } else if (bargain?.timeline.length) {
      setUnreadCount((c) => c + 1);
    }
  }, [bargain?.timeline.length]);

  useEffect(() => {
    // Reset unread count when user scrolls back to bottom
    if (isNearBottom) {
      setUnreadCount(0);
    }
  }, [isNearBottom]);

  // Mark messages as seen when viewed
  useEffect(() => {
    if (session) {
      bargainingStore.markSeen(session.sessionId);
    }
  }, [session, bargain?.timeline.length]);

  // Clean typing status on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

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
      const confirmed = window.confirm('Reject this bargain request?');
      if (confirmed) {
        bargainingStore.rejectBargain(offerId);
      }
    } else {
      Alert.alert('Reject offer', 'Reject this bargain request?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => bargainingStore.rejectBargain(offerId) },
      ]);
    }
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    bargainingStore.sendMerchantMessage(bargain.sessionId, chatInput);
    setChatInput('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsMerchantTyping(false);
    bargainingStore.sendTypingStatus(bargain.sessionId, false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const handleTextChange = (text: string) => {
    setChatInput(text);

    if (!isMerchantTyping) {
      setIsMerchantTyping(true);
      bargainingStore.sendTypingStatus(bargain.sessionId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsMerchantTyping(false);
      bargainingStore.sendTypingStatus(bargain.sessionId, false);
    }, 2000);
  };

  const applyPercentDiscount = (pct: number) => {
    if (!counterEntry) return;
    setCounterPrice(Math.round(counterEntry.item.effectivePrice * (1 - pct / 100)));
  };

  const currentDiscountPercent = counterEntry && counterEntry.item.effectivePrice > 0
    ? Math.round((1 - counterPrice / counterEntry.item.effectivePrice) * 100)
    : 0;

  const sessionActive = session.status !== 'ENDED' && session.status !== 'EXPIRED' && bargain.status === 'Pending';
  const cartTotal = session.cart.reduce((sum, item) => sum + item.lineTotal, 0);

  const parseISODate = (isoString: string): Date => {
    if (!isoString) return new Date();
    const sanitized = isoString.replace(/\.(\d{3})\d+/, '.$1');
    const d = new Date(sanitized);
    return isNaN(d.getTime()) ? new Date(isoString) : d;
  };

  // Group messages by Date and consecutive sender block
  const getGroupedTimeline = () => {
    const groups: { title: string; blocks: { sender: 'customer' | 'merchant' | 'system'; messages: typeof bargain.timeline }[] }[] = [];

    const getDayLabel = (dateStr: string) => {
      const d = parseISODate(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (d.toDateString() === today.toDateString()) return 'Today';
      if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    let currentDayLabel = '';
    let currentDayGroup: typeof groups[0] | null = null;
    let currentBlock: typeof groups[0]['blocks'][0] | null = null;

    bargain.timeline.forEach((msg) => {
      const dayLabel = getDayLabel(msg.createdAt);
      if (dayLabel !== currentDayLabel) {
        currentDayLabel = dayLabel;
        currentDayGroup = { title: dayLabel, blocks: [] };
        groups.push(currentDayGroup);
        currentBlock = null;
      }

      const senderType = msg.sender;

      const isSameSender = currentBlock && currentBlock.sender === senderType;
      const isWithinGroupingTime = currentBlock && currentBlock.messages.length > 0 &&
        (parseISODate(msg.createdAt).getTime() - parseISODate(currentBlock.messages[currentBlock.messages.length - 1].createdAt).getTime()) < 120000;

      // Offers are kept as separate event cards, so they never group with standard texts
      const isOfferEvent = msg.messageType === 'OFFER' || msg.messageType === 'COUNTER_OFFER';

      if (isSameSender && isWithinGroupingTime && !isOfferEvent && currentBlock && currentBlock.messages[0].messageType !== 'OFFER' && currentBlock.messages[0].messageType !== 'COUNTER_OFFER') {
        currentBlock.messages.push(msg);
      } else {
        currentBlock = { sender: senderType, messages: [msg] };
        currentDayGroup?.blocks.push(currentBlock);
      }
    });

    return groups;
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;
    setIsNearBottom(isCloseToBottom);
  };

  // Determine countdown warning levels
  const getCountdownColor = () => {
    if (bargain.expirationTime <= 60) return '#EF4444'; // Red (<1m)
    if (bargain.expirationTime <= 300) return '#F59E0B'; // Orange (<5m)
    return '#10B981'; // Green
  };

  // Sort and display the negotiation timeline rounds
  const negotiationHistory = Object.values(session.offers)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <AnimatedScreen style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      {/* 1. WebSocket Reconnect / Offline Banner */}
      {bargainingStore.connectionStatus !== 'open' && (
        <View style={styles.connectionBanner}>
          <AlertCircle size={16} color="#991B1B" />
          <Text style={styles.connectionBannerText}>
            {bargainingStore.connectionStatus === 'reconnecting'
              ? 'Connection lost. Trying to reconnect...'
              : 'Gateway is offline. Reconnecting...'}
          </Text>
        </View>
      )}

      {/* 2. Redesigned Premium Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(bargain.customerName)}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{bargain.customerName}</Text>
          <Text style={[styles.headerSubtitle, { color: getCountdownColor() }]}>
            ⏳ {Math.floor(bargain.expirationTime / 60)}:{String(bargain.expirationTime % 60).padStart(2, '0')} remaining
          </Text>
        </View>

        <View style={styles.headerStatus}>
          <Text style={styles.headerStatusText}>Round {negotiationHistory.length}</Text>
        </View>
      </View>

      {/* 3. Collapsible Sticky Deal Summary Panel */}
      <View style={styles.stickySummaryBar}>
        <View style={styles.stickySummaryTop}>
          <Text style={styles.stickySummaryProduct} numberOfLines={1}>
            {bargain.productName}
          </Text>
          <TouchableOpacity style={styles.stickySummaryCollapseBtn} onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}>
            {isSummaryExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
          </TouchableOpacity>
        </View>

        {isSummaryExpanded && (
          <View style={styles.stickySummaryContent}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Cart Value</Text>
              <Text style={styles.summaryStatValue}>₹{cartTotal}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>MRP</Text>
              <Text style={styles.summaryStatValue}>₹{bargain.originalPrice}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Current Offer</Text>
              <Text style={[styles.summaryStatValue, { color: '#10B981' }]}>₹{bargain.customerOffer}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Gap</Text>
              <Text style={[styles.summaryStatValue, { color: '#EF4444' }]}>₹{bargain.currentPrice - bargain.customerOffer}</Text>
            </View>
          </View>
        )}
      </View>

      {/* 4. Timeline Message Board */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        {bargain.timeline.length === 0 ? (
          /* Empty state view */
          <View style={styles.emptyStateContainer}>
            <ShoppingBag size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>Start the negotiation</Text>
            <Text style={styles.emptyStateText}>
              Send a greeting message or write a counter offer to get started with {bargain.customerName}.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateBtn}
              onPress={() => {
                setChatInput("Hello! How can I help you with your offer today?");
              }}
            >
              <Text style={styles.emptyStateBtnText}>Send Greeting</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.timeline}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          >
            {getGroupedTimeline().map((group) => (
              <View key={group.title}>
                {/* Date separator pill */}
                <View style={styles.dateSeparatorRow}>
                  <View style={styles.dateSeparatorLine} />
                  <View style={styles.dateSeparatorPill}>
                    <Text style={styles.dateSeparatorText}>{group.title}</Text>
                  </View>
                  <View style={styles.dateSeparatorLine} />
                </View>

                {group.blocks.map((block, bIdx) => {
                  if (block.sender === 'system') {
                    return block.messages.map((m) => (
                      <View key={m.id} style={styles.systemDividerRow}>
                        <View style={styles.systemDividerLine} />
                        <Text style={styles.systemDividerText}>{m.message}</Text>
                        <View style={styles.systemDividerLine} />
                      </View>
                    ));
                  }

                  // Render OFFER / COUNTER_OFFER events as standalone negotiation cards.
                  // `sender_id` (via msg.sender) decides which side a card belongs to and
                  // whether the shop owner needs to respond to it.
                  const firstMsg = block.messages[0];
                  const isOffer = firstMsg.messageType === 'OFFER';
                  const isCounter = firstMsg.messageType === 'COUNTER_OFFER';

                  if (isOffer || isCounter) {
                    const liveOffer = firstMsg.bargainOfferId
                      ? Object.values(session.offers).find((o) => o.offerId === firstMsg.bargainOfferId)
                      : undefined;

                    const match = firstMsg.message.match(/₹\s*([0-9]+(?:\.[0-9]+)?)/);
                    const fallbackAmount = match ? parseFloat(match[1]) : (isOffer ? bargain.customerOffer : bargain.currentPrice);
                    const offer: any = liveOffer ?? {
                      offerId: firstMsg.bargainOfferId || `fallback-${firstMsg.id}`,
                      cartItemId: bargain.cartItemId,
                      originalPrice: bargain.originalPrice,
                      offeredAmount: fallbackAmount,
                      status: 'EXPIRED',
                    };

                    const fromCustomer = firstMsg.sender === 'customer';
                    // OFFER cards always come from the customer; COUNTER_OFFER cards can come
                    // from either side. Cards from the customer always need a merchant
                    // response, so they render on the LEFT with the "received" layout.
                    const showAsReceived = isOffer || fromCustomer;
                    const cartItem = session.cart.find((i) => i.cartItemId === offer.cartItemId);
                    const discountPct = offer.originalPrice > 0 ? Math.round((1 - offer.offeredAmount / offer.originalPrice) * 100) : 0;
                    const canRespond = !!liveOffer && fromCustomer && ACTIVE_OFFER_STATUSES.has(offer.status) && sessionActive;
                    const cardLabel = isOffer ? 'Offer Received' : fromCustomer ? 'Counter Offer Received' : 'Counter Offer Sent';

                    return (
                      <View key={firstMsg.id} style={[showAsReceived ? styles.offerInlineCard : styles.counterInlineCard, showAsReceived ? styles.cardAlignLeft : styles.cardAlignRight]}>
                        <View style={showAsReceived ? styles.offerInlineHeader : styles.counterInlineHeader}>
                          <Text style={showAsReceived ? styles.offerInlineLabel : styles.counterInlineLabel}>{cardLabel}</Text>
                          {showAsReceived ? (
                            <Text style={styles.offerInlineStatus}>{offer.status.toLowerCase()}</Text>
                          ) : (
                            <Text style={styles.counterInlineStatus}>
                              {firstMsg.status === 'READ' ? 'Seen ✓✓' : firstMsg.status === 'DELIVERED' ? 'Delivered ✓' : 'Sent'}
                            </Text>
                          )}
                        </View>
                        {showAsReceived ? (
                          <>
                            <Text style={styles.offerInlineTitle} numberOfLines={1}>
                              {cartItem?.productName || bargain.productName}
                            </Text>
                            <View style={styles.offerInlineDetails}>
                              <View style={styles.offerInlineValueBlock}>
                                <Text style={styles.offerInlineValueLabel}>List Price</Text>
                                <Text style={[styles.offerInlineValue, { textDecorationLine: 'line-through', color: '#94A3B8' }]}>
                                  ₹{offer.originalPrice}
                                </Text>
                              </View>
                              <View style={styles.offerInlineValueBlock}>
                                <Text style={styles.offerInlineValueLabel}>{isOffer ? 'Customer Offer' : "Customer's New Offer"}</Text>
                                <Text style={[styles.offerInlineValue, { color: '#10B981' }]}>
                                  ₹{offer.offeredAmount}
                                </Text>
                              </View>
                              <View style={styles.offerInlineValueBlock}>
                                <Text style={styles.offerInlineValueLabel}>Discount</Text>
                                <Text style={styles.offerInlineDiscount}>{discountPct}% off</Text>
                              </View>
                            </View>
                            {canRespond && (
                              <View style={styles.offerInlineActions}>
                                <TouchableOpacity style={[styles.offerInlineBtn, styles.offerInlineBtnAccept]} onPress={() => handleAccept(offer.offerId)}>
                                  <Text style={styles.offerInlineBtnText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.offerInlineBtn, styles.offerInlineBtnCounter]}
                                  onPress={() => openCounter(offer.offerId, offer.originalPrice, offer.offeredAmount)}
                                >
                                  <Text style={styles.offerInlineBtnText}>Counter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.offerInlineBtn, styles.offerInlineBtnReject]} onPress={() => handleReject(offer.offerId)}>
                                  <Text style={styles.offerInlineBtnText}>Reject</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        ) : (
                          <View style={styles.counterInlineDetails}>
                            <View style={styles.counterInlinePriceBlock}>
                              <Text style={styles.offerInlineValueLabel}>Your Counter Price</Text>
                              <Text style={styles.counterInlinePrice}>₹{offer.offeredAmount}</Text>
                            </View>
                            <Clock3 size={20} color="#64748B" />
                          </View>
                        )}
                      </View>
                    );
                  }

                  // Normal Text Messages
                  const isMine = block.sender === 'merchant';
                  return (
                    <View key={bIdx} style={styles.messageGroupContainer}>
                      {block.messages.map((m) => {
                        const formattedTime = m.time;
                        return (
                          <View key={m.id} style={[styles.messageRow, isMine ? styles.messageRowCustomer : styles.messageRowMerchant]}>
                            <View style={isMine ? styles.bubbleCustomer : styles.bubbleMerchant}>
                              <Text style={isMine ? styles.bubbleCustomerText : styles.bubbleMerchantText}>
                                {m.message}
                              </Text>
                              <View style={isMine ? styles.bubbleCustomerMeta : styles.bubbleMerchantMeta}>
                                <Text style={isMine ? styles.bubbleCustomerTime : styles.bubbleMerchantTime}>
                                  {formattedTime}
                                </Text>
                                {isMine && (
                                  m.status === 'READ' ? (
                                    <CheckCheck size={12} color="#93C5FD" />
                                  ) : (
                                    <Check size={12} color="#93C5FD" />
                                  )
                                )}
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            ))}

            {/* Typing Indicator */}
            {session.isTyping && (
              <View style={{ alignSelf: 'flex-start', marginVertical: 6, paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                  {bargain.customerName} is typing...
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* 5. Floating Navigation Indicator overlay */}
        {!isNearBottom && unreadCount > 0 && (
          <TouchableOpacity
            style={styles.floatingNewMsgsBtn}
            onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <ArrowDown size={14} color="#FFFFFF" />
            <Text style={styles.floatingNewMsgsText}>New messages ({unreadCount})</Text>
          </TouchableOpacity>
        )}

        {/* 6. Sticky Composer Input Bar / Ended states */}
        {sessionActive ? (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              value={chatInput}
              onChangeText={handleTextChange}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={300}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !chatInput.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={!chatInput.trim()}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.endedBanner}>
            <Text style={styles.endedTitle}>
              {bargain.status === 'Accepted' ? 'Deal closed' : bargain.status === 'Rejected' ? 'Offer rejected' : 'Bargain expired'}
            </Text>
            <Text style={styles.endedText}>
              {bargain.status === 'Accepted'
                ? `Order generated at ₹${bargain.customerOffer}.`
                : bargain.status === 'Rejected'
                ? 'You declined this offer.'
                : 'The customer ran out of time to respond.'}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Counter Offer Bottom Sheet (Make an offer UI styled with White Theme) */}
      <BottomSheet isVisible={counterOfferId !== null} onClose={() => setCounterOfferId(null)} height={0.65}>
        {counterEntry ? (
          <View style={styles.sheet}>
            {/* Header Row */}
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetHeaderTitle}>Make a counter offer</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setCounterOfferId(null)}>
                <X size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Cart Item Selection list */}
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

            {/* Your Counter offer field */}
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

            {/* Quick adjust percentages */}
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

            {/* Submit Action */}
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

      {/* Success Celebration Modal Overlay */}
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
