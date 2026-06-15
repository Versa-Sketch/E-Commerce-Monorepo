import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { OrderStatus } from '../../types/domain';
import {
  iconWrapperStyle,
  nodeLeftStyle,
  nodeRightStyle,
  timelineCardStyle,
  timelineRowStyle,
  verticalLineStyle,
} from './styledcomponents';
interface OrderTrackingTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
const STEPS: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PACKING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ status, createdAt, updatedAt }) => {
  const { theme } = useTheme();
  const currentIdx = STEPS.indexOf(status);
  const getStepIcon = (step: string, currentStatus: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />;
    }
    if (currentStatus === step) {
      return <Ionicons name="ellipse" size={16} color={theme.colors.primary} />;
    }
    return <Ionicons name="ellipse-outline" size={16} color={theme.colors.textMuted} />;
  };
  return (
    <View style={[timelineCardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}>
      <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, marginBottom: 16 }]}>
        Delivery Progress
      </Text>
      {STEPS.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = status === step;
        const timestamp = idx === 0 ? createdAt : (idx <= currentIdx ? updatedAt : undefined);
        return (
          <View key={step} style={timelineRowStyle}>
            <View style={nodeLeftStyle}>
              <View style={iconWrapperStyle}>
                {getStepIcon(step, status, isCompleted)}
              </View>
              {idx < STEPS.length - 1 && (
                <View style={[verticalLineStyle, { backgroundColor: isCompleted ? theme.colors.success : theme.colors.border }]} />
              )}
            </View>
            <View style={nodeRightStyle}>
              <Text
                style={[
                  theme.textPresets.bodyMedium,
                  {
                    color: isCompleted ? theme.colors.textPrimary : theme.colors.textSecondary,
                    fontFamily: isCurrent || isCompleted ? theme.typography.fonts.bold : theme.typography.fonts.regular,
                  },
                ]}
              >
                {step.replace(/_/g, ' ')}
              </Text>
              {timestamp ? (
                <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              ) : (
                <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  Pending...
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default OrderTrackingTimeline;
