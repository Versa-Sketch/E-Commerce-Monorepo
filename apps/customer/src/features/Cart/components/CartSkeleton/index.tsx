import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../../../../Common/components/ui/Skeleton';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  billRowStyle,
  cardHeaderRowStyle,
  cardStyle,
  itemDetailsStyle,
  itemRowStyle,
  totalRowStyle,
} from './styledcomponents';
const ItemRowSkeleton: React.FC<{ isLast?: boolean }> = ({ isLast }) => {
  const { theme } = useTheme();
  return (
    <View style={[itemRowStyle, !isLast && { marginBottom: 14 }]}>
      <Skeleton width={56} height={56} borderRadius={theme.borderRadius.md} />
      <View style={itemDetailsStyle}>
        <Skeleton width="65%" height={14} />
        <Skeleton width="35%" height={11} />
        <Skeleton width="40%" height={14} />
      </View>
      <Skeleton width={64} height={26} borderRadius={theme.borderRadius.round} />
    </View>
  );
};
export const CartSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View>
      <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
        <View style={cardHeaderRowStyle}>
          <Skeleton width={120} height={16} />
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Skeleton width={60} height={22} borderRadius={theme.borderRadius.round} />
            <Skeleton width={80} height={22} borderRadius={theme.borderRadius.round} />
          </View>
        </View>
        <ItemRowSkeleton />
        <ItemRowSkeleton isLast />
      </View>

      <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
        <View style={cardHeaderRowStyle}>
          <Skeleton width={100} height={16} />
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Skeleton width={60} height={22} borderRadius={theme.borderRadius.round} />
            <Skeleton width={80} height={22} borderRadius={theme.borderRadius.round} />
          </View>
        </View>
        <ItemRowSkeleton isLast />
      </View>

      <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
        <Skeleton width={130} height={16} style={{ marginBottom: 14 }} />
        <View style={billRowStyle}>
          <Skeleton width={70} height={12} />
          <Skeleton width={40} height={12} />
        </View>
        <View style={billRowStyle}>
          <Skeleton width={60} height={12} />
          <Skeleton width={36} height={12} />
        </View>
      </View>

      <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
        <Skeleton width={100} height={16} style={{ marginBottom: 14 }} />
        <View style={billRowStyle}>
          <Skeleton width={70} height={12} />
          <Skeleton width={40} height={12} />
        </View>
        <View style={billRowStyle}>
          <Skeleton width={90} height={12} />
          <Skeleton width={50} height={12} />
        </View>
        <View style={billRowStyle}>
          <Skeleton width={100} height={12} />
          <Skeleton width={36} height={12} />
        </View>
        <View style={totalRowStyle}>
          <Skeleton width={90} height={20} />
          <Skeleton width={70} height={24} />
        </View>
      </View>
    </View>
  );
};
export default CartSkeleton;
