import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../theme/ThemeContext';
import { ADDRESS_ICON_BY_TYPE } from '../../Constants';
import { addressSheetStyles } from './styledcomponents';

interface Address {
  id: string;
  address_type: string;
  address_line1: string;
  address_line2?: string;
}

interface AddressSheetProps {
  addressSheetRef: React.RefObject<BottomSheetModal>;
  snapPoints: (string | number)[];
  addresses: Address[];
  selectedAddressId: string | null;
  isLocating: boolean;
  onAddressSelect: (address: Address) => void;
  onUseCurrentLocation: () => void;
  onAddNewAddress: () => void;
  renderBackdrop: (props: any) => React.ReactNode;
}

export const AddressSheet: React.FC<AddressSheetProps> = ({
  addressSheetRef,
  snapPoints,
  addresses,
  selectedAddressId,
  isLocating,
  onAddressSelect,
  onUseCurrentLocation,
  onAddNewAddress,
  renderBackdrop,
}) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  return (
    <BottomSheetModal
      ref={addressSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop as any}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderRadius: 28,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
      }}
    >
      <BottomSheetView style={addressSheetStyles.sheetContent}>
        {/* Header */}
        <View style={addressSheetStyles.sheetHeader}>
          <View
            style={[
              addressSheetStyles.headerIconBadge,
              {
                backgroundColor: isDark
                  ? 'rgba(16,185,129,0.15)'
                  : '#ECFDF5',
              },
            ]}
          >
            <Ionicons name="location-sharp" size={18} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                addressSheetStyles.sheetTitle,
                {
                  fontFamily: theme.typography.fonts.bold,
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              Delivery address
            </Text>
            <Text
              style={[
                addressSheetStyles.sheetSubtitle,
                {
                  fontFamily: theme.typography.fonts.medium,
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              Stores within 6 km of your location
            </Text>
          </View>
        </View>

        {/* Use Current Location */}
        <Pressable
          onPress={onUseCurrentLocation}
          disabled={isLocating}
          style={({ pressed }) => [
            addressSheetStyles.currentLocBtn,
            {
              borderColor: '#10B981',
              backgroundColor: pressed
                ? 'rgba(16,185,129,0.12)'
                : isDark
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(16,185,129,0.06)',
            },
          ]}
        >
          <View
            style={[
              addressSheetStyles.currentLocIconWrap,
              { backgroundColor: '#10B981' },
            ]}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                addressSheetStyles.currentLocLabel,
                {
                  color: '#065F46',
                  fontFamily: theme.typography.fonts.bold,
                },
              ]}
            >
              {isLocating ? 'Detecting location...' : 'Use current location'}
            </Text>
            <Text
              style={[
                addressSheetStyles.currentLocSub,
                {
                  color: '#059669',
                  fontFamily: theme.typography.fonts.medium,
                },
              ]}
            >
              Detect my location automatically
            </Text>
          </View>
          {!isLocating && (
            <Ionicons name="chevron-forward" size={16} color="#10B981" />
          )}
        </Pressable>

        {/* Divider */}
        <View
          style={[
            addressSheetStyles.divider,
            { backgroundColor: theme.colors.border },
          ]}
        />

        {/* Address List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={addressSheetStyles.addressListScroll}
        >
          {addresses.map((addr) => {
            const isActive = selectedAddressId === addr.id;
            const addressIcon =
              ADDRESS_ICON_BY_TYPE[addr.address_type as keyof typeof ADDRESS_ICON_BY_TYPE] ||
              'location-outline';

            return (
              <Pressable
                key={addr.id}
                onPress={() => onAddressSelect(addr)}
                style={({ pressed }) => [
                  addressSheetStyles.addressItem,
                  {
                    borderColor: isActive
                      ? '#10B981'
                      : theme.colors.border,
                    backgroundColor: isActive
                      ? isDark
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(16,185,129,0.06)'
                      : pressed
                        ? theme.colors.surfaceSecondary
                        : 'transparent',
                  },
                ]}
              >
                <View
                  style={[
                    addressSheetStyles.addressIcon,
                    {
                      backgroundColor: isActive
                        ? '#10B981'
                        : isDark
                          ? '#1F2937'
                          : '#ECFDF5',
                    },
                  ]}
                >
                  <Ionicons
                    name={addressIcon}
                    size={16}
                    color={isActive ? '#FFFFFF' : '#10B981'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      addressSheetStyles.addressLabel,
                      {
                        fontFamily: theme.typography.fonts.bold,
                        color: theme.colors.textPrimary,
                        textTransform: 'capitalize',
                      },
                    ]}
                  >
                    {addr.address_type.toLowerCase()}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      addressSheetStyles.addressStreet,
                      {
                        fontFamily: theme.typography.fonts.medium,
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {addr.address_line1}
                    {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                  </Text>
                </View>
                {isActive ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#10B981"
                  />
                ) : (
                  <View
                    style={[
                      addressSheetStyles.radioCircle,
                      { borderColor: theme.colors.border },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Add New Address Button */}
        <Pressable
          onPress={onAddNewAddress}
          style={({ pressed }) => [
            addressSheetStyles.addAddressBtn,
            {
              borderColor: theme.colors.primary,
              backgroundColor: pressed
                ? `${theme.colors.primary}10`
                : 'transparent',
            },
          ]}
        >
          <View
            style={[
              addressSheetStyles.addAddressIconWrap,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
          <Text
            style={[
              addressSheetStyles.addAddressLabel,
              {
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Add new address
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AddressSheet;
