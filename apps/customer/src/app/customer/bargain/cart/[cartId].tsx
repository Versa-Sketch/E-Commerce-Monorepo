import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { useBargainingStore } from '@/features/Bargaining/Providers/useBargainingStore';
import { EmptyState } from '@/Common/components/ui/EmptyState';
import { Badge } from '@/Common/components/ui/Badge';
import { API_STATUS } from '@/Common/Constants';
import { BargainSessionHistory, BargainTimelineEvent } from '@/features/Bargaining/types/domain';
import { formatAmount } from '@/features/Bargaining/utils/bargainHelpers';

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const getPreview = (timeline: BargainTimelineEvent[]): string => {
  for (let i = timeline.length - 1; i >= 0; i--) {
    const event = timeline[i];
    if (event.type === 'chat_message') return event.message;
    if (event.type === 'bargain_offer') return `Offer ${formatAmount(event.offered_amount)}`;
  }
  return 'No activity yet';
};

const statusVariant = (status: BargainSessionHistory['status']) =>
  status === 'ACTIVE' ? 'success' : status === 'EXPIRED' ? 'warning' : 'secondary';

export default observer(function BargainCartHistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartId, focusCartItemId } = useLocalSearchParams<{ cartId: string; focusCartItemId?: string }>();
  const bargainingStore = useBargainingStore();

  useEffect(() => {
    if (cartId) bargainingStore.loadCartHistory(cartId);
  }, [cartId]);

  const focusQuery = focusCartItemId ? `?focusCartItemId=${focusCartItemId}` : '';
  const sessions = bargainingStore.cartHistory?.sessions ?? [];
  const activeSession = sessions.find((s) => s.status === 'ACTIVE');
  const pastSessions = [...sessions].filter((s) => s.status !== 'ACTIVE').reverse();

  const openSession = (session: BargainSessionHistory) => {
    if (session.status === 'ACTIVE') {
      router.push(`/customer/bargain/session/${session.session_id}${focusQuery}`);
    } else {
      router.push({ pathname: '/customer/bargain/history/[sessionId]', params: { sessionId: session.session_id } });
    }
  };

  const handleStartNew = async () => {
    try {
      const session = await bargainingStore.startSession(cartId);
      router.push(`/customer/bargain/session/${session.session_id}${focusQuery}`);
    } catch (e) {
      Alert.alert('Unable to start bargain', 'Please try again in a moment.');
    }
  };

  const renderSessionCard = (session: BargainSessionHistory) => (
    <Pressable
      onPress={() => openSession(session)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: theme.borderRadius.round,
          backgroundColor: theme.dark ? 'rgba(0, 109, 119, 0.15)' : 'rgba(0, 109, 119, 0.08)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name="chatbubbles-outline" size={18} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginRight: 8 }]}>
            {formatDateTime(session.started_at)}
          </Text>
          <Badge label={session.status} variant={statusVariant(session.status)} size="sm" />
        </View>
        <Text numberOfLines={1} style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]}>
          {getPreview(session.timeline)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            theme.textPresets.bodyLarge,
            { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginLeft: 12, flex: 1 },
          ]}
          numberOfLines={1}
        >
          Bargain History
        </Text>
      </View>

      {(bargainingStore.cartHistoryStatus === API_STATUS.FETCHING || bargainingStore.cartHistoryStatus === API_STATUS.IDLE) && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      )}

      {bargainingStore.cartHistoryStatus === API_STATUS.ERROR && (
        <EmptyState
          title="Unable to load history"
          description={bargainingStore.cartHistoryError ?? 'Could not load bargain history for this cart.'}
          iconName="time-outline"
          actionLabel="Retry"
          onActionPress={() => bargainingStore.loadCartHistory(cartId)}
          style={{ flex: 1, justifyContent: 'center' }}
        />
      )}

      {bargainingStore.cartHistoryStatus === API_STATUS.SUCCESS && (
        <FlatList
          data={pastSessions}
          keyExtractor={(item) => item.session_id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
          renderItem={({ item }) => renderSessionCard(item)}
          ListHeaderComponent={
            <View style={{ marginBottom: 12 }}>
              {activeSession ? (
                <Pressable
                  onPress={() => openSession(activeSession)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.lg,
                    padding: 14,
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.surface} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.surface, fontFamily: theme.typography.fonts.bold }]}>
                      Continue active negotiation
                    </Text>
                    <Text style={[theme.textPresets.caption, { color: theme.colors.surface, opacity: 0.85 }]} numberOfLines={1}>
                      {getPreview(activeSession.timeline)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.surface} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleStartNew}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.accent,
                    borderRadius: theme.borderRadius.lg,
                    paddingVertical: 14,
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="pricetags-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#FFFFFF', fontFamily: theme.typography.fonts.bold, fontSize: 14 }}>Start New Bargain</Text>
                </Pressable>
              )}
              {pastSessions.length > 0 && (
                <Text style={[theme.textPresets.label, { color: theme.colors.textSecondary, marginBottom: 4 }]}>Past negotiations</Text>
              )}
            </View>
          }
          ListEmptyComponent={
            !activeSession ? (
              <EmptyState
                title="No past negotiations"
                description="You haven't bargained on this cart before. Start a new negotiation to get a better price."
                iconName="pricetags-outline"
              />
            ) : null
          }
        />
      )}
    </View>
  );
});
