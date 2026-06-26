import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
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

  return (
    <View style={[homeHeaderStyles.gradientContainer, { paddingTop: insets.top }]}>
      <View style={homeHeaderStyles.headerRow}>
        <View style={homeHeaderStyles.headerLeft}>
          {/* Greeting */}
          <Text
            style={[
              theme.textPresets.caption,
              {
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: theme.typography.fonts.medium,
                fontSize: 11,
                marginBottom: 1,
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
              size={14}
              color="#FFFFFF"
              style={{ marginRight: 4, marginTop: -1 }}
            />
            <Text
              numberOfLines={1}
              style={[
                theme.textPresets.bodyLarge,
                {
                  color: '#FFFFFF',
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: 15,
                  maxWidth: SCREEN_WIDTH * 0.6,
                },
              ]}
            >
              {getAddressText()}
            </Text>
          </Pressable>

          {/* Delivery Time */}
          <Text
            style={[
              theme.textPresets.caption,
              {
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: theme.typography.fonts.bold,
                fontSize: 10,
                marginTop: 1,
              },
            ]}
          >
            Delivering in 15-20 mins
          </Text>
        </View>

        {/* Profile Button */}
        <View style={homeHeaderStyles.headerRightActions}>
          <Pressable
            onPress={() => router.push('/profile')}
            style={homeHeaderStyles.headerActionBtn}
          >
            <Ionicons name="person-circle-outline" size={34} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
