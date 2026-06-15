import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { StoreCategory } from '../../../../types/shared';
import { circleStyle, containerStyle, labelStyle } from './styledcomponents';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface CategoryCardProps {
  category: StoreCategory;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}
const resolveCategoryStyle = (
  category: StoreCategory,
  theme: ReturnType<typeof useTheme>['theme']
): { iconName: keyof typeof Ionicons.glyphMap; softColor: string; iconColor: string } => {
  switch (category) {
    case 'grocery':
    case 'daily_amenities':
      return { iconName: 'basket', softColor: 'rgba(34, 181, 115, 0.08)', iconColor: theme.colors.success };
    case 'pharmacy':
      return { iconName: 'medical', softColor: 'rgba(229, 72, 77, 0.08)', iconColor: theme.colors.error };
    case 'restaurants':
    case 'food':
      return { iconName: 'restaurant', softColor: 'rgba(242, 169, 59, 0.08)', iconColor: theme.colors.warning };
    case 'fashion':
      return { iconName: 'shirt', softColor: 'rgba(201, 124, 93, 0.08)', iconColor: theme.colors.accent };
    case 'electronics':
      return { iconName: 'phone-portrait', softColor: 'rgba(0, 109, 119, 0.08)', iconColor: theme.colors.primary };
    case 'general_store':
      return { iconName: 'storefront', softColor: 'rgba(0, 122, 255, 0.08)', iconColor: '#007AFF' };
    case 'local_business':
      return { iconName: 'briefcase', softColor: 'rgba(0, 77, 87, 0.08)', iconColor: theme.colors.deepPrimary };
    default:
      return { iconName: 'grid', softColor: 'rgba(102, 112, 133, 0.08)', iconColor: theme.colors.textSecondary };
  }
};
export const CategoryCard: React.FC<CategoryCardProps> = ({ category, label, onPress, style }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const { iconName, softColor, iconColor } = resolveCategoryStyle(category, theme);
  const handlePressIn = () => { scale.value = withSpring(0.92, { damping: 10, stiffness: 200 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 10, stiffness: 200 }); };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const renderIcon = () => (
    <View style={[circleStyle, { backgroundColor: softColor }]}>
      <Ionicons name={iconName} size={26} color={iconColor} />
    </View>
  );
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyle, animatedStyle, style]}
    >
      {renderIcon()}
      <Text numberOfLines={1} style={[theme.textPresets.caption, labelStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};
export default CategoryCard;
