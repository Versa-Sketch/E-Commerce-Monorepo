import { OrderTrackingMap } from '@/features/Orders/components/OrderTrackingMap';
import { OrderTrackingTimeline } from '@/features/Orders/components/OrderTrackingTimeline';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useOrderStore } from '../../../features/Orders/Providers/useOrderStore';
import { OrderStatus } from '../../../features/Orders/types/domain';
import { useTheme } from '../../../theme/ThemeContext';
export default observer(function OrderTrackingScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderStore = useOrderStore();
  const activeOrder = orderStore.orders.find((o) => o.id === id) || orderStore.orders[0];
  const mockDeliveryPartner = {
    name: 'Rahul Sharma',
    avatarUrl: 'https://i.pravatar.cc/150?u=rider1',
    phone: '+919876543210'
  };
  const handleSimulateNextStep = () => {
    if (!activeOrder) return;
    const steps: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PACKING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = steps.indexOf(activeOrder.status);
    if (currentIdx < steps.length - 1) {
      const nextStatus = steps[currentIdx + 1];
      orderStore.updateOrderStatus(activeOrder.id, nextStatus);
    }
  };
  const handleCall = () => {
    if (mockDeliveryPartner.phone) {
      Linking.openURL(`tel:${mockDeliveryPartner.phone}`).catch(() => {
        Alert.alert('Calling unavailable', 'This device does not support telephone dialing.');
      });
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => router.replace('/(tabs)/orders')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            Live Tracking
          </Text>
          <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]}>
            Order ID: #{activeOrder?.id || 'Unknown'}
          </Text>
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OrderTrackingMap />
        {activeOrder && (activeOrder.status === 'OUT_FOR_DELIVERY' || activeOrder.status === 'DELIVERED') && (
          <View style={[styles.courierCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
            <Image source={{ uri: mockDeliveryPartner.avatarUrl }} style={styles.courierAvatar} />
            <View style={styles.courierInfo}>
              <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
                {mockDeliveryPartner.name}
              </Text>
              <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                Localio Delivery Partner
              </Text>
            </View>
            <View style={styles.communicationRow}>
              <Pressable onPress={handleCall} style={[styles.commBtn, { backgroundColor: 'rgba(0, 109, 119, 0.08)' }]}>
                <Ionicons name="call" size={20} color={theme.colors.primary} />
              </Pressable>
              <Pressable onPress={() => Alert.alert('Chat Active', 'Connecting to delivery courier...')} style={[styles.commBtn, { backgroundColor: 'rgba(0, 109, 119, 0.08)' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.primary} />
              </Pressable>
            </View>
          </View>
        )}

        {activeOrder && (
          <OrderTrackingTimeline
            status={activeOrder.status}
            createdAt={activeOrder.toRaw().createdAt}
            updatedAt={activeOrder.toRaw().updatedAt}
          />
        )}
      </ScrollView>
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12, borderBottomWidth: 1.5 },
  backBtn: { padding: 4 },
  headerText: { alignItems: 'center' },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  courierCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1.5, marginBottom: 16 },
  courierAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F4F4' },
  courierInfo: { flex: 1, marginLeft: 12 },
  communicationRow: { flexDirection: 'row', alignItems: 'center' },
  commBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  simulatorBox: { padding: 16, borderWidth: 1.5, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
});
