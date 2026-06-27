import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LoadingWrapper } from '../../Common/components/ui/LoadingWrapper';
import { OrderModel } from '../../features/Orders/Models/OrderModel';
import { useOrderStore } from '../../features/Orders/Providers/useOrderStore';
import { useTheme } from '../../theme/ThemeContext';
import { OrderCard } from '@/features/Orders/components/OrderCard';
type OrderTab = 'ongoing' | 'completed' | 'cancelled';
export default observer(function OrdersScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const orderStore = useOrderStore();
  const [activeTab, setActiveTab] = useState<OrderTab>('ongoing');
  useFocusEffect(
    useCallback(() => {
      orderStore.fetchOrders();
    }, [orderStore])
  );
  const activeOrdersList =
    activeTab === 'completed' ? orderStore.completedOrders
      : activeTab === 'cancelled' ? orderStore.cancelledOrders
        : orderStore.ongoingOrders;
  const handleTrackOrder = (order: OrderModel) => {
    orderStore.setActiveTrackingOrder(order.toRaw());
    router.push(`/customer/tracking/${order.id}`);
  };
  const handleOpenOrder = (order: OrderModel) => {
    router.push(`/customer/order/${order.id}`);
  };
  // Render helpers
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[theme.textPresets.h1, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 28 }]}>
        Your Orders
      </Text>
    </View>
  );
  const renderSegmentTabs = () => (
    <View style={[styles.segmentContainer, { backgroundColor: isDark ? theme.colors.surfaceSecondary : '#EAEFEF', borderRadius: theme.borderRadius.round }]}>
      {(['ongoing', 'completed', 'cancelled'] as OrderTab[]).map((tab) => (
        <Pressable
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[styles.segmentBtn, { backgroundColor: activeTab === tab ? theme.colors.surface : 'transparent', borderRadius: theme.borderRadius.round }]}
        >
          <Text style={[theme.textPresets.label, { color: activeTab === tab ? theme.colors.primary : theme.colors.textSecondary, textTransform: 'capitalize', fontFamily: activeTab === tab ? theme.typography.fonts.semiBold : theme.typography.fonts.medium }]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={48} color={theme.colors.textMuted} />
      <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, marginTop: 12, fontWeight: 'bold' }]}>
        No orders found
      </Text>
      <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: 'center', maxWidth: 200 }]}>
        You don't have any orders listed in this tab yet.
      </Text>
    </View>
  );
  const renderOrderList = () => (
    <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
      {activeOrdersList.length === 0 ? (
        renderEmptyState()
      ) : (
        activeOrdersList.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            activeTab={activeTab}
            onTrackOrder={handleTrackOrder}
            onPress={handleOpenOrder}
          />
        ))
      )}
    </ScrollView>
  );
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {renderHeader()}
      {renderSegmentTabs()}
      <LoadingWrapper
        apiStatus={orderStore.fetchStatus}
        error={orderStore.error}
        retry={orderStore.fetchOrders}
        renderSuccessUI={renderOrderList}
      />
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  segmentContainer: { flexDirection: 'row', marginHorizontal: 20, height: 48, padding: 4, marginBottom: 20 },
  segmentBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollList: { paddingHorizontal: 20, paddingBottom: 140 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
});
