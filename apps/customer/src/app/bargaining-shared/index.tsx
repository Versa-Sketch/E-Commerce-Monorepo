import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { BargainCardView, PendingDealCard, ResolvedDealCard } from '@monorepo/bargaining';
import { useTheme } from '../../theme/ThemeContext';
import { customerBargainingStore as store } from '@/features/BargainingShared/store';

function respond(item: BargainCardView, action: 'ACCEPT' | 'REJECT') {
  const offer = store.sessions[item.sessionId]?.offers[item.cartItemId];
  if (!offer) return;
  store.activeSessionId = item.sessionId;
  store.respondToOffer(offer, action).catch(() => {});
}

export default observer(function BargainingSharedDashboard() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    store.connect();
    store.startSession('fixture-cart-1').catch(() => {});
    return () => store.disconnect();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.textPresets.h2, { color: theme.colors.textPrimary, margin: 16 }]}>Negotiations</Text>
      <FlatList
        data={store.bargains}
        keyExtractor={(deal) => `${deal.sessionId}-${deal.cartItemId}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) =>
          item.status === 'PENDING' ? (
            <PendingDealCard
              deal={item}
              viewerRole="CUSTOMER"
              onAccept={() => respond(item, 'ACCEPT')}
              onCounter={() => router.push({ pathname: '/bargaining-shared/[sessionId]', params: { sessionId: item.sessionId } })}
              onReject={() => respond(item, 'REJECT')}
            />
          ) : (
            <ResolvedDealCard deal={item} />
          )
        }
        ListEmptyComponent={
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
            No active negotiations yet.
          </Text>
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
});
