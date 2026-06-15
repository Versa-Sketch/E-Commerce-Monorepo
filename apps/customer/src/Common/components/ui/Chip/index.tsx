import React from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { chipStyle, iconStyle } from './styledcomponents';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  leftIcon,
  style,
  textStyle,
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const activeBg = theme.colors.primary;
  const inactiveBg = isDark ? theme.colors.surfaceSecondary : '#F0F4F4';
  const activeText = theme.colors.surface;
  const inactiveText = theme.colors.textSecondary;
  const inactiveBorder = theme.colors.border;
  const handlePressIn = () => { scale.value = withSpring(0.95, { damping: 10, stiffness: 200 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 10, stiffness: 200 }); };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const renderIcon = () => (
    <View style={iconStyle}>{leftIcon}</View>
  );
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        chipStyle,
        {
          backgroundColor: selected ? activeBg : inactiveBg,
          borderColor: selected ? 'transparent' : inactiveBorder,
          borderWidth: 1,
          borderRadius: theme.borderRadius.sm,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        animatedStyle,
        style,
      ]}
    >
      {leftIcon && renderIcon()}
      <Text style={[theme.textPresets.label, { color: selected ? activeText : inactiveText, fontSize: 12 }, textStyle]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};
export default Chip;
