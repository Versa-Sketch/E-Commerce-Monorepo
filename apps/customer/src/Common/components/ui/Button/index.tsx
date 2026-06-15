import React from 'react';
import { ActivityIndicator, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { buttonContentStyle, iconLeftStyle, iconRightStyle } from './styledcomponents';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}
export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  let buttonBg = theme.colors.primary;
  let buttonBorder = 'transparent';
  let labelColor = theme.colors.surface;
  if (variant === 'outline') {
    buttonBg = 'transparent';
    buttonBorder = theme.colors.primary;
    labelColor = theme.colors.primary;
  } else if (variant === 'ghost') {
    buttonBg = 'transparent';
    buttonBorder = 'transparent';
    labelColor = theme.colors.primary;
  } else if (variant === 'accent') {
    buttonBg = theme.colors.accent;
    labelColor = theme.colors.surface;
  }
  if (disabled) {
    buttonBg = theme.dark ? theme.colors.surfaceSecondary : '#E4E9E9';
    buttonBorder = 'transparent';
    labelColor = theme.colors.textMuted;
  }
  const paddingVertical = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const paddingHorizontal = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;
  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, { damping: 10, stiffness: 200 });
    }
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const renderLoader = () => <ActivityIndicator color={labelColor} size="small" />;
  const renderContent = () => (
    <Animated.View style={buttonContentStyle}>
      {leftIcon && <Animated.View style={iconLeftStyle}>{leftIcon}</Animated.View>}
      <Text style={[theme.textPresets.button, { color: labelColor, fontSize, textAlign: 'center' }, labelStyle]}>
        {label}
      </Text>
      {rightIcon && <Animated.View style={iconRightStyle}>{rightIcon}</Animated.View>}
    </Animated.View>
  );
  return (
    <AnimatedPressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: buttonBg,
          borderColor: buttonBorder,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: theme.borderRadius.md,
          paddingVertical,
          paddingHorizontal,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? renderLoader() : renderContent()}
    </AnimatedPressable>
  );
};
export default Button;
