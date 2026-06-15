import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Skeleton } from '../../../../Common/components/ui/Skeleton';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  BANNER_HEIGHT,
  chipsRowStyle,
  containerStyle,
  footerRowStyle,
  headerRowStyle,
  infoContainerStyle,
} from './styledcomponents';
interface ShopCardSkeletonProps {
  style?: ViewStyle;
}
export const ShopCardSkeleton: React.FC<ShopCardSkeletonProps> = ({ style }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
        },
        style,
      ]}
    >
      <Skeleton width="100%" height={BANNER_HEIGHT} borderRadius={0} />
      <View style={infoContainerStyle}>
        <View style={[headerRowStyle, { alignItems: 'center' }]}>
          <Skeleton width="55%" height={18} />
          <Skeleton width={52} height={26} borderRadius={50} />
        </View>
        <View style={[chipsRowStyle]}>
          <Skeleton width={72} height={22} borderRadius={8} />
          <Skeleton width={64} height={22} borderRadius={8} />
          <Skeleton width={58} height={22} borderRadius={8} />
        </View>
        <View style={[footerRowStyle]}>
          <Skeleton width={70} height={14} />
          <Skeleton width={50} height={14} />
          <Skeleton width={60} height={14} />
        </View>
      </View>
    </View>
  );
};
export default ShopCardSkeleton;
