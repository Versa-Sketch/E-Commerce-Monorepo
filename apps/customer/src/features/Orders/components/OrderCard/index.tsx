import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { OrderModel } from '../../Models/OrderModel';
import { Badge } from '@/Common/components/ui/Badge';
import { Button } from '@/Common/components/ui/Button';
import {
  cardBodyStyle,
  cardHeaderStyle,
  orderCardStyle,
  priceRowStyle,
  cardActionsStyle,
  trackBtnStyle,
} from './styledcomponents';
interface OrderCardProps {
  order: OrderModel;
  activeTab: 'ongoing' | 'completed' | 'cancelled';
  onTrackOrder: (order: OrderModel) => void;
  onPress?: (order: OrderModel) => void;
}
export const OrderCard: React.FC<OrderCardProps> = observer(({ order, activeTab, onTrackOrder, onPress }) => {
  const { theme } = useTheme();
  const getBadgeVariant = (status: string): 'success' | 'error' | 'secondary' | 'warning' => {
    if (status === 'DELIVERED') return 'success';
    if (status === 'CANCELLED') return 'error';
    if (status === 'PLACED' || status === 'ACCEPTED') return 'secondary';
    return 'warning';
  };
  return (
    <Pressable
      onPress={() => onPress?.(order)}
      style={[
        orderCardStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          shadowColor: 'rgba(0, 60, 70, 0.05)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
        },
      ]}
    >
      <View style={[cardHeaderStyle, { borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            {order.storeName}
          </Text>
          <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
            ID: #{order.id} • {order.formattedDate}
          </Text>
        </View>
        <Badge label={order.formattedStatus} variant={getBadgeVariant(order.status)} />
      </View>
      <View style={cardBodyStyle}>
        {order.items.map((item, idx) => (
          <Text key={idx} style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary, marginBottom: 4 }]}>
            • {item.productName} (x{item.quantity})
          </Text>
        ))}
        <View style={[priceRowStyle, { marginTop: theme.spacing.xs }]}>
          <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]}>Total Amount:</Text>
          <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            {order.formattedTotal}
          </Text>
        </View>
      </View>
      {activeTab === 'ongoing' && (
        <View style={[cardActionsStyle, { borderTopColor: theme.colors.border }]}>
          <Button
            label="Track Order Status"
            onPress={() => onTrackOrder(order)}
            variant="solid"
            style={trackBtnStyle}
            leftIcon={<Ionicons name="map-outline" size={16} color="#FFFFFF" />}
          />
        </View>
      )}
    </Pressable>
  );
});
export default OrderCard;
