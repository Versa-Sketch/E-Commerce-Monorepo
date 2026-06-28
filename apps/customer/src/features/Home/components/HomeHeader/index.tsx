import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { locationStore } from '../../../../stores/LocationStore';
import { AddressApi } from '../../../../types/shared';
import { homeHeaderStyles } from './styledcomponents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeHeaderProps {
  selectedAddressId: string | null;
  activeAddress: AddressApi | undefined;
  usingCurrentLocation: boolean;
  onAddressPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  selectedAddressId,
  activeAddress,
  usingCurrentLocation,
  onAddressPress,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Profile scale animation value
  const profileScale = useSharedValue(1);

  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: profileScale.value }],
    };
  });

  const handleProfilePressIn = () => {
    profileScale.value = withTiming(0.9, { duration: 100 });
  };

  const handleProfilePressOut = () => {
    profileScale.value = withTiming(1, { duration: 100 });
  };

  // Format address display text
  const getAddressText = (): string => {
    if (usingCurrentLocation && locationStore.location) {
      return locationStore.location.formattedAddress ?? 'Current location';
    }

    if (activeAddress) {
      const line2 = activeAddress.address_line2 ? `, ${activeAddress.address_line2}` : '';
      return `${activeAddress.address_line1}${line2}`;
    }

    return 'Add a delivery address';
  };

  const textShadowStyle = {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  };

  return (
    <View style={[homeHeaderStyles.gradientContainer, { paddingTop: insets.top + 16, backgroundColor: 'transparent' }]}>
      <View style={homeHeaderStyles.headerRow}>
        <View style={homeHeaderStyles.headerLeft}>
          {/* Greeting */}
          <Text
            style={[
              theme.textPresets.caption,
              {
                color: '#FFFFFF',
                fontFamily: theme.typography.fonts.medium,
                fontWeight: '700',
                fontSize: 11,
                marginBottom: 3,
                letterSpacing: 0.5,
                ...textShadowStyle,
              },
            ]}
          >
            Good Morning 👋
          </Text>

          {/* Location Button */}
          <Pressable
            onPress={onAddressPress}
            style={homeHeaderStyles.locationContainer}
          >
            <Ionicons
              name="location-sharp"
              size={15}
              color="#FFFFFF"
              style={[{ marginRight: 4, marginTop: -1 }, textShadowStyle]}
            />
            <Text
              numberOfLines={1}
              style={[
                theme.textPresets.bodyLarge,
                {
                  color: '#FFFFFF',
                  fontFamily: theme.typography.fonts.bold,
                  fontWeight: '700',
                  fontSize: 16,
                  maxWidth: SCREEN_WIDTH * 0.6,
                  ...textShadowStyle,
                },
              ]}
            >
              {getAddressText()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#FFFFFF"
              style={[{ marginLeft: 2, marginTop: 1 }, textShadowStyle]}
            />
          </Pressable>

          {/* Delivery Time */}
          <Text
            style={[
              theme.textPresets.caption,
              {
                color: 'rgba(255, 255, 255, 0.95)',
                fontFamily: theme.typography.fonts.bold,
                fontWeight: '700',
                fontSize: 10.5,
                marginTop: 4,
                ...textShadowStyle,
              },
            ]}
          >
            Delivering in 15-20 mins
          </Text>
        </View>

        {/* Profile Button with Frosted Glass Look */}
        <Animated.View style={[profileAnimatedStyle, { marginLeft: 16 }]}>
          <Pressable
            onPressIn={handleProfilePressIn}
            onPressOut={handleProfilePressOut}
            onPress={() => router.push('/profile')}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.35)',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

export default HomeHeader;
