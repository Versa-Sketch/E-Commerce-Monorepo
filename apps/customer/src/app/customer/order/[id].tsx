import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../Common/components/ui/Badge';
import { LoadingWrapper } from '../../../Common/components/ui/LoadingWrapper';
import { formatCurrency, formatDate, formatStatus } from '../../../Common/utils/formatters';
import { useOrderStore } from '../../../features/Orders/Providers/useOrderStore';
import { useTheme } from '../../../theme/ThemeContext';

const getBadgeVariant = (status: string): 'success' | 'error' | 'secondary' | 'warning' => {
  if (status === 'DELIVERED') return 'success';
  if (status === 'CANCELLED') return 'error';
  if (status === 'PLACED' || status === 'ACCEPTED') return 'secondary';
  return 'warning';
};

export default observer(function OrderDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderStore = useOrderStore();

  useEffect(() => {
    if (id) orderStore.fetchOrderById(id);
  }, [id]);

  const order = orderStore.orderDetail;

  const renderContent = () => {
    if (!order) return null;
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
                {order.shop_name}
              </Text>
              <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                Order #{order.order_id}
              </Text>
              <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                Placed on {formatDate(order.created_at)}
              </Text>
            </View>
            <Badge label={formatStatus(order.status)} variant={getBadgeVariant(order.status)} />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            Items
          </Text>
          {order.items.map((item, idx) => (
            <View key={`${item.variant_id}_${idx}`} style={styles.itemRow}>
              {item.product_image ? (
                <Image source={{ uri: item.product_image }} style={[styles.itemImage, { backgroundColor: theme.colors.surfaceSecondary }]} />
              ) : (
                <View style={[styles.itemImage, { backgroundColor: theme.colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="cube-outline" size={18} color={theme.colors.textMuted} />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text numberOfLines={1} style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
                  {item.product_name}
                </Text>
                <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  Qty {item.quantity} • {formatCurrency(parseFloat(item.unit_price))} each
                </Text>
              </View>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
                {formatCurrency(parseFloat(item.total_price))}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
          <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            Bill details
          </Text>
          <View style={styles.billRow}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Subtotal</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>{formatCurrency(parseFloat(order.subtotal))}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Delivery charge</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>{formatCurrency(parseFloat(order.delivery_charge))}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Discount</Text>
            <Text style={[theme.textPresets.bodySmall, { color: theme.colors.success }]}>
              -{formatCurrency(parseFloat(order.discount_amount))}
            </Text>
          </View>
          <View style={[styles.billRow, styles.billTotalRow, { borderTopColor: theme.colors.border }]}>
            <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>Total</Text>
            <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              {formatCurrency(parseFloat(order.total_amount))}
            </Text>
          </View>
        </View>

        {order.payment && (
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
            <Text style={[theme.textPresets.label, styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              Payment
            </Text>
            <View style={styles.billRow}>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Method</Text>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textPrimary }]}>
                {order.payment.payment_method === 'COD' ? 'Cash on delivery' : 'Pay online (Razorpay)'}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary }]}>Status</Text>
              <Badge label={order.payment.status} variant={order.payment.status === 'SUCCESS' || order.payment.status === 'COD' ? 'success' : 'warning'} size="sm" />
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Order Details
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <LoadingWrapper
        apiStatus={orderStore.orderDetailStatus}
        error={orderStore.orderDetailError}
        retry={() => { if (id) orderStore.fetchOrderById(id); }}
        renderSuccessUI={renderContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12, borderBottomWidth: 1.5 },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionCard: { borderWidth: 1.5, padding: 16, marginBottom: 16 },
  sectionTitle: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImage: { width: 40, height: 40, borderRadius: 8 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  billTotalRow: { borderTopWidth: 1, paddingTop: 8, marginTop: 4, marginBottom: 0 },
});
