import React, { useEffect } from 'react';
import { DimensionValue, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { skeletonStyle } from './styledcomponents';
interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  variant?: 'rectangle' | 'circle';
  borderRadius?: number;
  style?: ViewStyle;
}
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'rectangle',
  borderRadius,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const isCircle = variant === 'circle';
  const defaultRadius = isCircle
    ? typeof width === 'number' ? width / 2 : 9999
    : borderRadius !== undefined ? borderRadius : theme.borderRadius.sm;
  return (
    <Animated.View
      style={[
        skeletonStyle,
        {
          width,
          height,
          borderRadius: defaultRadius,
          backgroundColor: isDark ? theme.colors.surfaceSecondary : '#E1E6E6',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
export default Skeleton;
