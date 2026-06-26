import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { MOCK_PRODUCTS } from '../../../../constants';
import { floatingCartStyles } from './styledcomponents';

interface FloatingCartProps {
  totalItemCount: number;
  productImageUrl?: string;
  onViewCartsPress: () => void;
  onCheckoutPress: () => void;
  floatingCartAnimatedStyle: any;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({
  totalItemCount,
  productImageUrl,
  onViewCartsPress,
  onCheckoutPress,
  floatingCartAnimatedStyle,
}) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Use provided image or default to first mock product
  const imageUrl = productImageUrl || MOCK_PRODUCTS[0]?.imageUrl;

  return (
    <Animated.View
      style={[
        floatingCartStyles.floatingCart,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)',
        },
        floatingCartAnimatedStyle,
      ]}
    >
      {/* Main Cart Content Area */}
      <Pressable
        onPress={onViewCartsPress}
        style={floatingCartStyles.cartMainArea}
      >
        {/* Product Thumbnail */}
        <View
          style={[
            floatingCartStyles.cartImageWrapper,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6',
            },
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={floatingCartStyles.cartImage}
            resizeMode="cover"
          />
        </View>

        {/* Cart Info (Text) */}
        <View style={floatingCartStyles.cartLeft}>
          <Text
            style={[
              floatingCartStyles.viewCartText,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                marginTop: 14,
              },
            ]}
            numberOfLines={1}
          >
            View all carts
          </Text>
          <Text
            style={[
              floatingCartStyles.cartQtyText,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.medium,
              },
            ]}
            numberOfLines={1}
          >
            {totalItemCount} item{totalItemCount === 1 ? '' : 's'}
          </Text>
        </View>
      </Pressable>

      {/* Chevron Forward Button */}
      <Pressable
        onPress={onCheckoutPress}
        style={floatingCartStyles.cartChevronCircle}
      >
        <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
      </Pressable>

      {/* Floating Pill with Floating Badge */}
      <View
        style={floatingCartStyles.viewCartFloatingPillWrapper}
        pointerEvents="box-none"
      >
        {/* Pill Button */}
        <Pressable
          onPress={onViewCartsPress}
          style={[
            floatingCartStyles.viewCartFloatingPill,
            {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          <Ionicons
            name="cart"
            size={14}
            color="#16A34A"
            style={floatingCartStyles.viewCartFloatingPillIcon}
          />
          <Text
            style={[
              floatingCartStyles.viewCartFloatingPillText,
              { fontFamily: theme.typography.fonts.bold },
            ]}
            numberOfLines={1}
          >
            View Carts
          </Text>
        </Pressable>

        {/* Badge with Chevron Up */}
        <View
          style={floatingCartStyles.viewCartFloatingPillBadgeWrapper}
          pointerEvents="none"
        >
          <View
            style={[
              floatingCartStyles.viewCartFloatingPillBadge,
              {
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            <Ionicons name="chevron-up" size={13} color="#16A34A" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default FloatingCart;
