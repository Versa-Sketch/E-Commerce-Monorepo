import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Skeleton } from '../../../../Common/components/ui/Skeleton';
import { useTheme } from '../../../../theme/ThemeContext';
import { BANNER_HEIGHT, containerStyle, infoStyle } from './styledcomponents';
interface FeaturedShopCardSkeletonProps {
  style?: ViewStyle;
}
export const FeaturedShopCardSkeleton: React.FC<FeaturedShopCardSkeletonProps> = ({ style }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        containerStyle,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
    >
      <Skeleton width="100%" height={BANNER_HEIGHT} borderRadius={0} />
      <View style={[infoStyle, { gap: 8 }]}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="55%" height={12} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
};
export default FeaturedShopCardSkeleton;
